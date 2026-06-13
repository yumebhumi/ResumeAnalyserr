import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateResumeAnalysis } from "@/features/resume/analyze";
import {
  MAX_RESUME_FILE_SIZE,
  SUPPORTED_RESUME_EXTENSIONS,
  SUPPORTED_RESUME_TYPES,
} from "@/features/resume/constants";
import { extractResumeTextWithFallback } from "@/features/resume/parse";
import { saveResumeAnalysis } from "@/features/resume/persist";

const requestSchema = z.object({
  targetRole: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("resume");
    const { targetRole } = requestSchema.parse({
      targetRole:
        typeof formData.get("targetRole") === "string"
          ? formData.get("targetRole")
          : undefined,
    });

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A PDF or DOCX resume file is required." },
        { status: 400 },
      );
    }

    const fileName = file.name.trim();
    const lowercaseName = fileName.toLowerCase();

    if (
      !SUPPORTED_RESUME_TYPES.has(file.type) &&
      !SUPPORTED_RESUME_EXTENSIONS.some((extension) =>
        lowercaseName.endsWith(extension),
      )
    ) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF or DOCX resume." },
        { status: 400 },
      );
    }

    if (file.size > MAX_RESUME_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Resume files must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractResumeTextWithFallback(
      fileName,
      file.type,
      buffer,
    );

    if (extractedText.length < 80) {
      return NextResponse.json(
        {
          error:
            "Could not extract enough readable text from this resume. Try another PDF or DOCX file.",
        },
        { status: 400 },
      );
    }

    const analysis = await generateResumeAnalysis({
      resumeText: extractedText,
      targetRole,
    });
    const normalizedAnalysis = {
      ...analysis,
      missingSkills:
        analysis.missingSkills.length > 0
          ? analysis.missingSkills
          : analysis.missingKeywords,
      missingKeywords:
        analysis.missingKeywords.length > 0
          ? analysis.missingKeywords
          : analysis.missingSkills,
    };

    const analysisId = await saveResumeAnalysis({
      clerkUserId: userId,
      resumeFilename: fileName,
      extractedText,
      analysis: normalizedAnalysis,
    });

    return NextResponse.json({
      analysisId,
      analysis: normalizedAnalysis,
      ...normalizedAnalysis,
    });
  } catch (error) {
    console.error("Resume analysis request failed", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload.", details: error.flatten() },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Resume analysis failed.";

    if (/gemini/i.test(message)) {
      return NextResponse.json(
        { error: "Gemini API failed while analyzing the resume." },
        { status: 502 },
      );
    }

    if (/extract/i.test(message) || /unsupported/i.test(message)) {
      return NextResponse.json(
        { error: "Could not extract text from the uploaded resume." },
        { status: 400 },
      );
    }

    if (/database|relation|insert|select|users|resume_analyses/i.test(message)) {
      return NextResponse.json(
        { error: "Database save failed while storing the analysis." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

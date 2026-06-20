import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateResumeAnalysis } from "@/features/resume/analyze";
import {
  MAX_RESUME_FILE_SIZE,
  SUPPORTED_RESUME_EXTENSIONS,
  SUPPORTED_RESUME_TYPES,
} from "@/features/resume/constants";
import {
  extractResumeTextWithFallback,
  getUnreadableResumeMessage,
  MIN_EXTRACTED_RESUME_LENGTH,
} from "@/features/resume/parse";
import { saveResumeAnalysis } from "@/features/resume/persist";

const requestSchema = z.object({
  targetRole: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((value) => (value ? value : undefined)),
  resumeText: z
    .string()
    .trim()
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
    const { targetRole, resumeText } = requestSchema.parse({
      targetRole:
        typeof formData.get("targetRole") === "string"
          ? formData.get("targetRole")
          : undefined,
      resumeText:
        typeof formData.get("resumeText") === "string"
          ? formData.get("resumeText")
          : undefined,
    });

    let extractedText = resumeText ?? "";
    let sourceLabel = "pasted-resume.txt";

    if (!resumeText) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Upload a PDF or DOCX resume, or paste resume text manually." },
          { status: 400 },
        );
      }

      const fileName = file.name.trim();
      const lowercaseName = fileName.toLowerCase();
      const isSupportedFile =
        SUPPORTED_RESUME_TYPES.has(file.type) ||
        SUPPORTED_RESUME_EXTENSIONS.some((extension) =>
          lowercaseName.endsWith(extension),
        );

      if (!fileName) {
        return NextResponse.json(
          { error: "Resume file name is missing." },
          { status: 400 },
        );
      }

      if (!isSupportedFile) {
        return NextResponse.json(
          { error: "Unsupported file type. Upload a PDF or DOCX resume." },
          { status: 400 },
        );
      }

      if (file.size <= 0) {
        return NextResponse.json(
          { error: "Uploaded resume file is empty." },
          { status: 400 },
        );
      }

      if (!Number.isFinite(file.size) || file.size > MAX_RESUME_FILE_SIZE) {
        return NextResponse.json(
          { error: "File too large. Resume files must be 5 MB or smaller." },
          { status: 400 },
        );
      }

      let buffer: Buffer;
      try {
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } catch (error) {
        console.error("Resume upload buffer conversion failed", error);
        return NextResponse.json(
          { error: "Could not upload the resume file. Please try again." },
          { status: 400 },
        );
      }

      if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        return NextResponse.json(
          { error: "Uploaded resume file is empty." },
          { status: 400 },
        );
      }

      try {
        const extraction = await extractResumeTextWithFallback(
          fileName,
          file.type,
          buffer,
        );
        extractedText = extraction.text;
        sourceLabel = fileName;
      } catch (error) {
        console.error("Resume extraction failed", error);

        return NextResponse.json(
          {
            error: getUnreadableResumeMessage(),
          },
          { status: 400 },
        );
      }
    }

    if (extractedText.trim().length < MIN_EXTRACTED_RESUME_LENGTH) {
      return NextResponse.json(
        {
          error: getUnreadableResumeMessage(),
        },
        { status: 400 },
      );
    }

    let analysis;
    try {
      analysis = await generateResumeAnalysis({
        resumeText: extractedText,
        targetRole,
      });
    } catch (error) {
      console.error("Resume AI analysis failed", error);
      throw error;
    }

    let normalizedAnalysis;
    try {
      normalizedAnalysis = {
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
    } catch (error) {
      console.error("Resume score normalization failed", error);
      throw new Error("Resume score generation failed.", { cause: error });
    }

    let analysisId: string;
    try {
      analysisId = await saveResumeAnalysis({
        clerkUserId: userId,
        resumeFilename: sourceLabel,
        extractedText,
        analysis: normalizedAnalysis,
      });
    } catch (error) {
      console.error("Resume analysis persistence failed", error);
      throw error;
    }

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

    if (/groq/i.test(message)) {
      return NextResponse.json(
        { error: "Groq API failed while analyzing the resume." },
        { status: 502 },
      );
    }

    if (/image-based|unreadable|extract|unsupported|valid pdf|empty|docx/i.test(message)) {
      return NextResponse.json(
        {
          error: getUnreadableResumeMessage(),
        },
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

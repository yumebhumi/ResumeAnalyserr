import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateResumeAnalysis } from "@/features/resume/analyze";
import {
  MAX_RESUME_FILE_SIZE,
  SUPPORTED_RESUME_EXTENSIONS,
  SUPPORTED_RESUME_TYPES,
} from "@/features/resume/constants";
import { extractResumeText } from "@/features/resume/parse";
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
        { error: "A resume file is required." },
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
        { error: "Only PDF and DOCX resumes are supported." },
        { status: 400 },
      );
    }

    if (file.size > MAX_RESUME_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file must be 5 MB or smaller." },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractResumeText(fileName, file.type, buffer);

    if (resumeText.length < 150) {
      return NextResponse.json(
        {
          error:
            "The uploaded resume did not contain enough readable text to analyze.",
        },
        { status: 400 },
      );
    }

    const analysis = await generateResumeAnalysis({
      resumeText,
      targetRole,
    });

    const analysisId = await saveResumeAnalysis({
      clerkUserId: userId,
      resumeFilename: fileName,
      targetRole,
      analysis,
    });

    return NextResponse.json({
      analysisId,
      analysis,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload.", details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Resume analysis failed.",
      },
      { status: 500 },
    );
  }
}

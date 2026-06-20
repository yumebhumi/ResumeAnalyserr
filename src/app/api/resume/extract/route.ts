import { NextResponse } from "next/server";

import {
  MAX_RESUME_FILE_SIZE,
  SUPPORTED_RESUME_EXTENSIONS,
  SUPPORTED_RESUME_TYPES,
} from "@/features/resume/constants";
import {
  extractResumeTextWithFallback,
  getUnreadableResumeMessage,
} from "@/features/resume/parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a PDF or DOCX resume file." },
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
      buffer = Buffer.from(await file.arrayBuffer());
    } catch (error) {
      console.error("Resume upload buffer conversion failed", error);
      return NextResponse.json(
        { error: "Could not upload the resume file. Please try again." },
        { status: 400 },
      );
    }

    const extraction = await extractResumeTextWithFallback(fileName, file.type, buffer);

    return NextResponse.json({
      text: extraction.text,
      fileName,
      fileKind: extraction.fileKind,
      method: extraction.method,
    });
  } catch (error) {
    console.error("Resume extraction route failed", error);

    return NextResponse.json(
      { error: getUnreadableResumeMessage() },
      { status: 400 },
    );
  }
}

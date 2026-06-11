import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export async function extractResumeText(
  fileName: string,
  fileType: string,
  buffer: Buffer,
) {
  if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return normalizeResumeText(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeResumeText(result.value);
  }

  throw new Error("Unsupported resume file type.");
}

function normalizeResumeText(rawText: string) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

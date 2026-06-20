import mammoth from "mammoth";

export async function extractResumeText(
  fileName: string,
  fileType: string,
  buffer: Buffer,
) {
  if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    return extractPdfText(buffer);
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

export async function extractResumeTextWithFallback(
  fileName: string,
  fileType: string,
  buffer: Buffer,
) {
  return extractResumeText(fileName, fileType, buffer);
}

function normalizeResumeText(rawText: string) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractPdfText(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const normalized = normalizeResumeText(result.text ?? "");

    if (normalized.length >= 80) {
      return normalized;
    }

    if (normalized.length > 0) {
      return normalized;
    }

    throw new Error("Could not extract readable text from the uploaded PDF.");
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

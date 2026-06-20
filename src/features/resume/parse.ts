import mammoth from "mammoth";

export async function extractResumeText(
  fileName: string,
  fileType: string,
  buffer: Buffer,
) {
  if (!fileName.trim()) {
    throw new Error("Resume file name is required for PDF extraction.");
  }

  const lowercaseName = fileName.toLowerCase();

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowercaseName.endsWith(".docx")
  ) {
    return extractDocxText(buffer);
  }

  if (fileType !== "application/pdf" && !lowercaseName.endsWith(".pdf")) {
    throw new Error("Unsupported resume file type. Upload a PDF or DOCX resume.");
  }

  return extractPdfText(buffer);
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
  if (!isUsableBinaryObject(buffer)) {
    throw new Error("PDF parsing requires a valid binary buffer.");
  }

  if (buffer.length === 0) {
    throw new Error("Uploaded PDF file is empty.");
  }

  const header = buffer.subarray(0, 4).toString("utf8");
  if (header !== "%PDF") {
    throw new Error("Uploaded file is not a valid PDF.");
  }

  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText();
    const normalized = normalizeResumeText(
      result && typeof result === "object" && typeof result.text === "string"
        ? result.text
        : "",
    );

    if (normalized.length > 0) {
      return normalized;
    }

    throw new Error(
      "This PDF seems image-based or unreadable. Please upload a text-based PDF or DOCX.",
    );
  } catch (error) {
    throw new Error(
      "This PDF seems image-based or unreadable. Please upload a text-based PDF or DOCX.",
      { cause: error },
    );
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy().catch(() => undefined);
    }
  }
}

async function extractDocxText(buffer: Buffer) {
  if (!isUsableBinaryObject(buffer)) {
    throw new Error("DOCX parsing requires a valid binary buffer.");
  }

  if (buffer.length === 0) {
    throw new Error("Uploaded DOCX file is empty.");
  }

  try {
    const result = await mammoth.extractRawText({ buffer });
    const normalized = normalizeResumeText(result.value ?? "");

    if (normalized.length > 0) {
      return normalized;
    }

    throw new Error(
      "This PDF seems image-based or unreadable. Please upload a text-based PDF or DOCX.",
    );
  } catch (error) {
    throw new Error(
      "This PDF seems image-based or unreadable. Please upload a text-based PDF or DOCX.",
      { cause: error },
    );
  }
}

function isUsableBinaryObject(value: unknown): value is Buffer {
  return typeof value === "object" && value !== null && Buffer.isBuffer(value);
}

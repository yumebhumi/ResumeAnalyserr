import mammoth from "mammoth";

export const MIN_EXTRACTED_RESUME_LENGTH = 50;

export type ResumeExtractionResult = {
  text: string;
  method: "pdf-parse" | "pdfjs-dist" | "pdf-raw" | "mammoth";
  fileKind: "pdf" | "docx";
};

const unreadableResumeMessage =
  "This PDF seems image-based or unreadable. Please upload a text-based PDF or DOCX.";

export async function extractResumeText(
  fileName: string,
  fileType: string,
  buffer: Buffer,
): Promise<string> {
  const result = await extractResumeTextWithFallback(fileName, fileType, buffer);
  return result.text;
}

export async function extractResumeTextWithFallback(
  fileName: string,
  fileType: string,
  buffer: Buffer,
): Promise<ResumeExtractionResult> {
  if (!fileName.trim()) {
    throw new Error("Resume file name is required for extraction.");
  }

  if (!isUsableBinaryObject(buffer) || buffer.length === 0) {
    throw new Error("Uploaded resume file is empty.");
  }

  const lowercaseName = fileName.toLowerCase();

  if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowercaseName.endsWith(".docx")
  ) {
    return {
      text: await extractDocxText(buffer),
      method: "mammoth",
      fileKind: "docx",
    };
  }

  if (fileType === "application/pdf" || lowercaseName.endsWith(".pdf")) {
    return extractPdfTextWithFallback(buffer);
  }

  throw new Error("Unsupported resume file type. Upload a PDF or DOCX resume.");
}

function normalizeResumeText(rawText: string) {
  return rawText
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractPdfTextWithFallback(
  buffer: Buffer,
): Promise<ResumeExtractionResult> {
  const header = buffer.subarray(0, 4).toString("utf8");
  if (header !== "%PDF") {
    throw new Error("Uploaded file is not a valid PDF.");
  }

  const extractionErrors: Array<{ method: string; error: unknown }> = [];

  try {
    const text = await extractPdfTextWithPdfParse(buffer);
    return {
      text,
      method: "pdf-parse",
      fileKind: "pdf",
    };
  } catch (error) {
    extractionErrors.push({ method: "pdf-parse", error });
  }

  try {
    const text = await extractPdfTextWithPdfJs(buffer);
    return {
      text,
      method: "pdfjs-dist",
      fileKind: "pdf",
    };
  } catch (error) {
    extractionErrors.push({ method: "pdfjs-dist", error });
  }

  try {
    const text = extractPdfTextFromRawContent(buffer);
    return {
      text,
      method: "pdf-raw",
      fileKind: "pdf",
    };
  } catch (error) {
    extractionErrors.push({ method: "pdf-raw", error });
  }

  console.error("Resume PDF extraction failed across all methods", extractionErrors);
  throw new Error(unreadableResumeMessage);
}

async function extractPdfTextWithPdfParse(buffer: Buffer) {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  try {
    const result = await parser.getText();
    const normalized = normalizeResumeText(
      result && typeof result === "object" && typeof result.text === "string"
        ? result.text
        : "",
    );

    if (normalized.length >= MIN_EXTRACTED_RESUME_LENGTH) {
      return normalized;
    }

    throw new Error(
      `pdf-parse extracted only ${normalized.length} characters from the PDF.`,
    );
  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy().catch(() => undefined);
    }
  }
}

async function extractPdfTextWithPdfJs(buffer: Buffer) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
  });

  try {
    const document = await loadingTask.promise;
    const pageTexts: string[] = [];

    try {
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);

        try {
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => {
              if (typeof item !== "object" || item === null || !("str" in item)) {
                return "";
              }

              return typeof item.str === "string" ? item.str : "";
            })
            .join(" ");

          pageTexts.push(pageText);
        } finally {
          page.cleanup();
        }
      }
    } finally {
      await document.destroy();
    }

    const normalized = normalizeResumeText(pageTexts.join("\n\n"));
    if (normalized.length >= MIN_EXTRACTED_RESUME_LENGTH) {
      return normalized;
    }

    throw new Error(
      `pdfjs-dist extracted only ${normalized.length} characters from the PDF.`,
    );
  } finally {
    await loadingTask.destroy().catch(() => undefined);
  }
}

async function extractDocxText(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer });
  const normalized = normalizeResumeText(result.value ?? "");

  if (normalized.length >= MIN_EXTRACTED_RESUME_LENGTH) {
    return normalized;
  }

  throw new Error(
    `mammoth extracted only ${normalized.length} characters from the DOCX.`,
  );
}

function extractPdfTextFromRawContent(buffer: Buffer) {
  const source = buffer.toString("latin1");
  const matches = [...source.matchAll(/\(([^()]*)\)\s*Tj/g)];

  const extracted = matches
    .map((match) => decodePdfString(match[1] ?? ""))
    .join(" ")
    .replace(/\s+/g, " ");

  const normalized = normalizeResumeText(extracted);
  if (normalized.length >= MIN_EXTRACTED_RESUME_LENGTH) {
    return normalized;
  }

  throw new Error(
    `raw PDF content extraction found only ${normalized.length} characters.`,
  );
}

function decodePdfString(value: string) {
  return value
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function isUsableBinaryObject(value: unknown): value is Buffer {
  return typeof value === "object" && value !== null && Buffer.isBuffer(value);
}

export function getUnreadableResumeMessage() {
  return unreadableResumeMessage;
}

import mammoth from "mammoth";

import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini";

export async function extractResumeText(
  fileName: string,
  fileType: string,
  buffer: Buffer,
) {
  if (fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
    return extractPdfTextWithGemini(buffer);
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

async function extractPdfTextWithGemini(buffer: Buffer) {
  const pdfBytes = new Uint8Array(buffer);
  const uploadedFile = await getGeminiClient().files.upload({
    file: new Blob([pdfBytes], { type: "application/pdf" }),
    config: {
      mimeType: "application/pdf",
    },
  });
  const uploadedFileUri = uploadedFile.uri;

  try {
    if (!uploadedFileUri) {
      throw new Error("Gemini file upload did not return a PDF URI.");
    }

    const response = await getGeminiClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text:
            "Extract the readable resume text from this PDF. Return plain text only. Preserve headings, bullets, and section order where possible.",
        },
        {
          fileData: {
            fileUri: uploadedFileUri,
            mimeType: uploadedFile.mimeType ?? "application/pdf",
          },
        },
      ],
      config: {
        temperature: 0,
      },
    });

    return normalizeResumeText(response.text ?? "");
  } finally {
    if (uploadedFile.name) {
      await getGeminiClient().files
        .delete({ name: uploadedFile.name })
        .catch(() => undefined);
    }
  }
}

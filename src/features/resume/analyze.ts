import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini";

import { resumeAnalysisSchema, type ResumeAnalysis } from "./schema";

const analysisInstructions = `
You are an ATS and recruiter reviewer for technical resumes.
Return valid JSON only.
Score the resume from 0 to 100.
Be concrete, concise, and tailored to the candidate's content.
Do not invent experience that does not exist in the resume.
`;

export async function generateResumeAnalysis(input: {
  resumeText: string;
  targetRole?: string;
}): Promise<ResumeAnalysis> {
  const prompt = [
    analysisInstructions,
    input.targetRole
      ? `Target role: ${input.targetRole}`
      : "Target role: Not provided. Infer the likely role from the resume.",
    "Return JSON with keys:",
    "atsScore, summary, recruiterSummary, keywordCoverage, formattingIssues, missingSkills, strengths, weakBullets",
    "Each weakBullets item must contain original, improved, reason.",
    "Resume:",
    input.resumeText,
  ].join("\n\n");

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await getGeminiClient().models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const payload = JSON.parse(response.text ?? "{}");
      return resumeAnalysisSchema.parse(payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini analysis failed.");
}

import { generateGroqCompletion } from "@/lib/groq";

import { resumeAnalysisSchema, type ResumeAnalysis } from "./schema";

const analysisInstructions = `
You are an ATS and recruiter reviewer for technical resumes.
Return valid JSON only.
Score each area from 0 to 100.
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
    "atsScore, keywordMatch, formattingScore, skillsScore, experienceScore, projectsScore, summary, missingSkills, strengths, weaknesses, suggestions, improvedBullets, recommendedRoles",
    "All score fields must be integers from 0 to 100.",
    "All list fields must be arrays of concise strings.",
    "Resume:",
    input.resumeText,
  ].join("\n\n");

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await generateGroqCompletion(
        [
          {
            role: "system",
            content:
              "You are an ATS and recruiter reviewer for technical resumes. Return valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        { json: true, temperature: 0.2 },
      );

      const payload = JSON.parse(response);
      return resumeAnalysisSchema.parse(payload);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Groq analysis failed.");
}

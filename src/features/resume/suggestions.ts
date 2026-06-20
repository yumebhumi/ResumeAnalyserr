import { z } from "zod";

import { generateGroqCompletion } from "@/lib/groq";

import type { ResumeAnalysis } from "./schema";

export const resumeSuggestionsSchema = z.object({
  summaryImprovement: z.string().min(1),
  projectBulletImprovements: z.array(z.string().min(1)).max(6).default([]),
  skillsSuggestions: z.array(z.string().min(1)).max(6).default([]),
  keywordSuggestions: z.array(z.string().min(1)).max(6).default([]),
  recruiterFeedback: z.array(z.string().min(1)).max(5).default([]),
});

export type ResumeSuggestions = z.infer<typeof resumeSuggestionsSchema>;

export async function generateResumeSuggestions(input: {
  resumeText: string;
  analysis?: ResumeAnalysis | null;
}): Promise<ResumeSuggestions> {
  const prompt = [
    "You improve technical resumes for recruiters and ATS systems.",
    "Return valid JSON only.",
    "Keep the feedback practical, concise, and specific to the provided resume.",
    "Return JSON with keys:",
    "summaryImprovement, projectBulletImprovements, skillsSuggestions, keywordSuggestions, recruiterFeedback",
    input.analysis
      ? `Existing analysis context: ${JSON.stringify(input.analysis)}`
      : "No prior analysis context is available.",
    "Resume:",
    input.resumeText,
  ].join("\n\n");

  const response = await generateGroqCompletion(
    [
      {
        role: "system",
        content:
          "You improve technical resumes for recruiters and ATS systems. Return valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    { json: true, temperature: 0.2 },
  );

  return resumeSuggestionsSchema.parse(JSON.parse(response));
}

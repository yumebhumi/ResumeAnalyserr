import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini";

import { generatedPortfolioSchema, type GeneratedPortfolio } from "./schema";
import type { PortfolioFormData, PortfolioTemplate } from "./types";

export async function generatePortfolioContent(input: {
  template: PortfolioTemplate;
  resumeText?: string;
  analysis?: Record<string, unknown> | null;
  current: PortfolioFormData;
}): Promise<GeneratedPortfolio> {
  const prompt = [
    "You generate recruiter-ready developer portfolio content.",
    "Return valid JSON only.",
    "Do not invent employers, dates, or projects that are not supported by the input.",
    "Prefer concise, premium, recruiter-facing language.",
    `Template style: ${input.template}`,
    "Return JSON with keys:",
    "name, role, about, skills, projects, experience, education, github, linkedin, email",
    `Current form data: ${JSON.stringify(input.current)}`,
    input.analysis ? `Resume analysis context: ${JSON.stringify(input.analysis)}` : "",
    input.resumeText ? `Resume text:\n${input.resumeText}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await getGeminiClient().models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  return generatedPortfolioSchema.parse(JSON.parse(response.text ?? "{}"));
}

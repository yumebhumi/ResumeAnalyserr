import { generateGroqCompletion } from "@/lib/groq";

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

  const response = await generateGroqCompletion(
    [
      {
        role: "system",
        content:
          "You generate recruiter-ready developer portfolio content. Return valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    { json: true, temperature: 0.2 },
  );

  return generatedPortfolioSchema.parse(
    normalizeGeneratedPortfolio(JSON.parse(response)),
  );
}

function normalizeGeneratedPortfolio(value: unknown) {
  const source = isRecord(value) ? value : {};

  return {
    name: asString(source.name),
    role: asString(source.role),
    about: asString(source.about),
    skills: asStringArray(source.skills),
    projects: asStringArray(source.projects),
    experience: asStringArray(source.experience),
    education: asStringArray(source.education),
    github: asString(source.github),
    linkedin: asString(source.linkedin),
    email: asString(source.email),
  };
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\n|[,|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

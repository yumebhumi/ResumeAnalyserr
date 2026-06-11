import { GEMINI_MODEL, getGeminiClient } from "@/lib/gemini";

import { githubAnalysisSchema, type GithubAnalysis } from "./schema";
import type { GitHubAnalysisInput } from "./fetch";

const instructions = `
You are a recruiter-focused GitHub profile reviewer.
Return valid JSON only.
Do not invent repositories or technologies that are not present in the input.
Keep recommendations concise and practical.
`;

export async function generateGithubAnalysis(
  input: GitHubAnalysisInput,
): Promise<GithubAnalysis> {
  const prompt = [
    instructions,
    "Return JSON with keys:",
    "portfolioReadyScore, commitActivity, languages, topRepositories, recommendations, healthBreakdown",
    "topRepositories must contain at most 3 items with: name, description, stars, techStack, portfolioScore",
    "healthBreakdown must contain: codeConsistency, projectQuality, readmeQuality, portfolioReadiness",
    "All score fields must be integers from 0 to 100.",
    "Input:",
    JSON.stringify(input),
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
      return githubAnalysisSchema.parse(normalizeGithubAnalysisPayload(payload));
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("GitHub analysis failed.");
}

function normalizeGithubAnalysisPayload(payload: unknown) {
  const source =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const normalizedRepositories = Array.isArray(source.topRepositories)
    ? source.topRepositories
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .slice(0, 3)
        .map((repo) => ({
          name: asString(repo.name),
          description: asString(repo.description),
          stars: asInt(repo.stars),
          techStack: asStringArray(repo.techStack).slice(0, 5),
          portfolioScore: clampScore(repo.portfolioScore),
        }))
    : [];

  return {
    portfolioReadyScore: clampScore(source.portfolioReadyScore),
    commitActivity: asCommitActivity(source.commitActivity),
    languages: asStringArray(source.languages).slice(0, 12),
    topRepositories: normalizedRepositories,
    recommendations: asStringArray(source.recommendations).slice(0, 3),
    healthBreakdown: {
      codeConsistency: clampScore(source.healthBreakdown, "codeConsistency"),
      projectQuality: clampScore(source.healthBreakdown, "projectQuality"),
      readmeQuality: clampScore(source.healthBreakdown, "readmeQuality"),
      portfolioReadiness: clampScore(source.healthBreakdown, "portfolioReadiness"),
    },
  };
}

function clampScore(value: unknown, nestedKey?: string) {
  const raw =
    nestedKey && value && typeof value === "object"
      ? (value as Record<string, unknown>)[nestedKey]
      : value;
  const numeric = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asInt(value: unknown) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function asCommitActivity(value: unknown) {
  return value === "High" || value === "Medium" || value === "Low"
    ? value
    : "Medium";
}

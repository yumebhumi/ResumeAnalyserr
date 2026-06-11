import type { AnalyzeGithubResponse, GithubAnalysis } from "./schema";

export type GitHubViewModel = {
  username: string;
  portfolioReadyScore: number;
  repositories: number;
  stars: number;
  languagesCount: number;
  commitActivity: string;
  languages: string[];
  topProjects: Array<{
    name: string;
    description: string;
    stars: number;
    techStack: string[];
    portfolioScore: number;
  }>;
  health: Array<{
    label: string;
    value: number;
  }>;
  insights: string[];
  sourceLabel: string;
};

export function buildGitHubViewModel(input: {
  username: string;
  stats: Record<string, unknown> | null;
  summary: Record<string, unknown> | null;
  sourceLabel: string;
}): GitHubViewModel {
  const safeStats = input.stats ?? {};
  const safeSummary = input.summary ?? {};

  const analysis = safeSummary as Partial<GithubAnalysis>;
  const languages = extractStringArray(analysis.languages);
  const repositories = Array.isArray(analysis.topRepositories)
    ? analysis.topRepositories
    : [];

  return {
    username: input.username,
    portfolioReadyScore:
      extractNumber(analysis.portfolioReadyScore) ??
      extractNumber((safeSummary as { portfolioReadyScore?: unknown }).portfolioReadyScore) ??
      0,
    repositories:
      extractNumber(safeStats.repositories) ??
      extractNumber(safeStats.repoCount) ??
      0,
    stars:
      extractNumber(safeStats.stars) ??
      extractNumber(safeStats.totalStars) ??
      0,
    languagesCount: languages.length,
    commitActivity: extractString(analysis.commitActivity) || "Low",
    languages,
    topProjects: repositories
      .map((repo) => ({
        name: extractString(repo?.name) || "Repository",
        description:
          extractString(repo?.description) || "No description provided.",
        stars: extractNumber(repo?.stars) ?? 0,
        techStack: extractStringArray(repo?.techStack).slice(0, 5),
        portfolioScore: extractNumber(repo?.portfolioScore) ?? 0,
      }))
      .slice(0, 3),
    health: [
      {
        label: "Code Consistency",
        value: extractNumber(analysis.healthBreakdown?.codeConsistency) ?? 0,
      },
      {
        label: "Project Quality",
        value: extractNumber(analysis.healthBreakdown?.projectQuality) ?? 0,
      },
      {
        label: "Readme Quality",
        value: extractNumber(analysis.healthBreakdown?.readmeQuality) ?? 0,
      },
      {
        label: "Portfolio Readiness",
        value: extractNumber(analysis.healthBreakdown?.portfolioReadiness) ?? 0,
      },
    ],
    insights: extractStringArray(analysis.recommendations).slice(0, 3),
    sourceLabel: input.sourceLabel,
  };
}

export function buildGitHubViewModelFromResponse(
  payload: AnalyzeGithubResponse,
): GitHubViewModel {
  return buildGitHubViewModel({
    username: payload.username,
    stats: {
      ...payload.stats,
      repositories: payload.totalRepos ?? payload.stats.repositories,
      stars: payload.totalStars ?? payload.stats.stars,
      languages: payload.topLanguages ?? payload.stats.languages,
    },
    summary: {
      ...payload.analysis,
      portfolioReadyScore:
        payload.portfolioReadyScore ?? payload.analysis.portfolioReadyScore,
      languages: payload.topLanguages ?? payload.analysis.languages,
      topRepositories: payload.bestProjects ?? payload.analysis.topRepositories,
      recommendations: payload.suggestions ?? payload.analysis.recommendations,
    },
    sourceLabel: "Latest saved GitHub analysis",
  });
}

function extractNumber(value: unknown) {
  return typeof value === "number" ? value : null;
}

function extractString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function extractStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

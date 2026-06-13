import { githubAnalysisSchema, type GithubAnalysis } from "./schema";
import type { GitHubAnalysisInput } from "./fetch";

export async function generateGithubAnalysis(
  input: GitHubAnalysisInput,
): Promise<GithubAnalysis> {
  const healthBreakdown = buildHealthBreakdown(input);
  const portfolioReadyScore = averageScore([
    healthBreakdown.codeConsistency,
    healthBreakdown.projectQuality,
    healthBreakdown.readmeQuality,
    healthBreakdown.portfolioReadiness,
  ]);

  return githubAnalysisSchema.parse({
    portfolioReadyScore,
    commitActivity: input.stats.commitActivity,
    languages: input.stats.languages.slice(0, 12),
    topRepositories: input.topRepositories
      .map((repository) => ({
        name: repository.name,
        description: repository.description,
        stars: repository.stars,
        techStack: repository.techStack.slice(0, 5),
        portfolioScore: scoreRepository(repository),
      }))
      .slice(0, 3),
    recommendations: buildRecommendations(input, healthBreakdown, portfolioReadyScore),
    healthBreakdown,
  });
}

function buildHealthBreakdown(input: GitHubAnalysisInput) {
  const repositories = input.topRepositories;
  const totalRepositoryCount = Math.max(input.stats.repositories, repositories.length, 1);
  const describedRepositories = repositories.filter(
    (repository) => repository.description !== "No description provided.",
  ).length;
  const documentedRepositories = repositories.filter(
    (repository) => repository.readmeSnippet.length >= 140,
  ).length;
  const recentlyUpdatedRepositories = repositories.filter((repository) =>
    isRecentlyUpdated(repository.updatedAt),
  ).length;
  const repositoryStars = repositories.reduce(
    (sum, repository) => sum + repository.stars,
    0,
  );

  const repoDepthScore = clampScore((repositories.length / Math.min(totalRepositoryCount, 6)) * 100);
  const documentationScore = clampScore(
    documentedRepositories * 24 + describedRepositories * 10 + repositories.length * 8,
  );
  const qualityScore = clampScore(
    repoDepthScore * 0.28 +
      normalizedScore(repositoryStars, 40) * 0.24 +
      normalizedScore(input.stats.languages.length, 8) * 0.18 +
      documentedRepositories * 12 +
      describedRepositories * 7,
  );
  const consistencyScore = clampScore(
    commitActivityScore(input.stats.commitActivity) * 0.5 +
      normalizedScore(recentlyUpdatedRepositories, 3) * 0.35 +
      normalizedScore(repositories.length, 4) * 0.15,
  );
  const readinessScore = clampScore(
    qualityScore * 0.35 +
      documentationScore * 0.35 +
      consistencyScore * 0.2 +
      normalizedScore(input.stats.languages.length, 6) * 0.1,
  );

  return {
    codeConsistency: consistencyScore,
    projectQuality: qualityScore,
    readmeQuality: documentationScore,
    portfolioReadiness: readinessScore,
  };
}

function buildRecommendations(
  input: GitHubAnalysisInput,
  healthBreakdown: GithubAnalysis["healthBreakdown"],
  portfolioReadyScore: number,
) {
  const recommendations: string[] = [];

  if (healthBreakdown.readmeQuality < 60) {
    recommendations.push(
      "Strengthen README coverage on your top repositories with setup steps, screenshots, and a short problem-solution summary.",
    );
  }

  if (healthBreakdown.codeConsistency < 60) {
    recommendations.push(
      "Show more recent activity by polishing and pushing updates to 2 or 3 flagship repositories this month.",
    );
  }

  if (input.stats.languages.length < 3) {
    recommendations.push(
      "Broaden visible stack depth by highlighting repositories that show frontend, backend, and deployment skills.",
    );
  }

  if (
    input.topRepositories.some(
      (repository) => repository.description === "No description provided.",
    )
  ) {
    recommendations.push(
      "Add clear one-line descriptions to repositories so recruiters can understand project value without opening the code.",
    );
  }

  if (
    input.topRepositories.every((repository) => repository.stars < 3) &&
    portfolioReadyScore < 70
  ) {
    recommendations.push(
      "Pin stronger case-study projects with better demos, screenshots, and outcomes instead of relying on smaller utility repos.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Your profile already has solid structure. Focus next on pinned-project storytelling, measurable impact, and stronger README polish.",
    );
  }

  return recommendations.slice(0, 3);
}

function scoreRepository(repository: GitHubAnalysisInput["topRepositories"][number]) {
  return clampScore(
    normalizedScore(repository.stars, 25) * 0.3 +
      normalizedScore(repository.techStack.length, 4) * 0.15 +
      (repository.description === "No description provided." ? 0 : 16) +
      normalizedScore(repository.readmeSnippet.length, 260) * 0.25 +
      (isRecentlyUpdated(repository.updatedAt) ? 14 : 6) +
      10,
  );
}

function isRecentlyUpdated(updatedAt: string | null) {
  if (!updatedAt) {
    return false;
  }

  const ninetyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 90;
  return new Date(updatedAt).getTime() >= ninetyDaysAgo;
}

function normalizedScore(value: number, target: number) {
  return clampScore((value / Math.max(target, 1)) * 100);
}

function averageScore(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function commitActivityScore(activity: GitHubAnalysisInput["stats"]["commitActivity"]) {
  if (activity === "High") {
    return 92;
  }

  if (activity === "Medium") {
    return 68;
  }

  return 38;
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

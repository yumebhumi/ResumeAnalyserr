import { getServerEnv } from "@/lib/env";

type GitHubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  pushed_at: string | null;
  html_url: string;
};

type GitHubUser = {
  login: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
};

export type GitHubAnalysisInput = {
  username: string;
  profile: GitHubUser;
  stats: {
    repositories: number;
    stars: number;
    languages: string[];
    healthScore: number;
    commitActivity: "Low" | "Medium" | "High";
  };
  topRepositories: Array<{
    name: string;
    description: string;
    stars: number;
    techStack: string[];
    readmeSnippet: string;
    updatedAt: string | null;
    url: string;
  }>;
};

export async function fetchGitHubAnalysisInput(username: string): Promise<GitHubAnalysisInput> {
  const profile = await githubRequest<GitHubUser>(`/users/${username}`);
  const repositories = await githubRequest<GitHubRepo[]>(
    `/users/${username}/repos?sort=updated&per_page=100`,
  );

  const publicRepos = repositories.filter((repo) => !repo.fork && !repo.archived);
  if (publicRepos.length === 0) {
    return {
      username: profile.login,
      profile,
      stats: {
        repositories: profile.public_repos,
        stars: 0,
        languages: [],
        healthScore: 24,
        commitActivity: "Low",
      },
      topRepositories: [],
    };
  }

  const topRepositories = publicRepos
    .slice()
    .sort((left, right) => right.stargazers_count - left.stargazers_count)
    .slice(0, 3);

  const readmes = await Promise.all(
    topRepositories.map(async (repo) => {
      const readme = await fetchReadme(repo.full_name);
      return {
        repo,
        readme,
      };
    }),
  );

  const totalStars = publicRepos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const languages = Array.from(
    new Set(
      publicRepos
        .flatMap((repo) => [
          repo.language,
          ...(repo.topics ?? []).filter((topic) => topic.length < 20),
        ])
        .filter((value): value is string => Boolean(value)),
    ),
  ).slice(0, 12);

  const recentlyUpdated = publicRepos.filter((repo) => {
    if (!repo.pushed_at) return false;
    const pushedAt = new Date(repo.pushed_at).getTime();
    const threshold = Date.now() - 1000 * 60 * 60 * 24 * 90;
    return pushedAt >= threshold;
  }).length;

  const commitActivity: "Low" | "Medium" | "High" =
    recentlyUpdated >= 5 ? "High" : recentlyUpdated >= 2 ? "Medium" : "Low";

  const readmeCoverage =
    readmes.filter((item) => item.readme.trim().length >= 120).length /
    Math.max(readmes.length, 1);
  const descriptionCoverage =
    publicRepos.filter((repo) => Boolean(repo.description?.trim())).length /
    publicRepos.length;
  const repoSignal = Math.min(publicRepos.length / 12, 1);
  const healthScore = Math.round(
    repoSignal * 30 + readmeCoverage * 35 + descriptionCoverage * 20 + (commitActivity === "High" ? 15 : commitActivity === "Medium" ? 9 : 4),
  );

  return {
    username: profile.login,
    profile,
    stats: {
      repositories: profile.public_repos,
      stars: totalStars,
      languages,
      healthScore,
      commitActivity,
    },
    topRepositories: readmes.map(({ repo, readme }) => ({
      name: repo.name,
      description: repo.description?.trim() || "No description provided.",
      stars: repo.stargazers_count,
      techStack: Array.from(
        new Set(
          [repo.language, ...(repo.topics ?? [])].filter(
            (value): value is string => Boolean(value),
          ),
        ),
      ).slice(0, 5),
      readmeSnippet: readme.slice(0, 1200),
      updatedAt: repo.pushed_at,
      url: repo.html_url,
    })),
  };
}

async function githubRequest<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "HireMe-AI",
  };

  const token = getServerEnv().GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com${path}`, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "GitHub user not found."
        : "GitHub API request failed.",
    );
  }

  return (await response.json()) as T;
}

async function fetchReadme(fullName: string) {
  try {
    const payload = await githubRequest<{ content?: string }>(
      `/repos/${fullName}/readme`,
    );

    if (!payload.content) {
      return "";
    }

    return Buffer.from(payload.content, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateGithubAnalysis } from "@/features/github/analyze";
import { fetchGitHubAnalysisInput } from "@/features/github/fetch";
import { saveGithubAnalysis } from "@/features/github/persist";

const requestSchema = z.object({
  username: z.string().trim().min(1).max(39).regex(/^[A-Za-z0-9-]+$/),
});

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { username } = requestSchema.parse(await request.json());
    const githubInput = await fetchGitHubAnalysisInput(username);
    const analysis = await generateGithubAnalysis(githubInput);
    const stats = {
      ...githubInput.stats,
      healthScore: analysis.portfolioReadyScore,
    };

    const profileId = await saveGithubAnalysis({
      clerkUserId,
      username: githubInput.username,
      stats,
      analysis,
    });

    return NextResponse.json({
      profileId,
      username: githubInput.username,
      totalRepos: stats.repositories,
      totalStars: stats.stars,
      topLanguages: analysis.languages,
      bestProjects: analysis.topRepositories,
      portfolioReadyScore: analysis.portfolioReadyScore,
      suggestions: analysis.recommendations,
      stats,
      analysis,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid GitHub username." },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "GitHub analysis failed.";

    if (/GitHub user not found/i.test(message)) {
      return NextResponse.json({ error: "GitHub user not found." }, { status: 404 });
    }

    if (/GitHub API request failed/i.test(message)) {
      return NextResponse.json(
        { error: "Could not fetch public GitHub data right now." },
        { status: 502 },
      );
    }

    if (/GitHub analysis failed|Gemini/i.test(message)) {
      return NextResponse.json(
        { error: "Gemini API failed while analyzing the GitHub profile." },
        { status: 502 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

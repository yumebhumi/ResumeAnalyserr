import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { githubAnalyses, githubProfiles, users } from "@/db/schema";
import { generateGithubAnalysis } from "@/features/github/analyze";
import { fetchGitHubAnalysisInput } from "@/features/github/fetch";
import { saveGithubAnalysis } from "@/features/github/persist";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

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
    const db = getDb();

    await ensureAppSchema();

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    const sixHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 6);
    const normalizedUsername = username.toLowerCase();

    if (user) {
      const [cachedProfile] = await db
        .select({
          id: githubProfiles.id,
          username: githubProfiles.username,
          summary: githubProfiles.summary,
          stats: githubProfiles.stats,
        })
        .from(githubProfiles)
        .where(
          and(
            eq(githubProfiles.userId, user.id),
            eq(githubProfiles.username, normalizedUsername),
            gte(githubProfiles.analyzedAt, sixHoursAgo),
          ),
        )
        .orderBy(desc(githubProfiles.analyzedAt))
        .limit(1);

      if (cachedProfile?.summary && cachedProfile.stats) {
        const analysis = cachedProfile.summary as {
          portfolioReadyScore: number;
          languages: string[];
          topRepositories: Array<Record<string, unknown>>;
          recommendations: string[];
        };
        const stats = cachedProfile.stats as {
          repositories: number;
          stars: number;
          languages: string[];
          healthScore: number;
          commitActivity: "Low" | "Medium" | "High";
        };

        return NextResponse.json({
          profileId: cachedProfile.id,
          username: cachedProfile.username,
          totalRepos: stats.repositories,
          totalStars: stats.stars,
          topLanguages: analysis.languages,
          bestProjects: analysis.topRepositories,
          portfolioReadyScore: analysis.portfolioReadyScore,
          suggestions: analysis.recommendations,
          stats,
          analysis,
        });
      }
    }

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
    if (isMissingGroqConfiguration(error)) {
      return NextResponse.json(
        { error: "Groq API failed while analyzing the GitHub profile." },
        { status: 502 },
      );
    }

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

    if (/GitHub analysis failed|Groq/i.test(message)) {
      return NextResponse.json(
        { error: "Groq API failed while analyzing the GitHub profile." },
        { status: 502 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const db = getDb();

    await ensureAppSchema();

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      return NextResponse.json({
        success: true,
        deletedProfiles: 0,
        deletedAnalyses: 0,
      });
    }

    const deletedAnalyses = await db
      .delete(githubAnalyses)
      .where(eq(githubAnalyses.userId, user.id))
      .returning({ id: githubAnalyses.id });

    const deletedProfiles = await db
      .delete(githubProfiles)
      .where(eq(githubProfiles.userId, user.id))
      .returning({ id: githubProfiles.id });

    return NextResponse.json({
      success: true,
      deletedProfiles: deletedProfiles.length,
      deletedAnalyses: deletedAnalyses.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not reset GitHub analysis.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function isMissingGroqConfiguration(error: unknown) {
  if (!(error instanceof z.ZodError)) {
    return false;
  }

  return error.issues.some((issue) =>
    issue.message.toLowerCase().includes("groq_api_key"),
  );
}

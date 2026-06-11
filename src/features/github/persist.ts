import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";

import { githubAnalyses, githubProfiles, users } from "@/db/schema";
import { getDb } from "@/lib/db";

import type { GithubAnalysis } from "./schema";

export async function saveGithubAnalysis(params: {
  clerkUserId: string;
  username: string;
  stats: Record<string, unknown>;
  analysis: GithubAnalysis;
}) {
  const db = getDb();
  await ensureGithubProfilesTable();

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, params.clerkUserId))
    .limit(1);

  const user =
    existingUser ??
    (await (async () => {
      const clerkProfile = await currentUser();
      const email = clerkProfile?.emailAddresses[0]?.emailAddress;

      if (!email) {
        throw new Error("Could not resolve the authenticated user's email.");
      }

      const [createdUser] = await db
        .insert(users)
        .values({
          clerkUserId: params.clerkUserId,
          email,
        })
        .returning();

      return createdUser;
    })());

  const [profile] = await db
    .insert(githubProfiles)
    .values({
      id: randomUUID(),
      userId: user.id,
      username: params.username,
      stats: params.stats,
      summary: params.analysis,
      analyzedAt: new Date(),
    })
    .returning({
      id: githubProfiles.id,
    });

  await ensureGithubAnalysesTable();

  await db.insert(githubAnalyses).values({
    userId: user.id,
    username: params.username,
    analysisJson: params.analysis,
    portfolioReadyScore: params.analysis.portfolioReadyScore,
  });

  return profile.id;
}

async function ensureGithubProfilesTable() {
  const db = getDb();

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS github_profiles (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username varchar(255) NOT NULL,
      summary jsonb,
      stats jsonb,
      analyzed_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function ensureGithubAnalysesTable() {
  const db = getDb();

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS github_analyses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username varchar(255) NOT NULL,
      analysis_json jsonb NOT NULL,
      portfolio_ready_score integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { githubProfiles, users } from "@/db/schema";
import { GithubAnalyzer } from "@/features/github/analyzer";
import { buildGitHubViewModel, type GitHubViewModel } from "@/features/github/view-model";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

export default async function GithubPage() {
  const { userId: clerkUserId } = await auth();
  const db = getDb();

  await ensureAppSchema();

  const [user] = clerkUserId
    ? await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1)
    : [];

  const [latestGithubProfile] = user
    ? await db
        .select({
          username: githubProfiles.username,
          summary: githubProfiles.summary,
          stats: githubProfiles.stats,
        })
        .from(githubProfiles)
        .where(eq(githubProfiles.userId, user.id))
        .orderBy(desc(githubProfiles.analyzedAt))
        .limit(1)
    : [];

  const initialModel: GitHubViewModel | null = latestGithubProfile
    ? buildGitHubViewModel({
        username: latestGithubProfile.username,
        stats: latestGithubProfile.stats,
        summary: latestGithubProfile.summary,
        sourceLabel: "Latest saved GitHub analysis",
      })
    : null;

  return (
    <GithubAnalyzer
      initialUsername={latestGithubProfile?.username ?? ""}
      initialModel={initialModel}
    />
  );
}

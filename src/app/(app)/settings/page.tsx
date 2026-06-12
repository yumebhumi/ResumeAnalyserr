import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

import { githubProfiles, resumeAnalyses, usageEvents, users } from "@/db/schema";
import { SettingsForm } from "@/features/settings/form";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

export default async function SettingsPage() {
  const { userId: clerkUserId } = await auth();
  const clerkProfile = await currentUser();
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
        })
        .from(githubProfiles)
        .where(eq(githubProfiles.userId, user.id))
        .orderBy(desc(githubProfiles.analyzedAt))
        .limit(1)
    : [];

  const analysesCount = user
    ? await db.$count(resumeAnalyses, eq(resumeAnalyses.userId, user.id))
    : 0;
  const usageCount = user
    ? await db.$count(usageEvents, eq(usageEvents.userId, user.id))
    : 0;

  return (
    <SettingsForm
      profile={{
        name:
          clerkProfile?.fullName ||
          clerkProfile?.firstName ||
          clerkProfile?.username ||
          "HireMe AI User",
        email:
          clerkProfile?.emailAddresses[0]?.emailAddress ||
          user?.email ||
          "No email available",
        avatarUrl:
          clerkProfile?.imageUrl ||
          "https://placehold.co/64x64/png",
      }}
      preferences={{
        targetRole: user?.targetRole ?? "",
        preferredLocation: user?.preferredLocation ?? "",
        experienceLevel:
          (user?.experienceLevel as
            | "Student"
            | "Fresher"
            | "Junior"
            | "Mid-level") ?? "Student",
        linkedinUrl: user?.linkedinUrl ?? "",
        portfolioUrl: user?.portfolioUrl ?? "",
      }}
      connections={{
        githubUsername: latestGithubProfile?.username ?? null,
      }}
      usage={{
        currentPlan: user?.plan === "pro" ? "Pro" : "Free",
        aiCreditsUsed: usageCount,
        resumeAnalysesCount: analysesCount,
      }}
    />
  );
}

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { analyses, suggestions, users } from "@/db/schema";
import { getDb } from "@/lib/db";

import type { ResumeAnalysis } from "./schema";

export async function saveResumeAnalysis(params: {
  clerkUserId: string;
  resumeFilename: string;
  targetRole?: string;
  analysis: ResumeAnalysis;
}) {
  const db = getDb();
  const user = await ensureUserRecord(params.clerkUserId);

  const [analysisRow] = await db
    .insert(analyses)
    .values({
      userId: user.id,
      resumeFilename: params.resumeFilename,
      targetRole: params.targetRole,
      atsScore: params.analysis.atsScore,
      summary: {
        summary: params.analysis.summary,
        recruiterSummary: params.analysis.recruiterSummary,
        keywordCoverage: params.analysis.keywordCoverage,
        formattingIssues: params.analysis.formattingIssues,
        missingSkills: params.analysis.missingSkills,
        strengths: params.analysis.strengths,
      },
    })
    .returning({ id: analyses.id });

  if (params.analysis.weakBullets.length > 0) {
    await db.insert(suggestions).values(
      params.analysis.weakBullets.map((bullet) => ({
        analysisId: analysisRow.id,
        category: "weak_bullet",
        severity: "medium",
        originalText: bullet.original,
        suggestedText: bullet.improved,
        rationale: bullet.reason,
      })),
    );
  }

  return analysisRow.id;
}

async function ensureUserRecord(clerkUserId: string) {
  const db = getDb();
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (existingUsers[0]) {
    return existingUsers[0];
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.emailAddresses.find(
      (entry) => entry.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ?? clerkUser?.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Unable to determine the signed-in user's email address.");
  }

  const [createdUser] = await db
    .insert(users)
    .values({
      clerkUserId,
      email,
    })
    .returning();

  return createdUser;
}

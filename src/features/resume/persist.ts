import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { resumeAnalyses, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

import type { ResumeAnalysis } from "./schema";

export async function saveResumeAnalysis(params: {
  clerkUserId: string;
  resumeFilename: string;
  extractedText: string;
  analysis: ResumeAnalysis;
}) {
  const db = getDb();
  await ensureAppSchema();
  const user = await ensureUserRecord(params.clerkUserId);

  const [analysisRow] = await db
    .insert(resumeAnalyses)
    .values({
      userId: user.id,
      fileName: params.resumeFilename,
      extractedText: params.extractedText,
      atsScore: params.analysis.atsScore,
      keywordMatch: params.analysis.keywordMatch,
      formattingScore: params.analysis.formattingScore,
      skillsScore: params.analysis.skillsScore,
      experienceScore: params.analysis.experienceScore,
      projectsScore: params.analysis.projectsScore,
      analysisJson: params.analysis,
    })
    .returning({ id: resumeAnalyses.id });

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

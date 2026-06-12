import { randomUUID } from "node:crypto";

import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { portfolioDrafts, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

import type { PortfolioFormData, PortfolioTemplate } from "./types";

export async function savePortfolioDraft(params: {
  clerkUserId: string;
  draftId?: string | null;
  template: PortfolioTemplate;
  sections: PortfolioFormData;
}) {
  const db = getDb();
  await ensureAppSchema();
  const user = await ensureUserRecord(params.clerkUserId);

  const nextSections = {
    ...params.sections,
    generatedAt: new Date().toISOString(),
  };

  if (params.draftId) {
    const [existing] = await db
      .select({ id: portfolioDrafts.id })
      .from(portfolioDrafts)
      .where(
        and(
          eq(portfolioDrafts.id, params.draftId),
          eq(portfolioDrafts.userId, user.id),
        ),
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(portfolioDrafts)
        .set({
          template: params.template,
          sections: nextSections,
          portfolioJson: nextSections,
          updatedAt: new Date(),
        })
        .where(eq(portfolioDrafts.id, params.draftId))
        .returning({ id: portfolioDrafts.id });

      return updated.id;
    }
  }

  const [created] = await db
    .insert(portfolioDrafts)
    .values({
      id: randomUUID(),
      userId: user.id,
      template: params.template,
      sections: nextSections,
      portfolioJson: nextSections,
    })
    .returning({ id: portfolioDrafts.id });

  return created.id;
}

async function ensureUserRecord(clerkUserId: string) {
  const db = getDb();
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (existingUser) {
    return existingUser;
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

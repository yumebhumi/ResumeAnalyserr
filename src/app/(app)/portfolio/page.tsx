import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { portfolioDrafts, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

export default async function PortfolioIndexPage() {
  const { userId: clerkUserId } = await auth();
  const db = getDb();

  await ensureAppSchema();

  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (!user) {
    redirect("/portfolio/demo");
  }

  const [latestDraft] = await db
    .select({ id: portfolioDrafts.id })
    .from(portfolioDrafts)
    .where(eq(portfolioDrafts.userId, user.id))
    .orderBy(desc(portfolioDrafts.updatedAt))
    .limit(1);

  redirect(latestDraft ? `/portfolio/${latestDraft.id}` : "/portfolio/demo");
}

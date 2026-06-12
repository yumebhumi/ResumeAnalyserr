import { auth, currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { resumeAnalyses, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureUsersTableColumns } from "@/lib/db-schema";

const settingsSchema = z.object({
  targetRole: z.string().trim().max(255).default(""),
  preferredLocation: z.string().trim().max(255).default(""),
  experienceLevel: z.enum(["Student", "Fresher", "Junior", "Mid-level"]).default("Student"),
  linkedinUrl: z.string().trim().max(512).default(""),
  portfolioUrl: z.string().trim().max(512).default(""),
});

export async function GET() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const db = getDb();

  await ensureUsersTableColumns();

  const [user] = await db
    .select({
      id: users.id,
      plan: users.plan,
      targetRole: users.targetRole,
      preferredLocation: users.preferredLocation,
      experienceLevel: users.experienceLevel,
      linkedinUrl: users.linkedinUrl,
      portfolioUrl: users.portfolioUrl,
      email: users.email,
    })
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  const latestAnalysis =
    user?.id
      ? await db
          .select({ atsScore: resumeAnalyses.atsScore })
          .from(resumeAnalyses)
          .where(eq(resumeAnalyses.userId, user.id))
          .orderBy(desc(resumeAnalyses.createdAt))
          .limit(1)
          .then((rows) => rows[0] ?? null)
      : null;

  return NextResponse.json({
    plan: user?.plan === "pro" ? "pro" : "free",
    targetRole: user?.targetRole ?? "",
    preferredLocation: user?.preferredLocation ?? "",
    experienceLevel: user?.experienceLevel ?? "Student",
    linkedinUrl: user?.linkedinUrl ?? "",
    portfolioUrl: user?.portfolioUrl ?? "",
    email: user?.email ?? "",
    atsScore: latestAnalysis?.atsScore ?? null,
  });
}

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = settingsSchema.parse(await request.json());
    const db = getDb();

    await ensureUsersTableColumns();

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (!user) {
      const clerkProfile = await currentUser();
      const email = clerkProfile?.emailAddresses[0]?.emailAddress;

      if (!email) {
        return NextResponse.json(
          { error: "Could not resolve the authenticated user." },
          { status: 400 },
        );
      }

      [user] = await db
        .insert(users)
        .values({
          clerkUserId,
          email,
        })
        .returning();
    }

    await db
      .update(users)
      .set({
        targetRole: payload.targetRole || null,
        preferredLocation: payload.preferredLocation || null,
        experienceLevel: payload.experienceLevel || null,
        linkedinUrl: payload.linkedinUrl || null,
        portfolioUrl: payload.portfolioUrl || null,
      })
      .where(eq(users.id, user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not save settings.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

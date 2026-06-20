import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { resumeAnalyses, users } from "@/db/schema";
import { generatePortfolioContent } from "@/features/portfolio/generate";
import { savePortfolioDraft } from "@/features/portfolio/persist";
import { generatedPortfolioSchema } from "@/features/portfolio/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

const sectionsSchema = z.object({
  name: z.string().default(""),
  role: z.string().default(""),
  about: z.string().default(""),
  skills: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  experience: z.array(z.string()).default([]),
  education: z.array(z.string()).default([]),
  githubLink: z.string().default(""),
  linkedinLink: z.string().default(""),
  email: z.string().default(""),
});

const nullableUuidSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value ?? null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      trimmed,
    )
      ? trimmed
      : null;
  },
  z.string().uuid().nullable(),
);

const requestSchema = z.object({
  draftId: nullableUuidSchema.optional().default(null),
  resumeAnalysisId: nullableUuidSchema.optional().default(null),
  template: z.enum(["minimal", "developer", "creative", "premium"]),
  sections: sectionsSchema,
});

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  try {
    const rawBody = await request.json();
    const body = requestSchema.parse(rawBody);
    const db = clerkUserId ? getDb() : null;
    const sanitizedSections = sectionsSchema.parse({
      ...body.sections,
      name: normalizeString(body.sections.name),
      role: normalizeString(body.sections.role),
      about: normalizeString(body.sections.about),
      skills: normalizeStringArray(body.sections.skills),
      projects: normalizeStringArray(body.sections.projects),
      experience: normalizeStringArray(body.sections.experience),
      education: normalizeStringArray(body.sections.education),
      githubLink: normalizeString(body.sections.githubLink),
      linkedinLink: normalizeString(body.sections.linkedinLink),
      email: normalizeString(body.sections.email),
    });

    let user: { id: string } | undefined;

    if (clerkUserId && db) {
      await ensureAppSchema();
      [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1);
    }

    const [analysis] = user && db
      ? body.resumeAnalysisId
        ? await db
            .select({
              id: resumeAnalyses.id,
              extractedText: resumeAnalyses.extractedText,
              analysisJson: resumeAnalyses.analysisJson,
            })
            .from(resumeAnalyses)
            .where(
              and(
                eq(resumeAnalyses.id, body.resumeAnalysisId),
                eq(resumeAnalyses.userId, user.id),
              ),
            )
            .limit(1)
        : await db
            .select({
              id: resumeAnalyses.id,
              extractedText: resumeAnalyses.extractedText,
              analysisJson: resumeAnalyses.analysisJson,
            })
            .from(resumeAnalyses)
            .where(eq(resumeAnalyses.userId, user.id))
            .orderBy(desc(resumeAnalyses.createdAt))
            .limit(1)
      : [];

    const portfolio = await generatePortfolioContent({
      template: body.template,
      resumeText: analysis?.extractedText,
      analysis: analysis?.analysisJson ?? null,
      current: sanitizedSections,
    });

    const mergedSections = sectionsSchema.parse({
      ...sanitizedSections,
      name: portfolio.name || sanitizedSections.name,
      role: portfolio.role || sanitizedSections.role,
      about: portfolio.about || sanitizedSections.about,
      skills:
        portfolio.skills.length > 0 ? portfolio.skills : sanitizedSections.skills,
      projects:
        portfolio.projects.length > 0
          ? portfolio.projects
          : sanitizedSections.projects,
      experience:
        portfolio.experience.length > 0
          ? portfolio.experience
          : sanitizedSections.experience,
      education:
        portfolio.education.length > 0
          ? portfolio.education
          : sanitizedSections.education,
      githubLink: portfolio.github || sanitizedSections.githubLink,
      linkedinLink: portfolio.linkedin || sanitizedSections.linkedinLink,
      email: portfolio.email || sanitizedSections.email,
    });

    const responsePortfolio = generatedPortfolioSchema.parse({
      ...portfolio,
      github: mergedSections.githubLink,
      linkedin: mergedSections.linkedinLink,
      email: mergedSections.email,
    });

    if (!clerkUserId) {
      return NextResponse.json({
        draftId: null,
        portfolio: responsePortfolio,
        saveStatus: "skipped",
        saveError: "Please sign in to save your portfolio draft.",
      });
    }

    let draftId: string | null = null;
    let saveStatus: "saved" | "failed" = "saved";
    let saveError: string | null = null;

    try {
      draftId = await savePortfolioDraft({
        clerkUserId,
        draftId: body.draftId,
        template: body.template,
        sections: mergedSections,
      });
    } catch (error) {
      console.error("Portfolio draft save failed", {
        error,
        draftId: body.draftId,
        hasResumeAnalysis: Boolean(analysis?.id),
        clerkUserId,
      });
      saveStatus = "failed";
      saveError = "Database save failed while storing the portfolio draft.";
    }

    return NextResponse.json({
      draftId,
      portfolio: responsePortfolio,
      saveStatus,
      saveError,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    const message =
      error instanceof Error ? error.message : "Could not generate portfolio.";

    if (/Groq/i.test(message)) {
      return NextResponse.json(
        { error: "Groq API failed while generating portfolio content." },
        { status: 502 },
      );
    }

    if (/database|insert|update|portfolio_drafts/i.test(message)) {
      return NextResponse.json(
        { error: "Database save failed while storing the portfolio draft." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringArray(value: unknown) {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

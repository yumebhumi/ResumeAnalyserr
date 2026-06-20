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

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const rawBody = await request.json();
    const body = requestSchema.parse(rawBody);
    const db = getDb();
    await ensureAppSchema();
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    const [analysis] = user
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
      current: body.sections,
    });

    const mergedSections = sectionsSchema.parse({
      ...body.sections,
      name: portfolio.name || body.sections.name,
      role: portfolio.role || body.sections.role,
      about: portfolio.about || body.sections.about,
      skills: portfolio.skills.length > 0 ? portfolio.skills : body.sections.skills,
      projects:
        portfolio.projects.length > 0 ? portfolio.projects : body.sections.projects,
      experience:
        portfolio.experience.length > 0
          ? portfolio.experience
          : body.sections.experience,
      education:
        portfolio.education.length > 0
          ? portfolio.education
          : body.sections.education,
      githubLink: portfolio.github || body.sections.githubLink,
      linkedinLink: portfolio.linkedin || body.sections.linkedinLink,
      email: portfolio.email || body.sections.email,
    });

    const draftId = await savePortfolioDraft({
      clerkUserId,
      draftId: body.draftId,
      template: body.template,
      sections: mergedSections,
    });

    return NextResponse.json({
      draftId,
      portfolio: generatedPortfolioSchema.parse({
        ...portfolio,
        github: mergedSections.githubLink,
        linkedin: mergedSections.linkedinLink,
        email: mergedSections.email,
      }),
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

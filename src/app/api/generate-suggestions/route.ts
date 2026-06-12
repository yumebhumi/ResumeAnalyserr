import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

import { resumeAnalyses, users } from "@/db/schema";
import { generateResumeSuggestions } from "@/features/resume/suggestions";
import { resumeAnalysisSchema } from "@/features/resume/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

const requestSchema = z
  .object({
    analysisId: z.string().uuid().optional(),
    resumeText: z.string().trim().min(80).optional(),
  })
  .refine((value) => Boolean(value.analysisId || value.resumeText), {
    message: "Provide a saved analysis ID or resume text.",
  });

export async function POST(request: Request) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = requestSchema.parse(await request.json());
    const db = getDb();
    await ensureAppSchema();

    let resumeText = body.resumeText;
    let priorAnalysis = null;

    if (body.analysisId) {
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: "User record not found." }, { status: 404 });
      }

      const [analysis] = await db
        .select({
          extractedText: resumeAnalyses.extractedText,
          analysisJson: resumeAnalyses.analysisJson,
        })
        .from(resumeAnalyses)
        .where(
          and(
            eq(resumeAnalyses.id, body.analysisId),
            eq(resumeAnalyses.userId, user.id),
          ),
        )
        .limit(1);

      if (!analysis) {
        return NextResponse.json({ error: "Saved analysis not found." }, { status: 404 });
      }

      resumeText = analysis.extractedText;
      priorAnalysis = resumeAnalysisSchema.safeParse(analysis.analysisJson).success
        ? resumeAnalysisSchema.parse(analysis.analysisJson)
        : null;
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required to generate suggestions." },
        { status: 400 },
      );
    }

    const suggestions = await generateResumeSuggestions({
      resumeText,
      analysis: priorAnalysis,
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Could not generate suggestions.";

    if (/Gemini/i.test(message)) {
      return NextResponse.json(
        { error: "Gemini API failed while generating suggestions." },
        { status: 502 },
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { Download, FileText, Target } from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { resumeAnalyses, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

export default async function ExportsPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;
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

  const [analysis] = user
    ? await db
        .select({
          id: resumeAnalyses.id,
          fileName: resumeAnalyses.fileName,
          atsScore: resumeAnalyses.atsScore,
          analysisJson: resumeAnalyses.analysisJson,
          createdAt: resumeAnalyses.createdAt,
        })
        .from(resumeAnalyses)
        .where(
          and(
            eq(resumeAnalyses.userId, user.id),
            eq(resumeAnalyses.id, analysisId),
          ),
        )
        .limit(1)
    : [];

  if (!analysis) {
    return (
      <SectionCard
        title="Export Report"
        description="Only your own saved analyses can be exported."
      >
        <div className="rounded-[20px] bg-[#221e1d] px-5 py-5 text-sm text-[#D6D3D1]">
          No exportable report was found for this analysis.
        </div>
      </SectionCard>
    );
  }

  const analysisJson =
    analysis.analysisJson && typeof analysis.analysisJson === "object"
      ? (analysis.analysisJson as Record<string, unknown>)
      : {};
  const suggestions = Array.isArray(analysisJson.suggestions)
    ? analysisJson.suggestions.filter((item): item is string => typeof item === "string")
    : [];
  const strengths = Array.isArray(analysisJson.strengths)
    ? analysisJson.strengths.filter((item): item is string => typeof item === "string")
    : [];
  const recommendedRoles = Array.isArray(analysisJson.recommendedRoles)
    ? analysisJson.recommendedRoles.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <div className="space-y-6 pb-8">
      <SectionCard
        title="Export Report"
        description="Saved recruiter-facing output from your real resume analysis."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[20px] bg-[#221e1d] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
              <Target className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-[#D6D3D1]">ATS Score</p>
            <p className="mt-2 text-3xl font-semibold text-[#FAF3E0]">
              {analysis.atsScore}/100
            </p>
          </div>

          <div className="rounded-[20px] bg-[#221e1d] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-[#D6D3D1]">Suggestions</p>
            <p className="mt-2 text-3xl font-semibold text-[#FAF3E0]">
              {suggestions.length}
            </p>
          </div>

          <div className="rounded-[20px] bg-[#221e1d] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
              <Download className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-[#D6D3D1]">Source File</p>
            <p className="mt-2 text-lg font-semibold text-[#FAF3E0]">
              {analysis.fileName}
            </p>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          title="Top strengths"
          description="Export-friendly strengths from the saved AI analysis."
        >
          <div className="space-y-3">
            {strengths.length > 0 ? (
              strengths.slice(0, 5).map((item) => (
                <div key={item} className="rounded-[18px] bg-[#221e1d] px-4 py-3 text-sm text-[#D6D3D1]">
                  {item}
                </div>
              ))
            ) : (
              <div className="rounded-[18px] bg-[#221e1d] px-4 py-3 text-sm text-[#D6D3D1]">
                No strengths were saved for this analysis.
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Recommended roles"
          description="Role alignment inferred from the saved analysis."
        >
          <div className="flex flex-wrap gap-2">
            {recommendedRoles.length > 0 ? (
              recommendedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-[rgba(192,132,87,0.12)] px-3 py-1.5 text-sm text-[#FAF3E0]"
                >
                  {role}
                </span>
              ))
            ) : (
              <div className="rounded-[18px] bg-[#221e1d] px-4 py-3 text-sm text-[#D6D3D1]">
                No recommended roles were saved for this analysis.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

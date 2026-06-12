import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";

import { githubProfiles, portfolioDrafts, resumeAnalyses, users } from "@/db/schema";
import { buildPortfolioInitialData } from "@/features/portfolio/defaults";
import { PortfolioBuilder } from "@/features/portfolio/builder";
import { getDb } from "@/lib/db";
import { ensureAppSchema } from "@/lib/db-schema";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function PortfolioDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const isDemoDraft = draftId === "demo";
  const isUuidDraft = uuidPattern.test(draftId);
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

  let draftById:
    | {
        id: string;
        template: string;
        sections: Record<string, unknown> | null;
      }
    | null = null;

  if (user && isUuidDraft) {
    [draftById] = await db
        .select({
          id: portfolioDrafts.id,
          template: portfolioDrafts.template,
          sections: portfolioDrafts.sections,
        })
        .from(portfolioDrafts)
        .where(
          and(
            eq(portfolioDrafts.userId, user.id),
            eq(portfolioDrafts.id, draftId),
          ),
        )
        .limit(1);
  }

  let latestDraft:
    | {
        id: string;
        template: string;
        sections: Record<string, unknown> | null;
      }
    | null = null;

  if (!draftById && user) {
    [latestDraft] = await db
        .select({
          id: portfolioDrafts.id,
          template: portfolioDrafts.template,
          sections: portfolioDrafts.sections,
        })
        .from(portfolioDrafts)
        .where(eq(portfolioDrafts.userId, user.id))
        .orderBy(desc(portfolioDrafts.updatedAt))
        .limit(1);
  }

  const [latestAnalysis] = user
    ? await db
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

  const selectedDraft = draftById ?? (isDemoDraft ? latestDraft ?? null : null);

  const initialData = buildPortfolioInitialData({
    latestAnalysis: latestAnalysis
      ? {
          id: latestAnalysis.id,
          extractedText: latestAnalysis.extractedText,
          analysisJson: latestAnalysis.analysisJson,
        }
      : null,
    draft: selectedDraft
      ? {
          id: selectedDraft.id,
          template: selectedDraft.template,
          sections: selectedDraft.sections,
        }
      : null,
    plan: user?.plan === "pro" ? "pro" : "free",
  });

  if (!initialData.data.githubLink && latestGithubProfile?.username) {
    initialData.data.githubLink = `https://github.com/${latestGithubProfile.username}`;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
          Portfolio Builder
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Build a recruiter-ready developer portfolio.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#D6D3D1]">
          Start from your latest resume analysis, refine the content manually,
          and shape a clean portfolio preview before publishing.
        </p>
      </section>

      <PortfolioBuilder initialData={initialData} />
    </div>
  );
}

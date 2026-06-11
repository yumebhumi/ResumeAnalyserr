import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  LayoutTemplate,
  Link2,
  ScanSearch,
  Sparkles,
} from "lucide-react";

import { SectionCard } from "@/components/section-card";
import { githubProfiles, portfolioDrafts, resumeAnalyses, users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { ensureUsersTableColumns } from "@/lib/db-schema";

type AnalysisSnapshot = {
  id: string;
  fileName: string;
  atsScore: number | null;
  analysisJson: unknown;
  createdAt: Date | string | null;
};

type ActivityItem = {
  id: string;
  message: string;
  meta: string;
};

function formatRelativeLabel(value: Date | string | null | undefined) {
  if (!value) return "Recent";

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Recent";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfTarget.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function extractGithubHealth(stats: Record<string, unknown> | null | undefined) {
  if (!stats) return null;

  const candidates = [stats.healthScore, stats.githubHealth, stats.score, stats.health];
  for (const value of candidates) {
    if (typeof value === "number") {
      return Math.max(0, Math.min(100, Math.round(value)));
    }
  }

  return null;
}

function extractSuggestions(item: AnalysisSnapshot | null) {
  if (!item?.analysisJson || typeof item.analysisJson !== "object") {
    return [];
  }

  const suggestions = (item.analysisJson as Record<string, unknown>).suggestions;
  return Array.isArray(suggestions)
    ? suggestions.filter((value): value is string => typeof value === "string")
    : [];
}

export default async function DashboardPage() {
  const { userId: clerkUserId } = await auth();
  const db = getDb();

  await ensureUsersTableColumns();

  const [user] = clerkUserId
    ? await db
        .select()
        .from(users)
        .where(eq(users.clerkUserId, clerkUserId))
        .limit(1)
    : [];

  const recentAnalyses = user
    ? await db
        .select({
          id: resumeAnalyses.id,
          fileName: resumeAnalyses.fileName,
          atsScore: resumeAnalyses.atsScore,
          analysisJson: resumeAnalyses.analysisJson,
          createdAt: resumeAnalyses.createdAt,
        })
        .from(resumeAnalyses)
        .where(eq(resumeAnalyses.userId, user.id))
        .orderBy(desc(resumeAnalyses.createdAt))
        .limit(5)
    : [];

  const latestAnalysis = recentAnalyses[0] ?? null;

  const [latestGithubProfile] = user
    ? await db
        .select({
          id: githubProfiles.id,
          username: githubProfiles.username,
          stats: githubProfiles.stats,
          analyzedAt: githubProfiles.analyzedAt,
        })
        .from(githubProfiles)
        .where(eq(githubProfiles.userId, user.id))
        .orderBy(desc(githubProfiles.analyzedAt))
        .limit(1)
    : [];

  const [latestPortfolioDraft] = user
    ? await db
        .select({
          id: portfolioDrafts.id,
          template: portfolioDrafts.template,
          updatedAt: portfolioDrafts.updatedAt,
        })
        .from(portfolioDrafts)
        .where(eq(portfolioDrafts.userId, user.id))
        .orderBy(desc(portfolioDrafts.updatedAt))
        .limit(1)
    : [];

  const atsScore = latestAnalysis?.atsScore ?? null;
  const githubHealth = extractGithubHealth(latestGithubProfile?.stats);
  const portfolioStatus = latestPortfolioDraft ? "Draft" : "Not started";
  const latestSuggestions = extractSuggestions(latestAnalysis);
  const resumeSuggestions = latestSuggestions.length;
  const topSuggestions = latestSuggestions.slice(0, 3);

  const recentActivity: ActivityItem[] = [];

  if (latestAnalysis) {
    recentActivity.push({
      id: `analysis-${latestAnalysis.id}`,
      message: `Resume analysis completed for ${latestAnalysis.fileName}.`,
      meta: formatRelativeLabel(latestAnalysis.createdAt),
    });
  }

  if (latestGithubProfile) {
    recentActivity.push({
      id: `github-${latestGithubProfile.id}`,
      message: `GitHub profile ${latestGithubProfile.username} was linked to your workspace.`,
      meta: formatRelativeLabel(latestGithubProfile.analyzedAt),
    });
  }

  if (latestPortfolioDraft) {
    recentActivity.push({
      id: `draft-${latestPortfolioDraft.id}`,
      message: `Portfolio draft is available using the ${latestPortfolioDraft.template} template.`,
      meta: formatRelativeLabel(latestPortfolioDraft.updatedAt),
    });
  }

  const quickActions = [
    { label: "Analyze Resume", href: "/analyze", icon: ScanSearch },
    { label: "Connect GitHub", href: "/github", icon: Link2 },
    {
      label: "Build Portfolio",
      href: latestPortfolioDraft
        ? `/portfolio/${latestPortfolioDraft.id}`
        : "/portfolio",
      icon: LayoutTemplate,
    },
  ];

  const metrics = [
    {
      label: "ATS Score",
      value: atsScore !== null ? `${atsScore}/100` : "No data",
      note: latestAnalysis ? "Latest saved analysis" : "Run your first analysis",
      icon: BarChart3,
    },
    {
      label: "Resume Suggestions",
      value: `${resumeSuggestions}`,
      note:
        resumeSuggestions > 0
          ? "Top issues ready to review"
          : "No suggestions saved yet",
      icon: FileText,
    },
    {
      label: "Portfolio Status",
      value: portfolioStatus,
      note: latestPortfolioDraft ? "Draft in workspace" : "Nothing generated yet",
      icon: LayoutTemplate,
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-[24px] bg-[linear-gradient(135deg,rgba(139,94,60,0.45),rgba(192,132,87,0.28),rgba(250,243,224,0.16))] p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
        <div className="rounded-[23px] bg-[#292524] p-7 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(192,132,87,0.08)] px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                <Sparkles className="h-3.5 w-3.5" />
                Overview
              </div>
              <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Your recruiter-ready profile, tracked in one workspace.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#D6D3D1] sm:text-[15px]">
                Analyze your resume, monitor GitHub health, and build a
                portfolio recruiters notice.
              </p>
            </div>

            <div className="w-full max-w-[360px] space-y-3">
              {[
                {
                  label: "ATS Score",
                  value: atsScore !== null ? `${atsScore}/100` : "No data",
                },
                {
                  label: "GitHub Health",
                  value: githubHealth !== null ? `${githubHealth}%` : "Not connected",
                },
                {
                  label: "Portfolio Status",
                  value: portfolioStatus,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3.5"
                >
                  <p className="text-sm text-[#D6D3D1]">{item.label}</p>
                  <p className="text-sm font-medium text-[#FAF3E0]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <div
            key={label}
            className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#D6D3D1]">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-[#FAF3E0]">{value}</p>
                <p className="mt-2 text-sm text-[#D6D3D1]">{note}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          title="Quick actions"
          description="Move through the core workflow without extra noise."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between rounded-[20px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-4 transition hover:-translate-y-[2px] hover:border-[rgba(250,243,224,0.14)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#C08457]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium text-white">{label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#D6AD60]" />
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent activity"
          description="Latest workspace events from your saved data."
        >
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-[18px] bg-[#221e1d] px-4 py-3.5"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D6AD60]" />
                  <div>
                    <p className="text-sm leading-7 text-[#D6D3D1]">{item.message}</p>
                    <p className="mt-1 text-xs text-[#D6AD60]">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] bg-[#221e1d] px-4 py-5 text-sm text-[#D6D3D1]">
              No activity yet. Start by analyzing your resume.
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard
        title="Priority suggestions"
        description="The highest-value improvements from your latest saved resume analysis."
      >
        <div className="grid gap-3">
          {topSuggestions.length > 0 ? (
            topSuggestions.map((suggestion, index) => (
              <div
                key={`${suggestion}-${index}`}
                className="flex items-start gap-4 rounded-[18px] bg-[#221e1d] px-4 py-4"
              >
                <div className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(214,173,96,0.14)] text-xs font-medium text-[#D6AD60]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Suggestion {index + 1}</p>
                  <p className="mt-1 text-sm leading-7 text-[#D6D3D1]">{suggestion}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] bg-[#221e1d] px-4 py-5 text-sm text-[#D6D3D1]">
              No priority suggestions yet. Analyze a resume to surface your top improvements.
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileSearch,
  FileText,
  GitBranch,
  LayoutTemplate,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { DashboardCard } from "@/components/dashboard-card";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { ScoreCard } from "@/components/score-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";

const featureCards = [
  {
    icon: FileSearch,
    title: "AI Resume Analyzer",
    description:
      "Parse PDF and DOCX resumes, score ATS readiness, and surface missing keywords, formatting gaps, and weak bullets in one pass.",
  },
  {
    icon: GitBranch,
    title: "GitHub Analyzer",
    description:
      "Review repository quality, project depth, commit signals, and technology patterns to build a stronger developer profile.",
  },
  {
    icon: LayoutTemplate,
    title: "Portfolio Builder",
    description:
      "Turn resume data and GitHub signals into a polished personal site draft with structured sections and recruiter-facing copy.",
  },
];

const dashboardMetrics = [
  { icon: FileText, title: "Resumes analyzed", value: "24.8k", detail: "+18% this month" },
  { icon: BarChart3, title: "Average ATS lift", value: "+27%", detail: "After guided rewrites" },
  { icon: Workflow, title: "Portfolio drafts", value: "8.1k", detail: "Generated in under 3 min" },
];

const scoreCards = [
  {
    label: "ATS Match",
    score: "92",
    detail: "Strong role alignment, measurable project outcomes, and clean keyword coverage for frontend engineering roles.",
  },
  {
    label: "GitHub Signal",
    score: "88",
    detail: "Consistent activity, meaningful README quality, and a healthy distribution of product and systems work.",
  },
  {
    label: "Portfolio Readiness",
    score: "95",
    detail: "Enough source material to auto-generate a portfolio that feels specific, current, and credible.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Navbar />
      </div>

      <section className="relative overflow-hidden px-4 pb-18 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/8 px-4 py-2 text-sm text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              Built for modern candidate workflows and recruiting teams
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-slate-50 sm:text-6xl lg:text-7xl">
                HireMe AI
              </h1>
              <p className="max-w-3xl text-xl leading-9 text-slate-300 sm:text-2xl">
                AI Resume Analyzer, Portfolio Builder, and GitHub Analyzer for
                candidates who want stronger signal and teams who want faster
                screening.
              </p>
              <p className="max-w-2xl text-base leading-8 text-slate-400">
                Upload a resume, measure ATS quality, inspect GitHub depth, and
                turn both into a recruiter-ready portfolio draft from one
                premium dark workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Launch dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/analyze">Try resume analysis</Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Resume parsing", "PDF + DOCX ingestion"],
                ["GitHub review", "Projects, commits, readmes"],
                ["Portfolio export", "Instant personal site draft"],
              ].map(([title, detail]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-white/4 px-5 py-4 backdrop-blur-xl"
                >
                  <p className="text-sm font-medium text-slate-100">{title}</p>
                  <p className="mt-2 text-sm text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
            className="relative"
          >
            <div className="absolute inset-x-10 top-10 h-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="glass-panel relative rounded-[32px] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
                    Live Product Snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-50">
                    Candidate intelligence dashboard
                  </h2>
                </div>
                <div className="rounded-2xl bg-[linear-gradient(135deg,#06B6D4,#22D3EE,#E5E7EB)] px-4 py-2 text-sm font-medium text-slate-950">
                  AI Active
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {dashboardMetrics.map((item) => (
                  <DashboardCard key={item.title} {...item} />
                ))}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                  <p className="text-sm font-medium text-slate-200">Analysis pipeline</p>
                  <div className="mt-5 space-y-4">
                    {[
                      "Upload resume and normalize content",
                      "Run ATS scoring and rewrite suggestions",
                      "Scan GitHub quality and portfolio signals",
                      "Assemble portfolio-ready candidate story",
                    ].map((step, index) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/8 text-xs font-semibold text-cyan-200">
                          {index + 1}
                        </div>
                        <p className="text-sm text-slate-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">Recruiter summary</p>
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                  </div>
                  <p className="mt-4 text-sm leading-8 text-slate-400">
                    Strong frontend engineer profile with production React work,
                    measurable delivery impact, and enough public proof to support
                    a clean portfolio narrative. Recommended focus: tighten system
                    design bullet points and raise backend keyword density.
                  </p>
                  <div className="mt-6 h-36 rounded-3xl border border-cyan-300/15 bg-[linear-gradient(180deg,rgba(6,182,212,0.14),rgba(255,255,255,0.02))] p-4">
                    <div className="flex h-full items-end gap-3">
                      {[42, 68, 56, 74, 88, 92].map((height, index) => (
                        <div key={height} className="flex-1 space-y-2">
                          <div
                            className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#06B6D4,#E5E7EB)]"
                            style={{ height: `${height}%` }}
                          />
                          <p className="text-center text-[11px] text-slate-500">
                            W{index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Core Product"
            title="Three products connected by one candidate data layer"
            description="HireMe AI combines resume analysis, GitHub evaluation, and portfolio generation so candidates and hiring teams work from the same structured signal."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section id="preview" className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Scoring Engine"
            title="Actionable scores instead of vague AI output"
            description="Each analysis returns structured scoring, targeted strengths, missing signals, and recruiter-facing explanations that are easy to act on."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {scoreCards.map((card) => (
              <ScoreCard key={card.label} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 rounded-[32px] border border-white/10 bg-white/4 p-8 shadow-[0_28px_100px_rgba(8,15,32,0.45)] backdrop-blur-xl lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
                Workflow
              </p>
              <h2 className="text-4xl font-semibold text-slate-50">
                One upload in, a complete candidate story out.
              </h2>
              <p className="text-base leading-8 text-slate-400">
                HireMe AI is designed to move a user from raw resume to polished
                digital presence without switching tools or losing context.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                ["01", "Resume ingestion", "Extract structured experience, keywords, bullet quality, and ATS fit."],
                ["02", "GitHub signal mapping", "Analyze repositories, contribution patterns, stack depth, and shipping evidence."],
                ["03", "Portfolio synthesis", "Generate a cleaner story, stronger proof points, and reusable site sections."],
              ].map(([step, title, body]) => (
                <div key={step} className="rounded-3xl border border-white/10 bg-slate-950/55 p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-300">
                      {step}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-100">{title}</p>
                      <p className="mt-1 text-sm leading-7 text-slate-400">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="px-4 py-18 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Pricing"
            title="Pricing that fits solo candidates and recruiting teams"
            description="Start with analysis, then expand into GitHub scoring, portfolio generation, and team workflows as volume grows."
            align="center"
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <PricingCard
              tier="Starter"
              price="$0"
              description="For candidates testing resume scoring and basic portfolio generation."
              features={[
                "3 resume analyses per month",
                "Basic ATS recommendations",
                "Single portfolio draft",
              ]}
            />
            <PricingCard
              tier="Pro"
              price="$29"
              description="For active job seekers and freelance developers building a stronger technical profile."
              features={[
                "Unlimited resume analyses",
                "GitHub repository scoring",
                "Advanced portfolio builder",
                "Export-ready recruiter summaries",
              ]}
              highlighted
            />
            <PricingCard
              tier="Team"
              price="$99"
              description="For recruiting teams and bootcamps managing candidate quality across a pipeline."
              features={[
                "Multi-user workspace",
                "Shared candidate dashboards",
                "Priority AI processing",
                "Usage analytics and seat controls",
              ]}
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

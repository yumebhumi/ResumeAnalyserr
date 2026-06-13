"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSearch,
  GitBranch,
  LayoutTemplate,
  ScanSearch,
} from "lucide-react";

import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileSearch,
    title: "AI Resume Analysis",
    description:
      "Checks ATS score, keywords, formatting, and recruiter readability.",
  },
  {
    icon: LayoutTemplate,
    title: "Portfolio Builder",
    description:
      "Generates a clean developer portfolio from your resume data.",
  },
  {
    icon: GitBranch,
    title: "GitHub Insights",
    description:
      "Finds your strongest repositories and suggests profile improvements.",
  },
];

const steps = [
  {
    title: "Upload Resume",
    body: "Upload your PDF or DOCX resume.",
  },
  {
    title: "Get AI Feedback",
    body: "Receive ATS score, missing keywords, and stronger bullet points.",
  },
  {
    title: "Build Portfolio",
    body: "Generate a polished portfolio website from your resume.",
  },
];

const heroTaglines = [
  "AI Resume + Portfolio Builder",
  "ATS Score Optimizer",
  "GitHub Profile Analyzer",
  "Recruiter-Ready Career Workspace",
  "Build Your Portfolio in Minutes",
];

export default function Home() {
  const [activeTagline, setActiveTagline] = useState(0);
  const atsScore = 86;
  const scoreSize = 220;
  const scoreStroke = 14;
  const scoreRadius = (scoreSize - scoreStroke) / 2;
  const scoreCircumference = 2 * Math.PI * scoreRadius;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTagline((current) => (current + 1) % heroTaglines.length);
    }, 1500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-auto">
      <section className="snap-start px-4 pb-12 pt-4 sm:px-6 lg:min-h-screen lg:px-8">
        <div className="mx-auto max-w-[1280px]">
          <Navbar />
        </div>

        <div className="mx-auto mt-6 grid max-w-[1200px] gap-10 lg:min-h-[calc(100vh-8rem)] lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-7"
          >
            <div className="space-y-4">
              <p className="text-[22px] font-bold tracking-[-0.02em] text-[#FAF3E0]">
                HireMe AI ☕
              </p>
              <div className="h-12">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={heroTaglines[activeTagline]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="inline-flex items-center rounded-full border border-[rgba(250,243,224,0.10)] bg-[rgba(41,37,36,0.75)] px-6 py-3 text-base font-medium text-[#D6AD60]"
                  >
                    {heroTaglines[activeTagline]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] text-white sm:text-5xl lg:text-[72px]">
                Get Hired. Not Ghosted.
              </h1>
              <p className="max-w-2xl text-lg leading-7 text-[#D6D3D1]">
                Analyze your resume, optimize your ATS score, improve your
                GitHub profile, and build a recruiter-ready portfolio—all in
                one workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <Link href="/analyze">
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className="relative rounded-[28px] border border-[rgba(250,243,224,0.10)] bg-[#292524] p-7 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              style={{ background: "rgba(192,132,87,0.08)" }}
            />
            <div className="relative h-1 rounded-full bg-[linear-gradient(135deg,#8B5E3C,#C08457,#FAF3E0)]" />

            <div className="relative mt-6 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)]">Career Intelligence</p>
                <h3 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  HireMe Score
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--accent)]">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="relative mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface-soft)] p-8">
                <div className="relative flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="absolute h-[168px] w-[168px] rounded-full blur-[60px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(192,132,87,0.16), transparent 60%)",
                    }}
                  />
                  <div className="relative flex h-[220px] w-[220px] items-center justify-center">
                    <svg
                      viewBox={`0 0 ${scoreSize} ${scoreSize}`}
                      className="absolute inset-0 h-full w-full -rotate-90"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="ats-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5E3C" />
                          <stop offset="55%" stopColor="#C08457" />
                          <stop offset="100%" stopColor="#D6AD60" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={scoreSize / 2}
                        cy={scoreSize / 2}
                        r={scoreRadius}
                        fill="none"
                        stroke="rgba(250,243,224,0.10)"
                        strokeWidth={scoreStroke}
                      />
                      <motion.circle
                        cx={scoreSize / 2}
                        cy={scoreSize / 2}
                        r={scoreRadius}
                        fill="none"
                        stroke="url(#ats-score-gradient)"
                        strokeWidth={scoreStroke}
                        strokeLinecap="round"
                        strokeDasharray={scoreCircumference}
                        initial={{ strokeDashoffset: scoreCircumference }}
                        animate={{
                          strokeDashoffset:
                            scoreCircumference - (scoreCircumference * atsScore) / 100,
                        }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="relative text-center">
                      <p className="text-[56px] font-extrabold leading-none text-[var(--text-primary)]">
                        {atsScore}
                      </p>
                      <p className="mt-2 text-base text-[var(--text-secondary)]">out of 100</p>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm font-medium tracking-[0.18em] text-[#D6AD60]">
                  HireMe Score
                </p>
              </div>

              <div className="space-y-3">
                {[
                  ["ATS Score", "86/100"],
                  ["Keyword Match", "78%"],
                  ["Resume Strength", "Strong"],
                  ["Portfolio Readiness", "92%"],
                ].map(([label, value]) => (
                  <motion.div
                    key={label}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex h-16 items-center justify-between rounded-[18px] border border-[var(--border)] bg-[var(--surface-soft)] px-5"
                  >
                    <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
                    <p className="text-sm font-semibold text-[#D6AD60]">{value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="features"
        className="snap-start px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:px-8"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D6AD60]">
              Features
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Everything you need to get hired faster.
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#D6D3D1]">
              Improve your resume, GitHub, and portfolio in one focused workspace.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="snap-start px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:px-8"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D6AD60]">
              Process
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              From resume upload to recruiter-ready profile.
            </h2>
          </div>

          <div className="relative mt-10 grid gap-5 lg:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-[#C08457] lg:block" />
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="relative rounded-[24px] border border-border bg-card p-6 shadow-[var(--inset-highlight)] lg:min-h-[200px] lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
              >
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[var(--surface-soft)] text-sm font-semibold text-primaryText lg:bg-card">
                  {index + 1}
                </div>
                <p className="mt-5 text-lg font-semibold text-primaryText">{step.title}</p>
                <p className="mt-3 max-w-sm text-base leading-7 text-secondaryText">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="snap-start px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:px-8">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#D6D3D1]">Product Preview</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Resume Analysis Dashboard</h3>
              </div>
              <ScanSearch className="h-5 w-5 text-[#D6AD60]" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["ATS Score", "86/100"],
                ["Keyword Match", "78%"],
                ["Formatting Score", "Clean"],
                ["Missing Skills", "CI/CD, Testing"],
              ].map(([label, detail]) => (
                <div
                  key={label}
                  className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3.5"
                >
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="mt-1 text-sm text-[#D6AD60]">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-4">
              <p className="text-sm font-medium text-white">AI Suggestions</p>
              <p className="mt-2 text-sm leading-7 text-[#D6D3D1]">
                Increase backend keyword density, add one quantified impact metric,
                and clarify ownership on the strongest project.
              </p>
            </div>

            <div className="mt-4 rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-4">
              <p className="text-sm font-medium text-white">Improved Resume Bullets</p>
              <div className="mt-3 space-y-3">
                {[
                  "Built a reporting dashboard that reduced manual analysis time by 42%.",
                  "Improved page performance by 31% through bundle and render optimization.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3 text-sm text-[#FAF3E0]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: 0.06 }}
            className="space-y-4"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D6AD60]">
              Product Showcase
            </p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              See what HireMe AI looks like in practice
            </h2>
            <p className="max-w-xl text-base leading-7 text-[#D6D3D1]">
              The product preview is designed to feel like a real SaaS workspace:
              structured scoring, clearer feedback, and content that is ready to
              turn into a stronger candidate profile.
            </p>
            <div className="space-y-3">
              {[
                "Recruiter-focused resume feedback",
                "ATS keyword optimization",
                "Better project descriptions",
                "Portfolio-ready content",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#D6AD60]" />
                  <p className="text-base leading-7 text-[#D6D3D1]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="pricing"
        className="snap-start px-4 py-16 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:px-8"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#D6AD60]">
              Pricing
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Start free, upgrade when you need more
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#D6D3D1]">
              Two plans, clear value, and a stronger premium signal for candidates
              who are actively trying to stand out.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <PricingCard
              tier="Free Plan"
              price="₹0/month"
              description="For trying HireMe AI and running your first analysis."
              features={[
                "1 resume analysis per month",
                "Basic ATS score",
                "Basic portfolio template",
                "GitHub overview",
              ]}
              cta="Start Free"
            />
            <PricingCard
              tier="Pro Plan"
              price="₹299/month"
              description="For serious applicants who want deeper AI insights."
              features={[
                "Unlimited resume analysis",
                "Premium resume templates",
                "Recruiter insights",
                "Advanced GitHub analysis",
              ]}
              highlighted
              cta="Upgrade to Pro"
            />
          </div>
        </div>
      </section>

      <section className="snap-start lg:min-h-screen">
        <div className="flex min-h-screen items-end">
          <Footer />
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Coffee, GitBranch, LayoutTemplate } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const trustStats = [
  { label: "ATS Score", icon: BarChart3 },
  { label: "Portfolio Builder", icon: LayoutTemplate },
  { label: "GitHub Insights", icon: GitBranch },
];

const microTrust = [
  "ATS Optimization",
  "Portfolio Generation",
  "GitHub Analysis",
];

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1C1917] px-4 py-6 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[420px] w-[420px] rounded-full blur-[160px]"
        style={{ background: "rgba(192,132,87,0.08)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full blur-[160px]"
        style={{ background: "rgba(250,243,224,0.04)" }}
      />

      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#D6D3D1] transition hover:text-[#FAF3E0]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="relative mt-6 grid items-center gap-8 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[0.55fr_0.45fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="max-w-[560px]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(250,243,224,0.10)] bg-[#292524] text-[#D6AD60]">
                  <Coffee className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-white">HireMe AI</p>
              </div>

              <p className="mt-10 text-xs font-medium uppercase tracking-[0.15em] text-[#D6AD60]">
                Career OS
              </p>
              <h1 className="mt-4 max-w-[560px] text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                {title}
              </h1>
              <p className="mt-6 max-w-[480px] text-lg leading-8 text-[#D6D3D1]">
                {subtitle}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {microTrust.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[#FAF3E0]">
                    <span className="text-[#D6AD60]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {trustStats.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex h-12 items-center gap-3 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(41,37,36,0.7)] px-4"
                  >
                    <Icon className="h-4 w-4 text-[#C08457]" />
                    <p className="text-sm font-medium text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 }}
            className="relative mx-auto flex min-h-full w-full max-w-[640px] items-center justify-center"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              style={{ background: "rgba(192,132,87,0.10)" }}
            />

            <div className="relative flex min-h-full w-full max-w-[480px] flex-col rounded-[32px] border border-[rgba(250,243,224,0.08)] bg-[rgba(41,37,36,0.85)] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
              <div className="h-[3px] rounded-full bg-[linear-gradient(90deg,#8B5E3C,#C08457,#FAF3E0)]" />
              <div className="mt-6 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(250,243,224,0.10)] bg-[#221e1d] text-[#D6AD60]">
                    <Coffee className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-white">HireMe AI</p>
                </div>
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-[#D6AD60]">
                  Career OS
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-white">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#D6D3D1]">{subtitle}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {microTrust.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[#FAF3E0]">
                      <span className="text-[#D6AD60]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-h-full flex-1 items-center justify-center py-6">
                <div className="w-full">{children}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, GitBranch, LayoutTemplate } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";

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
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-4 sm:px-6 lg:h-screen lg:px-8 lg:py-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at top, rgba(192,132,87,0.08), transparent 60%)",
        }}
      />

      <div className="mx-auto flex h-full max-w-[1200px] flex-col">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="relative mt-3 grid flex-1 items-center gap-4 lg:grid-cols-[0.6fr_0.4fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="max-w-[560px]">
              <BrandLogo iconClassName="h-11 w-11 rounded-full border border-[var(--border)]" />

              <p className="mt-7 text-xs font-medium uppercase tracking-[0.15em] text-[var(--secondary)]">
                Career OS
              </p>
              <h1 className="mt-4 max-w-[560px] text-[46px] font-bold leading-[0.95] tracking-[-0.04em] text-[var(--text-primary)] xl:text-[54px]">
                {title}
              </h1>
              <p className="mt-4 max-w-[480px] text-[17px] leading-7 text-[var(--text-secondary)]">
                {subtitle}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                {microTrust.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[var(--accent)]">
                    <span className="text-[var(--secondary)]">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {trustStats.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex h-12 items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--glass-bg)] px-4"
                  >
                    <Icon className="h-4 w-4 text-[var(--primary)]" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 }}
            className="relative mx-auto flex min-h-full w-full max-w-[500px] items-center justify-center lg:origin-center lg:scale-[0.88] xl:scale-[0.93] 2xl:scale-100 xl:max-w-[520px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              style={{ background: "rgba(192,132,87,0.10)" }}
            />

            <div className="relative flex min-h-full w-full max-w-[500px] flex-col rounded-[28px] border border-[var(--border)] bg-[color:var(--glass-bg)] p-3.5 shadow-[var(--card-shadow)] xl:max-w-[520px]">
              <div className="h-[3px] rounded-full bg-[linear-gradient(90deg,#8B5E3C,#C08457,#FAF3E0)]" />
              <div className="mt-6 lg:hidden">
                <BrandLogo iconClassName="h-10 w-10 rounded-full border border-[var(--border)]" />
                <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-[var(--secondary)]">
                  Career OS
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-[0.95] tracking-[-0.04em] text-[var(--text-primary)]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{subtitle}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {microTrust.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-[var(--accent)]">
                      <span className="text-[var(--secondary)]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex min-h-full flex-1 items-center justify-center py-2">
                <div className="w-full">{children}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

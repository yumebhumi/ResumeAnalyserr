"use client";

import { BrandLogo } from "@/components/brand-logo";

type AuthCardShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const trustIndicators = [
  "Secure Authentication",
  "ATS Analysis",
  "Recruiter Insights",
];

export function AuthCardShell({
  title,
  subtitle,
  children,
}: AuthCardShellProps) {
  return (
    <div className="rounded-[28px] bg-[var(--auth-card)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="flex flex-col items-center text-center">
        <BrandLogo
          showText={false}
          iconClassName="h-9 w-9 rounded-xl border-0 bg-transparent p-0"
        />
        <p className="mt-3 text-xl font-bold text-[var(--auth-text)]">HireMe AI</p>
        <h2 className="mt-3 text-[30px] font-bold tracking-[-0.02em] text-[var(--auth-text)] sm:text-[30px]">
          {title}
        </h2>
        <p className="mt-2 text-[15px] text-[var(--auth-muted)] sm:text-base">{subtitle}</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-[var(--auth-muted)] sm:text-xs">
          {trustIndicators.map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="text-[var(--primary)]">✓</span>
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}

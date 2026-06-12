"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  FileText,
  GitBranch,
  LayoutDashboard,
  LayoutTemplate,
  PanelLeft,
  Settings,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const userButtonAppearance = {
  elements: {
    avatarBox: "h-10 w-10",
    userButtonPopoverCard:
      "border border-[var(--border)] bg-[var(--auth-card)] shadow-[0_20px_60px_rgba(0,0,0,0.12)]",
    userButtonPopoverMain: "bg-[var(--auth-card)] text-[var(--auth-text)]",
    userButtonPopoverFooter: "bg-[var(--auth-card)] border-t border-[var(--border)]",
    userPreview: "bg-transparent",
    userPreviewMainIdentifier: "text-[var(--auth-text)] font-semibold",
    userPreviewSecondaryIdentifier: "text-[var(--auth-muted)]",
    userButtonPopoverActionButton:
      "text-[var(--auth-text)] hover:bg-[var(--surface-soft)] rounded-[14px]",
    userButtonPopoverActionButtonText: "text-[var(--auth-text)]",
    userButtonPopoverActionButtonIcon: "text-[var(--auth-muted)]",
  },
} as const;

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Resume Analyzer", icon: FileText },
  { href: "/github", label: "GitHub Analyzer", icon: GitBranch },
  { href: "/portfolio", label: "Portfolio Builder", icon: LayoutTemplate },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
];

const headerCopy: Array<{
  match: (pathname: string) => boolean;
  title: string;
  subtitle: string;
}> = [
  {
    match: (pathname) => pathname.startsWith("/settings"),
    title: "Settings",
    subtitle: "Profile, preferences, connections, and plan details.",
  },
  {
    match: (pathname) => pathname.startsWith("/pricing"),
    title: "Pricing",
    subtitle: "Plans and premium feature access.",
  },
  {
    match: (pathname) => pathname.startsWith("/github"),
    title: "GitHub Analyzer",
    subtitle: "Developer profile intelligence and repository quality.",
  },
  {
    match: (pathname) => pathname.startsWith("/portfolio"),
    title: "Portfolio Builder",
    subtitle: "Build and refine your recruiter-ready portfolio.",
  },
  {
    match: (pathname) => pathname.startsWith("/analyze"),
    title: "Resume Analyzer",
    subtitle: "Upload and review your resume with AI-backed ATS analysis.",
  },
  {
    match: (pathname) => pathname.startsWith("/user-profile"),
    title: "Account",
    subtitle: "Manage your Clerk account details securely.",
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const activeHeader =
    headerCopy.find((item) => item.match(pathname)) ?? {
      title: "Dashboard",
      subtitle: "Your career workspace at a glance.",
    };

  const navItems = (
    <nav className="space-y-1.5">
      {navigation.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href ||
          (href !== "/dashboard" &&
            !href.includes("#") &&
            pathname.startsWith(href));

        return (
          <Link
            key={href}
            href={href}
            onClick={() => setIsSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
              isActive
                ? "bg-[var(--brand-soft)] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--brand-soft)] hover:text-[var(--text-primary)]",
            )}
          >
            <Icon className="h-4 w-4 text-[var(--primary)]" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background text-[var(--text-primary)]">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/45 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[var(--border)] bg-surface px-4 py-5 md:flex">
          <div className="border-b border-[var(--border)] pb-5">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo
                iconClassName="h-11 w-11 rounded-2xl border border-[var(--border)]"
                textClassName="text-lg"
              />
            </Link>
          </div>

          <div className="mt-6">{navItems}</div>
        </aside>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[248px] border-r border-[var(--border)] bg-surface px-4 py-5 transition-transform md:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
              <BrandLogo
                iconClassName="h-11 w-11 rounded-2xl border border-[var(--border)]"
                textClassName="text-lg"
              />
            </Link>
            <button
              type="button"
              aria-label="Close sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-contrast)] text-[var(--secondary)]"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6">{navItems}</div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color:var(--background)]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-card text-[var(--primary)] md:hidden"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{activeHeader.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{activeHeader.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle className="hidden sm:inline-flex" />
                <div className="hidden rounded-full border border-[var(--border)] bg-card px-4 py-2 text-sm text-[var(--text-secondary)] sm:inline-flex">
                  Free Plan
                </div>
                <UserButton appearance={userButtonAppearance} />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

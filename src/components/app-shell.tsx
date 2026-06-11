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

import { cn } from "@/lib/utils";

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
                ? "bg-[rgba(192,132,87,0.14)] text-[#FAF3E0]"
                : "text-[#D6D3D1] hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4 text-[#C08457]" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#1C1917] text-white">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/45 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-5 md:flex">
          <div className="flex items-center gap-3 border-b border-[rgba(250,243,224,0.08)] pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f1b1a] text-sm font-semibold text-[#FAF3E0]">
              HM
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">HireMe AI</h1>
              <p className="text-sm text-[#D6D3D1]">Career workspace</p>
            </div>
          </div>

          <div className="mt-6">{navItems}</div>
        </aside>

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[248px] border-r border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-5 transition-transform md:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-[rgba(250,243,224,0.08)] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f1b1a] text-sm font-semibold text-[#FAF3E0]">
                HM
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">HireMe AI</h1>
                <p className="text-sm text-[#D6D3D1]">Career workspace</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(250,243,224,0.08)] bg-[#1f1b1a] text-[#D6AD60]"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6">{navItems}</div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-[rgba(250,243,224,0.08)] bg-[#1C1917]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Open sidebar"
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(250,243,224,0.08)] bg-[#292524] text-[#C08457] md:hidden"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-lg font-semibold text-white">{activeHeader.title}</p>
                  <p className="text-sm text-[#D6D3D1]">{activeHeader.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-2 text-sm text-[#D6D3D1] sm:inline-flex">
                  Free Plan
                </div>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10",
                    },
                  }}
                />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

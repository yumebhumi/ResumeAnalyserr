"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  Lock,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyze", label: "Analyze Resume", icon: FileText },
  { href: "/github", label: "GitHub Analysis", icon: GitBranch },
  { href: "/pricing", label: "Premium", icon: Lock },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,174,0,0.18),_transparent_28%),linear-gradient(180deg,_#fff8ed_0%,_#fffdf7_45%,_#f4efe4_100%)] text-stone-950">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 flex-col rounded-[28px] border border-stone-200/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(40,28,10,0.08)] backdrop-blur md:flex">
          <div className="flex items-center gap-3 border-b border-stone-200/80 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-white">
              HM
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Resume AI
              </p>
              <h1 className="text-lg font-semibold">HireMe AI</h1>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    isActive
                      ? "bg-stone-950 text-white"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl bg-stone-950 p-5 text-stone-50">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-5 w-5 text-amber-300" />
              <div>
                <p className="text-sm font-medium">Foundation ready</p>
                <p className="text-xs text-stone-300">
                  Next slice: resume upload and ATS analysis.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-[28px] border border-stone-200/70 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(40,28,10,0.06)] backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                Candidate Workspace
              </p>
              <p className="text-sm text-stone-700">
                ATS analysis, GitHub insights, and portfolio generation.
              </p>
            </div>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

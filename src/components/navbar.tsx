"use client";

import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-slate-950/60 px-5 py-4 shadow-[0_18px_60px_rgba(2,6,23,0.4)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#06B6D4,#22D3EE,#E5E7EB)] text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-50">HireMe AI</p>
            <p className="text-xs text-slate-500">
              Resume Analyzer, GitHub Insights, Portfolio Builder
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          <Link href="#features" className="transition hover:text-cyan-300">
            Features
          </Link>
          <Link href="#preview" className="transition hover:text-cyan-300">
            Preview
          </Link>
          <Link href="#pricing" className="transition hover:text-cyan-300">
            Pricing
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Create account</Button>
          </SignUpButton>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-200 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}

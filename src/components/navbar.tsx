"use client";

import { useState } from "react";
import Link from "next/link";
import { Coffee, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-4 z-30">
      <div className="mx-auto w-[90%] max-w-[1280px] rounded-[9999px] border border-[rgba(250,243,224,0.10)] bg-[rgba(41,37,36,0.82)] px-6 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-[18px]">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(250,243,224,0.10)] bg-[#1f1b1a] text-[#D6AD60]">
              <Coffee className="h-4 w-4" />
            </div>
            <p className="text-base font-semibold text-white">HireMe AI</p>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-[#D6D3D1] lg:flex">
            <Link href="#features" className="transition hover:text-white">
              Features
            </Link>
            <Link href="#pricing" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button asChild variant="ghost">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link href="/sign-up">Start Free</Link>
            </Button>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(250,243,224,0.10)] text-[#D6D3D1] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen ? (
          <div className="mt-4 border-t border-[rgba(250,243,224,0.10)] pt-4 md:hidden">
            <nav className="flex flex-col gap-1 text-sm text-[#D6D3D1]">
              {[
                { href: "#features", label: "Features" },
                { href: "#pricing", label: "Pricing" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl px-3 py-3 transition hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3">
              <Button asChild variant="ghost" className="w-full justify-center">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full">
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  Start Free
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

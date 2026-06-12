"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Menu, Settings, UserCircle2, X } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

const userButtonAppearance = {
  elements: {
    avatarBox: "h-9 w-9",
    userButtonAvatarBox: "h-9 w-9",
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

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-4 z-30">
      <div className="relative mx-auto flex h-[72px] w-[90%] max-w-[1800px] items-center rounded-full border border-[var(--border)] bg-[var(--glass-bg)] px-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-[16px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[22%] top-0 h-full rounded-full blur-[36px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(192,132,87,0.14), transparent 62%)",
          }}
        />
        <div className="flex w-full items-center justify-between gap-4">
          <Link href="/" className="relative z-10 flex items-center gap-3">
            <BrandLogo
              iconClassName="h-9 w-9 rounded-full border border-[var(--border)]"
              showText={false}
            />
            <span className="text-[22px] font-bold tracking-[-0.01em] text-[var(--text-primary)]">
              HireMe AI ☕
            </span>
          </Link>

          <nav className="relative z-10 hidden items-center gap-10 text-[15px] text-[var(--text-secondary)] lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[var(--accent)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative z-10 hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {!isSignedIn ? (
              <>
              <Button asChild variant="ghost" className="text-[var(--accent)] hover:text-[var(--text-primary)]">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full px-5">
                <Link href="/sign-up">Get Started</Link>
              </Button>
              </>
            ) : null}

            {isSignedIn ? (
              <>
              <Button asChild className="rounded-full px-5">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/user-profile"
                appearance={userButtonAppearance}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Profile"
                    labelIcon={<UserCircle2 className="h-4 w-4" />}
                    href="/user-profile"
                  />
                  <UserButton.Link
                    label="Settings"
                    labelIcon={<Settings className="h-4 w-4" />}
                    href="/settings"
                  />
                  <UserButton.Link
                    label="Billing"
                    labelIcon={<span className="text-sm leading-none">₹</span>}
                    href="/pricing"
                  />
                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
              </>
            ) : null}
          </div>

          <button
            type="button"
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-secondary)] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="mx-auto mt-3 w-[90%] max-w-[1280px] rounded-[28px] border border-[var(--border)] bg-[var(--glass-bg)] p-4 shadow-[var(--card-shadow)] backdrop-blur-[18px] md:hidden">
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          <nav className="flex flex-col gap-1 text-sm text-[var(--text-secondary)]">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-3 py-3 transition hover:bg-[var(--brand-soft)] hover:text-[var(--text-primary)]"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            {!isSignedIn ? (
              <>
              <Button asChild variant="ghost" className="w-full justify-center text-[var(--accent)]">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full">
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
              </>
            ) : null}

            {isSignedIn ? (
              <>
              <Button
                asChild
                className="w-full justify-center rounded-full"
              >
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              </Button>
              <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Account
                </span>
                <UserButton
                  userProfileMode="navigation"
                  userProfileUrl="/user-profile"
                  appearance={userButtonAppearance}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="Profile"
                      labelIcon={<UserCircle2 className="h-4 w-4" />}
                      href="/user-profile"
                    />
                    <UserButton.Link
                      label="Settings"
                      labelIcon={<Settings className="h-4 w-4" />}
                      href="/settings"
                    />
                    <UserButton.Link
                      label="Billing"
                      labelIcon={<span className="text-sm leading-none">₹</span>}
                      href="/pricing"
                    />
                    <UserButton.Action label="manageAccount" />
                    <UserButton.Action label="signOut" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

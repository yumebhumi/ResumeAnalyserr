import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 HireMe AI. Built for faster hiring outcomes and sharper candidate profiles.</p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/dashboard" className="transition hover:text-cyan-300">
            Dashboard
          </Link>
          <Link href="/analyze" className="transition hover:text-cyan-300">
            Resume Analyzer
          </Link>
          <Link href="/github" className="transition hover:text-cyan-300">
            GitHub Analyzer
          </Link>
          <Link href="/pricing" className="transition hover:text-cyan-300">
            Pricing
          </Link>
        </div>
      </div>
    </footer>
  );
}

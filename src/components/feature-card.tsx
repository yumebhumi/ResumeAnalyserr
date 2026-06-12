"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="rounded-[24px] border border-[var(--border)] bg-card p-8 shadow-[var(--card-shadow-soft),var(--inset-highlight)] hover:border-[var(--border)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--primary)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--secondary)] transition hover:text-[var(--accent)]"
      >
        Learn More
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}

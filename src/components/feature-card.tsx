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
      className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-[rgba(250,243,224,0.16)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(250,243,224,0.08)] text-[#C08457]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#D6D3D1]">{description}</p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#D6AD60] transition hover:text-[#FAF3E0]"
      >
        Learn More
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}

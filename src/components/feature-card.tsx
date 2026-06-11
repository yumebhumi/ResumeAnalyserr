"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="glass-panel cyan-ring rounded-3xl p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/12 text-cyan-300">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-50">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
    </motion.article>
  );
}

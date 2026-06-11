import type { LucideIcon } from "lucide-react";

export function DashboardCard({
  icon: Icon,
  title,
  value,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold text-slate-50">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

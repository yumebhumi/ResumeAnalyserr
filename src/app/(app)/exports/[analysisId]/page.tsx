import { Download } from "lucide-react";

import { SectionCard } from "@/components/section-card";

export default async function ExportsPage({
  params,
}: {
  params: Promise<{ analysisId: string }>;
}) {
  const { analysisId } = await params;

  return (
    <SectionCard
      title="Exports"
      description="This route will serve recruiter-ready exports for an analysis."
    >
      <div className="flex items-start gap-4 rounded-[28px] border border-stone-200 bg-stone-50/80 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-stone-950">Analysis reference</p>
          <p className="mt-2 font-mono text-xs text-stone-500">{analysisId}</p>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            The export slice will generate a printable resume improvement report
            and a downloadable portfolio code bundle.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

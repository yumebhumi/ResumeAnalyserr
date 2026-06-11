import { SectionCard } from "@/components/section-card";

export default async function PortfolioDraftPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;

  return (
    <div className="grid gap-6 pb-8 lg:grid-cols-[0.9fr_1.1fr]">
      <SectionCard
        title="Portfolio Editor"
        description="Editable portfolio drafts will live on this route."
      >
        <div className="rounded-[28px] border border-stone-200 bg-stone-50/80 p-5">
          <p className="font-mono text-xs text-stone-500">draftId</p>
          <p className="mt-2 text-sm text-stone-800">{draftId}</p>
        </div>
      </SectionCard>

      <SectionCard
        title="Preview Surface"
        description="This panel will render the generated portfolio preview."
      >
        <div className="flex min-h-80 items-center justify-center rounded-[28px] border border-dashed border-stone-300 bg-white/70 text-sm text-stone-500">
          Preview placeholder
        </div>
      </SectionCard>
    </div>
  );
}

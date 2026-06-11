import { cn } from "@/lib/utils";

export function SectionCard({
  className,
  title,
  description,
  children,
}: {
  className?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-stone-200/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(40,28,10,0.08)] backdrop-blur",
        className,
      )}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-stone-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-stone-600">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

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
        "rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-[#D6D3D1]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

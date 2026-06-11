import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("space-y-4", align === "center" && "text-center")}>
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#D6AD60]">
        {eyebrow}
      </p>
      <div className={cn("space-y-3", align === "center" && "mx-auto max-w-3xl")}>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

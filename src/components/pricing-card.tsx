import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCard({
  tier,
  price,
  description,
  features,
  highlighted = false,
  cta = "Get Started",
  badge,
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta?: string;
  badge?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] border p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-200 hover:-translate-y-1",
        highlighted
          ? "border-transparent bg-[linear-gradient(var(--card),var(--card))_padding-box,linear-gradient(135deg,#8B5E3C,#C08457,#FAF3E0)_border-box] lg:scale-[1.02]"
          : "border-[var(--border)] bg-card",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{tier}</p>
        {badge ? (
          <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-5xl font-semibold text-[var(--text-primary)]">{price}</p>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      <div className="mt-8 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--secondary)]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <Button variant={highlighted ? "default" : "secondary"} className="mt-10 w-full">
        {cta}
      </Button>
    </section>
  );
}

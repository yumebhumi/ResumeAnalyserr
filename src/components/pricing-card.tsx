import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCard({
  tier,
  price,
  description,
  features,
  highlighted = false,
}: {
  tier: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border p-6 shadow-[0_24px_80px_rgba(8,15,32,0.4)] backdrop-blur-xl",
        highlighted
          ? "border-cyan-300/35 bg-cyan-400/8"
          : "border-white/10 bg-white/4",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">{tier}</p>
          <p className="mt-4 text-4xl font-semibold text-slate-50">{price}</p>
        </div>
        {highlighted ? (
          <span className="rounded-full border border-cyan-300/25 bg-cyan-400/12 px-3 py-1 text-xs font-medium text-cyan-200">
            Most Popular
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-slate-300">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <Button variant={highlighted ? "default" : "secondary"} className="mt-8 w-full">
        Start free
      </Button>
    </section>
  );
}

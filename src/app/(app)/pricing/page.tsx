import { Lock } from "lucide-react";

import { SectionCard } from "@/components/section-card";

const paidFeatures = [
  "Premium resume templates",
  "Recruiter insights",
  "AI optimization credits",
  "Custom domain support",
];

export default function PricingPage() {
  return (
    <SectionCard
      title="Premium Features"
      description="UI-gated features that stay locked until billing is added."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {paidFeatures.map((feature) => (
          <div
            key={feature}
            className="flex items-center gap-3 rounded-[24px] border border-stone-200 bg-stone-50/80 px-4 py-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-950 text-white">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium text-stone-950">{feature}</p>
              <p className="text-sm text-stone-600">Coming after Stripe.</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

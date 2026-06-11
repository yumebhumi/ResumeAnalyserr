import { GitBranch } from "lucide-react";

import { SectionCard } from "@/components/section-card";

export default function GithubPage() {
  return (
    <div className="grid gap-6 pb-8 lg:grid-cols-[1.1fr_0.9fr]">
      <SectionCard
        title="GitHub Analysis"
        description="This screen will summarize public repositories and developer signals."
      >
        <div className="flex items-start gap-4 rounded-[28px] border border-stone-200 bg-stone-50/80 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-950 text-white">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-950">
              Planned flow
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              Fetch GitHub profile data, summarize repository quality, extract
              strengths and gaps with Gemini, then link the result to portfolio
              generation.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Inputs To Use">
        <div className="space-y-3 text-sm text-stone-700">
          {[
            "GitHub username",
            "Public repo metadata",
            "Language breakdown",
            "Stars, forks, and activity",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

import { SectionCard } from "@/components/section-card";
import { AnalyzeForm } from "@/features/resume/analyze-form";

export default function AnalyzePage() {
  return (
    <div className="grid gap-6 pb-8 lg:grid-cols-[1.2fr_0.8fr]">
      <SectionCard
        title="Resume Analysis"
        description="Upload a technical resume and get ATS-style feedback from Gemini."
      >
        <AnalyzeForm />
      </SectionCard>

      <SectionCard
        title="Analysis Output"
        description="What the Gemini pipeline now returns and persists."
      >
        <div className="space-y-3 font-mono text-xs text-stone-700">
          {[
            "atsScore: number",
            "summary: string",
            "recruiterSummary: string",
            "keywordCoverage: string[]",
            "formattingIssues: string[]",
            "weakBullets: { original, improved, reason }[]",
            "missingSkills: string[]",
            "strengths: string[]",
          ].map((row) => (
            <div
              key={row}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              {row}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

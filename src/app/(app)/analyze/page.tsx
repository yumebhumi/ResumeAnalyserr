import { SectionCard } from "@/components/section-card";
import { AnalyzeForm } from "@/features/resume/analyze-form";

export default function AnalyzePage() {
  return (
    <div className="grid gap-6 pb-8 lg:grid-cols-[1.2fr_0.8fr]">
      <SectionCard
        title="Resume Analysis"
        description="Upload a real PDF or DOCX resume and get ATS-style analysis, score breakdowns, and saved AI suggestions."
      >
        <AnalyzeForm />
      </SectionCard>

      <SectionCard
        title="Pipeline Output"
        description="What the backend now extracts, analyzes, validates, and saves."
      >
        <div className="space-y-3 text-sm text-[#D6D3D1]">
          {[
            "PDF and DOCX resume upload with 5 MB validation",
            "Readable text extraction and normalization",
            "Gemini JSON analysis with ATS and category scores",
            "Saved report in Neon database per authenticated user",
            "Real result cards for keywords, strengths, weaknesses, and recommended roles",
          ].map((row) => (
            <div
              key={row}
              className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3"
            >
              {row}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

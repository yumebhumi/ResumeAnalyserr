import { SectionCard } from "@/components/section-card";
import { AnalyzeForm } from "@/features/resume/analyze-form";

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-6xl pb-8">
      <SectionCard
        title="Resume Analysis"
        description="Upload a real PDF or DOCX resume and get ATS-style analysis, score breakdowns, and saved AI suggestions."
      >
        <AnalyzeForm />
      </SectionCard>
    </div>
  );
}

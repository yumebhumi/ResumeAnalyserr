"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  LoaderCircle,
  Sparkles,
  Target,
  Upload,
} from "lucide-react";

import type { AnalyzeResumeResponse } from "./schema";
import { MAX_RESUME_FILE_SIZE } from "./constants";

const megabyteLimit = MAX_RESUME_FILE_SIZE / (1024 * 1024);
const loadingSteps = [
  "Uploading resume",
  "Extracting text",
  "Analyzing ATS score",
  "Generating AI suggestions",
  "Saving report",
];

const scoreCards = [
  { key: "keywordMatch", label: "Keyword Match" },
  { key: "formattingScore", label: "Formatting Score" },
  { key: "skillsScore", label: "Skills Score" },
  { key: "experienceScore", label: "Experience Score" },
  { key: "projectsScore", label: "Projects Score" },
] as const;

export function AnalyzeForm() {
  const [targetRole, setTargetRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResumeResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const interval = window.setInterval(() => {
      setStepIndex((current) =>
        current < loadingSteps.length - 1 ? current + 1 : current,
      );
    }, 900);

    return () => window.clearInterval(interval);
  }, [isSubmitting]);

  const fileSummary = useMemo(() => {
    if (!file) {
      return "No resume selected yet.";
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    return `${file.name} • ${sizeInMb} MB`;
  }, [file]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Select a PDF or DOCX resume to continue.");
      return;
    }

    setStepIndex(0);
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      if (targetRole.trim()) {
        formData.append("targetRole", targetRole.trim());
      }

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const rawResponse = await response.text();
      let payload: unknown = null;

      if (rawResponse) {
        try {
          payload = JSON.parse(rawResponse) as unknown;
        } catch {
          payload = null;
        }
      }

      if (!response.ok) {
        const errorMessage =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : rawResponse.trim() || "Resume analysis failed.";

        throw new Error(errorMessage);
      }

      if (!payload || typeof payload !== "object") {
        throw new Error("Resume analysis returned an invalid response.");
      }

      setStepIndex(loadingSteps.length - 1);
      setResult(payload as AnalyzeResumeResponse);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Resume analysis failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">
              Target role
            </span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Frontend Engineer, Product Designer, Backend Developer..."
              className="w-full rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-4 py-3 text-sm text-white outline-none transition focus:border-[#C08457]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[#FAF3E0]">
              Resume file
            </span>
            <div className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#C08457]">
                  <Upload className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Upload PDF or DOCX
                  </p>
                  <p className="text-xs text-[#D6D3D1]">
                    Max file size {megabyteLimit} MB
                  </p>
                </div>
              </div>

              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="mt-4 block w-full text-sm text-[#D6D3D1] file:mr-3 file:rounded-xl file:border-0 file:bg-[#C08457] file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
              />

              <p className="mt-3 text-xs text-[#D6D3D1]">{fileSummary}</p>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analyze resume
        </button>
      </form>

      {isSubmitting ? (
        <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-5">
          <p className="text-sm font-medium text-white">Analysis in progress</p>
          <div className="mt-4 space-y-3">
            {loadingSteps.map((step, index) => {
              const isComplete = index < stepIndex;
              const isActive = index === stepIndex;

              return (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3"
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4 text-[#D6AD60]" />
                  ) : isActive ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#C08457]" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-[rgba(250,243,224,0.12)]" />
                  )}
                  <span className="text-sm text-[#D6D3D1]">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[20px] border border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] px-4 py-3 text-sm text-[#FAF3E0]">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 text-[#D6AD60]" />
            <span>{error}</span>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="space-y-5">
          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D6AD60]">
                    ATS Score
                  </p>
                  <p className="mt-4 text-6xl font-semibold text-[#FAF3E0]">
                    {result.analysis.atsScore}
                  </p>
                </div>
                <div
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    result.analysis.atsScore >= 80
                      ? "bg-[rgba(95,165,125,0.12)] text-[#B9E6C7]"
                      : result.analysis.atsScore >= 60
                        ? "bg-[rgba(214,173,96,0.12)] text-[#F3D897]"
                        : "bg-[rgba(193,90,90,0.12)] text-[#F3B1B1]"
                  }`}
                >
                  {getScoreLabel(result.analysis.atsScore)}
                </div>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#D6D3D1]">
                {result.analysis.summary}
              </p>
            </div>

            <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Score Breakdown</h3>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  Quick recruiter-style signal across the most important areas.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {scoreCards.map(({ key, label }) => (
                  <div
                    key={key}
                    className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-4"
                  >
                    <p className="text-sm text-[#D6D3D1]">{label}</p>
                    <p className="mt-3 text-2xl font-semibold text-[#FAF3E0]">
                      {result.analysis[key]}%
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-[#3a312d]">
                      <div
                        className="h-2 rounded-full bg-[#C08457]"
                        style={{ width: `${result.analysis[key]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <PreviewListCard
                title="Top strengths"
                icon={CheckCircle2}
                items={result.analysis.strengths}
                emptyLabel="No strengths returned."
              />
              <PreviewListCard
                title="Top gaps"
                icon={AlertCircle}
                items={result.analysis.weaknesses}
                emptyLabel="No weaknesses returned."
              />
            </div>

            <div className="space-y-5">
              <PreviewListCard
                title="Missing skills"
                icon={Target}
                items={
                  result.analysis.missingSkills.length > 0
                    ? result.analysis.missingSkills
                    : result.analysis.missingKeywords
                }
                emptyLabel="No missing skills detected."
              />
              <PreviewListCard
                title="Recommended roles"
                icon={Briefcase}
                items={result.analysis.recommendedRoles}
                emptyLabel="No roles recommended."
              />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <ExpandableCard
              title="AI suggestions"
              items={result.analysis.suggestions}
              emptyLabel="No suggestions returned."
            />
            <ExpandableCard
              title="Improved bullet points"
              items={result.analysis.improvedBullets}
              emptyLabel="No improved bullet points returned."
            />
            <ExpandableCard
              title="Missing skills"
              icon={Target}
              items={
                result.analysis.missingSkills.length > 0
                  ? result.analysis.missingSkills
                  : result.analysis.missingKeywords
              }
              emptyLabel="No missing skills detected."
            />
            <ExpandableCard
              title="All strengths"
              icon={CheckCircle2}
              items={result.analysis.strengths}
              emptyLabel="No strengths returned."
            />
            <ExpandableCard
              title="All weaknesses"
              icon={AlertCircle}
              items={result.analysis.weaknesses}
              emptyLabel="No weaknesses returned."
            />
          </div>

          <p className="font-mono text-xs text-[#D6D3D1]">
            analysisId: {result.analysisId}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function PreviewListCard({
  title,
  icon: Icon,
  items,
  emptyLabel,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
  emptyLabel: string;
}) {
  const previewItems = items.slice(0, 3);

  return (
    <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#C08457]">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {previewItems.length > 0 ? (
          previewItems.map((item) => (
            <div
              key={item}
              className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3 text-sm leading-7 text-[#D6D3D1]"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-[#D6D3D1]">{emptyLabel}</p>
        )}
      </div>
      {items.length > 3 ? (
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-[#D6AD60]">
          +{items.length - 3} more in detailed sections below
        </p>
      ) : null}
    </div>
  );
}

function ExpandableCard({
  title,
  icon: Icon,
  items,
  emptyLabel,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  items: string[];
  emptyLabel: string;
}) {
  return (
    <details className="group rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6 open:bg-[#221e1d]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {Icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#C08457]">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <ChevronDown className="h-5 w-5 text-[#D6AD60] transition group-open:rotate-180" />
      </summary>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={`${title}-${index}-${item}`}
              className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3 text-sm leading-7 text-[#D6D3D1]"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-[#D6D3D1]">{emptyLabel}</p>
        )}
      </div>
    </details>
  );
}

function getScoreLabel(score: number) {
  if (score >= 80) {
    return "Strong fit";
  }

  if (score >= 60) {
    return "Good base";
  }

  return "Needs work";
}

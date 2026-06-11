"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, Sparkles, Upload } from "lucide-react";

import type { AnalyzeResumeResponse } from "./schema";
import { MAX_RESUME_FILE_SIZE } from "./constants";

const megabyteLimit = MAX_RESUME_FILE_SIZE / (1024 * 1024);

export function AnalyzeForm() {
  const [targetRole, setTargetRole] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResumeResponse | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Select a PDF or DOCX resume to continue.");
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append("resume", file);

        if (targetRole.trim()) {
          formData.append("targetRole", targetRole.trim());
        }

        const response = await fetch("/api/resume/analyze", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as unknown;

        if (!response.ok) {
          const errorMessage =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
              ? payload.error
              : "Resume analysis failed.";

          throw new Error(errorMessage);
        }

        setResult(payload as AnalyzeResumeResponse);
      } catch (submissionError) {
        setResult(null);
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : "Resume analysis failed.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-800">
              Target role
            </span>
            <input
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder="Frontend Developer, Data Analyst, Backend Engineer..."
              className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-stone-800">
              Resume file
            </span>
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3">
              <Upload className="h-4 w-4 text-stone-500" />
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-stone-700 file:mr-3 file:rounded-xl file:border-0 file:bg-stone-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
              />
            </div>
            <p className="text-xs text-stone-500">
              Accepts PDF and DOCX up to {megabyteLimit} MB.
            </p>
          </label>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-2xl bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analyze resume
        </button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[28px] border border-stone-200 bg-stone-950 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                ATS Score
              </p>
              <p className="mt-3 text-6xl font-semibold">
                {result.analysis.atsScore}
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                {result.analysis.summary}
              </p>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-stone-50/85 p-6">
              <p className="text-sm font-medium text-stone-900">
                Recruiter summary
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                {result.analysis.recruiterSummary}
              </p>
              <p className="mt-5 font-mono text-xs text-stone-500">
                analysisId: {result.analysisId}
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <ResultList
              title="Keyword coverage"
              items={result.analysis.keywordCoverage}
            />
            <ResultList
              title="Missing skills"
              items={result.analysis.missingSkills}
            />
            <ResultList
              title="Formatting issues"
              items={result.analysis.formattingIssues}
            />
            <ResultList title="Strengths" items={result.analysis.strengths} />
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white/85 p-6">
            <h3 className="text-lg font-semibold text-stone-950">
              Weak bullet rewrites
            </h3>
            <div className="mt-4 space-y-4">
              {result.analysis.weakBullets.length > 0 ? (
                result.analysis.weakBullets.map((bullet) => (
                  <div
                    key={`${bullet.original}-${bullet.improved}`}
                    className="rounded-3xl border border-stone-200 bg-stone-50 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                      Original
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-700">
                      {bullet.original}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-amber-700">
                      Improved
                    </p>
                    <p className="mt-2 text-sm font-medium leading-7 text-stone-950">
                      {bullet.improved}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-600">
                      {bullet.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-stone-600">
                  No weak bullet rewrites were returned for this resume.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[28px] border border-stone-200 bg-white/85 p-6">
      <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700"
            >
              {item}
            </div>
          ))
        ) : (
          <p className="text-sm text-stone-500">No items returned.</p>
        )}
      </div>
    </div>
  );
}

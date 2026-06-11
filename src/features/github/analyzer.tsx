"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Code2,
  Flame,
  GitBranch,
  LoaderCircle,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import type { AnalyzeGithubResponse } from "./schema";
import {
  buildGitHubViewModelFromResponse,
  type GitHubViewModel,
} from "./view-model";

export function GithubAnalyzer({
  initialUsername,
  initialModel,
}: {
  initialUsername: string;
  initialModel: GitHubViewModel | null;
}) {
  const [username, setUsername] = useState(initialUsername);
  const [model, setModel] = useState<GitHubViewModel | null>(initialModel);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim()) {
      setError("Enter a GitHub username.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
        }),
      });

      const payload = (await response.json()) as unknown;
      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "GitHub analysis failed.";
        throw new Error(message);
      }

      setModel(buildGitHubViewModelFromResponse(payload as AnalyzeGithubResponse));
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "GitHub analysis failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_top_left,rgba(192,132,87,0.08),transparent_45%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(192,132,87,0.08)] px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
              <Sparkles className="h-3.5 w-3.5" />
              GitHub Analyzer
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Developer Profile Intelligence
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#D6D3D1] sm:text-[15px]">
              Analyze repositories, technologies, activity patterns, and
              portfolio readiness.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D6AD60]" />
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter GitHub username"
                  className="h-14 w-full rounded-[16px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-[#8f887f] focus:border-[#C08457]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[14px] bg-[#C08457] px-6 text-sm font-medium text-white transition hover:bg-[#D6AD60] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : null}
                Analyze GitHub
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-[18px] border border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] px-4 py-3 text-sm text-[#FAF3E0]">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6">
            {model ? (
              <>
                <p className="text-sm text-[#D6D3D1]">{model.sourceLabel}</p>
                <div className="mt-5 flex items-center gap-6">
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-[rgba(250,243,224,0.08)]" />
                    <div
                      className="absolute inset-0 rounded-full border-[10px] border-transparent [clip-path:inset(0_0_50%_0)]"
                      style={{
                        borderTopColor: "#C08457",
                        transform: `rotate(${(model.portfolioReadyScore / 100) * 180}deg)`,
                      }}
                    />
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-[#FAF3E0]">
                        {model.portfolioReadyScore}
                      </p>
                      <p className="text-xs text-[#D6D3D1]">/100</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                      Portfolio Ready Score
                    </p>
                    <p className="text-sm leading-7 text-[#D6D3D1]">
                      Strongest signal for recruiters based on project quality,
                      documentation, and visible technical depth.
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] px-3 py-1.5 text-xs text-[#FAF3E0]">
                      <GitBranch className="h-3.5 w-3.5 text-[#D6AD60]" />
                      @{model.username}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-[220px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(250,243,224,0.08)] text-sm text-[#D6D3D1]">
                Analyze a GitHub username to generate real developer insights.
              </div>
            )}
          </div>
        </div>
      </section>

      {model ? (
        <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Repositories", value: `${model.repositories}`, icon: GitBranch },
              { label: "Stars", value: `${model.stars}`, icon: Star },
              { label: "Languages", value: `${model.languagesCount}`, icon: Code2 },
              { label: "Commit Activity", value: model.commitActivity, icon: Flame },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#D6D3D1]">{label}</p>
                    <p className="mt-3 text-3xl font-semibold text-[#FAF3E0]">{value}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </section>

          <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <h2 className="text-lg font-semibold text-white">Top Languages</h2>
            <p className="mt-1 text-sm text-[#D6D3D1]">
              Technologies most visible across the analyzed profile.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {model.languages.map((language) => (
                <span
                  key={language}
                  className="rounded-full bg-[rgba(192,132,87,0.12)] px-3 py-1.5 text-sm text-[#FAF3E0]"
                >
                  {language}
                </span>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <h2 className="text-lg font-semibold text-white">Best Projects</h2>
              <p className="mt-1 text-sm text-[#D6D3D1]">
                Top repositories most useful for recruiter-facing portfolio value.
              </p>
              <div className="mt-5 space-y-3">
                {model.topProjects.map((project) => (
                  <div
                    key={project.name}
                    className="rounded-[20px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{project.name}</p>
                        <p className="mt-2 text-sm leading-7 text-[#D6D3D1]">
                          {project.description}
                        </p>
                      </div>
                      <div className="rounded-full bg-[rgba(214,173,96,0.14)] px-2.5 py-1 text-xs font-medium text-[#D6AD60]">
                        {project.portfolioScore}/100
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(250,243,224,0.08)] px-2.5 py-1 text-xs text-[#FAF3E0]">
                        <Star className="h-3 w-3 text-[#D6AD60]" />
                        {project.stars}
                      </span>
                      {project.techStack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-[rgba(192,132,87,0.12)] px-2.5 py-1 text-xs text-[#FAF3E0]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-lg font-semibold text-white">GitHub Health</h2>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  Cleaner signal view across consistency, quality, and portfolio readiness.
                </p>
                <div className="mt-5 space-y-4">
                  {model.health.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-[#D6D3D1]">{item.label}</p>
                        <p className="text-sm font-medium text-[#FAF3E0]">{item.value}%</p>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[rgba(250,243,224,0.08)]">
                        <div
                          className="h-2 rounded-full bg-[#C08457]"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  Three high-impact fixes to improve recruiter signal.
                </p>
                <div className="mt-5 space-y-3">
                  {model.insights.map((insight, index) => (
                    <div
                      key={insight}
                      className="flex items-start gap-3 rounded-[18px] bg-[#221e1d] px-4 py-3.5"
                    >
                      <div className="mt-0.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(192,132,87,0.12)] text-xs font-medium text-[#D6AD60]">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-7 text-[#D6D3D1]">{insight}</p>
                      </div>
                      <CheckCircle2 className="mt-1 h-4 w-4 text-[#D6AD60]" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

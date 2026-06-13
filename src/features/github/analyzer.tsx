"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  Flame,
  GitBranch,
  LoaderCircle,
  Search,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import type { AnalyzeGithubResponse } from "./schema";
import {
  buildGitHubViewModelFromResponse,
  type GitHubViewModel,
} from "./view-model";

const loadingSteps = [
  "Checking the GitHub username",
  "Loading public repositories",
  "Scoring project quality",
  "Preparing recruiter-facing insights",
];

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
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const interval = window.setInterval(() => {
      setStepIndex((current) =>
        current < loadingSteps.length - 1 ? current + 1 : current,
      );
    }, 700);

    return () => window.clearInterval(interval);
  }, [isSubmitting]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim()) {
      setError("Enter a GitHub username.");
      return;
    }

    setStepIndex(0);
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
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : rawResponse.trim() || "GitHub analysis failed.";
        throw new Error(message);
      }

      if (!payload || typeof payload !== "object") {
        throw new Error("GitHub analysis returned an invalid response.");
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

  const scoreMeta = model ? getScoreMeta(model.portfolioReadyScore) : null;

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-[28px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(192,132,87,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(192,132,87,0.08)] px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
              <Sparkles className="h-3.5 w-3.5" />
              GitHub Analyzer
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Faster GitHub profile review
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#D6D3D1] sm:text-[15px]">
              Get a clear score, strongest repositories, and the next fixes that
              improve recruiter confidence.
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
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                Analyze GitHub
              </button>
            </form>

            {error ? (
              <div className="mt-4 rounded-[18px] border border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] px-4 py-3 text-sm text-[#FAF3E0]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-[#D6AD60]" />
                  <span>{error}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6">
            {isSubmitting ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#D6AD60]">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Analyzing @{username.trim()}
                    </p>
                    <p className="text-sm text-[#D6D3D1]">
                      Fetching repository signals and preparing recommendations.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
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
                          <div className="h-4 w-4 rounded-full border border-[rgba(250,243,224,0.14)]" />
                        )}
                        <span className="text-sm text-[#D6D3D1]">{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : model && scoreMeta ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#D6D3D1]">{model.sourceLabel}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      @{model.username}
                    </h2>
                  </div>
                  <div
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${scoreMeta.badgeClassName}`}
                  >
                    {scoreMeta.label}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                        Portfolio Ready Score
                      </p>
                      <p className="mt-3 text-5xl font-semibold text-[#FAF3E0]">
                        {model.portfolioReadyScore}
                      </p>
                    </div>
                    <TrendingUp className="h-7 w-7 text-[#C08457]" />
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(250,243,224,0.08)]">
                    <div
                      className={`h-full rounded-full ${scoreMeta.barClassName}`}
                      style={{ width: `${model.portfolioReadyScore}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#D6D3D1]">
                    {scoreMeta.description}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SignalChip
                    icon={Flame}
                    label="Activity"
                    value={model.commitActivity}
                  />
                  <SignalChip
                    icon={Code2}
                    label="Visible stack"
                    value={`${model.languagesCount} languages`}
                  />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[280px] items-center justify-center rounded-[18px] border border-dashed border-[rgba(250,243,224,0.08)] text-sm text-[#D6D3D1]">
                Analyze a GitHub username to generate a clearer project-quality report.
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
              { label: "Commit Activity", value: model.commitActivity, icon: Clock3 },
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

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <h2 className="text-lg font-semibold text-white">Top Projects</h2>
              <p className="mt-1 text-sm text-[#D6D3D1]">
                These repositories contribute the strongest recruiter-facing signal.
              </p>
              <div className="mt-5 space-y-3">
                {model.topProjects.length > 0 ? (
                  model.topProjects.map((project) => (
                    <div
                      key={project.name}
                      className="rounded-[20px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <p className="text-base font-medium text-white">{project.name}</p>
                          <p className="text-sm leading-7 text-[#D6D3D1]">
                            {project.description}
                          </p>
                        </div>
                        <div className="rounded-full bg-[rgba(214,173,96,0.14)] px-3 py-1 text-xs font-medium text-[#D6AD60]">
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
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-4 text-sm text-[#D6D3D1]">
                    No standout public repositories were found yet.
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-lg font-semibold text-white">Health Breakdown</h2>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  A clearer view of consistency, documentation, and project quality.
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
                          className="h-2 rounded-full bg-[linear-gradient(90deg,#8B5E3C,#C08457,#D6AD60)]"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
                <h2 className="text-lg font-semibold text-white">Priority Fixes</h2>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  Work on these next to improve how your profile reads to recruiters.
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
                      <p className="flex-1 text-sm leading-7 text-[#D6D3D1]">{insight}</p>
                      <CheckCircle2 className="mt-1 h-4 w-4 text-[#D6AD60]" />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <h2 className="text-lg font-semibold text-white">Top Languages</h2>
            <p className="mt-1 text-sm text-[#D6D3D1]">
              The stack areas currently most visible on this profile.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {model.languages.length > 0 ? (
                model.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-[rgba(192,132,87,0.12)] px-3 py-1.5 text-sm text-[#FAF3E0]"
                  >
                    {language}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#D6D3D1]">
                  No clear language signal detected yet.
                </span>
              )}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function SignalChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.12)] text-[#C08457]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#D6AD60]">{label}</p>
          <p className="mt-1 text-sm font-medium text-[#FAF3E0]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function getScoreMeta(score: number) {
  if (score >= 80) {
    return {
      label: "Strong profile",
      description:
        "Your public GitHub profile already shows solid recruiter signal. Focus on polishing project storytelling and keeping flagship repos fresh.",
      badgeClassName:
        "border-[rgba(95,165,125,0.22)] bg-[rgba(95,165,125,0.12)] text-[#B9E6C7]",
      barClassName: "bg-[linear-gradient(90deg,#3E6B52,#5FA57D,#B9E6C7)]",
    };
  }

  if (score >= 60) {
    return {
      label: "Good base",
      description:
        "The profile has useful signal, but clearer README quality, stronger project summaries, and more recent updates would make it easier to trust quickly.",
      badgeClassName:
        "border-[rgba(214,173,96,0.22)] bg-[rgba(214,173,96,0.12)] text-[#F3D897]",
      barClassName: "bg-[linear-gradient(90deg,#8B5E3C,#C08457,#F3D897)]",
    };
  }

  return {
    label: "Needs work",
    description:
      "Recruiters can find some signal, but the profile still needs better documentation, stronger repository positioning, and more visible proof of recent work.",
    badgeClassName:
      "border-[rgba(193,90,90,0.22)] bg-[rgba(193,90,90,0.12)] text-[#F3B1B1]",
    barClassName: "bg-[linear-gradient(90deg,#7A3636,#C15A5A,#F3B1B1)]",
  };
}

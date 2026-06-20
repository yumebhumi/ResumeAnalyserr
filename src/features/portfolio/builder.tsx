"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  Code2,
  Crown,
  ExternalLink,
  Globe,
  GitBranch,
  Link2,
  LoaderCircle,
  Lock,
  Mail,
  Sparkles,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  PortfolioBuilderInitialData,
  PortfolioFormData,
  PortfolioTemplate,
} from "./types";

const templates: Array<{
  key: PortfolioTemplate;
  label: string;
  description: string;
  premium?: boolean;
}> = [
  { key: "minimal", label: "Minimal", description: "Quiet and recruiter-friendly." },
  { key: "developer", label: "Developer", description: "Built for technical credibility." },
  { key: "creative", label: "Creative", description: "Softer presentation with more personality." },
  { key: "premium", label: "Premium", description: "Advanced layout and publishing tools.", premium: true },
];

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

export function PortfolioBuilder({
  initialData,
}: {
  initialData: PortfolioBuilderInitialData;
}) {
  const router = useRouter();
  const [draftId, setDraftId] = useState(initialData.draftId);
  const [template, setTemplate] = useState<PortfolioTemplate>(initialData.template);
  const [form, setForm] = useState<PortfolioFormData>(initialData.data);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const isFreePlan = initialData.plan !== "pro";

  const previewProjects = useMemo(
    () => form.projects.filter(Boolean).slice(0, 3),
    [form.projects],
  );
  const previewSkills = useMemo(
    () => form.skills.filter(Boolean).slice(0, 8),
    [form.skills],
  );

  function updateField<K extends keyof PortfolioFormData>(
    key: K,
    value: PortfolioFormData[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateListField(
    key: "skills" | "projects" | "experience" | "education",
    value: string,
  ) {
    updateField(
      key,
      value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    );
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setToast(null);

    try {
      const response = await fetch("/api/generate-portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draftId,
          resumeAnalysisId: initialData.latestAnalysisId,
          template,
          sections: form,
        }),
      });

      const payload = (await response.json()) as {
        draftId?: string;
        portfolio?: {
          name?: string;
          role?: string;
          about?: string;
          skills?: string[];
          projects?: string[];
          experience?: string[];
          education?: string[];
          github?: string;
          linkedin?: string;
          email?: string;
        };
        error?: string;
      };

      if (!response.ok || !payload.draftId) {
        throw new Error(payload.error || "Could not generate portfolio.");
      }

      setDraftId(payload.draftId);
      if (payload.portfolio) {
        setForm((current) => ({
          ...current,
          name: payload.portfolio?.name ?? current.name,
          role: payload.portfolio?.role ?? current.role,
          about: payload.portfolio?.about ?? current.about,
          skills:
            payload.portfolio?.skills && payload.portfolio.skills.length > 0
              ? payload.portfolio.skills
              : current.skills,
          projects:
            payload.portfolio?.projects && payload.portfolio.projects.length > 0
              ? payload.portfolio.projects
              : current.projects,
          experience:
            payload.portfolio?.experience &&
            payload.portfolio.experience.length > 0
              ? payload.portfolio.experience
              : current.experience,
          education:
            payload.portfolio?.education &&
            payload.portfolio.education.length > 0
              ? payload.portfolio.education
              : current.education,
          githubLink: payload.portfolio?.github ?? current.githubLink,
          linkedinLink: payload.portfolio?.linkedin ?? current.linkedinLink,
          email: payload.portfolio?.email ?? current.email,
        }));
      }
      setToast({
        type: "success",
        message: "Portfolio draft generated and saved.",
      });

      if (payload.draftId !== draftId) {
        router.replace(`/portfolio/${payload.draftId}`);
      }
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not generate portfolio.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  function showLockedToast(label: string) {
    setToast({
      type: "error",
      message: `${label} is available on the Pro plan.`,
    });
  }

  const hasPortfolioState = Boolean(
    draftId ||
      form.name ||
      form.role ||
      form.about ||
      form.skills.length ||
      form.projects.length ||
      form.experience.length ||
      form.education.length ||
      form.githubLink ||
      form.linkedinLink ||
      form.email,
  );

  function resetPortfolioBuilder() {
    setDraftId(null);
    setTemplate(initialData.template);
    setForm({
      name: "",
      role: "",
      about: "",
      skills: [],
      projects: [],
      experience: [],
      education: [],
      githubLink: "",
      linkedinLink: "",
      email: "",
    });
    setIsGenerating(false);
    setToast(null);
    setIsResetModalOpen(false);
  }

  return (
    <div className="space-y-5 pb-8">
      {toast ? (
        <div
          className={cn(
            "rounded-[18px] border px-4 py-3 text-sm",
            toast.type === "success"
              ? "border-[rgba(214,173,96,0.2)] bg-[rgba(214,173,96,0.08)] text-[#FAF3E0]"
              : "border-[rgba(192,132,87,0.22)] bg-[rgba(192,132,87,0.08)] text-[#FAF3E0]",
          )}
        >
          {toast.message}
        </div>
      ) : null}

      {!initialData.hasResumeData ? (
        <div className="rounded-[20px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-5 py-4 text-sm text-[#D6D3D1]">
          No resume data found yet. Analyze a resume first, or fill the portfolio
          fields manually.
        </div>
      ) : (
        <div className="rounded-[20px] border border-[rgba(214,173,96,0.16)] bg-[rgba(214,173,96,0.06)] px-5 py-4 text-sm text-[#FAF3E0]">
          {initialData.sourceLabel}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#FAF3E0]">Template</p>
                <p className="mt-1 text-sm text-[#D6D3D1]">
                  Choose a layout before generating your portfolio draft.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {templates.map((item) => {
                const isActive = template === item.key;
                const isLocked = Boolean(item.premium && isFreePlan);

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={isLocked}
                    onClick={() => setTemplate(item.key)}
                    className={cn(
                      "rounded-[18px] border bg-[#221e1d] p-4 text-left transition",
                      isActive
                        ? "border-[#C08457]"
                        : "border-[rgba(250,243,224,0.08)] hover:border-[rgba(250,243,224,0.14)]",
                      isLocked && "opacity-70",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <p className="mt-1 text-xs leading-6 text-[#D6D3D1]">
                          {item.description}
                        </p>
                      </div>
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[rgba(250,243,224,0.08)] px-2 py-1 text-[11px] text-[#D6AD60]">
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(192,132,87,0.16)] text-[#D6AD60]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
            <div className="space-y-4">
              <details open className="group rounded-[18px] bg-[#221e1d] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white">
                  Identity
                  <ChevronDown className="h-4 w-4 text-[#D6AD60] transition group-open:rotate-180" />
                </summary>
                <div className="mt-4 grid gap-4">
                  <Field label="Name">
                    <input
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Enter your full name"
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      value={form.role}
                      onChange={(event) => updateField("role", event.target.value)}
                      placeholder="Enter your professional role"
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="About">
                    <textarea
                      value={form.about}
                      onChange={(event) => updateField("about", event.target.value)}
                      placeholder="Write a short recruiter-facing summary."
                      className={textareaClassName}
                      rows={5}
                    />
                  </Field>
                </div>
              </details>

              <details className="group rounded-[18px] bg-[#221e1d] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white">
                  Portfolio content
                  <ChevronDown className="h-4 w-4 text-[#D6AD60] transition group-open:rotate-180" />
                </summary>
                <div className="mt-4 grid gap-4">
                  <Field label="Skills">
                    <textarea
                      value={form.skills.join("\n")}
                      onChange={(event) => updateListField("skills", event.target.value)}
                      placeholder="Add one skill per line"
                      className={textareaClassName}
                      rows={4}
                    />
                  </Field>
                  <Field label="Projects">
                    <textarea
                      value={form.projects.join("\n")}
                      onChange={(event) => updateListField("projects", event.target.value)}
                      placeholder="Add one project highlight per line"
                      className={textareaClassName}
                      rows={4}
                    />
                  </Field>
                  <Field label="Experience">
                    <textarea
                      value={form.experience.join("\n")}
                      onChange={(event) => updateListField("experience", event.target.value)}
                      placeholder="Add one experience item per line"
                      className={textareaClassName}
                      rows={4}
                    />
                  </Field>
                  <Field label="Education">
                    <textarea
                      value={form.education.join("\n")}
                      onChange={(event) => updateListField("education", event.target.value)}
                      placeholder="Add one education item per line"
                      className={textareaClassName}
                      rows={3}
                    />
                  </Field>
                </div>
              </details>

              <details className="group rounded-[18px] bg-[#221e1d] p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white">
                  Links
                  <ChevronDown className="h-4 w-4 text-[#D6AD60] transition group-open:rotate-180" />
                </summary>
                <div className="mt-4 grid gap-4">
                  <Field label="GitHub link">
                    <input
                      value={form.githubLink}
                      onChange={(event) => updateField("githubLink", event.target.value)}
                      placeholder="Paste your GitHub profile URL"
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="LinkedIn link">
                    <input
                      value={form.linkedinLink}
                      onChange={(event) => updateField("linkedinLink", event.target.value)}
                      placeholder="Paste your LinkedIn profile URL"
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      value={form.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      placeholder="Enter your email address"
                      className={inputClassName}
                    />
                  </Field>
                </div>
              </details>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-full bg-[#C08457] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#D6AD60] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Generate Portfolio"}
              </button>

              {hasPortfolioState ? (
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.12)] px-5 py-3 text-sm font-medium text-[#FAF3E0] transition hover:border-[#C08457] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Trash2 className="h-4 w-4" />
                  Reset Portfolio
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => showLockedToast("Export Code")}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.12)] px-5 py-3 text-sm font-medium text-[#FAF3E0] transition hover:border-[rgba(250,243,224,0.18)]"
              >
                <Code2 className="h-4 w-4" />
                Export Code
                <span className="rounded-full border border-[rgba(250,243,224,0.08)] px-2 py-0.5 text-[11px] text-[#D6AD60]">
                  Locked
                </span>
              </button>

              <button
                type="button"
                onClick={() => showLockedToast("Publish Portfolio")}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.12)] px-5 py-3 text-sm font-medium text-[#FAF3E0] transition hover:border-[rgba(250,243,224,0.18)]"
              >
                <Globe className="h-4 w-4" />
                Publish Portfolio
                <span className="rounded-full border border-[rgba(250,243,224,0.08)] px-2 py-0.5 text-[11px] text-[#D6AD60]">
                  Locked
                </span>
              </button>
            </div>
          </section>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={hasPortfolioState ? "portfolio-preview-ready" : "portfolio-preview-idle"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="rounded-[28px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
          >
            <div className="h-1 rounded-full bg-[linear-gradient(90deg,#8B5E3C,#C08457,#FAF3E0)]" />
            <div className="mt-6 rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-white">
                    {form.name || "Your Name"}
                  </p>
                  <p className="mt-2 text-sm text-[#D6AD60]">
                    {form.role || "Your target role"}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] bg-[rgba(192,132,87,0.08)] px-3 py-1.5 text-xs text-[#FAF3E0]">
                  <Crown className="h-3.5 w-3.5 text-[#D6AD60]" />
                  {template.charAt(0).toUpperCase() + template.slice(1)} template
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                  About
                </p>
                <p className="mt-3 text-sm leading-7 text-[#D6D3D1]">
                  {form.about ||
                    "A concise recruiter-facing summary will appear here once you generate your portfolio."}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                  Skills
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewSkills.length > 0 ? (
                    previewSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[rgba(250,243,224,0.08)] bg-[#292524] px-3 py-1.5 text-xs text-[#FAF3E0]"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[#D6D3D1]">
                      Skills will appear here.
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#D6AD60]">
                  Projects
                </p>
                <div className="mt-3 space-y-3">
                  {previewProjects.length > 0 ? (
                    previewProjects.map((project, index) => (
                      <div
                        key={`${project}-${index}`}
                        className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-4"
                      >
                        <p className="text-sm leading-7 text-[#D6D3D1]">{project}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-4 text-sm text-[#D6D3D1]">
                      Project highlights will appear here.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <PreviewLink
                  href={form.githubLink}
                  label="GitHub"
                  icon={<GitBranch className="h-4 w-4" />}
                />
                <PreviewLink
                  href={form.linkedinLink}
                  label="LinkedIn"
                  icon={<Link2 className="h-4 w-4" />}
                />
                <PreviewLink
                  href={form.email ? `mailto:${form.email}` : ""}
                  label="Email"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isResetModalOpen ? (
          <motion.div
            key="portfolio-reset-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,10,9,0.72)] px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-md rounded-[24px] border border-[rgba(250,243,224,0.08)] bg-[#292524] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(192,132,87,0.14)] text-[#D6AD60]">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Are you sure you want to reset this analysis?
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#D6D3D1]">
                    This will clear the current portfolio form, generated preview,
                    draft id in local state, and status messages without refreshing
                    the page.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="inline-flex h-12 items-center justify-center rounded-[14px] border border-[rgba(250,243,224,0.08)] bg-[#221e1d] px-5 text-sm font-medium text-[#FAF3E0] transition hover:border-[#C08457]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={resetPortfolioBuilder}
                  className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#C08457] px-5 text-sm font-medium text-white transition hover:bg-[#D6AD60]"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[#FAF3E0]">{label}</span>
      {children}
    </label>
  );
}

function PreviewLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  if (!href) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] px-3 py-2 text-[#D6D3D1]">
        {icon}
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-[rgba(250,243,224,0.08)] px-3 py-2 text-[#FAF3E0] transition hover:border-[rgba(250,243,224,0.16)]"
    >
      {icon}
      {label}
      <ExternalLink className="h-3.5 w-3.5 text-[#D6AD60]" />
    </a>
  );
}

const inputClassName =
  "w-full rounded-[16px] border border-[rgba(250,243,224,0.08)] bg-[#292524] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#8f887f] focus:border-[#C08457]";

const textareaClassName = `${inputClassName} min-h-[120px] resize-y`;

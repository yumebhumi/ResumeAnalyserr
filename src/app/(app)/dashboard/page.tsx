import { BarChart3, FileText, GitBranch, Sparkles } from "lucide-react";

import { SectionCard } from "@/components/section-card";

const metrics = [
  {
    label: "Resume analyses",
    value: "0",
    note: "No ATS runs yet",
    icon: FileText,
  },
  {
    label: "GitHub profiles",
    value: "0",
    note: "No repositories scored yet",
    icon: GitBranch,
  },
  {
    label: "Portfolio drafts",
    value: "0",
    note: "No generated sites yet",
    icon: Sparkles,
  },
];

const nextActions = [
  "Connect Clerk keys and sign into the app.",
  "Add Neon connection details and push the Drizzle schema.",
  "Build the resume upload endpoint and ATS analysis screen.",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[36px] border border-stone-200/70 bg-stone-950 px-6 py-8 text-stone-50 shadow-[0_28px_90px_rgba(27,20,13,0.16)]">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-300">
            Workspace Status
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight">
            The foundation is wired for Clerk, Neon, Drizzle, and Gemini.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
            This shell is ready for the first product slice: upload a resume,
            extract text, score it, and persist structured analysis output.
          </p>
        </div>

        <SectionCard
          title="Next Build Slice"
          description="The cleanest next unit of work."
        >
          <div className="flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/80 p-4 text-stone-900">
            <BarChart3 className="mt-1 h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Resume upload + ATS analysis</p>
              <p className="mt-1 text-sm text-stone-600">
                Add a server route that parses PDF and DOCX resumes, calls
                Gemini, validates JSON, and writes the result to Neon.
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <SectionCard key={label} title={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-semibold">{value}</p>
                <p className="mt-2 text-sm text-stone-600">{note}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100">
                <Icon className="h-5 w-5 text-stone-700" />
              </div>
            </div>
          </SectionCard>
        ))}
      </section>

      <SectionCard
        title="Foundation Checklist"
        description="What is already present in this starter."
      >
        <div className="grid gap-3 text-sm text-stone-700 md:grid-cols-2">
          {[
            "Protected routes with Clerk middleware",
            "Neon and Drizzle configuration",
            "Gemini SDK server wiring",
            "App shell and dashboard scaffold",
            "Placeholder routes for analysis, GitHub, pricing, portfolio, and exports",
            "Environment variable template",
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

      <SectionCard title="Immediate Next Actions">
        <div className="space-y-3">
          {nextActions.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-xs text-white">
                {index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

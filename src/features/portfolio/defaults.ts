import type { PortfolioBuilderInitialData, PortfolioFormData, PortfolioTemplate } from "./types";

type ResumeAnalysisRecord = {
  id: string;
  extractedText: string;
  analysisJson: Record<string, unknown> | null;
};

type PortfolioDraftRecord = {
  id: string;
  template: string;
  sections: Record<string, unknown> | null;
};

const emptyData: PortfolioFormData = {
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
};

export function buildPortfolioInitialData({
  latestAnalysis,
  draft,
  plan,
}: {
  latestAnalysis: ResumeAnalysisRecord | null;
  draft: PortfolioDraftRecord | null;
  plan: "free" | "pro";
}): PortfolioBuilderInitialData {
  const analysisDefaults = latestAnalysis
    ? deriveFromResumeAnalysis(latestAnalysis)
    : emptyData;
  const draftSections = draft?.sections
    ? coercePortfolioData(draft.sections)
    : emptyData;

  return {
    draftId: draft?.id ?? null,
    latestAnalysisId: latestAnalysis?.id ?? null,
    template: isTemplate(draft?.template) ? draft.template : "minimal",
    data: {
      name: draftSections.name || analysisDefaults.name,
      role: draftSections.role || analysisDefaults.role,
      about: draftSections.about || analysisDefaults.about,
      skills: draftSections.skills.length > 0 ? draftSections.skills : analysisDefaults.skills,
      projects:
        draftSections.projects.length > 0
          ? draftSections.projects
          : analysisDefaults.projects,
      experience:
        draftSections.experience.length > 0
          ? draftSections.experience
          : analysisDefaults.experience,
      education:
        draftSections.education.length > 0
          ? draftSections.education
          : analysisDefaults.education,
      githubLink: draftSections.githubLink || analysisDefaults.githubLink,
      linkedinLink: draftSections.linkedinLink || analysisDefaults.linkedinLink,
      email: draftSections.email || analysisDefaults.email,
    },
    hasResumeData: Boolean(latestAnalysis),
    sourceLabel: draft
      ? "Loaded from saved draft"
      : latestAnalysis
        ? "Auto-filled from latest resume analysis"
        : "No saved resume analysis yet",
    plan,
  };
}

function deriveFromResumeAnalysis(record: ResumeAnalysisRecord): PortfolioFormData {
  const text = record.extractedText ?? "";
  const analysis = record.analysisJson ?? {};
  const recommendedRoles = asStringArray(analysis.recommendedRoles);
  const summary = asString(analysis.summary);
  const improvedBullets = asStringArray(analysis.improvedBullets);

  return {
    name: extractName(text),
    role: recommendedRoles[0] ?? extractRole(text),
    about: summary || extractAbout(text),
    skills: extractSkills(text),
    projects: improvedBullets.length > 0 ? improvedBullets.slice(0, 4) : extractProjects(text),
    experience: extractSectionLines(text, ["experience", "work experience", "employment"], 4),
    education: extractSectionLines(text, ["education"], 3),
    githubLink: extractLink(text, /https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i),
    linkedinLink: extractLink(text, /https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i),
    email: extractEmail(text),
  };
}

function coercePortfolioData(value: Record<string, unknown>): PortfolioFormData {
  return {
    name: asString(value.name),
    role: asString(value.role),
    about: asString(value.about),
    skills: asStringArray(value.skills),
    projects: asStringArray(value.projects),
    experience: asStringArray(value.experience),
    education: asStringArray(value.education),
    githubLink: asString(value.githubLink),
    linkedinLink: asString(value.linkedinLink),
    email: asString(value.email),
  };
}

function extractName(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    lines.find(
      (line) =>
        !line.includes("@") &&
        !/^https?:\/\//i.test(line) &&
        !/linkedin|github/i.test(line) &&
        line.length < 60,
    ) ?? ""
  );
}

function extractRole(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines[1] ?? "";
}

function extractAbout(text: string) {
  const summaryLines = extractSectionLines(
    text,
    ["summary", "professional summary", "profile", "about"],
    3,
  );

  return summaryLines.join(" ").trim();
}

function extractSkills(text: string) {
  const section = extractSectionLines(
    text,
    ["skills", "technical skills", "technologies", "tools"],
    8,
  );

  const items = section.flatMap((line) =>
    line
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter(Boolean),
  );

  return dedupe(items).slice(0, 10);
}

function extractProjects(text: string) {
  return extractSectionLines(text, ["projects", "personal projects"], 4);
}

function extractSectionLines(text: string, headings: string[], limit: number) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const startIndex = lines.findIndex((line) =>
    headings.some((heading) => line.toLowerCase() === heading.toLowerCase()),
  );

  if (startIndex === -1) {
    return [];
  }

  const collected: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Z][A-Z\s/&-]{2,}$/.test(line) || /^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3}$/.test(line) && headings.some((heading) => line.toLowerCase() === heading.toLowerCase()) === false && collected.length > 0) {
      break;
    }

    const cleaned = line.replace(/^[•*-]\s*/, "").trim();
    if (cleaned) {
      collected.push(cleaned);
    }

    if (collected.length >= limit) {
      break;
    }
  }

  return collected;
}

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
}

function extractLink(text: string, pattern: RegExp) {
  return text.match(pattern)?.[0] ?? "";
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function dedupe(values: string[]) {
  return Array.from(new Set(values));
}

function isTemplate(value: string | undefined | null): value is PortfolioTemplate {
  return value === "minimal" || value === "developer" || value === "creative" || value === "premium";
}

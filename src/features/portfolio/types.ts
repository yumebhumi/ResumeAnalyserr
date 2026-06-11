export type PortfolioTemplate = "minimal" | "developer" | "creative" | "premium";

export type PortfolioFormData = {
  name: string;
  role: string;
  about: string;
  skills: string[];
  projects: string[];
  experience: string[];
  education: string[];
  githubLink: string;
  linkedinLink: string;
  email: string;
};

export type PortfolioBuilderInitialData = {
  draftId: string | null;
  latestAnalysisId: string | null;
  template: PortfolioTemplate;
  data: PortfolioFormData;
  hasResumeData: boolean;
  sourceLabel: string;
  plan: "free" | "pro";
};

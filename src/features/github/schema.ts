import { z } from "zod";

export const githubRepositorySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  stars: z.number().int().min(0),
  techStack: z.array(z.string().min(1)).default([]),
  portfolioScore: z.number().int().min(0).max(100),
});

export const githubAnalysisSchema = z.object({
  portfolioReadyScore: z.number().int().min(0).max(100),
  commitActivity: z.enum(["Low", "Medium", "High"]),
  languages: z.array(z.string().min(1)).max(12).default([]),
  topRepositories: z.array(githubRepositorySchema).max(3).default([]),
  recommendations: z.array(z.string().min(1)).max(3).default([]),
  healthBreakdown: z.object({
    codeConsistency: z.number().int().min(0).max(100),
    projectQuality: z.number().int().min(0).max(100),
    readmeQuality: z.number().int().min(0).max(100),
    portfolioReadiness: z.number().int().min(0).max(100),
  }),
});

export const analyzeGithubResponseSchema = z.object({
  profileId: z.string().uuid(),
  username: z.string().min(1),
  totalRepos: z.number().int().min(0).optional(),
  totalStars: z.number().int().min(0).optional(),
  topLanguages: z.array(z.string().min(1)).default([]).optional(),
  bestProjects: z.array(githubRepositorySchema).default([]).optional(),
  portfolioReadyScore: z.number().int().min(0).max(100).optional(),
  suggestions: z.array(z.string().min(1)).default([]).optional(),
  stats: z.object({
    repositories: z.number().int().min(0),
    stars: z.number().int().min(0),
    languages: z.array(z.string().min(1)).default([]),
    healthScore: z.number().int().min(0).max(100),
    commitActivity: z.enum(["Low", "Medium", "High"]),
  }),
  analysis: githubAnalysisSchema,
});

export type GithubAnalysis = z.infer<typeof githubAnalysisSchema>;
export type AnalyzeGithubResponse = z.infer<typeof analyzeGithubResponseSchema>;

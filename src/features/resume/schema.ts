import { z } from "zod";

export const resumeAnalysisSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  keywordMatch: z.number().int().min(0).max(100),
  formattingScore: z.number().int().min(0).max(100),
  skillsScore: z.number().int().min(0).max(100),
  experienceScore: z.number().int().min(0).max(100),
  projectsScore: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  missingSkills: z.array(z.string().min(1)).default([]),
  missingKeywords: z.array(z.string().min(1)).default([]),
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  suggestions: z.array(z.string().min(1)).default([]),
  improvedBullets: z.array(z.string().min(1)).default([]),
  recommendedRoles: z.array(z.string().min(1)).default([]),
});

export const analyzeResumeResponseSchema = z.object({
  analysisId: z.string().uuid(),
  analysis: resumeAnalysisSchema,
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
export type AnalyzeResumeResponse = z.infer<typeof analyzeResumeResponseSchema>;

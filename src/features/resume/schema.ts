import { z } from "zod";

export const weakBulletSchema = z.object({
  original: z.string().min(1),
  improved: z.string().min(1),
  reason: z.string().min(1),
});

export const resumeAnalysisSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  recruiterSummary: z.string().min(1),
  keywordCoverage: z.array(z.string().min(1)).default([]),
  formattingIssues: z.array(z.string().min(1)).default([]),
  missingSkills: z.array(z.string().min(1)).default([]),
  strengths: z.array(z.string().min(1)).default([]),
  weakBullets: z.array(weakBulletSchema).default([]),
});

export const analyzeResumeResponseSchema = z.object({
  analysisId: z.string().uuid(),
  analysis: resumeAnalysisSchema,
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;
export type AnalyzeResumeResponse = z.infer<typeof analyzeResumeResponseSchema>;

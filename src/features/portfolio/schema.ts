import { z } from "zod";

export const generatedPortfolioSchema = z.object({
  name: z.string().default(""),
  role: z.string().default(""),
  about: z.string().default(""),
  skills: z.array(z.string().min(1)).default([]),
  projects: z.array(z.string().min(1)).default([]),
  experience: z.array(z.string().min(1)).default([]),
  education: z.array(z.string().min(1)).default([]),
  github: z.string().default(""),
  linkedin: z.string().default(""),
  email: z.string().default(""),
});

export type GeneratedPortfolio = z.infer<typeof generatedPortfolioSchema>;

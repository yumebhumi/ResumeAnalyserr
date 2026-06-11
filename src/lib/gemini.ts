import { GoogleGenAI } from "@google/genai";

import { getServerEnv } from "@/lib/env";

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient() {
  if (geminiClient) {
    return geminiClient;
  }

  geminiClient = new GoogleGenAI({
    apiKey: getServerEnv().GEMINI_API_KEY,
  });

  return geminiClient;
}

export const GEMINI_MODEL = "gemini-2.5-flash";

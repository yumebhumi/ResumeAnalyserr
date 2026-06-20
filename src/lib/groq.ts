import { getGroqApiKey } from "@/lib/env";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const GROQ_MODEL = "llama-3.3-70b-versatile";

type GroqMessage = {
  role: "system" | "user";
  content: string;
};

type GroqOptions = {
  temperature?: number;
  json?: boolean;
};

export async function generateGroqCompletion(
  messages: GroqMessage[],
  options: GroqOptions = {},
) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getGroqApiKey()}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: options.temperature ?? 0.2,
      response_format: options.json ? { type: "json_object" } : undefined,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Groq API request failed: ${response.status} ${message}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null;
      };
    }>;
  };

  const content = payload.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Groq API returned an empty response.");
  }

  return content;
}

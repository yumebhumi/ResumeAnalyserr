import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }

    return value;
  },
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }

    return value;
  },
  z.string().url().optional(),
);

const dodoEnvironmentSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      const normalized = value.trim();

      if (!normalized) {
        return undefined;
      }

      if (normalized === "test") {
        return "test_mode";
      }

      if (normalized === "live") {
        return "live_mode";
      }

      return normalized;
    }

    return value;
  },
  z.enum(["test_mode", "live_mode"]).optional(),
);

type DodoEnv = {
  DODO_PAYMENTS_API_KEY?: string;
  DODO_PAYMENTS_ENVIRONMENT?: "test_mode" | "live_mode";
  DODO_PAYMENTS_WEBHOOK_KEY?: string;
  DODO_PRO_PRODUCT_ID?: string;
};

let cachedDatabaseUrl: string | null = null;
let cachedGroqApiKey: string | null = null;
let cachedOptionalGithubToken: string | null | undefined;
let cachedAppUrl: string | null | undefined;
let cachedDodoEnv: DodoEnv | null = null;

export function getDatabaseUrl() {
  if (cachedDatabaseUrl) {
    return cachedDatabaseUrl;
  }

  const parsed = z
    .string()
    .trim()
    .min(1, "DATABASE_URL is not configured.")
    .parse(process.env.DATABASE_URL);

  cachedDatabaseUrl = parsed;
  return cachedDatabaseUrl;
}

export function getGroqApiKey() {
  if (cachedGroqApiKey) {
    return cachedGroqApiKey;
  }

  const parsed = z
    .string()
    .trim()
    .min(1, "GROQ_API_KEY is not configured.")
    .parse(process.env.GROQ_API_KEY);

  cachedGroqApiKey = parsed;
  return cachedGroqApiKey;
}

export function getOptionalGithubToken() {
  if (cachedOptionalGithubToken !== undefined) {
    return cachedOptionalGithubToken;
  }

  cachedOptionalGithubToken = optionalTrimmedString.parse(process.env.GITHUB_TOKEN) ?? null;
  return cachedOptionalGithubToken;
}

export function getDodoEnv() {
  if (cachedDodoEnv) {
    return cachedDodoEnv;
  }

  cachedDodoEnv = {
    DODO_PAYMENTS_API_KEY: optionalTrimmedString.parse(
      process.env.DODO_PAYMENTS_API_KEY,
    ),
    DODO_PAYMENTS_ENVIRONMENT: dodoEnvironmentSchema.parse(
      process.env.DODO_PAYMENTS_ENVIRONMENT,
    ),
    DODO_PAYMENTS_WEBHOOK_KEY: optionalTrimmedString.parse(
      process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    ),
    DODO_PRO_PRODUCT_ID: optionalTrimmedString.parse(
      process.env.DODO_PRO_PRODUCT_ID,
    ),
  };

  return cachedDodoEnv;
}

export function getOptionalAppUrl() {
  if (cachedAppUrl !== undefined) {
    return cachedAppUrl;
  }

  cachedAppUrl = optionalUrl.parse(process.env.NEXT_PUBLIC_APP_URL) ?? null;
  return cachedAppUrl;
}

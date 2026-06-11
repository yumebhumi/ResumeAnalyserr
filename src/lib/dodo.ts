import DodoPayments from "dodopayments";

import { getServerEnv } from "@/lib/env";

let dodoClient: DodoPayments | null = null;

export function getDodoClient() {
  if (dodoClient) {
    return dodoClient;
  }

  const env = getServerEnv();

  if (!env.DODO_PAYMENTS_API_KEY) {
    throw new Error("Dodo Payments API key is not configured.");
  }

  dodoClient = new DodoPayments({
    bearerToken: env.DODO_PAYMENTS_API_KEY,
    environment: env.DODO_PAYMENTS_ENVIRONMENT ?? "test_mode",
    webhookKey: env.DODO_PAYMENTS_WEBHOOK_KEY ?? null,
  });

  return dodoClient;
}

export function getAppUrl(requestUrl?: string) {
  const env = getServerEnv();
  return env.NEXT_PUBLIC_APP_URL ?? requestUrl ?? "http://localhost:3000";
}

import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { users } from "@/db/schema";
import { ensureUsersTableColumns } from "@/lib/db-schema";
import { getDb } from "@/lib/db";
import { getDodoClient } from "@/lib/dodo";

type DodoWebhookPayload = {
  type: string;
  data?: {
    metadata?: Record<string, string>;
    customer?: {
      email?: string | null;
    };
  };
};

export async function POST(request: Request) {
  const rawBody = await request.text();

  try {
    const dodo = getDodoClient();
    const payload = dodo.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      },
    }) as DodoWebhookPayload;

    const db = getDb();
    await ensureUsersTableColumns();
    await ensureWebhookEventsTable();

    const webhookId = request.headers.get("webhook-id");

    if (!webhookId) {
      return NextResponse.json({ error: "Missing webhook id." }, { status: 400 });
    }

    const existing = await db.execute(sql`
      SELECT webhook_id FROM dodo_webhook_events WHERE webhook_id = ${webhookId} LIMIT 1
    `);

    if (existing.rows.length > 0) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    const metadata = payload.data?.metadata ?? {};
    const clerkUserId = metadata.clerkUserId;
    const email = payload.data?.customer?.email ?? undefined;

    let nextPlan: "free" | "pro" | null = null;
    if (
      payload.type === "subscription.active" ||
      payload.type === "subscription.renewed" ||
      payload.type === "payment.succeeded"
    ) {
      nextPlan = "pro";
    }

    if (
      payload.type === "subscription.cancelled" ||
      payload.type === "subscription.expired" ||
      payload.type === "subscription.failed"
    ) {
      nextPlan = "free";
    }

    if (nextPlan) {
      if (clerkUserId) {
        await db
          .update(users)
          .set({ plan: nextPlan })
          .where(eq(users.clerkUserId, clerkUserId));
      } else if (email) {
        await db.update(users).set({ plan: nextPlan }).where(eq(users.email, email));
      }
    }

    await db.execute(sql`
      INSERT INTO dodo_webhook_events (webhook_id, event_type, processed_at)
      VALUES (${webhookId}, ${payload.type}, now())
    `);

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }
}

async function ensureWebhookEventsTable() {
  const db = getDb();

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dodo_webhook_events (
      webhook_id varchar(255) PRIMARY KEY,
      event_type varchar(255) NOT NULL,
      processed_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

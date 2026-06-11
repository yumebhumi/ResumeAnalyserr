import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db";

export async function ensureUsersTableColumns() {
  const db = getDb();

  await db.execute(sql`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS plan varchar(32) NOT NULL DEFAULT 'free',
      ADD COLUMN IF NOT EXISTS target_role varchar(255),
      ADD COLUMN IF NOT EXISTS preferred_location varchar(255),
      ADD COLUMN IF NOT EXISTS experience_level varchar(32),
      ADD COLUMN IF NOT EXISTS linkedin_url varchar(512),
      ADD COLUMN IF NOT EXISTS portfolio_url varchar(512)
  `);
}

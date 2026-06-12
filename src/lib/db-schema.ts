import { sql } from "drizzle-orm";

import { getDb } from "@/lib/db";

let ensureAppSchemaPromise: Promise<void> | null = null;
let ensureUsersTableColumnsPromise: Promise<void> | null = null;

export async function ensureAppSchema() {
  if (ensureAppSchemaPromise) {
    return ensureAppSchemaPromise;
  }

  ensureAppSchemaPromise = (async () => {
  const db = getDb();

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      clerk_user_id varchar(255) NOT NULL UNIQUE,
      email varchar(255) NOT NULL,
      plan varchar(32) NOT NULL DEFAULT 'free',
      target_role varchar(255),
      preferred_location varchar(255),
      experience_level varchar(32),
      linkedin_url varchar(512),
      portfolio_url varchar(512),
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS resume_analyses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      file_name varchar(255) NOT NULL,
      extracted_text text NOT NULL,
      ats_score integer NOT NULL,
      keyword_match integer NOT NULL,
      formatting_score integer NOT NULL,
      skills_score integer NOT NULL,
      experience_score integer NOT NULL,
      projects_score integer NOT NULL,
      analysis_json jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS github_profiles (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username varchar(255) NOT NULL,
      summary jsonb,
      stats jsonb,
      analyzed_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS github_analyses (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      username varchar(255) NOT NULL,
      analysis_json jsonb NOT NULL,
      portfolio_ready_score integer NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS portfolio_drafts (
      id uuid PRIMARY KEY,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      analysis_id uuid NULL,
      github_profile_id uuid NULL,
      template varchar(64) NOT NULL DEFAULT 'minimal',
      sections jsonb,
      portfolio_json jsonb,
      html_snapshot text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS usage_events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      action varchar(64) NOT NULL,
      model varchar(64),
      estimated_tokens integer,
      status varchar(32) NOT NULL DEFAULT 'success',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  await ensureUsersTableColumns();
  })();

  try {
    await ensureAppSchemaPromise;
  } catch (error) {
    ensureAppSchemaPromise = null;
    throw error;
  }
}

export async function ensureUsersTableColumns() {
  if (ensureUsersTableColumnsPromise) {
    return ensureUsersTableColumnsPromise;
  }

  ensureUsersTableColumnsPromise = (async () => {
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
  })();

  try {
    await ensureUsersTableColumnsPromise;
  } catch (error) {
    ensureUsersTableColumnsPromise = null;
    throw error;
  }
}

import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  plan: varchar("plan", { length: 32 }).notNull().default("free"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const analyses = pgTable("analyses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resumeFilename: varchar("resume_filename", { length: 255 }).notNull(),
  targetRole: varchar("target_role", { length: 255 }),
  atsScore: integer("ats_score"),
  summary: jsonb("summary").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const suggestions = pgTable("suggestions", {
  id: uuid("id").defaultRandom().primaryKey(),
  analysisId: uuid("analysis_id")
    .references(() => analyses.id, { onDelete: "cascade" })
    .notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  severity: varchar("severity", { length: 32 }).notNull(),
  originalText: text("original_text"),
  suggestedText: text("suggested_text"),
  rationale: text("rationale"),
});

export const githubProfiles = pgTable("github_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  username: varchar("username", { length: 255 }).notNull(),
  summary: jsonb("summary").$type<Record<string, unknown>>(),
  stats: jsonb("stats").$type<Record<string, unknown>>(),
  analyzedAt: timestamp("analyzed_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const portfolioDrafts = pgTable("portfolio_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  analysisId: uuid("analysis_id").references(() => analyses.id, {
    onDelete: "set null",
  }),
  githubProfileId: uuid("github_profile_id").references(() => githubProfiles.id, {
    onDelete: "set null",
  }),
  template: varchar("template", { length: 64 }).notNull().default("signal"),
  sections: jsonb("sections").$type<Record<string, unknown>>(),
  htmlSnapshot: text("html_snapshot"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const usageEvents = pgTable("usage_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 64 }).notNull(),
  model: varchar("model", { length: 64 }),
  estimatedTokens: integer("estimated_tokens"),
  status: varchar("status", { length: 32 }).notNull().default("success"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { getServerEnv } from "@/lib/env";

let database: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (database) {
    return database;
  }

  const sql = neon(getServerEnv().DATABASE_URL);
  database = drizzle({ client: sql });
  return database;
}

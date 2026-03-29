import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

export function isTursoConfigured() {
  return Boolean(
    process.env.TURSO_DATABASE_URL &&
    process.env.TURSO_AUTH_TOKEN &&
    process.env.TURSO_DATABASE_URL.startsWith("libsql://")
  );
}

export function getTursoClient(): Client | null {
  if (!isTursoConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!
    });
  }

  return client;
}

export async function initializeDb() {
  const db = getTursoClient();
  if (!db) return;

  await db.execute(`
    CREATE TABLE IF NOT EXISTS whitelist_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
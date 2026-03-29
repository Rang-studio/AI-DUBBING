import { getTursoClient, initializeDb } from "@/lib/turso";

const REQUIRED_EMAIL = "kts123@estsoft.com";

async function ensureWhitelistSeeded() {
  const db = getTursoClient();
  if (!db) return null;

  await initializeDb();

  await db.execute({
    sql: `INSERT OR IGNORE INTO whitelist_users (email) VALUES (?)`,
    args: [REQUIRED_EMAIL],
  });

  return db;
}

export async function seedRequiredWhitelistUser() {
  await ensureWhitelistSeeded();
}

export async function isWhitelisted(email?: string | null) {
  if (!email) return false;

  const db = await ensureWhitelistSeeded();

  if (!db) {
    return email === REQUIRED_EMAIL;
  }

  const result = await db.execute({
    sql: `SELECT 1 FROM whitelist_users WHERE email = ? LIMIT 1`,
    args: [email],
  });

  return result.rows.length > 0;
}

export async function getWhitelist() {
  const db = await ensureWhitelistSeeded();

  if (!db) {
    return [{ email: REQUIRED_EMAIL, created_at: "fallback" }];
  }

  const result = await db.execute(
    `SELECT email, created_at FROM whitelist_users ORDER BY created_at ASC`
  );

  return result.rows.map((row) => ({
    email: String(row.email),
    created_at: String(row.created_at),
  }));
}
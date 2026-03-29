import { initializeDb, turso } from "@/lib/turso";

const REQUIRED_EMAIL = "kts123@estsoft.com";

export async function seedRequiredWhitelistUser() {
  await initializeDb();
  await turso.execute({
    sql: `INSERT OR IGNORE INTO whitelist_users (email) VALUES (?)`,
    args: [REQUIRED_EMAIL]
  });
}

export async function isWhitelisted(email?: string | null) {
  if (!email) return false;

  await seedRequiredWhitelistUser();

  const result = await turso.execute({
    sql: `SELECT email FROM whitelist_users WHERE email = ? LIMIT 1`,
    args: [email]
  });

  return result.rows.length > 0;
}

export async function getWhitelist() {
  await seedRequiredWhitelistUser();
  const result = await turso.execute(`SELECT email, created_at FROM whitelist_users ORDER BY created_at ASC`);
  return result.rows;
}

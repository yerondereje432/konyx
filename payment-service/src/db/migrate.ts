import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "..", "migrations");

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const { rows } = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1", [file]);
      if (rows.length > 0) continue;

      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
      // eslint-disable-next-line no-console
      console.log(`[migrate] applying ${file}`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${(err as Error).message}`);
      }
    }
  } finally {
    client.release();
  }
}

// Allow `npm run migrate`
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runMigrations()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("[migrate] done");
      return pool.end();
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      process.exit(1);
    });
}

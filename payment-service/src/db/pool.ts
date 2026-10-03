import pg from "pg";
import { config } from "../config.js";

// BIGINT (OID 20) arrives as string by default; our amounts fit safely in JS numbers
// (max safe integer ≈ 90 trillion birr in santim), so parse to number.
pg.types.setTypeParser(20, (v) => Number.parseInt(v, 10));
// NUMERIC stays a string — we never use NUMERIC for money (we use BIGINT santim).

export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export type Queryable = pg.Pool | pg.PoolClient;

/**
 * Run `fn` inside a SERIALIZABLE-adjacent transaction (READ COMMITTED + row locks
 * is sufficient for our access patterns; every money mutation takes FOR UPDATE).
 * Rolls back on any throw.
 */
export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      /* connection may be dead; pool will discard it */
    }
    throw err;
  } finally {
    client.release();
  }
}

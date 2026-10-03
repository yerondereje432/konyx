// Dev-only helper: boots an embedded PostgreSQL on port 5433 for local
// development when you don't have Postgres/Supabase handy.
// Usage: node scripts/dev-db.mjs   (keep it running; Ctrl+C to stop)
import EmbeddedPostgres from "embedded-postgres";

const pg = new EmbeddedPostgres({
  databaseDir: "/tmp/konyx-pg-data",
  user: "konyx",
  password: "konyx",
  port: 5433,
  persistent: true,
});

const main = async () => {
  try {
    await pg.initialise();
  } catch {
    /* already initialised */
  }
  await pg.start();
  try {
    await pg.createDatabase("konyx");
  } catch {
    /* already exists */
  }
  console.log("[dev-db] PostgreSQL ready at postgres://konyx:konyx@localhost:5433/konyx");

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

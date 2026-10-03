import { assertProductionSafety, config } from "./config.js";
import { runMigrations } from "./db/migrate.js";
import { pool } from "./db/pool.js";
import { buildServer } from "./server.js";
import { startWorkers, stopWorkers } from "./workers/scheduler.js";

async function main(): Promise<void> {
  assertProductionSafety();

  await runMigrations();

  const app = buildServer();
  await app.listen({ port: config.PORT, host: config.HOST });
  app.log.info(`Konyx payment service listening on ${config.HOST}:${config.PORT} (gateway default: ${config.DEFAULT_GATEWAY}, auth: ${config.AUTH_MODE})`);

  startWorkers((msg) => app.log.info(msg));

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received, shutting down`);
    stopWorkers();
    await app.close();
    await pool.end();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

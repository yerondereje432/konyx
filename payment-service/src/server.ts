import Fastify, { type FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { AppError } from "./lib/errors.js";
import { adminRoutes } from "./routes/admin.js";
import { mockCheckoutRoutes } from "./routes/mockCheckout.js";
import { paymentRoutes } from "./routes/payments.js";
import { subscriptionRoutes } from "./routes/subscriptions.js";
import { webhookRoutes } from "./routes/webhooks.js";

export function buildServer(): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === "test" ? "warn" : "info",
      redact: ["req.headers.authorization", "req.headers['x-admin-key']"],
    },
    trustProxy: true,
  });

  // Permissive CORS: auth is header-based (JWT / admin key), no cookies involved.
  app.addHook("onSend", async (req, reply) => {
    reply.header("access-control-allow-origin", req.headers.origin ?? "*");
    reply.header("access-control-allow-headers", "authorization, content-type, idempotency-key, x-dev-user, x-admin-key");
    reply.header("access-control-allow-methods", "GET, POST, OPTIONS");
  });
  app.options("*", async (_req, reply) => reply.code(204).send());

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.code(400).send({ error: "validation_error", details: err.flatten().fieldErrors });
    }
    if (err instanceof AppError) {
      return reply.code(err.statusCode).send({ error: err.code, message: err.message });
    }
    app.log.error(err);
    return reply.code(500).send({ error: "internal_error", message: "Something went wrong" });
  });

  app.get("/health", async () => {
    await pool.query("SELECT 1");
    return { ok: true, service: "konyx-payment-service", env: config.NODE_ENV };
  });

  app.register(paymentRoutes);
  app.register(subscriptionRoutes);
  app.register(webhookRoutes);
  app.register(adminRoutes);
  if (config.NODE_ENV !== "production") {
    app.register(mockCheckoutRoutes);
  }

  return app;
}

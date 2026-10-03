import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireUser } from "../auth/auth.js";
import {
  cancelSubscription,
  listUserSubscriptions,
  subscribe,
} from "../services/subscriptionService.js";

const SubscribeBody = z.object({
  planCode: z.string().min(1),
  gateway: z.string().optional(),
  idempotencyKey: z.string().min(8).max(128).optional(),
  customer: z
    .object({
      email: z.string().email().optional(),
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      phone: z.string().max(20).optional(),
    })
    .optional(),
});

export async function subscriptionRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireUser);

  /** Start a subscription: creates sub + first invoice, returns checkout URL. */
  app.post("/v1/subscriptions", async (req, reply) => {
    const body = SubscribeBody.parse(req.body);
    const result = await subscribe({
      userId: req.user!.id,
      planCode: body.planCode,
      gateway: body.gateway,
      idempotencyKey: body.idempotencyKey,
      customer: body.customer,
    });
    reply.code(201);
    return result;
  });

  app.get("/v1/subscriptions", async (req) => {
    return { subscriptions: await listUserSubscriptions(req.user!.id) };
  });

  /** Cancel at period end (entitlement persists until the paid period ends). */
  app.post("/v1/subscriptions/:id/cancel", async (req) => {
    const { id } = req.params as { id: string };
    await cancelSubscription(id, req.user!.id);
    return { canceled: true };
  });
}

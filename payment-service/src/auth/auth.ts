import type { FastifyReply, FastifyRequest } from "fastify";
import { jwtVerify } from "jose";
import { config } from "../config.js";
import { UnauthorizedError } from "../lib/errors.js";

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthUser;
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Authentication:
 *  - AUTH_MODE=supabase: verify the Supabase HS256 JWT from Authorization: Bearer.
 *    (Supabase signs user JWTs with the project's JWT secret.)
 *  - AUTH_MODE=dev: trust the x-dev-user header (UUID). Never enabled in production.
 */
export async function requireUser(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  if (config.AUTH_MODE === "dev") {
    const devUser = req.headers["x-dev-user"];
    const id = Array.isArray(devUser) ? devUser[0] : devUser;
    if (!id || !UUID_RE.test(id)) {
      throw new UnauthorizedError("Dev mode: send header x-dev-user: <uuid>");
    }
    req.user = { id };
    return;
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new UnauthorizedError("Missing bearer token");
  const token = header.slice("Bearer ".length);

  if (!config.SUPABASE_JWT_SECRET) throw new UnauthorizedError("Server auth is not configured");

  try {
    const secret = new TextEncoder().encode(config.SUPABASE_JWT_SECRET);
    const { payload } = await jwtVerify(token, secret, {
      // Supabase sets aud to "authenticated" for signed-in users.
      audience: "authenticated",
    });
    if (!payload.sub) throw new Error("missing sub");
    req.user = {
      id: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role: typeof payload.role === "string" ? payload.role : undefined,
    };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

/** Admin endpoints use a static API key (rotate via env). */
export async function requireAdmin(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const key = req.headers["x-admin-key"];
  const value = Array.isArray(key) ? key[0] : key;
  if (!value || value !== config.ADMIN_API_KEY) {
    throw new UnauthorizedError("Invalid admin key");
  }
}

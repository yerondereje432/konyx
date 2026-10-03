import "dotenv/config";
import { z } from "zod";

const Env = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("0.0.0.0"),
  PUBLIC_BASE_URL: z.string().url().default("http://localhost:4000"),
  FRONTEND_RETURN_URL: z.string().url().default("http://localhost:5173/payment/result"),

  DATABASE_URL: z.string().min(1),

  AUTH_MODE: z.enum(["supabase", "dev"]).default("dev"),
  SUPABASE_JWT_SECRET: z.string().optional().default(""),
  ADMIN_API_KEY: z.string().min(8).default("change-me-admin-key"),

  DEFAULT_GATEWAY: z.enum(["mock", "chapa"]).default("mock"),
  CHAPA_SECRET_KEY: z.string().optional().default(""),
  CHAPA_WEBHOOK_SECRET: z.string().optional().default(""),
  CHAPA_BASE_URL: z.string().url().default("https://api.chapa.co/v1"),

  OUTBOX_POLL_INTERVAL: z.coerce.number().int().min(0).default(5),
  RECONCILIATION_INTERVAL: z.coerce.number().int().min(0).default(300),
  SUBSCRIPTION_RENEWAL_INTERVAL: z.coerce.number().int().min(0).default(3600),
  INVOICE_OVERDUE_INTERVAL: z.coerce.number().int().min(0).default(3600),

  RENEWAL_LEAD_DAYS: z.coerce.number().int().min(0).default(3),
  GRACE_PERIOD_DAYS: z.coerce.number().int().min(0).default(5),
  PAYMENT_EXPIRY_MINUTES: z.coerce.number().int().min(5).default(60),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;

export function assertProductionSafety(): void {
  if (config.NODE_ENV !== "production") return;
  const problems: string[] = [];
  if (config.AUTH_MODE === "dev") problems.push("AUTH_MODE=dev is forbidden in production");
  if (config.DEFAULT_GATEWAY === "mock") problems.push("DEFAULT_GATEWAY=mock is forbidden in production");
  if (config.AUTH_MODE === "supabase" && !config.SUPABASE_JWT_SECRET)
    problems.push("SUPABASE_JWT_SECRET is required when AUTH_MODE=supabase");
  if (config.DEFAULT_GATEWAY === "chapa" && !config.CHAPA_SECRET_KEY)
    problems.push("CHAPA_SECRET_KEY is required when DEFAULT_GATEWAY=chapa");
  if (config.ADMIN_API_KEY === "change-me-admin-key") problems.push("ADMIN_API_KEY must be changed in production");
  if (problems.length > 0) {
    throw new Error(`Refusing to start in production:\n - ${problems.join("\n - ")}`);
  }
}

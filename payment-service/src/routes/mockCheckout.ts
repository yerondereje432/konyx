import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { pool } from "../db/pool.js";
import { formatSantim } from "../lib/money.js";
import { settleByVerification } from "../services/paymentService.js";

/**
 * Development-only hosted checkout for the mock gateway. Mimics a real
 * aggregator page (like Chapa's) with Pay / Fail buttons, then "sends a
 * webhook" by driving the exact same settlement pipeline.
 * Not registered in production.
 */
export async function mockCheckoutRoutes(app: FastifyInstance): Promise<void> {
  // The checkout page posts a plain HTML form (urlencoded); parse it simply.
  app.addContentTypeParser("application/x-www-form-urlencoded", { parseAs: "string" }, (_req, body, done) => {
    done(null, Object.fromEntries(new URLSearchParams(String(body))));
  });

  app.get("/mock/checkout/:txRef", async (req, reply) => {
    const { txRef } = req.params as { txRef: string };
    const { rows } = await pool.query(
      "SELECT m.status, m.amount_santim, m.currency FROM mock_gateway_payments m WHERE m.tx_ref = $1",
      [txRef],
    );
    const row = rows[0];
    if (!row) return reply.code(404).type("text/html").send("<h1>Unknown transaction</h1>");

    reply.type("text/html").send(renderCheckout(txRef, row));
  });

  app.post("/mock/checkout/:txRef/complete", async (req, reply) => {
    const { txRef } = req.params as { txRef: string };
    const { outcome } = (req.body ?? {}) as { outcome?: string };
    const status = outcome === "fail" ? "failed" : "success";

    await pool.query("UPDATE mock_gateway_payments SET status = $2, updated_at = now() WHERE tx_ref = $1", [
      txRef,
      status,
    ]);

    // Simulate the gateway's server-to-server callback: hit our own pipeline.
    try {
      await settleByVerification(txRef, "webhook");
    } catch {
      /* reconciliation will catch it */
    }

    const returnUrl = `${config.FRONTEND_RETURN_URL}?tx_ref=${encodeURIComponent(txRef)}`;
    reply.type("text/html").send(renderDone(txRef, status, returnUrl));
  });
}

function renderCheckout(txRef: string, row: { amount_santim: number; currency: string; status: string }): string {
  const amount = formatSantim(Number(row.amount_santim), row.currency);
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Konyx Mock Checkout</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0b0f1a;color:#e2e8f0;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{background:#111827;border:1px solid #1f2937;border-radius:16px;padding:40px;max-width:420px;width:90%;text-align:center}
  .badge{display:inline-block;background:#1d06f422;color:#00e5ff;border:1px solid #00e5ff44;border-radius:999px;padding:4px 14px;font-size:12px;letter-spacing:1px;margin-bottom:18px}
  h1{font-size:20px;margin:0 0 6px}  .amt{font-size:40px;font-weight:800;margin:14px 0;color:#fff}
  .ref{font-family:monospace;font-size:12px;color:#64748b;word-break:break-all;margin-bottom:26px}
  form{display:inline}
  button{cursor:pointer;border:none;border-radius:10px;padding:14px 26px;font-size:15px;font-weight:700;margin:6px}
  .pay{background:#10b981;color:#06281d}  .fail{background:#1f2937;color:#f87171}
  p.small{color:#64748b;font-size:12px;margin-top:22px}
</style></head><body>
<div class="card">
  <div class="badge">MOCK GATEWAY — DEV ONLY</div>
  <h1>Konyx Payment</h1>
  <div class="amt">${amount}</div>
  <div class="ref">${txRef}</div>
  <form method="post" action="/mock/checkout/${encodeURIComponent(txRef)}/complete">
    <input type="hidden" name="outcome" value="pay">
    <button class="pay" type="submit">Pay with Telebirr (simulated)</button>
  </form>
  <form method="post" action="/mock/checkout/${encodeURIComponent(txRef)}/complete">
    <input type="hidden" name="outcome" value="fail">
    <button class="fail" type="submit">Simulate failure</button>
  </form>
  <p class="small">In production this page is Chapa's hosted checkout (Telebirr, CBE Birr, M-Pesa, Amole).</p>
</div></body></html>`;
}

function renderDone(txRef: string, status: string, returnUrl: string): string {
  const ok = status === "success";
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Payment ${ok ? "Successful" : "Failed"}</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0b0f1a;color:#e2e8f0;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0}
  .card{background:#111827;border:1px solid #1f2937;border-radius:16px;padding:40px;max-width:420px;width:90%;text-align:center}
  h1{color:${ok ? "#10b981" : "#f87171"}}
  .ref{font-family:monospace;font-size:12px;color:#64748b;word-break:break-all;margin:16px 0}
  a{color:#00e5ff}
</style></head><body>
<div class="card">
  <h1>${ok ? "✓ Payment confirmed" : "✗ Payment failed"}</h1>
  <div class="ref">${txRef}</div>
  <p>The settlement pipeline (verify → ledger → outbox → entitlement) has run.</p>
  <p><a href="${returnUrl}">Return to Konyx</a></p>
</div></body></html>`;
}

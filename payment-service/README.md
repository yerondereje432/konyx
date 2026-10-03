# Konyx Payment Service

The money backbone of Konyx. A standalone TypeScript/Node (Fastify) service that handles
every birr that moves through the platform: job-post purchases, premium subscriptions,
badges — via Ethiopian payment rails.

```
React SPA ──► Supabase (auth, profiles, job data)
         ──► THIS SERVICE ──► Chapa ──► Telebirr / CBE Birr / M-Pesa / Amole
                   │
                   └─► PostgreSQL (can be the same Supabase Postgres)
```

## Why it's built the way it is

| Principle | Implementation |
|---|---|
| Webhooks are hints, never truth | Every settlement re-verifies against the gateway API (`settleByVerification`) |
| Money is never lost to a crash | Outbox pattern: entitlement grants commit in the same DB transaction as the ledger |
| A double-click never double-charges | Idempotency keys on initiation, content-hash dedupe on webhooks, unique `tx_ref` per attempt |
| Balances are provable, not stored | Append-only double-entry ledger (`ledger_journals` / `ledger_entries`), immutable via DB triggers |
| Only legal state changes happen | Explicit state machine: `PENDING → PROCESSING → PAID / FAILED / EXPIRED → REFUND_PENDING → REFUNDED` (late `EXPIRED → PAID` allowed — Ethiopian gateways confirm late) |
| Lost webhooks don't lose money | Reconciliation worker re-queries the gateway for every stuck transaction |
| No card-on-file in Ethiopia | Subscriptions = invoice chains: renewal invoices issued ahead of period end, grace period, then downgrade |
| Amounts are exact | All money is integer santim (1 ETB = 100); floats never touch money |

## Gateways

- **`chapa`** — production. One integration covers Telebirr, CBE Birr, M-Pesa, Amole, cards.
  Webhook signatures verified (HMAC-SHA256, constant-time compare).
- **`mock`** — development. Hosted fake checkout at `/mock/checkout/:tx_ref` with Pay/Fail
  buttons that drive the exact same settlement pipeline. Refuses to load in production.
- Direct `telebirr` / `cbe` adapters slot in behind the same `PaymentGateway` interface
  when enterprise API agreements are in place.

## Running

```bash
cd payment-service
npm install
cp .env.example .env         # fill in DATABASE_URL etc.
npm run dev                  # migrates automatically, starts server + workers
```

No Postgres handy? `node scripts/dev-db.mjs` boots an embedded one on port 5433
(`npm i --no-save embedded-postgres` first), then set
`DATABASE_URL=postgres://konyx:konyx@localhost:5433/konyx`.

Tests & checks:

```bash
npm test          # 25 unit tests: state machine, ledger balancing, money math, webhook signatures
npm run typecheck
```

## API

Auth: `Authorization: Bearer <supabase-jwt>` (`AUTH_MODE=supabase`) or `x-dev-user: <uuid>` (`AUTH_MODE=dev`).
Admin endpoints use `x-admin-key`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness + DB check |
| GET | `/v1/plans` | purchasable catalog + available gateways |
| POST | `/v1/payments/initiate` | start one-time payment (job post / badge) → checkout URL |
| GET | `/v1/payments/:txRef` | payment status (poll from return page) |
| POST | `/v1/payments/:txRef/verify` | force server-side verification against the gateway |
| GET | `/v1/payments` | user's payment history |
| GET | `/v1/entitlements` | what the user has paid for (the contract with the app) |
| POST | `/v1/subscriptions` | start subscription → first invoice → checkout URL |
| GET | `/v1/subscriptions` | user's subscriptions |
| POST | `/v1/subscriptions/:id/cancel` | cancel at period end |
| POST | `/v1/webhooks/:gateway` | gateway callbacks (signature-verified, deduped) |
| GET | `/v1/admin/transactions` | browse transactions (`?status=PAID`) |
| GET | `/v1/admin/transactions/:txRef/events` | full audit trail |
| POST | `/v1/admin/transactions/:txRef/reverify` | support tool: "I paid but nothing happened" |
| POST | `/v1/admin/transactions/:txRef/refund` | request refund at gateway |
| POST | `/v1/admin/transactions/:txRef/confirm-refund` | confirm refund (ledger + revoke) |
| POST | `/v1/admin/reconcile` | run reconciliation sweep now |
| GET | `/v1/admin/ledger/trial-balance` | per-account totals + journal integrity check |
| GET | `/v1/admin/webhooks` | webhook intake log |

## Payment flow (one-time)

1. Frontend `POST /v1/payments/initiate` with `planCode` + `idempotencyKey` (+ `jobDraft` for job posts — the draft is persisted *before* money moves).
2. Redirect customer to `checkoutUrl` (Chapa hosted page → Telebirr/CBE Birr/...).
3. Gateway calls `POST /v1/webhooks/chapa`; we verify the signature, then **re-verify the transaction via Chapa's API** — only that flips the state to `PAID`, writes the balanced ledger journal, and enqueues fulfillment.
4. Outbox worker publishes the job / grants the entitlement. Frontend polls `GET /v1/payments/:txRef` or calls `/verify` on the return page.
5. If the webhook never arrives, the reconciliation worker settles it anyway.

## Subscription lifecycle

`incomplete` → (first invoice paid) → `active` → renewal invoice issued `RENEWAL_LEAD_DAYS`
before period end → unpaid past due date → `past_due` with `GRACE_PERIOD_DAYS` grace →
still unpaid → `expired` + entitlement revoked. `canceled` keeps the entitlement until the
paid period ends. Notifications are emitted as outbox events (`notify.renewal_due`,
`notify.payment_overdue`) — wire them to SMS/Telegram/email in `outboxService.ts`.

## Background workers

| Worker | Default | Job |
|---|---|---|
| outbox-dispatcher | 5s | deliver entitlements/notifications (SKIP LOCKED, exponential backoff) |
| reconciliation | 5min | re-verify stuck transactions, expire stale ones, confirm refunds |
| subscription-renewals | 1h | issue upcoming renewal invoices |
| invoice-overdue | 1h | past_due / grace / expiry enforcement |

## Going to production checklist

- [ ] `AUTH_MODE=supabase` + `SUPABASE_JWT_SECRET`
- [ ] `DEFAULT_GATEWAY=chapa` + live `CHAPA_SECRET_KEY` / `CHAPA_WEBHOOK_SECRET`
- [ ] Set the webhook URL in the Chapa dashboard to `https://<service>/v1/webhooks/chapa`
- [ ] `DATABASE_URL` → Supabase pooled connection string
- [ ] Rotate `ADMIN_API_KEY`
- [ ] The service refuses to boot in production with dev auth / mock gateway (see `assertProductionSafety`)

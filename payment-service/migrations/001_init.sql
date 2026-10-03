-- ============================================================================
-- Konyx Payment System — core schema
-- All money columns are BIGINT in santim (1 ETB = 100 santim). Never floats.
-- All tables are append-friendly; money-bearing rows are never UPDATEd except
-- through the state machine, and ledger entries are never updated or deleted.
-- ============================================================================

-- ── Plans (catalog of purchasable things) ────────────────────────────────────
CREATE TABLE plans (
  code            TEXT PRIMARY KEY,                 -- e.g. 'employer_starter_post'
  name            TEXT NOT NULL,
  kind            TEXT NOT NULL CHECK (kind IN ('one_time', 'subscription')),
  amount_santim   BIGINT NOT NULL CHECK (amount_santim >= 0),
  currency        TEXT NOT NULL DEFAULT 'ETB',
  interval        TEXT CHECK (interval IN ('month', 'year')), -- NULL for one_time
  entitlement     TEXT NOT NULL,                    -- what fulfillment grants
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO plans (code, name, kind, amount_santim, interval, entitlement) VALUES
  ('employer_starter_post',  'Starter Job Post (Pay-As-You-Hire)', 'one_time',     45000,   NULL,    'job_post_publish'),
  ('employer_pro_monthly',   'Employer Pro — Monthly',             'subscription', 145000,  'month', 'employer_pro'),
  ('employer_pro_yearly',    'Employer Pro — Yearly',              'subscription', 1450000, 'year',  'employer_pro'),
  ('seeker_premium_monthly', 'Seeker Premium — Monthly',           'subscription', 15000,   'month', 'seeker_premium'),
  ('seeker_premium_yearly',  'Seeker Premium — Yearly',            'subscription', 150000,  'year',  'seeker_premium'),
  ('gold_verified_badge',    'Gold Verified Badge',                'one_time',     25000,   NULL,    'gold_badge');

-- ── Orders (the thing being bought; links payment to product) ───────────────
CREATE TABLE orders (
  id              UUID PRIMARY KEY,
  user_id         UUID NOT NULL,                    -- Supabase auth.users id
  plan_code       TEXT NOT NULL REFERENCES plans(code),
  kind            TEXT NOT NULL CHECK (kind IN ('one_time', 'subscription_invoice')),
  reference_id    UUID,                             -- job draft id, invoice id, etc.
  amount_santim   BIGINT NOT NULL CHECK (amount_santim >= 0),
  currency        TEXT NOT NULL DEFAULT 'ETB',
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open', 'paid', 'canceled')),
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX orders_user_idx ON orders (user_id, created_at DESC);

-- ── Transactions (one payment attempt against an order) ─────────────────────
CREATE TABLE transactions (
  id                UUID PRIMARY KEY,
  order_id          UUID NOT NULL REFERENCES orders(id),
  user_id           UUID NOT NULL,
  tx_ref            TEXT NOT NULL UNIQUE,           -- our reference, sent to gateway
  gateway           TEXT NOT NULL,                  -- 'chapa' | 'mock' | later: 'telebirr', 'cbe'
  gateway_tx_id     TEXT,                           -- gateway's own reference
  status            TEXT NOT NULL DEFAULT 'PENDING'
                    CHECK (status IN ('PENDING','PROCESSING','PAID','FAILED','EXPIRED','REFUND_PENDING','REFUNDED')),
  amount_santim     BIGINT NOT NULL CHECK (amount_santim >= 0),
  currency          TEXT NOT NULL DEFAULT 'ETB',
  idempotency_key   TEXT,                           -- client-supplied; dedupes initiations
  checkout_url      TEXT,
  gateway_response  JSONB NOT NULL DEFAULT '{}',    -- last verify/initiate payload
  failure_reason    TEXT,
  paid_at           TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX transactions_idem_idx
  ON transactions (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX transactions_order_idx  ON transactions (order_id);
CREATE INDEX transactions_status_idx ON transactions (status) WHERE status IN ('PENDING','PROCESSING','REFUND_PENDING');

-- ── Transaction events (append-only audit of every state transition) ────────
CREATE TABLE transaction_events (
  id              BIGSERIAL PRIMARY KEY,
  transaction_id  UUID NOT NULL REFERENCES transactions(id),
  from_status     TEXT,
  to_status       TEXT NOT NULL,
  source          TEXT NOT NULL,                    -- 'webhook' | 'verify_api' | 'reconciliation' | 'admin' | 'system'
  detail          JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX transaction_events_tx_idx ON transaction_events (transaction_id, id);

-- ── Double-entry ledger ──────────────────────────────────────────────────────
CREATE TABLE ledger_accounts (
  id        SERIAL PRIMARY KEY,
  code      TEXT NOT NULL UNIQUE,
  name      TEXT NOT NULL,
  type      TEXT NOT NULL CHECK (type IN ('asset','liability','revenue','expense','contra_revenue'))
);

INSERT INTO ledger_accounts (code, name, type) VALUES
  ('gateway_receivable', 'Gateway Receivable (funds held at gateway)', 'asset'),
  ('revenue_job_posts',  'Revenue — Job Posts',                        'revenue'),
  ('revenue_subscriptions', 'Revenue — Subscriptions',                 'revenue'),
  ('revenue_badges',     'Revenue — Badges',                           'revenue'),
  ('gateway_fees',       'Gateway Fees Expense',                       'expense'),
  ('refunds',            'Refunds',                                    'contra_revenue');

-- A journal groups the balanced entries of one economic event.
CREATE TABLE ledger_journals (
  id              UUID PRIMARY KEY,
  transaction_id  UUID REFERENCES transactions(id),
  kind            TEXT NOT NULL CHECK (kind IN ('payment_captured','refund','fee','adjustment')),
  memo            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
  id              BIGSERIAL PRIMARY KEY,
  journal_id      UUID NOT NULL REFERENCES ledger_journals(id),
  account_id      INT NOT NULL REFERENCES ledger_accounts(id),
  direction       TEXT NOT NULL CHECK (direction IN ('debit','credit')),
  amount_santim   BIGINT NOT NULL CHECK (amount_santim > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ledger_entries_journal_idx ON ledger_entries (journal_id);
CREATE INDEX ledger_entries_account_idx ON ledger_entries (account_id);

-- Ledger rows are immutable: block UPDATE and DELETE at the database level.
CREATE OR REPLACE FUNCTION forbid_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'ledger rows are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ledger_entries_immutable
  BEFORE UPDATE OR DELETE ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER ledger_journals_immutable
  BEFORE UPDATE OR DELETE ON ledger_journals
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();
CREATE TRIGGER transaction_events_immutable
  BEFORE UPDATE OR DELETE ON transaction_events
  FOR EACH ROW EXECUTE FUNCTION forbid_mutation();

-- ── Subscriptions ────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY,
  user_id               UUID NOT NULL,
  plan_code             TEXT NOT NULL REFERENCES plans(code),
  status                TEXT NOT NULL DEFAULT 'incomplete'
                        CHECK (status IN ('incomplete','active','past_due','canceled','expired')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  grace_until           TIMESTAMPTZ,
  canceled_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX subscriptions_user_idx ON subscriptions (user_id);
CREATE INDEX subscriptions_renewal_idx ON subscriptions (status, current_period_end);

CREATE TABLE invoices (
  id              UUID PRIMARY KEY,
  number          TEXT NOT NULL UNIQUE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id),
  order_id        UUID REFERENCES orders(id),
  amount_santim   BIGINT NOT NULL CHECK (amount_santim >= 0),
  currency        TEXT NOT NULL DEFAULT 'ETB',
  period_start    TIMESTAMPTZ NOT NULL,
  period_end      TIMESTAMPTZ NOT NULL,
  due_at          TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open'
                  CHECK (status IN ('open','paid','void','overdue')),
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX invoices_sub_idx ON invoices (subscription_id, created_at DESC);
CREATE INDEX invoices_open_idx ON invoices (status, due_at) WHERE status IN ('open','overdue');

-- ── Webhook events (dedupe + replay protection + audit) ─────────────────────
CREATE TABLE webhook_events (
  id            BIGSERIAL PRIMARY KEY,
  gateway       TEXT NOT NULL,
  dedupe_key    TEXT NOT NULL,                      -- hash of gateway+tx_ref+event+body
  tx_ref        TEXT,
  signature_ok  BOOLEAN NOT NULL,
  payload       JSONB NOT NULL,
  processed_at  TIMESTAMPTZ,
  error         TEXT,
  received_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (gateway, dedupe_key)
);

-- ── Outbox (exactly-once-ish fulfillment of entitlements) ────────────────────
CREATE TABLE outbox_events (
  id            BIGSERIAL PRIMARY KEY,
  type          TEXT NOT NULL,                      -- 'entitlement.grant' | 'entitlement.revoke' | 'notify.renewal_due' | ...
  payload       JSONB NOT NULL,
  attempts      INT NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at  TIMESTAMPTZ,
  last_error    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX outbox_pending_idx ON outbox_events (next_attempt_at) WHERE processed_at IS NULL;

-- ── Entitlements (the contract with the main app / Supabase side) ───────────
-- The frontend / Supabase RLS reads this table to know what a user has paid for.
CREATE TABLE user_entitlements (
  id            UUID PRIMARY KEY,
  user_id       UUID NOT NULL,
  entitlement   TEXT NOT NULL,                      -- 'seeker_premium' | 'employer_pro' | 'gold_badge' | 'job_post_publish'
  reference_id  UUID,                               -- e.g. the published job post id
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ,
  revoked_at    TIMESTAMPTZ,
  source_transaction_id UUID REFERENCES transactions(id)
);
CREATE INDEX user_entitlements_user_idx ON user_entitlements (user_id, entitlement) WHERE active;

-- Minimal job-post contract table (the main app will own richer job data;
-- the payment service only flips drafts to published on confirmed payment).
CREATE TABLE job_posts (
  id          UUID PRIMARY KEY,
  user_id     UUID NOT NULL,
  title       TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX job_posts_user_idx ON job_posts (user_id, created_at DESC);

-- ── Mock gateway state (development only; harmless in production) ───────────
CREATE TABLE mock_gateway_payments (
  tx_ref      TEXT PRIMARY KEY,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  amount_santim BIGINT NOT NULL,
  currency    TEXT NOT NULL DEFAULT 'ETB',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

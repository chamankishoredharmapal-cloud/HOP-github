-- Payment Events table for idempotent event processing
-- Each unique Razorpay event (or verification) is recorded here.
-- Duplicate inserts are silently ignored via ON CONFLICT DO NOTHING,
-- allowing at-most-once processing semantics.

CREATE TABLE IF NOT EXISTS payment_events (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            TEXT        NOT NULL UNIQUE,
  event_type          TEXT        NOT NULL,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON payment_events (event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_razorpay_order_id ON payment_events (razorpay_order_id);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

-- Only service_role can access payment_events (same model as payments)
CREATE POLICY payment_events_all_service ON payment_events
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================================================
-- House of Padmavati — Newsletter Subscriptions
-- Migration: 20260928000006
-- Description: Add newsletter_subscriptions table for footer newsletter form
-- =============================================================================

-- 1. Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT DEFAULT 'footer',
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email)
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions (status);

-- 3. RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY newsletter_subscriptions_service_all ON newsletter_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own subscription
CREATE POLICY newsletter_subscriptions_customer_select ON newsletter_subscriptions
  FOR SELECT USING (email = auth.email());

-- Users can subscribe (insert) - but email must match their auth email for security
-- Actually, for newsletter we allow anonymous subscription via Edge Function
-- So we need a policy that allows anonymous inserts via service role

-- 4. Trigger for updated_at
CREATE TRIGGER set_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON newsletter_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Grant permissions
GRANT SELECT ON newsletter_subscriptions TO authenticated;
GRANT ALL ON newsletter_subscriptions TO service_role;

-- 6. RPC for safe newsletter subscription (allows anonymous via Edge Function)
CREATE OR REPLACE FUNCTION subscribe_newsletter(
  p_email TEXT,
  p_source TEXT DEFAULT 'footer'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized_email TEXT;
BEGIN
  v_normalized_email := LOWER(TRIM(p_email));

  IF v_normalized_email IS NULL OR v_normalized_email = '' OR v_normalized_email NOT LIKE '%@%' THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;

  INSERT INTO newsletter_subscriptions (email, source, status)
  VALUES (v_normalized_email, p_source, 'subscribed')
  ON CONFLICT (email) DO UPDATE SET
    status = 'subscribed',
    source = EXCLUDED.source,
    confirmed_at = CASE 
      WHEN newsletter_subscriptions.status = 'unsubscribed' THEN now()
      ELSE newsletter_subscriptions.confirmed_at
    END,
    unsubscribed_at = CASE 
      WHEN newsletter_subscriptions.status = 'unsubscribed' THEN NULL
      ELSE newsletter_subscriptions.unsubscribed_at
    END,
    updated_at = now()
  RETURNING id INTO v_normalized_email;

  RETURN jsonb_build_object('success', true, 'email', v_normalized_email);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

GRANT EXECUTE ON FUNCTION subscribe_newsletter(TEXT, TEXT) TO authenticated, anon;
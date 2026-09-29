-- =============================================================================
-- House of Padmavati — Contact Messages Table
-- Migration: 20260928000005
-- Description: Add contact_messages table for customer care form submissions
-- =============================================================================

-- 1. Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  order_number TEXT,
  message TEXT NOT NULL,
  user_email TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- 3. RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY contact_messages_service_all ON contact_messages
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read their own messages
CREATE POLICY contact_messages_customer_select ON contact_messages
  FOR SELECT USING (email = auth.email());

-- 4. Trigger for updated_at
CREATE TRIGGER set_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Grant permissions
GRANT SELECT, INSERT ON contact_messages TO authenticated;
GRANT ALL ON contact_messages TO service_role;
-- =============================================================================
-- House of Padmavati — Phase 1 Remediation Migration
-- Migration: 20260813000000
-- Description: Apply fixes from Phase 1 Audit (F-07, F-08, F-12).
-- =============================================================================

-- #############################################################################
-- 1. F-05: Add missing 'packed' and 'refunded' values to order_status enum
-- #############################################################################

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'packed' AFTER 'processing';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'refunded' AFTER 'returned';

-- #############################################################################
-- 2. F-07 & F-08: Add CHECK constraints to unstructured event_type TEXT fields
-- #############################################################################

-- Add constraint to payment_events
ALTER TABLE payment_events DROP CONSTRAINT IF EXISTS payment_events_type_check;
ALTER TABLE payment_events ADD CONSTRAINT payment_events_type_check
  CHECK (event_type IN ('verify_payment', 'refund', 'chargeback', 'payment.failed', 'payment.captured'));

-- Add constraint to order_events
ALTER TABLE order_events DROP CONSTRAINT IF EXISTS order_events_type_check;
ALTER TABLE order_events ADD CONSTRAINT order_events_type_check
  CHECK (event_type IN ('status_changed', 'paid', 'cancelled', 'returned', 'refunded'));

-- =============================================================================
-- End of Migration
-- =============================================================================

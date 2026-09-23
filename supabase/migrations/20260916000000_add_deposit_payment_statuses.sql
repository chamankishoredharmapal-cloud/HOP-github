-- =============================================================================
-- House of Padmavati — Add Deposit Payment Statuses
-- Migration: 20260916000000
-- Description: Adds missing payment_status enum values for the deposit/partial-payment model.
-- These values are required by the confirm_paid_order and refund_deposit RPCs
-- and the TypeScript PaymentStatus type.
-- =============================================================================

-- The payment_status enum is used by orders.payment_status column
-- The payment_transaction_status enum is used by payments.status column
-- We only need to add deposit-related values to payment_status

-- Add deposit payment statuses to payment_status enum
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'deposit_pending';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'deposit_paid';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'partially_paid';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'fully_paid';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'balance_due';
ALTER TYPE payment_status ADD VALUE IF NOT EXISTS 'cancelled';

-- Note: We do NOT remove existing values (pending, paid, failed, refunded, partially_refunded)
-- We do NOT modify payment_transaction_status enum (used by payments.status)
-- We do NOT alter any tables or drop any objects
-- This migration is purely additive and non-destructive
# Phase 3 — Failure Scenario Matrix

**Audit Timestamp**: 2026-08-16T05:30:00+05:30  

---

## 1. Ten Mandatory Failure Scenarios

| # | Failure Scenario | System Handling & Verification Evidence | Resilience Verdict |
|---|------------------|-----------------------------------------|--------------------|
| **A** | **Payment Rejected** (Card declined / UPI fail) | `verify-payment` updates payment status to `failed` and triggers `release_order_inventory`. Modal closes with clear error; no false paid order. | **PASS** |
| **B** | **Payment Abandoned** (User closes tab/modal) | Razorpay modal `ondismiss` triggers state transition to `failed` (phase: `checkout`). DB order stays `pending_payment` until timeout/cancel; inventory released on cancel. | **PASS** |
| **C** | **Payment Succeeds but Browser Crashes** | Razorpay backend triggers `razorpay-webhook` (`payment.captured`). Webhook independently executes `confirm_paid_order` and updates order to `confirmed`/`paid`. User can find order in account. | **PASS** |
| **D** | **Webhook Delayed** (Arrival after client verify) | Client verification marks order `paid`. When webhook arrives later, `payment_events` idempotency check returns `{ already_processed: true }`. Eventual consistency guaranteed. | **PASS** |
| **E** | **Webhook Duplicated** (Network retries) | `payment_events` table checks `event_id`. Duplicate webhook returns HTTP 200 with `{ received: true, already_processed: true }`. Zero duplicate deductions. | **PASS** |
| **F** | **Webhook Missing / Lost in Transit** | Client-side `usePayment` hook verifies signature directly with `verify-payment` Edge Function, executing `confirm_paid_order`. | **PASS** |
| **G** | **Order Creation Fails Mid-Transaction** | `create_order` PostgreSQL RPC wraps all inserts (customer, address, order, order_items) in an atomic transaction; `EXCEPTION` rolls back all changes. Zero orphan rows. | **PASS** |
| **H** | **Inventory Concurrency Race** | `confirm_paid_order` and `adjust_product_stock` execute `SELECT stock FROM products ... FOR UPDATE`. Table has `CHECK (stock >= 0)` constraint. Overselling is impossible. | **PASS** |
| **I** | **Network Timeout on Payment Creation** | Checkout component preserves `orderId` in state and passes it to `create-razorpay-order` on retry. Edge function reuses existing pending order instead of inserting duplicate. | **PASS** |
| **J** | **Checkout Retry After Failure** | `handlePaymentRetry` resets payment state and error messages without wiping entered customer information, allowing clean retry. | **PASS** |

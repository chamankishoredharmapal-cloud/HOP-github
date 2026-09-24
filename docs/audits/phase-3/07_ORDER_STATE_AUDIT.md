# Phase 3 — Order State Machine & Integrity Audit

**Audit Timestamp**: 2026-08-16T05:28:00+05:30  

---

## 1. Database Schema vs Frontend Types

### Allowed Database Status Enum & Constraint
In `supabase/migrations/20260718000000_reconcile_order_schema.sql` and `20260813000000_phase1_remediation.sql`:
- **`orders.status`**: `pending_payment`, `confirmed`, `processing`, `packed`, `shipped`, `delivered`, `cancelled`, `returned`, `refunded`.
- **`orders.payment_status`**: `pending`, `paid`, `failed`, `refunded`.
- **`order_events.event_type`**: `created`, `paid`, `cancelled`, `returned`, `refunded`, `status_changed`.

### Frontend Order Status Flow (`src/services/orderService.ts`)
Matches database constraints 1:1:
```typescript
export const ORDER_STATUS_FLOW = [
  "pending_payment",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;
```

---

## 2. Order State Transitions & Authorization Matrix

| Transition | Trigger / Mechanism | Authorized Actor | Database Mutations |
|------------|---------------------|------------------|---------------------|
| `None` -> `pending_payment` | `create_order` RPC | Customer / Guest Checkout | Inserts `orders`, `order_items`, `shipping_addresses` |
| `pending_payment` -> `confirmed` | `confirm_paid_order` RPC | Razorpay Webhook / `verify-payment` Edge Function | Updates `orders.payment_status = 'paid'`, `orders.status = 'confirmed'`, deducts `products.stock`, logs `inventory_history` |
| `pending_payment` -> `cancelled` | `cancel-payment` Edge Function / `release_order_inventory` | Order Owner / Admin | Updates `orders.status = 'cancelled'`, logs `order_events`, releases inventory |
| `confirmed` -> `processing` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'processing'`, logs `order_events` |
| `processing` -> `packed` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'packed'`, logs `order_events` |
| `packed` -> `shipped` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'shipped'`, logs `order_events` |
| `shipped` -> `delivered` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'delivered'`, logs `order_events` |
| `delivered` -> `returned` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'returned'`, logs `order_events` |
| `returned` -> `refunded` | Admin Studio UI / `transitionOrderStatus` | Admin (`is_admin()`) | Updates `orders.status = 'refunded'`, `payment_status = 'refunded'` |

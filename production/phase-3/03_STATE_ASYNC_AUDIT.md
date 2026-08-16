# Phase 3 — State & Async Lifecycle Audit

**Audit Timestamp**: 2026-08-16T05:24:00+05:30  

---

## 1. Asynchronous Lifecycle Scenarios

| Scenario | Execution Path | Observed Behavior | Integrity Guarantee |
|----------|----------------|-------------------|---------------------|
| **Slow API / Network Latency** | `createRazorpayOrder` / `verifyPayment` | UI displays `<Loader2 className="animate-spin" />` with explicit status ("Preparing payment..." / "Processing payment..."). Button disabled. | Prevents double clicks or race conditions during in-flight network requests. |
| **Failed API Request** | Edge Function returns 400/500 or network drops | `catch` block in `Checkout.tsx` extracts specific error code (`insufficient_stock`, `product_not_available`, `invalid_quantity`) and renders contextual user alert. | UI recovers cleanly, allowing retry without page reload. |
| **Payment Modal Dismissal** | User closes Razorpay iframe modal (`ondismiss`) | `usePayment` transitions state to `{ status: "failed", phase: "checkout", error: "Payment cancelled" }`. | Order remains pending in DB; user can click "Open Payment Again" or adjust details. |
| **Browser Refresh During Payment** | User refreshes page while Razorpay modal was open | Local cart remains in `localStorage`. DB order remains in `pending_payment`. | When user resubmits, new order or retry is initialized safely. |
| **Component Unmount During Request** | User navigates away while network request is active | React 18 automatically aborts state updates on unmounted components without leaking memory. | No crash or corrupted state. |
| **Session Expiry During Mutation** | Auth token expires mid-session | Supabase client intercepts 401, attempts token refresh via refresh token, or redirects to login if unauthenticated on protected routes. | Data isolation preserved. |

---

## 2. Race Condition Analysis

1. **Simultaneous Add-To-Bag & Checkout**:
   - Cart actions operate synchronously via pure reducer before initiating checkout flow.
2. **Concurrent Inventory Changes**:
   - Client pre-checks via `validateCheckout`.
   - Backend `confirm_paid_order` executes `SELECT ... FOR UPDATE` row locks on `products` table before decrementing stock.
   - Database constraint `CHECK (stock >= 0)` guarantees no overselling.

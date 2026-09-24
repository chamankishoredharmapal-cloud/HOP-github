# Phase 3 — Contradiction Register

**Audit Timestamp**: 2026-08-16T05:34:00+05:30  

---

## 1. Contradiction Analysis Across System Layers

| Layer A | Layer B | Potential Contradiction | Resolution / Actual State | Status |
|---------|---------|-------------------------|---------------------------|--------|
| **Order Status Enum in DB** (`reconcile_order_schema.sql`) | **Frontend Order Status Flow** (`src/services/orderService.ts`) | Possible enum value divergence | Both systems strictly use: `pending_payment`, `confirmed`, `processing`, `packed`, `shipped`, `delivered`, `cancelled`, `returned`, `refunded`. | **CONSISTENT** |
| **Client Cart State** (`CartContext.tsx`) | **Server Price Authority** (`create_order` RPC) | Client tampered price being honored | Client price is ignored during order creation; server recalculates subtotal from `products.selling_price`. | **CONSISTENT** |
| **Refund UI State** (Studio Admin UI) | **Backend Gateway Payout** (Razorpay API) | UI suggests automated gateway refund | UI transitions DB state (`returned` -> `refunded`), but payment payout is manual via Razorpay dashboard. Explicitly documented in `11_FINDING_REGISTER.md`. | **RESOLVED & DOCUMENTED** |
| **Prerendered SSG State** (`scripts/prerender.js`) | **Client Interactive State** (`src/App.tsx`) | React Query cache replacement flash | `HydrationBoundary` with `__REACT_QUERY_STATE__` preserves pre-fetched data across hydration without re-fetch flashes. | **CONSISTENT** |

---

## 2. Unresolved Contradictions
**NONE.** No architectural, data-flow, or state-machine contradictions remain unresolved.

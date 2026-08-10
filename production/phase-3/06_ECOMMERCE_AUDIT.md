---
title: "Phase 3 — E-Commerce Audit"
document_id: "HOP-P3-06"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "Lead QA Engineer"
reviewer: "Backend Developer / Product Manager"
source_sop: "11_ECOMMERCE_AUDIT.md"
---

# Phase 3 — E-Commerce Audit

## 1. Purpose

This procedure traces the complete customer commerce journey and validates every e-commerce capability that **actually exists** in the current HOP application. It is the executable, evidence-driven Phase 3 implementation of `11_ECOMMERCE_AUDIT.md`, scoped to real capabilities: **no capability is assumed; any planned capability that does not exist is documented accurately as a gap, never invented.**

**WHAT is being tested:** product selection, product information, cart, quantity, pricing, checkout, address, payment, order creation, order persistence, confirmation, error handling, failed-payment behavior, duplicate-submission protection, order status, customer-facing order information.
**WHY:** QG3 requires "Cart totals, Razorpay initialization, inventory deduction simulation fully verified in staging." Transactional correctness is the core of the business.
**WHEN:** Sixth and final audit of Phase 3 (after Studio — depends on Studio-validated product/inventory data and on the Security audit for transaction security; order preserved from `00_MASTER_EXECUTION_PLAN.md` Phase 3).

## 2. Scope

The complete journey: **Homepage → Collection/Category → Product → Cart → Checkout → Payment → Order → Confirmation**, plus account (order history/detail, addresses, wishlist), gift, appointments, search. Backend: Supabase tables (products, orders, order items, payment events, inventory), Edge Functions (`create-razorpay-order`, `verify-payment`, `cancel-payment`, `razorpay-webhook`, `release-inventory`, `get-order-confirmation`, `send-email`). Razorpay **test mode only**.

## 3. Definitions

Preserved from `11`: HOP, E2E, SKU, INR, Razorpay, Supabase.

## 4. Roles & Responsibilities

Per `11`: Lead QA Engineer (oversight/sign-off), Backend Developer (data integrity, edge functions), Frontend Developer (UI issues), Product Manager (catalog accuracy/business logic).

## 5. Prerequisites

- Staging environment (`localhost:8080` dev or staging URL).
- Test accounts (new, returning, with/without saved addresses).
- Razorpay **test** keys configured; test cards (success/failure) per Razorpay docs.
- Supabase staging project seeded with test products (known SKUs, prices, stock levels).
- Playwright installed; existing specs (`CheckoutPricing.spec.ts`, `ProductGallery.spec.ts`, `ProductImages.spec.ts`, `RazorpayWebhook.spec.ts`) runnable.

## 6. Inputs / Outputs

**Inputs:** `05_STUDIO_AUDIT.md` results (product data validity), pricing/shipping matrix, Razorpay test docs, Playwright specs.
**Outputs:** test report, bug tracker entries, Razorpay test transaction log, e-commerce readiness sign-off.

---

## 7. Journey Procedures (Action → Expected Result → Evidence → Pass/Fail)

### Step 1 — Homepage

**Action:** Load Index at staging URL.
**Expected:** Hero, collections, journal teasers render; navigation links to Collections, Lookbook, Journal, Gift, Appointments work; prices render in INR format (₹).
**Evidence:** screenshot; console-error check.
**Pass/Fail:** ____________

### Step 2 — Collection / Category

**Action:** Navigate via nav to a category (e.g., `/collections/<slug>`) and to `/collections`.
**Expected:** Product grid renders only products belonging to the category (verify against Supabase); collection narrative/cover render; empty state if none.
**Evidence:** screenshots; cross-check query.
**Pass/Fail:** ____________

### Step 3 — Product Detail (PDP)

**Action:** Open 3+ distinct products. Verify:
- Gallery images render and zoom/lightbox work (`ProductGallery.spec.ts` covers gallery behavior — run it).
- Name, description, materials, care, price (INR format ₹ 1,50,000), stock status correct.
- Related products section ("You May Also Like") shows relevant items (this exists on PDP via related-products query).
- Variant options (if any, e.g., blouse stitching) behave.
**Expected:** all correct; no console errors.
**Evidence:** screenshots; `npx playwright test ProductGallery.spec.ts ProductImages.spec.ts` results.
**Pass/Fail:** ____________

### Step 4 — Cart

**Action 1:** Add items to cart; open Cart page/drawer.
**Expected:** Item, thumbnail, unit price, quantity shown; cart counter updates immediately; toast feedback (per A11y check).
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 2:** Increment/decrement quantity.
**Expected:** Subtotal updates instantly and correctly.
**Evidence:** before/after screenshots.
**Pass/Fail:** ____________

**Action 3:** Attempt quantity beyond available inventory.
**Expected:** Error handling ("Insufficient stock" or capped quantity).
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 4:** Remove item.
**Expected:** Item disappears; subtotal updates.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 5:** Refresh the page.
**Expected:** Cart state persists (CartContext persistence mechanism).
**Evidence:** screenshot after reload.
**Pass/Fail:** ____________

### Step 5 — Checkout

**Action 1:** Proceed to checkout with 2+ items.
**Expected:** Shipping form requests recipient name, phone, address, city, postal code, country.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 2:** Submit invalid data (missing fields, bad postal code).
**Expected:** Validation errors per field; no submission.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 3:** Verify pricing math (run `CheckoutPricing.spec.ts`):
```bash
npx playwright test CheckoutPricing.spec.ts
```
**Expected:** 100% pass. Shipping rule (actual implementation `src/pages/Checkout.tsx:88`): **free when subtotal >= ₹ 2,499, else flat ₹ 99**; total = subtotal + shipping. (Doc 11 Step 12.15 cites a ₹ 50,000 free-shipping threshold — the implemented rule differs; record this variance in the completion report. Validate the implemented rule for mathematical accuracy.)
**Evidence:** Playwright results; screenshot of order summary.
**Pass/Fail:** ____________

**Action 4:** Gift option: enable "this is a gift", enter recipient + message.
**Expected:** Order notes contain `Gift for <recipient>: <message>` when order created.
**Evidence:** Supabase orders row check.
**Pass/Fail:** ____________

### Step 6 — Payment (Razorpay, test mode)

**Action 1:** Initiate payment.
**Expected:** Razorpay checkout modal opens (script loads dynamically via `loadRazorpayScript`; not blocked by pop-up blockers); `create-razorpay-order` Edge Function returns order_id.
**Evidence:** screen recording; Network tab showing `checkout.razorpay.com` load at this point only.
**Pass/Fail:** ____________

**Action 2:** Complete payment with Razorpay **success** test card.
**Expected:** `verify-payment` succeeds; order status becomes `confirmed`; user redirected to `/order/confirmation/<orderNumber>`.
**Evidence:** screen recording; Razorpay dashboard test transaction log; Supabase orders + payment_events rows.
**Pass/Fail:** ____________

**Action 3:** Payment **failure** card.
**Expected:** Graceful error; user returned to checkout with cart intact; retry possible; order not confirmed.
**Evidence:** screenshots; payment_events row.
**Pass/Fail:** ____________

**Action 4:** Cancel payment (close modal).
**Expected:** Return to checkout; cart intact; no order created.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 5:** Duplicate-submission protection.
**Expected:** Webhook duplicate events handled idempotently (covered by `RazorpayWebhook.spec.ts`); no double order/stock deduction. Run:
```bash
npx playwright test RazorpayWebhook.spec.ts
```
**Evidence:** Playwright results; Supabase row counts.
**Pass/Fail:** ____________

**Action 6:** Invalid webhook signature.
**Expected:** Rejected non-2xx (fail-closed) — cross-check Security audit evidence.
**Evidence:** function logs.
**Pass/Fail:** ____________

### Step 7 — Order Confirmation

**Action:** After success, open `/order/confirmation/<orderNumber>`.
**Expected:** Order number, item summary, totals, delivery estimate (if available) display; messaging consistent with brand tone.
**Evidence:** screenshot.
**Pass/Fail:** ____________

### Step 8 — Order Persistence & Status

**Action 1:** Verify Supabase: `orders`, `order_items`, `payment_events` rows created with correct amounts; inventory deducted (`release-inventory` behavior — verify stock decrement for purchased SKU).
**Expected:** Data matches Razorpay dashboard test transaction.
**Evidence:** Supabase queries + Razorpay dashboard.
**Pass/Fail:** ____________

**Action 2:** Account order history (logged-in user).
**Expected:** Order appears with correct status. Actual status enum: `pending_payment → confirmed → processing → shipped → delivered → cancelled → returned` (types in `src/integrations/supabase/types.ts`). Verify the storefront renders each status correctly.
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 3:** Order detail page shows items, address, payment id.
**Expected:** All data renders.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 4:** Studio status update reflects on storefront (cross-check `05` Studio audit 7.10).
**Expected:** Status change visible in order history.
**Evidence:** screenshots.
**Pass/Fail:** ____________

### Step 9 — Account, Wishlist & Addresses

**Action 1:** Register/login; password constraints and email validation per Security audit.
**Expected:** Registration works; profile update persists.
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 2:** Wishlist: add from PDP, view `/wishlist`, move to cart, remove, persist across logout/login.
**Expected:** All work; state persists (WishlistContext + customer wishlists table).
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 3:** Address book: add/edit/delete; changes propagate to checkout.
**Expected:** Persists and is usable at checkout.
**Evidence:** screenshots.
**Pass/Fail:** ____________

### Step 10 — Ancillary Features (Gift, Appointments, Search)

**Action 1:** `/gift` page renders gifting experience; gift option verified in Step 5.4.
**Expected:** Works end-to-end with checkout.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 2:** `/appointments` booking form.
**Expected:** Form validates and submits; appointment recorded (verify Supabase if a table exists; otherwise record behavior as observed).
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 3:** Search modal: query a product name and a broad term.
**Expected:** Accurate results; helpful empty state.
**Evidence:** screenshots.
**Pass/Fail:** ____________

---

## 8. Capability Status Matrix (state at manual creation — verify at execution)

| Capability (`11` reference) | Current implementation | Phase 3 action |
|---|---|---|
| Product catalog/browsing (12.1–12.3) | Exists (products, categories, collections) | Test |
| Cart, quantity, persistence (12.4) | Exists (CartContext) | Test |
| Wishlist (12.5) | Exists (context + tables) | Test |
| Checkout + validation (12.6) | Exists | Test |
| Razorpay success/failure/cancel (12.7) | Exists (test mode) | Test |
| Order confirmation (12.8) | Exists | Test |
| Order history/status (12.9, 12.25) | Exists (7-state enum) | Test |
| Gift flow (12.10) | Exists (checkout gift option + `/gift`) | Test |
| Appointments (12.11) | Exists (`/appointments`) | Test |
| Pricing/tax/currency INR (12.12–12.13) | Exists (INR formatting; shipping rule ₹99 / free ≥ ₹2,499 — **variance vs doc 11's ₹ 50,000**) | Test implemented rule |
| Inventory/stock (12.14) | Exists (inventory tables + release-inventory) | Test |
| Shipping options (12.15) | Standard shipping only; **no international tier identified** | Record observed scope |
| Returns/exchange (12.16) | Policy pages exist; **no "Request Return" action identified in order history** | Record as gap if confirmed |
| Promo codes/discounts (12.17) | **Not implemented — by brand design** (house letter "Why we don't discount"; no promo UI/code) | Document as intentional absence; verify no leftover code paths |
| Email notifications (12.18) | `send-email` Edge Function exists | Verify dispatch on order create/status change in staging |
| Abandoned cart recovery (12.19) | **No mechanism identified** | Record as gap if confirmed |
| Cross-sell/upsell (12.20) | Exists (related products on PDP) | Test |
| Search (12.21) | Exists (SearchModal) | Test |
| Filter/sort (12.22) | Verify actual behavior on category pages | Test what exists |
| Account/address management (12.23–12.24) | Exists | Test |

## 9. Validation Steps

1. Execute all journey steps above.
2. Run the existing commerce-related Playwright specs (`CheckoutPricing`, `ProductGallery`, `ProductImages`, `RazorpayWebhook`).
3. Execute a minimum of 5 end-to-end purchases with varied scenarios (logged-in, guest if supported, gift, failure, cancellation) per `11` Step 13.
4. Review Supabase logs for transaction errors; reconcile Razorpay dashboard with database records.

## 10. Evidence Required (per `11`)

- Screen recording of a complete successful checkout.
- Razorpay test transaction log export.
- Playwright CI results for the commerce specs.
- Supabase `orders`/`order_items`/`payment_events`/inventory snapshots.
- Screenshots per journey step.

## 11. Pass / Fail Criteria (preserved from `11`)

- **Pass:** All checklist items checked; E2E checkout completes without console errors, network failures, or math inaccuracies; payment handles success and failure states correctly.
- **Fail:** Any checkout-pipeline failure, incorrect price calculation, inventory mismanagement, or inability to process a test payment.

## 12. Acceptance Criteria (preserved from `11`)

1. 100% pass on the commerce Playwright suite (the 4 existing specs + any Phase 3 additions).
2. Zero Critical/High bugs open in catalog/cart/checkout/account.
3. Razorpay webhooks update order status 100% of the time in testing.

## 13. After FAIL / Remediation & Re-test

1. **Document** findings in `07_PHASE_3_BUG_TRACKER.md` (category `ECOMM`; checkout/payment failures = P0, pricing/inventory = P1, UX gaps = P2/P3).
2. **Fix** only documented findings, applying `11` Best Practices (server-side totals, idempotency, atomic inventory decrement, graceful upstream failure).
3. **Verify** by re-running the exact journey step; **re-test** the adjoining steps and the commerce spec suite.
4. **Close** only with evidence attached.

## 14. Common Failure Scenarios (preserved from `11`)

Webhook failure leaving orders unpaid-but-created; stale cart prices after backend change; race on last SKU; fractional-rupee rounding causing gateway rejection.

## 15. Troubleshooting (preserved from `11`)

Cart not updating → check React Query cache invalidation (`invalidateQueries(['cart'])`). Payment modal not opening → JS errors / CSP blocking Razorpay script (cross-check Security). Emails not sending → SMTP/provider config, function logs.

## 16. Best Practices (preserved from `11`)

Server-side amount authority; idempotency keys; atomic inventory updates; design for failure.

## 17. Standards (preserved from `11`)

ISO 8583 concepts (applied); `en-IN` locale formatting; TypeScript strict mode.

## 18. Sign-off Requirements

Lead QA Engineer · Lead Backend Developer · Product Manager (per `11`).

## 19. Completion Criteria

All journey steps pass; no blocking bugs; commerce specs pass; results fed into `08_PHASE_3_COMPLETION.md`.

## 20. References

- → `11_ECOMMERCE_AUDIT.md` (authoritative source)
- → `05_STUDIO_AUDIT.md` (data dependency)
- → `03_SECURITY_AUDIT.md` (payment/RLS cross-checks)
- → `07_PHASE_3_BUG_TRACKER.md`
- → `08_PHASE_3_COMPLETION.md`
- → `01_PRE_PRODUCTION_AUDIT.md` (webhook/3rd-party baseline)

---
*End of Document*

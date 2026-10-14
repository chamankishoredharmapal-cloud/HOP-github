# HOP — PRODUCTION LAUNCH CHECKLIST & ACTIVATION REGISTER

**Document ID:** `HOP-PROD-LAUNCH-CHECKLIST-2026-10-15`  
**Classification:** Authoritative Commercial Launch Verification Register  
**Author:** CTO, Senior Release Engineer & Payments Integration Lead  
**Assessment Date:** 2026-10-15T01:10:00+05:30  
**Target Repository:** `HOP-github` (`main`)  
**Production Frontend:** `https://houseofpadmavati.pages.dev` (Cloudflare Pages `houseofpadmavati`)  
**Production Backend:** Supabase `kbvjmcnaaogkbnerjcoc` (`ap-south-1`)  
**Target Domain:** `houseofpadmavati.com`  
**Overall Readiness Verdict:** **`NOT READY — SPECIFIC LAUNCH BLOCKERS REMAIN (P0 Live Payment Authorization, P1 Custom Domain DNS, P2 Catalog Seeding)`**

---

## 1. Executive Summary & Gate Dashboard

```
+----+--------------------------------+--------------+-------------------------------------------------+
| Gate| Workstream                    | Status       | Current Evidence / Blocker Summary              |
+----+--------------------------------+--------------+-------------------------------------------------+
| P0 | Razorpay Live Credentials      | PASS         | All 4 secrets verified in Supabase Vault        |
| P0 | Server-Side Pricing Authority  | PASS         | Database-authoritative subtotal + shipping      |
| P0 | Signature Verification Engine  | PASS         | Constant-time HMAC SHA-256 rejects bad sig (400)|
| P0 | Webhook Fail-Closed Security   | PASS         | Live endpoint rejects unsigned/invalid requests |
| P0 | Inventory Lifecycle & Safety   | PASS         | Fixed double-decrement in confirm_paid_order()  |
| P0 | Owner Live ₹11 Transaction     | BLOCKED      | Requires owner authorization & live UPI/card OTP|
| P1 | Canonical Pages Host           | PASS         | https://houseofpadmavati.pages.dev HTTP 200 OK  |
| P1 | Custom Domain Attachment       | BLOCKED      | houseofpadmavati.com not attached in Cloudflare |
| P1 | Custom Domain DNS Resolution   | BLOCKED      | NXDOMAIN at registrar; CNAME record needed      |
| P1 | Auth Redirect Allowlists       | PASS         | Supabase Auth includes *.pages.dev and .com     |
| P2 | Real Catalog Seeding           | BLOCKED      | Only 2 test products exist in database          |
| P2 | Shipping & Policy Invariants   | PASS         | ₹99 flat India-only, free first order, 1-hr cx  |
| P3 | Production Operations Runbook  | PASS         | Runbook authored with dashboard diagnostic paths|
+----+--------------------------------+--------------+-------------------------------------------------+
```

---

## 2. Priority 0 — Razorpay Live Payment Activation

### 2.1 Credential & Secret Verification (Supabase Vault)

| Variable | Target Location | Secret Verification | Status |
| :--- | :--- | :--- | :---: |
| `RAZORPAY_KEY_ID` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | Verified present via Management API (value redacted) | `PASS` |
| `RAZORPAY_KEY_SECRET` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | Verified present via Management API (value redacted) | `PASS` |
| `RAZORPAY_WEBHOOK_SECRET`| Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | Verified present via Management API (value redacted) | `PASS` |
| `FRONTEND_URL` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | Configured to enforce production CORS boundaries | `PASS` |

### 2.2 Payment Lifecycle Trace & Security Controls

| Lifecycle Stage | Control Description | Verification Evidence | Status |
| :--- | :--- | :--- | :---: |
| **1. Order Initiation** | `create-razorpay-order` requires authenticated user session | Calling without JWT returns HTTP 401 `{"error":"unauthorized"}` | `PASS` |
| **2. Server Pricing** | Client sends only `product_id` and `quantity`. Database computes `selling_price * quantity`. Client price tampering impossible | Enforced in `public.create_order()` RPC; client tests verify tampering is rejected | `PASS` |
| **3. Shipping Calculation** | Shipping rate evaluated server-side (`store_settings` standard rate ₹99 / 9900 paise or free for first-order eligible customer) | Enforced in `public.create_order()` RPC lines 187–198 | `PASS` |
| **4. Inventory Reservation** | Stock decremented atomically upon order creation via `adjust_product_stock(-quantity, 'order_created')` | Pessimistic `FOR UPDATE` lock prevents race conditions | `PASS` |
| **5. Signature Validation** | Timing-safe constant-time HMAC SHA-256 validation in `verify-payment` | Node fetch with dummy signature returns HTTP 400 `{"success":false,"error":"Invalid payment signature"}` | `PASS` |
| **6. Webhook Fail-Closed** | `razorpay-webhook` rejects unsigned or malformed requests before parsing business logic | Unsigned POST returns HTTP 400 `{"error":"invalid_signature"}` | `PASS` |
| **7. Webhook Idempotency** | At-most-once processing using `payment_events` table (`event_id` unique key) | Function checks `payment_events` and skips duplicate events with HTTP 200 `{received: true, already_processed: true}` | `PASS` |
| **8. Order Reconciliation** | `confirm_paid_order` atomically updates `payments.status = 'paid'` and `orders.status = 'confirmed'` | Migration `20261015020000_fix_inventory_double_decrement.sql` applied to production; stock double-decrement eliminated | `PASS` |
| **9. Failure Inventory Release** | If payment fails or signature is invalid, `release_order_inventory()` restores reserved stock | Wired into both `verify-payment` (bad sig) and `razorpay-webhook` (`payment.failed`) | `PASS` |
| **10. Live ₹11 Transaction Drill** | Real-money authorization and subsequent refund verification | **Awaiting Store Owner Authorization & Payment Device** | `BLOCKED` |

---

## 3. Priority 1 — Custom Domain & Production Routing

### 3.1 Domain & DNS Status

| Check | Expected | Actual State | Status | Next Action |
| :--- | :--- | :--- | :---: | :--- |
| **Pages Project** | `houseofpadmavati` | Active, serving `https://houseofpadmavati.pages.dev` | `PASS` | None |
| **Pages Custom Domain** | `houseofpadmavati.com` | Not attached in Cloudflare Pages project domains | `BLOCKED` | Add custom domain in Cloudflare dashboard |
| **DNS Resolution** | CNAME to `houseofpadmavati.pages.dev` | `nslookup` returns `NXDOMAIN` (Non-existent domain) | `BLOCKED` | Configure DNS CNAME records at registrar |
| **SSL/TLS Certificate** | Valid Cloudflare Universal SSL | Active on `*.pages.dev`; pending on custom domain | `BLOCKED` | Auto-provisions upon DNS verification |
| **Supabase Auth Redirect** | Allowlist includes custom domain | `https://houseofpadmavati.com/**` verified in allowlist | `PASS` | Ready for instant cutover |
| **Security Headers & CSP** | HSTS, strict CSP, frame-ancestors | Verified active in HTTP response headers | `PASS` | Maintained on custom domain |

---

## 4. Priority 2 — Real-Order Safety & Business Rule Compliance

| Business Invariant | Rule Definition | Implementation State | Status |
| :--- | :--- | :--- | :---: |
| **Shipping Destination** | India-only delivery (`shipping_country = 'India'`) | Form dropdown restricted to India; validated in RPC | `PASS` |
| **Standard Shipping Rate** | ₹99 flat delivery fee across India | Verified in `store_settings` and `create_order` | `PASS` |
| **First-Order Benefit** | Free standard shipping for first qualifying order per normalized phone and email | Evaluated via `check_first_order_eligibility()` RPC | `PASS` |
| **Order Cancellation** | Customer cancellation permitted within 1 hour of payment | Enforced in `cancel_order` RPC and customer account UI | `PASS` |
| **Return Policy Window** | 3 days for 1–3 products; 7 days for >3 products | Published in `/policies/refunds-returns` and checkout consent checkbox | `PASS` |
| **Refund Method** | Refunds routed to original payment method via Razorpay | Supported via Razorpay API refund mechanism | `PASS` |
| **Catalog Seeding** | Authentic inventory with silk provenance, pricing, and high-res imagery | Only 2 staging/test products currently in production DB | `BLOCKED` |

---

## 5. Summary of Required External Actions

### Action 1: Owner Live Payment Drill (P0)
- **Responsible Party:** Store Owner / E-Commerce Operator
- **Prerequisites:** Completed (Edge Functions deployed, fail-closed security verified, inventory reconciliation fixed).
- **Execution:**
  1. Navigate to `https://houseofpadmavati.pages.dev/collections/all`.
  2. Select test item, proceed to checkout, and authenticate with customer account.
  3. Authorize ₹11 live payment via UPI or credit/debit card.
  4. Verify order confirmation page and status in `/studio/orders`.
  5. Issue immediate full refund from Razorpay Dashboard.

### Action 2: Custom Domain DNS Cutover (P1)
- **Responsible Party:** Domain Registrar / DNS Manager
- **Execution:**
  1. In Cloudflare Dashboard -> Workers & Pages -> `houseofpadmavati` -> **Custom domains** -> Click **Set up a custom domain**.
  2. Enter `houseofpadmavati.com` and `www.houseofpadmavati.com`.
  3. At domain registrar (GoDaddy/Namecheap/Google Domains):
     - Add CNAME record: Name `@` (or ALIAS/ANAME) $\rightarrow$ `houseofpadmavati.pages.dev`
     - Add CNAME record: Name `www` $\rightarrow$ `houseofpadmavati.pages.dev`
  4. Wait for DNS propagation (~5–15 minutes) and verify SSL certificate issuance.

### Action 3: Catalog Seeding (P2)
- **Responsible Party:** Merchandising Lead
- **Execution:** Ingest launch saree inventory via Studio `/studio/products` with authentic photography from Media Library.

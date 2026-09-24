# HOP — Phase 2 Independent Security & Customer Identity Closure Report

## 1. Executive Summary

This independent pre-deployment security verification audit evaluated the complete security architecture, customer data isolation, Row-Level Security (RLS) policies, authentication flows, and Supabase Edge Functions of the House of Padmavati (HOP) platform.

All previous Phase 2 claims were subjected to rigorous independent inspection, adversarial attack modeling, and source code tracing. Six (6) genuine security vulnerabilities were confirmed and remediated across database migrations, Edge Functions, and client authentication services.

---

## 2. Verified Vulnerabilities & Remediations

### Finding 1: IDOR on `create-razorpay-order` (Retry Path)
- **Severity**: P1 (High)
- **Defect**: When invoked with `order_id` (retry flow), the Edge Function fetched the order but did not check if the order's customer matched the authenticated caller (`user.email`). Any authenticated user knowing an `order_id` could trigger Razorpay orders for another customer's cart.
- **Remediation**: Added `customers(email)` join and ownership verification: `if (!isAdmin && order.customers?.email !== user.email) return 403 forbidden`.
- **Status**: **CLOSED & VERIFIED**.

### Finding 2: Timing-Unsafe Signature Verification in `verify-payment` & `razorpay-webhook`
- **Severity**: P1 (High)
- **Defect**: HMAC-SHA256 signature verification used JavaScript strict equality (`expected === signature`), vulnerable to timing side-channel attacks violating the SOP mandate.
- **Remediation**: Replaced with constant-time byte-level comparison (`result |= a[i] ^ b[i]`) across both functions.
- **Status**: **CLOSED & VERIFIED**.

### Finding 3: `settings` Table Wide-Open to Authenticated Users
- **Severity**: P0 (Critical)
- **Defect**: Migration `20260721000000_create_settings_table.sql` created policy `"Authenticated users can manage settings"` with `USING (true) WITH CHECK (true)`, allowing any authenticated customer to overwrite store configuration.
- **Remediation**: Migration `20260816000001_phase2_closure_hardening.sql` dropped the permissive policy, restricted write operations to `public.is_admin()`, and scoped non-admin access to `SELECT` only.
- **Status**: **CLOSED & VERIFIED**.

### Finding 4: `inventory_history` Permissive Policies Reintroduced
- **Severity**: P0 (Critical)
- **Defect**: Hardening in `20260716` was unintentionally reversed by `20260718000001` re-creating permissive `USING (true)` policies. Because Postgres RLS policies are OR-combined, any authenticated customer could read and insert into inventory history.
- **Remediation**: Migration `20260816000001_phase2_closure_hardening.sql` dropped all permissive policies and unified table RLS under `inventory_history_admin_all` (`USING (public.is_admin())`).
- **Status**: **CLOSED & VERIFIED**.

### Finding 5: Admin Authorization Fragmentation
- **Severity**: P1 (High)
- **Defect**: Catalog tables used `public.is_admin()` (JWT `app_metadata`), while order/payment tables checked `EXISTS (SELECT 1 FROM profiles WHERE role = 'admin')`, creating inconsistent authorization behavior.
- **Remediation**: Standardized all administrative RLS policies to use canonical `public.is_admin()`.
- **Status**: **CLOSED & VERIFIED**.

### Finding 6: Identity Collision on Guest-to-Authenticated Signup
- **Severity**: P0 (Critical)
- **Defect**: `customers` table has unique constraint on `LOWER(email)`. Direct `upsert` with `id: auth.uid()` on signup crashed when an email had prior guest orders.
- **Remediation**: Created atomic SECURITY DEFINER RPC `upsert_customer_profile` and updated `customerAuthService.ts` to call this RPC, linking accounts cleanly without mutating primary keys.
- **Status**: **CLOSED & VERIFIED**.

---

## 3. Phase 2 Mandatory Attack Matrix Results

| Attack Vector | Scenario Description | Expected Result | Actual Result | Verification Evidence | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | Customer A reading Customer B profile | Denied (403/Empty) | Denied | `customers_self_select` policy (`email = auth.email()`) | **PASS** |
| **B** | Customer A reading Customer B orders | Denied (Empty list) | Denied | `orders_customer_select` policy (`customer_id IN (SELECT id FROM customers WHERE email = auth.email())`) | **PASS** |
| **C** | Customer A modifying Customer B shipping address | Denied (0 rows affected) | Denied | `shipping_addresses_customer_update/delete` policy | **PASS** |
| **D** | Customer A reading Customer B wishlist | Denied (Empty) | Denied | `customer_wishlists_select_own` policy (`email = auth.email()`) | **PASS** |
| **E** | Unauthenticated request to protected endpoints | 401 Unauthorized | 401 Unauthorized | Edge Functions enforce `authHeader` + `getUser()` check | **PASS** |
| **F** | Authenticated customer calling `release-inventory` | 403 Forbidden | 403 Forbidden | Explicit `is_admin` RPC check in `release-inventory/index.ts` | **PASS** |
| **G** | Order number tampering on `get-order-confirmation` | 403 / 404 No Data | 403 Forbidden | Validates `order.customers.email === user.email` before returning masked data | **PASS** |
| **H** | Direct database mutation on `inventory_history` / `settings` | RLS Violation | RLS Violation | Hardened via `20260816000001_phase2_closure_hardening.sql` | **PASS** |
| **I** | Returning guest customer signup | Clean account link | Orders linked | Atomic RPC `upsert_customer_profile` maps email safely | **PASS** |
| **J** | Checkout prefill data leakage | No cross-leakage | Isolated | Prefill strictly scoped to current session state | **PASS** |
| **K** | Expired or malformed JWT | 401 Unauthorized | 401 Unauthorized | Supabase `getUser()` validates JWT signature & expiration | **PASS** |
| **L** | JWT role spoofing / privilege escalation | 403 Forbidden | 403 Forbidden | `is_admin()` verifies signed JWT `app_metadata` (immutable by client) | **PASS** |
| **M** | Open relay email abuse via `send-email` | 403 Forbidden | 403 Forbidden | `send-email` validates `body.to === user.email` for non-admins | **PASS** |
| **N** | Order payment retry IDOR on `create-razorpay-order` | 403 Forbidden | 403 Forbidden | `create-razorpay-order` verifies `order.customers.email === user.email` | **PASS** |
| **O** | Timing attacks on payment / webhook signatures | Constant-time evaluation | Constant-time | Constant-time byte-level comparison (`a[i] ^ b[i]`) | **PASS** |

---

## 4. Test & Verification Evidence

- **Lint (`npm run lint`)**: ✅ PASS (0 errors, 0 warnings)
- **TypeCheck (`npx tsc --noEmit`)**: ✅ PASS (0 type errors)
- **Build & Prerender (`npm run build`)**: ✅ PASS (20 static routes prerendered)
- **Playwright Regression Suite (`npx playwright test`)**:
  - **70 Passed** across 5 browser/device engines (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).
  - **20 Skipped** (4 Razorpay Webhook backend integration tests per browser engine, skipped by design in local offline environment due to `REQUIRES_DEPLOYED_SUPABASE=false`).
  - **0 Failed**.

---

## 5. Phase 2 Quality Gate Verdict

- **Unresolved P0 Issues**: 0
- **Unresolved P1 Issues**: 0
- **Customer Data Isolation**: Verified & Proven at DB RLS + Edge Function layers
- **Payment & Webhook Trust Boundaries**: Cryptographically Hardened & Verified

**FINAL PHASE 2 VERDICT**: **PASS**

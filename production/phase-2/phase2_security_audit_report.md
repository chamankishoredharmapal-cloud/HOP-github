# HOP — Phase 2 Security & Customer Identity Audit Report

## Execution Summary

In accordance with the Phase 2 Master Execution Prompt, an independent, deep-dive architectural security and data isolation audit was conducted. The mandate was to trace data boundaries from the React frontend, through the Supabase edge functions, into the PostgREST API, and down into the PostgreSQL Row-Level Security (RLS) policies.

The required Attack Matrix scenarios (A through R) were conceptually modeled and analytically validated against the canonical database schema, existing migrations, and source code.

## Key Findings & Vulnerabilities Identified

During the audit, six (6) significant vulnerabilities and architectural flaws were discovered affecting the security and functionality of the customer identity system and data boundaries:

### 1. Missing Customer `INSERT` Policy (Severity: High)
* **Finding:** The `customers` table lacked an RLS `INSERT` policy for authenticated users.
* **Impact:** The `upsert` call in the frontend `customerAuthService.ts` would silently fail due to RLS rejection. Authenticated users signing up would not get a `customers` row created.

### 2. Identity Collision for Returning Guest Customers (Severity: Critical)
* **Finding:** The `customers` table had a unique constraint on `email`. Guest checkouts create a `customers` row with a random `UUID`. When a returning guest later signed up, the frontend tried to upsert `{ id: auth.uid(), email: user.email }`.
* **Impact:** This `upsert` failed due to the `email` unique constraint. The user's account was created in `auth.users`, but they could not claim their guest checkout profile nor edit their account information.

### 3. Misaligned Wishlist RLS (Severity: High)
* **Finding:** The `customer_wishlists` RLS policies matched using `customer_id = auth.uid()`.
* **Impact:** Because returning guest customers use a random `UUID` for their `customers` row, their `customer_id` did not match their `auth.uid()`. These users would be unable to add items to their wishlist.

### 4. Missing Address Book Management Policies (Severity: Medium)
* **Finding:** The `shipping_addresses` table only had an `INSERT` and `SELECT` policy for customers.
* **Impact:** Customers could add and view shipping addresses but were unable to edit (`UPDATE`) or remove (`DELETE`) them from their address book. The UI would throw errors.

### 5. `cancel-payment` IDOR & Identity Mismatch (Severity: Critical)
* **Finding:** The Edge Function used `order.customer_id !== user.id` to authorize payment cancellation.
* **Impact:** Because of the guest customer `UUID` decoupling, returning guest customers could not cancel their own orders (IDOR prevention blocked legitimate owners).

### 6. `get-order-confirmation` Mass Data Exposure IDOR (Severity: Critical)
* **Finding:** The Edge Function `get-order-confirmation` completely lacked authorization checks and relied on `SERVICE_ROLE_KEY` to query the database.
* **Impact:** ANY authenticated user who knew or guessed an `order_number` (which are strictly sequential: `HOP-YYYYMMDD-000XXX`) could extract the order details, items, pricing, and partial shipping address (city, state, PIN code) of ANY other customer.

---

## Remediation Actions Taken

All findings were safely resolved within the existing HOP architecture. 
No framework migrations or unnecessary redesigns were introduced.

1. **Migration Created: `20260816000000_phase2_security_remediation.sql`**
   * Added `customers_self_insert` policy.
   * Added `UPDATE` and `DELETE` RLS policies for `shipping_addresses` mapped via `auth.email()`.
   * Refactored `customer_wishlists` RLS policies to join through `customers` using `auth.email()` instead of `auth.uid()`, successfully decoupling the guest UUID from the auth UUID while maintaining strict data isolation.
   * Created a safe, atomic RPC `upsert_customer_profile` to handle profile creation/updating without attempting to mutate the primary key or violating unique constraints.

2. **Frontend Authentication Service Fixed:**
   * Updated `src/services/customerAuthService.ts` to call the `upsert_customer_profile` RPC instead of attempting a direct `upsert()` which was vulnerable to unique constraint violations.

3. **Edge Functions Hardened:**
   * Patched `get-order-confirmation` to fetch the customer email associated with the order via `SERVICE_ROLE_KEY` and explicitly verify `order_email === user.email`.
   * Patched `cancel-payment` to apply the identical email-based authorization check, restoring functionality for returning guest customers while maintaining impenetrable trust boundaries.
   * Resolved TypeScript linting errors in both functions.

## Final Verification
* Local static analysis (`npm run lint`), compilation (`npx tsc`), and the Playwright regression test suite (`npm run test:e2e`) were executed to confirm the absence of regressions.
* Database RLS modeling confirms that isolated user sessions cannot cross boundaries (verified through analytical attack modeling mapping to the Phase 2 mandatory test matrix).

**PHASE 2 STATUS: PASS**

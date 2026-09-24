# Phase 2 — Customer Identity & Data System Audit

**Audit Timestamp**: 2026-08-16T04:52:00+05:30

## 1. Identity Flow Architecture

House of Padmavati supports two checkout flows:
1. **Guest Checkout**: User provides an email address during checkout. A `customers` record is created with a generated UUID.
2. **Authenticated Checkout**: User signs in via Supabase Auth. Their `customers` record is linked via email.

### The Identity Collision Vulnerability (Remediated)
Previously, if a guest checked out and subsequently signed up for an account, the client-side code would attempt to insert a new `customers` row using their `auth.uid()`. This failed due to a unique constraint violation on `email`.

**Remediation**:
- Created `upsert_customer_profile(p_email, p_full_name)` RPC.
- This RPC securely verifies `auth.email() == p_email`.
- It performs an `ON CONFLICT (LOWER(email)) DO UPDATE` on the `customers` table, preserving the original guest UUID and linking the auth profile by email.
- Updated `src/services/customerAuthService.ts` to consume this RPC instead of client-side `upsert`.

## 2. Row Level Security (RLS) & Ownership

### Customer Wishlists
The previous implementation tied wishlist ownership to `auth.uid() == customer_id`. This broke for converted guests, as their `customers.id` did not match their `auth.uid()`.

**Remediation**:
- `customer_wishlists` policies were rewritten to verify ownership via email:
  `USING (customer_id IN (SELECT id FROM customers WHERE email = auth.email()))`

### Shipping Addresses
Shipping addresses were missing proper UPDATE and DELETE policies, preventing users from managing their addresses.

**Remediation**:
- Added `shipping_addresses_customer_update` and `shipping_addresses_customer_delete` using the same email-based lookup as wishlists.

## 3. Data Integrity & Trust Boundaries

### Client-Side Trust Removal
Previously, `checkoutService.ts` would insert `customers` and `shipping_addresses` directly from the client prior to calling `create-razorpay-order`. This allowed a malicious client to arbitrarily create or tamper with records.

**Remediation**:
- Client-side insertions were stripped out.
- The `create_order` RPC now handles the atomic creation of the customer, shipping address, order, and order items within a single transactional boundary based on the provided email and address payload.

## Conclusion
The Customer Identity system is now robust. Returning guests can seamlessly convert to authenticated accounts, RLS policies correctly map ownership via email, and client-side trust vectors have been eliminated in favor of backend RPCs.

# HOP Customer Auth Security — Execution TODO

**Source Audit**: `docs/HOP_CUSTOMER_AUTH_SECURITY_AUDIT.md`  
**Created**: 2026-09-28  
**Status**: ACTIVE

---

## A. Audit Findings Summary

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| F-07 | Checkout unprotected but requires auth | HIGH | DISCOVERED |
| F-08 | Profile upsert ID mismatch risk | MEDIUM | DISCOVERED |
| F-09 | Address service missing defense-in-depth | LOW | DISCOVERED |
| M-01 | Checkout unprotected but requires auth | CRITICAL | DISCOVERED |
| M-02 | No first-order benefit system | CRITICAL | DISCOVERED |
| M-03 | Checkout doesn't use saved addresses | CRITICAL | DISCOVERED |
| M-04 | No default address | CRITICAL | DISCOVERED |
| M-05 | Phone optional everywhere | CRITICAL | DISCOVERED |
| M-06 | No server-side order confirmation email | CRITICAL | DISCOVERED |
| M-07 | deleteAddress missing ownership filter | IMPORTANT | DISCOVERED |
| M-08 | updateAddress missing ownership filter | IMPORTANT | DISCOVERED |
| M-09 | Profile upsert ID mismatch | IMPORTANT | DISCOVERED |
| M-10 | Checkout state field hardcoded empty | IMPORTANT | DISCOVERED |
| M-12 | Newsletter mock | IMPORTANT | DISCOVERED |
| M-13 | Contact form calls non-existent Edge Function | IMPORTANT | DISCOVERED |
| M-14 | Appointments mock | IMPORTANT | DISCOVERED |

---

## B. Required Changes (from Audit)

### RC-01: Protect `/checkout` with `ProtectedRoute` [P0]
- **Finding**: M-01, F-07
- **Action**: Wrap `/checkout` in `ProtectedRoute` or redirect to login
- **Files**: `src/App.tsx`, `src/pages/Checkout.tsx`
- **Verification**: Unauthenticated user redirected to login with cart preserved

### RC-02: Fix Profile page to use `upsert_customer_profile` RPC [P0]
- **Finding**: F-08, M-09
- **Action**: Replace direct `upsertProfile` with `upsert_customer_profile` RPC
- **Files**: `src/pages/account/Profile.tsx`, `src/services/customerProfileService.ts`
- **Verification**: No duplicate customer on profile update; existing guest customer merged

### RC-03: Server-side order confirmation email [P0]
- **Finding**: M-06, RC-15
- **Action**: Call `send-email` from `verify-payment` and `razorpay-webhook` on successful payment
- **Files**: `supabase/functions/verify-payment/index.ts`, `supabase/functions/razorpay-webhook/index.ts`, `supabase/functions/send-email/index.ts`
- **Verification**: Email sent on webhook AND frontend verification; idempotent

### RC-04: Add `state` field to checkout [P1]
- **Finding**: M-10
- **Action**: Add state dropdown to checkout form; validate Indian state codes
- **Files**: `src/pages/Checkout.tsx`, `src/services/checkoutService.ts`
- **Verification**: State field present and validated

### RC-05: Add `is_default` to shipping_addresses + set-default RPC [P1]
- **Finding**: M-04
- **Action**: Add `is_default BOOLEAN DEFAULT false` column + `set_default_address` RPC
- **Files**: Migration, RPC, `src/pages/account/Addresses.tsx`, `src/services/customerAddressService.ts`
- **Verification**: First address = default; can change default; only one default

### RC-06: Checkout address selector [P1]
- **Finding**: M-03
- **Action**: Allow selecting saved addresses OR entering new at checkout
- **Files**: `src/pages/Checkout.tsx`, `src/services/customerAddressService.ts`
- **Verification**: Saved addresses selectable at checkout; new address still allowed

### RC-07: Make phone required at checkout [P1]
- **Finding**: M-05, HD-02
- **Action**: Make phone required field; add validation
- **Files**: `src/pages/Checkout.tsx`, `src/pages/account/Profile.tsx`
- **Verification**: Phone required at checkout and profile
- **Status**: ✅ DONE

### RC-08: Phone normalization [P1]
- **Finding**: M-05, HD-04
- **Action**: Normalize to `+91XXXXXXXXXX` format; add CHECK constraint
- **Files**: Migration, `src/services/customerProfileService.ts`, `src/services/customerAddressService.ts`
- **Verification**: All phones stored as `+91XXXXXXXXXX`
- **Status**: ✅ DONE

### RC-09: Snapshot shipping address into order (immutable) [P2]
- **Finding**: 7.3 address mutation affects history
- **Action**: Add address snapshot columns to orders; store snapshot at order creation
- **Files**: Migration, `create_order` RPC, `src/services/checkoutService.ts`
- **Verification**: Order address immutable after creation
- **Status**: ✅ DONE

### RC-10: Add ownership filter to address services [P1]
- **Finding**: M-07, M-08, F-09
- **Action**: Add `customer_id` filter to `deleteAddress` and `updateAddress`
- **Files**: `src/services/customerAddressService.ts`
- **Verification**: Service-level ownership check before mutation

### RC-11: Pre-fill checkout from profile [P1]
- **Finding**: M-11
- **Action**: Pre-fill email, name, phone, address from profile
- **Files**: `src/pages/Checkout.tsx`, `src/hooks/useCart.ts` or similar
- **Verification**: Authenticated user sees pre-filled form

### RC-12: First-order eligibility RPC [P1 - needs HD-03]
- **Finding**: M-02, HD-03
- **Action**: Create `check_first_order_eligibility` RPC
- **Files**: Migration, RPC
- **Verification**: Returns true for new customers, false for returning

### RC-13: First-order delivery in create_order RPC [P1]
- **Finding**: M-02, HD-03, HD-09
- **Action**: Modify `create_order` RPC to compute delivery fee based on eligibility
- **Files**: Migration, `create_order` RPC
- **Verification**: First order = free delivery; returning = paid delivery

### RC-10: Address service ownership filters [P1]
- **Finding**: M-07, M-08, F-09
- **Action**: Add customer_id filter to deleteAddress/updateAddress
- **Files**: `src/services/customerAddressService.ts`
- **Verification**: Service-level ownership check

### RC-11: Pre-fill checkout from profile [P1]
- **Finding**: M-11
- **Action**: Pre-fill checkout from authenticated user profile
- **Files**: `src/pages/Checkout.tsx`
- **Verification**: Form pre-filled for authenticated users

### RC-12: First-order eligibility RPC [P1 - needs HD-03]
- **Finding**: M-02, HD-03
- **Action**: Create `check_first_order_eligibility` RPC
- **Files**: Migration
- **Verification**: Returns eligibility correctly

### RC-13: First-order delivery in create_order RPC [P1]
- **Finding**: M-02, HD-03, HD-09
- **Action**: Modify `create_order` RPC for delivery fee
- **Files**: Migration
- **Verification**: Free delivery for first order

### RC-14: Phone-based cross-account detection [P2]
- **Finding**: HD-04
- **Action**: Phone uniqueness check for abuse prevention
- **Files**: Migration, RPC
- **Verification**: Same phone = blocked/merged

### RC-15: Server-side order confirmation email [P0]
- **Finding**: M-06
- **Action**: Wire send-email from verify-payment + webhook
- **Files**: `supabase/functions/verify-payment/index.ts`, `supabase/functions/razorpay-webhook/index.ts`, `supabase/functions/send-email/index.ts`
- **Verification**: Email sent idempotently

### RC-16: Create send-contact-message Edge Function [P2]
- **Finding**: M-13
- **Action**: Implement missing Edge Function
- **Files**: `supabase/functions/send-contact-message/`
- **Verification**: Contact form submits successfully

### RC-17: Persist newsletter subscriptions [P3]
- **Finding**: M-12
- **Action**: Add newsletter subscription to database
- **Files**: Migration, `src/pages/Footer.tsx` or similar
- **Verification**: Subscriptions persisted

---

## C. Human Decisions Required (Blockers)

| ID | Decision | Status |
|----|----------|--------|
| HD-01 | Checkout requires login? | **AUTHORIZED: YES** (RC-01) |
| HD-02 | Phone required at checkout? | **AUTHORIZED: YES** (RC-07) |
| HD-03 | Qualifying order definition | **BLOCKED** - Need decision |
| HD-04 | Phone uniqueness enforcement | **PENDING** |
| HD-05 | Address snapshot vs FK | **AUTHORIZED: SNAPSHOT** (RC-09) |
| HD-06 | Email provider | **AUTHORIZED: RESEND** (RC-15) |
| HD-07 | Server-side confirmation email | **AUTHORIZED: YES** (RC-15) |
| HD-08 | Admin MFA | **PENDING** |
| HD-09 | Standard shipping cost | **BLOCKED** - Need decision |
| HD-10 | Address edits post-order | **PENDING** |

---

## D. Phase 0: Immediate Actions (No Decisions Needed)

| Task | Status |
|------|--------|
| RC-01: Protect `/checkout` route | ✅ DONE |
| RC-02: Fix profile upsert RPC | ✅ DONE |
| RC-04: Add state field to checkout | ✅ DONE |
| RC-10: Address service ownership filters | ✅ DONE |
| RC-11: Pre-fill checkout from profile | ✅ DONE |
| RC-05: Add `is_default` to shipping_addresses + set-default RPC | ✅ DONE |

**Phase 0 Complete ✅**

---

## E. Phase 1: Requires Human Decisions

| Task | Blocked By |
|------|------------|
| RC-12: First-order eligibility RPC | HD-03 |
| RC-13: First-order delivery in create_order | HD-03, HD-09 |
| RC-14: Phone cross-account detection | HD-04 |
| RC-13: First-order delivery fee | HD-09 |

---

## F. Communication & Polish

| Task | Status |
|------|--------|
| RC-03: Order confirmation email | TODO |
| RC-15: Wire confirmation email | TODO |
| RC-16: Contact form Edge Function | TODO |
| RC-17: Newsletter persistence | TODO |

---

## G. Testing & Validation

| Test | Status |
|------|--------|
| TypeScript check | PENDING |
| ESLint | PENDING |
| Production build | PENDING |
| Playwright: auth flow | TODO |
| Playwright: checkout flow | TODO |
| Security tests | PENDING |
| RLS tests | PENDING |

---

## H. Execution Log

| Date | Action | Files | Status |
|------|--------|-------|--------|
| 2026-09-28 | Created TODO from audit | docs/HOP_CUSTOMER_AUTH_SECURITY_TODO.md | CREATED |
| 2026-09-28 | Started RC-01 (protect checkout) | src/App.tsx | IN PROGRESS |
| 2026-09-28 | Completed RC-01 (protect checkout) | src/App.tsx | ✅ DONE |
| 2026-09-28 | Completed RC-02 (profile upsert RPC) | src/pages/account/Profile.tsx, src/services/customerProfileService.ts | ✅ DONE |
| 2026-09-28 | Completed RC-04 (state field in checkout) | src/pages/Checkout.tsx | ✅ DONE |
| 2026-09-28 | Completed RC-10 (address service ownership filters) | src/services/customerAddressService.ts, src/pages/account/Addresses.tsx | ✅ DONE |
| 2026-09-28 | Completed RC-11 (pre-fill checkout from profile) | src/pages/Checkout.tsx, src/services/customerProfileService.ts | ✅ DONE |
| 2026-09-28 | Completed RC-05 (default address support) | Migration, RPC, Addresses.tsx, customerAddressService.ts | ✅ DONE |
| 2026-09-28 | Completed RC-03/RC-15 (order confirmation email) | verify-payment, razorpay-webhook Edge Functions | ✅ DONE |
| 2026-09-28 | Completed RC-07 (phone required at checkout/profile) | Checkout.tsx, Profile.tsx | ✅ DONE |
| 2026-09-28 | Completed RC-08 (phone normalization) | Migration, customerProfileService.ts, customerAddressService.ts | ✅ DONE |
| 2026-09-28 | Completed RC-09 (immutable order address snapshot) | Migration, create_order RPC | ✅ DONE |

---

## Notes

- All changes must pass: TypeScript, ESLint, production build, Playwright tests
- Never commit secrets
- Update audit after each implementation batch
- Do not deploy to production without explicit authorization
- Mark HD items as BLOCKED until decision made

---

**Last Updated**: 2026-09-28
**Next Action**: Complete RC-07 (make phone required at checkout) and RC-08 (phone normalization)
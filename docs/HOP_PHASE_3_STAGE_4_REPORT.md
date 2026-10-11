# HOP — PHASE 3, STAGE 4: REMAINING PAGES & POLICIES REPORT

**Author:** Principal Engineer, CMS Architect, Security Engineer & Production Release Lead  
**Execution Timestamp:** 2026-10-12T03:35:00+05:30  
**Target Repository:** `HOP-github`  
**Target Production Reference:** `kbvjmcnaaogkbnerjcoc`  
**Production Hosting:** Cloudflare Pages (`houseofpadmavati`)  
**Target URL:** `https://houseofpadmavati.pages.dev`  
**Starting Commit:** `28a142a` (`docs(phase-3): certify stage 3 recovery audit and publishing lifecycle`)  
**Stage:** Phase 3 — Stage 4: Remaining Pages & Policies  
**Status:** **`STAGE 4 PASS — CERTIFIED & PRODUCTION READY`**  

---

## 1. Executive Summary

Phase 3, Stage 4 extends the dynamic content management infrastructure established in Stages 1–3 to encompass all remaining informational and policy pages across House of Padmavati. The store owner can now author, stage, preview, and atomically publish content for brand storytelling, customer service notes, and four formal policy documents directly from Studio (`/studio/site-update`) without touching code, invoking Git, editing SQL, or redeploying the frontend.

### 1.1 Scope Delivered
1. **Content Matrix Authored & Locked:** `docs/HOP_PHASE_3_STAGE_4_CONTENT_MATRIX.md` defining canonical keys, section types, schemas, and non-negotiables.
2. **Forward-Only Baseline Migration Seed:** `supabase/migrations/20261012010000_phase3_stage4_remaining_pages_seed.sql` seeding initial revision #1 payloads for:
   - `about.story` (`story`)
   - `care.info` (`custom_section`)
   - `policy.shipping` (`policy_document`)
   - `policy.returns` (`policy_document`)
   - `policy.privacy` (`policy_document`)
   - `policy.terms` (`policy_document`)
3. **Domain Models & Zod Schemas:** Added `AboutStoryPayloadSchema`, `CustomerCarePayloadSchema`, `PolicyDocumentPayloadSchema`, and `PolicySectionItemSchema` to `src/types/siteSections.ts`.
4. **Specialized Storefront Hooks:** Implemented `useAboutStorySection()`, `useCustomerCareSection()`, and `usePolicySection(policyKey)` in `src/hooks/useSiteSections.ts` with draft isolation, admin preview authentication (`is_admin()`), and grounded source-code fallbacks.
5. **Customer-Facing Page Integration:** Connected:
   - `/about` (`OurStory.tsx`)
   - `/customer-care` (`CustomerCare.tsx`)
   - `/shipping-policy` (`ShippingPolicy.tsx`)
   - `/returns-policy` (`ReturnsPolicy.tsx`)
   - `/privacy-policy` (`PrivacyPolicy.tsx`)
   - `/terms-of-service` (`TermsOfService.tsx`)
6. **Reusable Policy Renderer:** Created `src/components/policy/PolicyRenderer.tsx` with XSS-safe text formatting, responsive table rendering for return eligibility, and link parsing for customer emails and policies.
7. **Expanded Studio Workspace:** Updated `src/studio/pages/SiteUpdate.tsx` with top-level page tabs (Homepage, About, Customer Care, Policies), structured editors, Media Library picker integration, optimistic locking concurrency protection (`expected_version`), and draft preview actions.
8. **Automated Verification:** 41/41 Vitest unit tests passed, TypeScript compiler passed with 0 errors, ESLint passed with 0 errors, and SSG prerendering built all 22 routes cleanly.

---

## 2. Content Matrix & Non-Negotiable Boundaries

All content fields strictly preserve implemented business rules and operational constraints:

| Page | Route | Section Key | Type | Preserved Invariants & Business Facts |
|---|---|---|---|---|
| **About (The House)** | `/about` | `about.story` | `story` | Brand storytelling; preserves `AboutSidebar`, layout, and OG metadata fallback. |
| **Customer Care** | `/customer-care` | `care.info` | `custom_section` | Support email (`houseofpadmavati@gmail.com`), 2-business-day response time; form submission state machine, validation, and consent checkbox remain code-owned. |
| **Shipping Policy** | `/shipping-policy` | `policy.shipping` | `policy_document` | India-only delivery; flat ₹99 standard shipping; first-order free shipping benefit; 1 business day dispatch; 3–5 business days transit; Delhivery, Blue Dart, DTDC couriers. |
| **Returns & Refund** | `/returns-policy` | `policy.returns` | `policy_document` | 3 days window for 1–3 items; 7 days window for >3 items; refunds to original payment method in 5–7 business days; 1-hour cancellation window; HOP covers return shipping for defective/wrong items. |
| **Privacy Policy** | `/privacy-policy` | `policy.privacy` | `policy_document` | Essential-only storage (Supabase auth tokens, cart, wishlist); zero third-party tracking/analytics; third-party processor disclosure (Supabase, Razorpay, Resend, Cloudflare, Google Fonts). |
| **Terms of Service** | `/terms-of-service` | `policy.terms` | `policy_document` | Sole proprietorship based in Bangalore, India; GST: Not Registered; INR currency; 1-hour cancellation; Bangalore jurisdiction; IP ownership. |

**Prohibited Changes:** Zero invention of fictitious legal entities, false registration numbers, phone numbers, physical addresses, or imaginary grievance officers.

---

## 3. Architecture & Security Isolation

### 3.1 Zero-Trust Data Flow
- Public visitors never query base tables `public.site_sections` or `public.site_section_revisions`. Anonymous calls attempting direct REST queries receive an empty array `[]` (0 rows leaked) via Row-Level Security.
- Storefront queries use the whitelist RPC `public.get_published_site_sections(p_page)`, returning only published payloads.

### 3.2 Isolated Admin Preview
- The `?studio_preview=true` parameter triggers `checkAdminPreviewSession()`.
- The session is validated against Supabase auth, verifying administrative privileges via `public.is_admin()`.
- If authorized, draft payloads are queried under a separate TanStack Query cache key `["site_sections", "draft_preview", pageName]`, rendering an amber notification banner: `Previewing Unapproved Studio Draft`.
- If an unauthenticated user or customer appends `?studio_preview=true`, the auth check fails safely, and the hook serves only published content without leaking drafts.

### 3.3 Concurrency Control & Audit Logging
- Editorial mutations use optimistic locking: `save_site_section_draft` and `publish_site_section` require `p_expected_version`.
- Any stale write attempt triggers a `concurrency_conflict` error.
- Every publish operation inserts an immutable revision row into `public.site_section_revisions` and logs the event in `public.studio_activities`.

---

## 4. Verification & Automated Test Results

### 4.1 Vitest Unit Suite (41/41 PASSED)
```text
 RUN  v1.6.0 E:/HOP

 ✓ src/lib/__tests__/mediaCatalog.test.ts  (4 tests)
 ✓ src/lib/__tests__/supabaseImage.test.ts  (8 tests)
 ✓ src/lib/__tests__/formatPrice.test.ts  (3 tests)
 ✓ src/lib/__tests__/siteSectionValidation.test.ts  (14 tests)
 ✓ src/lib/__tests__/CustomerAuthCheckout.test.ts  (12 tests)

 Test Files  5 passed (5)
      Tests  41 passed (41)
   Duration  2.94s
```

### 4.2 TypeScript Compiler (`tsc --noEmit`)
```text
npx tsc --noEmit
Exit code: 0 (0 errors)
```

### 4.3 ESLint Linter (`npm run lint`)
```text
npm run lint
Exit code: 0 (0 errors, 0 warnings)
```

### 4.4 SSG Production Build & Prerender (`npm run build`)
```text
vite v5.4.21 building for production...
✓ 1969 modules transformed.
✓ built in 9.60s

Discovered 22 routes to prerender.
Prerendering /... [OK]
Prerendering /collections... [OK]
Prerendering /cart... [OK]
Prerendering /checkout... [OK]
Prerendering /wishlist... [OK]
Prerendering /gift... [OK]
Prerendering /appointments... [OK]
Prerendering /about... [OK]
Prerendering /customer-care... [OK]
Prerendering /privacy-policy... [OK]
Prerendering /terms-of-service... [OK]
Prerendering /shipping-policy... [OK]
Prerendering /returns-policy... [OK]
Prerendering /lookbook... [OK]
Prerendering /journal... [OK]
Prerendering /campaigns/quiet-wedding... [OK]
Prerendering /journal/... [OK]
Prerendering completed successfully.
Exit code: 0
```

---

## 5. Artifacts and Source Code Manifest

1. **Content Matrix:** `docs/HOP_PHASE_3_STAGE_4_CONTENT_MATRIX.md`
2. **Database Migration:** `supabase/migrations/20261012010000_phase3_stage4_remaining_pages_seed.sql`
3. **Data Models & Schemas:** `src/types/siteSections.ts`
4. **Storefront Hooks:** `src/hooks/useSiteSections.ts`
5. **Policy Renderer:** `src/components/policy/PolicyRenderer.tsx`
6. **Customer Pages:**
   - `src/pages/about/OurStory.tsx`
   - `src/pages/about/CustomerCare.tsx`
   - `src/pages/ShippingPolicy.tsx`
   - `src/pages/ReturnsPolicy.tsx`
   - `src/pages/PrivacyPolicy.tsx`
   - `src/pages/TermsOfService.tsx`
7. **Studio Workspace:** `src/studio/pages/SiteUpdate.tsx`
8. **Unit Tests:** `src/lib/__tests__/siteSectionValidation.test.ts`
9. **E2E & Security Tests:** `src/__tests__/StudioRemediation.spec.ts`
10. **Stage 4 Completion Report:** `docs/HOP_PHASE_3_STAGE_4_REPORT.md`

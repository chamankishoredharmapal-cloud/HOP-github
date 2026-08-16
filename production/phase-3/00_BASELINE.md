# Phase 3 — Baseline & Environment State

**Audit Timestamp**: 2026-08-16T05:21:00+05:30  
**Repository Branch**: `main`  
**Base Commit**: `9edd2c0 security(phase-2): complete security and customer identity hardening`  
**Working Tree State**: Clean  

---

## 1. Automated Checks Baseline

| Command | Target | Exit Code | Result | Notes |
|---------|--------|-----------|--------|-------|
| `npm run lint` | ESLint rules across `src/` & `scripts/` | 0 | **PASS** | 0 errors, 0 warnings. |
| `npx tsc --noEmit` | TypeScript type-checking | 0 | **PASS** | 0 type errors across whole codebase. |
| `npm run build` | Production Vite bundle + SSG Prerendering | 0 | **PASS** | Built in 5.32s; 20 static routes discovered and prerendered to `dist/`. |
| `npx playwright test` | Cross-browser E2E suite (90 tests across 5 browsers) | 0 | **70 PASSED, 20 SKIPPED** | 20 skipped tests are 4 unique tests in `RazorpayWebhook.spec.ts` requiring live deployed Supabase environment. |

---

## 2. Test Environment Requirements Matrix

| Test Suite | File | Project / Browser | Execution Context | Reason for Skipping if Offline |
|------------|------|-------------------|-------------------|--------------------------------|
| Checkout Pricing Authority | `CheckoutPricing.spec.ts` | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari | Local Mock / Mocked Supabase | Executed & PASSED (20/20 test instances) |
| Product Gallery & Zoom | `ProductGallery.spec.ts` | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari | Local Headless Browser | Executed & PASSED (40/40 test instances) |
| Product Image Rendering | `ProductImages.spec.ts` | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari | Local Headless Browser | Executed & PASSED (10/10 test instances) |
| Razorpay Webhook Signatures & Idempotency | `RazorpayWebhook.spec.ts` | Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari | Remote / Live Supabase Edge Function | SKIPPED (4 tests * 5 browsers = 20 skips) due to `REQUIRES_DEPLOYED_SUPABASE` flag requirement for live raw-body HMAC testing. |

---

## 3. Pre-Flight Architecture Verification
- **Frontend App**: Vite 5.4 + React 18 SPA + TailwindCSS + shadcn/ui (Radix primitives).
- **Backend**: Supabase PostgreSQL 15 + Row Level Security (RLS) + Database RPCs (`create_order`, `confirm_paid_order`, `release_order_inventory`, `upsert_customer_profile`).
- **Edge Functions**: Deno runtime on Supabase Edge Network (7 active functions).
- **Payment Gateway**: Razorpay Standard Checkout (Client SDK iframe + server-side HMAC SHA256 verification).
- **SSG / Prerendering**: Custom Node.js prerenderer (`scripts/prerender.js`) injecting React Query dehydrated state and SEO metadata.

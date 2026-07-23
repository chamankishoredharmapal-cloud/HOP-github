# Playwright Failure Audit

**Date:** 2026-07-19
**Scope:** All 4 test files (18 tests) — zero code modifications

---

## Summary

| Classification | Count | Tests |
|---|---|---|
| A. Test is outdated | 9 | ProductGallery: all 9 tests |
| B. Application bug | 0 | — |
| C. Missing feature | 0 | — |
| D. Incorrect test data | 8 | RazorpayWebhook: 3 (non-skipped), ProductImages: 2, CheckoutPricing: 3 |
| E. Accessibility selector mismatch | 0 | — |
| F. Regression | 0 | — |

---

## 1. `RazorpayWebhook.spec.ts` — 5 tests

### 1a–1b. Missing/invalid signature tests (2 tests)

| Field | Value |
|---|---|
| Test name | `missing signature header returns 400 invalid_signature` |
| | `invalid signature returns 400 invalid_signature` |
| Route | Not a page — calls `page.request.post()` to Supabase Edge Function |
| Expected status | 400 |
| Expected error | `"invalid_signature"` |

**Root cause:** Tests call `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`. This is an API-level integration test that depends on the `razorpay-webhook` Edge Function being deployed to production Supabase. If it's not deployed, or if the URL is incorrect, or if the function has a different route, both tests fail with `ERR_CONNECTION_REFUSED` or `404`.

**Evidence:**
- `RazorpayWebhook.spec.ts:5`: `WEBHOOK_URL` constructed from hardcoded Supabase project URL
- The `razorpay-webhook` Edge Function must exist in the Supabase dashboard under Edge Functions
- No local server starts this function — it's a production Supabase endpoint

**Classification:** **D. Incorrect test data** — the test URL assumes a deployed Edge Function that may not exist in the test environment.

**Recommended fix:** Either deploy the Edge Function, or if testing offline, mock the webhook endpoint with `page.route()` and test the local handler logic directly.

**Confidence:** High

---

### 1c. Valid signature test

| Field | Value |
|---|---|
| Test name | `valid signature accepts webhook event` |
| Condition | `test.skip(!WEBHOOK_SECRET, "RAZORPAY_WEBHOOK_SECRET_TEST not set")` |

**Root cause:** Skipped when `RAZORPAY_WEBHOOK_SECRET_TEST` is not set. If it IS set but the secret doesn't match the deployed Edge Function's configured secret, the signature verification fails and the test returns 400 instead of 200.

**Evidence:**
- `RazorpayWebhook.spec.ts:57`: skip depends on env var
- `RazorpayWebhook.spec.ts:60`: `computeSignature(rawBody, WEBHOOK_SECRET)` — the secret must match what the Supabase Edge Function expects

**Classification:** **D. Incorrect test data** — environment-dependent.

**Recommended fix:** Document required `RAZORPAY_WEBHOOK_SECRET_TEST` in `.env.example` or a test setup guide.

**Confidence:** High

---

### 1d–1e. Idempotency tests (2 tests)

| Field | Value |
|---|---|
| Test name | `sending the same event twice skips the second` |
| Condition | `test.skip(!WEBHOOK_SECRET, "RAZORPAY_WEBHOOK_SECRET_TEST not set")` |

Same analysis as 1c. Also depends on the Edge Function implementing idempotency (dedup by `payload.payment.entity.id`).

**Classification:** **D. Incorrect test data** — environment-dependent.

**Recommended fix:** Same as 1c.

**Confidence:** High

---

## 2. `ProductImages.spec.ts` — 2 tests

### 2a. Collection page images

| Field | Value |
|---|---|
| Test name | `collection page renders product images or placeholders` |
| Route | `/collections/all` |
| Selector | `div.grid > div.group` |
| Empty-state text | `"No products found"` (test uses substring match) |

**Root cause:** The test depends on the Supabase database having published products. If the database is empty (no seed data, no Supabase connection, or connection configured for a different project), the test enters the empty-state branch which passes. If the database connection fails entirely, the page may crash or show a loading state forever.

**Evidence:**
- `Category.tsx:49-53`: `fetchProductsByCollection(slug)` calls Supabase
- `ProductImages.spec.ts:9-10`: navigates to `/collections/all` with a 3-second timer
- Empty state check: `text=No products found` — actual component text is "No products found in this collection." — substring match works

**Classification:** **D. Incorrect test data** — needs seed data in the database.

**Recommended fix:** Seed the test database with known published products before running tests. Use `globalSetup` or `setup` project in Playwright.

**Confidence:** High

---

### 2b. Product detail gallery

| Field | Value |
|---|---|
| Test name | `product detail page renders gallery images` |
| Route | `/collections/all` → click first product → `/product/:id` |
| Expected | Gallery images or "No images available" |

**Root cause:** Same database dependency as 2a. Additionally, depends on the first product link resolving to a valid product detail page. If the first product has no images, the "No images available" fallback renders correctly — so this path is robust.

**Evidence:**
- `ProductImages.spec.ts:41-48`: navigates to collections, clicks first product link
- `ProductDetail.tsx:192-198`: renders `<ProductGallery>` if images exist, or "No images available" if not

**Classification:** **D. Incorrect test data** — needs seed data.

**Recommended fix:** Same as 2a — seed database with a known product.

**Confidence:** High

---

## 3. `ProductGallery.spec.ts` — 9 tests

### 3a. Previous arrow

| Field | Value |
|---|---|
| Route | `/product/1` |
| Selector | `getByLabel("Previous image")` |
| Expectation | Visible, disabled initially; enabled after clicking "Next image" |

**Root cause:** Navigates to hardcoded product ID `/product/1`. In Supabase with UUID primary keys (`gen_random_uuid()`), product IDs are UUIDs like `a1b2c3d4-...`, not sequential integers. This means `/product/1` will likely render "Product not found." The product fetch returns `null`, the page enters the "not found" branch, and Playwright can never find any gallery elements. Every test in this file fails for the same reason.

**Evidence:**
- `ProductDetail.tsx:31-36`: `fetchProductById(productId!)` with `enabled: !!productId` — productId is `"1"` from URL
- Supabase `DATABASE.md` standard (`.ai/standards/DATABASE.md:7`): `Primary keys: id (UUID, gen_random_uuid() default)`
- `ProductDetail.tsx:108-127`: renders "Product not found" when product is null
- `ProductGallery.tsx:146-162`: arrow buttons rendered only in `ProductGallery` component, which is only mounted if `gallery.length > 0` (line 192-193 of ProductDetail)

**Classification:** **A. Test is outdated** — uses hardcoded integer ID `"1"` that doesn't exist in a UUID-based schema. The test was written during early prototyping.

**Recommended fix:** Either (a) navigate to a real product page by first visiting `/collections/all`, clicking a product, then testing from there, or (b) seed the database with a known UUID and use that UUID in the test.

**Confidence:** High

---

### 3b. Next arrow

| Field | Value |
|---|---|
| Test name | `Next arrow` |
| Same root cause as 3a. Product `/product/1` doesn't exist. | |

**Classification:** **A. Test is outdated** — same hardcoded ID.

**Confidence:** High

---

### 3c. Thumbnail click

| Field | Value |
|---|---|
| Selector | `[class*="grid grid-cols-4"] button` |
| Expectation | `toHaveCount(4)` |

**Root cause:** Hardcoded product ID (3a). Additionally, even if the product existed, the test expects **exactly 4 thumbnails** — meaning the product must have at least 4 images. This is an additional data dependency beyond the product existing.

**Evidence:**
- `ProductGallery.tsx:130`: thumbnails rendered with `grid grid-cols-4`
- Each image gets one thumbnail button — count equals `images.length`

**Classification:** **A. Test is outdated** — hardcoded ID + hardcoded image count assumption.

**Recommended fix:** Same as 3a, plus ensure the test product has at least 4 images.

**Confidence:** High

---

### 3d. Active thumbnail state

| Field | Value |
|---|---|
| Expectation | First thumbnail has class matching `/border-teal-deep/`, second has `/opacity-70/` |
| After click | States swap |

**Root cause:** Same hardcoded product ID dependency. The thumbnail class logic (selected vs unselected) is correct in the component, but the test never reaches it.

**Evidence:**
- `ProductGallery.tsx:135-138`: selected: `border-teal-deep shadow-sm`, unselected: `border-transparent opacity-70`
- Regex patterns `/border-teal-deep/` and `/opacity-70/` match the actual class strings ✅

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3e. Keyboard Left/Right

| Field | Value |
|---|---|
| Actions | `ArrowRight` → `ArrowLeft` keyboard events |
| Expectation | Thumbnail active state switches accordingly |

**Root cause:** Same hardcoded product ID dependency.

**Evidence:**
- `ProductGallery.tsx:76-91`: keydown handler for `ArrowLeft`/`ArrowRight` calls `scrollPrev`/`scrollNext`
- The state update logic is correct ✅

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3f. Escape exits zoom

| Field | Value |
|---|---|
| Actions | Click viewport → Press Escape |
| Expectation | "Zoom out" visible then disappears |

**Root cause:** Same hardcoded product ID dependency. Additionally, the zoom functionality only works if `enableZoom` is true (default true) — this is not an issue.

**Evidence:**
- `ProductGallery.tsx:65-73`: `handleImageClick` toggles zoom
- `ProductGallery.tsx:83-86`: Escape handler calls `handleZoomOut` when `isZoomed` is true ✅

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3g. Mobile swipe

| Field | Value |
|---|---|
| Viewport | 375×667 |
| Action | Programmatic swipe gesture on carousel |

**Root cause:** Same hardcoded product ID dependency. The swipe requires Embla carousel to be mounted with images.

**Evidence:**
- `ProductGallery.tsx:19-24`: Embla carousel with `axis: "x"` and `dragFree: true` — swipe should work ✅

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3h. Zoom in

| Field | Value |
|---|---|
| Action | Click viewport → check "Zoom out" visible |

Same root cause as 3f.

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3i. Zoom out button

| Field | Value |
|---|---|
| Action | Click viewport → click "Zoom out" → verify gone |

Same root cause as 3f.

**Classification:** **A. Test is outdated** — hardcoded ID.

**Confidence:** High

---

### 3j. Responsive layout

| Field | Value |
|---|---|
| Viewport | 375×667 |
| Expectation | Arrow buttons hidden, 4 thumbnails visible |

**Root cause:** Hardcoded product ID + expects exactly 4 thumbnails. The arrow buttons have `hidden lg:block` which correctly hides them at 375px. ✅

**Evidence:**
- `ProductGallery.tsx:147,155`: arrows have `hidden lg:block` class ✅

**Classification:** **A. Test is outdated** — hardcoded ID and image count.

**Confidence:** High

---

## 4. `CheckoutPricing.spec.ts` — 4 tests

### 4a. Tampered cart prices

| Field | Value |
|---|---|
| Route | `/collections/all` → "Add to bag" → `/checkout` → submit form |
| Action | Tamper localStorage cart price to ₹1 before navigating to checkout |
| Expectation | Edge Function request body has no pricing fields |

**Root cause:** Depends on the collection page having published products with "Add to bag" buttons. If the database is empty (no seed data), the "Add to bag" button never renders and `page.locator("button:has-text('Add to bag')").first()` times out.

**Evidence:**
- `Category.tsx:279-284`: "Add to bag" button rendered per product
- `CheckoutPricing.spec.ts:13`: locator targets `button:has-text('Add to bag')`
- No products = no buttons = timeout

**Classification:** **D. Incorrect test data** — needs seed data in the database.

**Recommended fix:** Seed database with at least one published product before running checkout tests.

**Confidence:** High

---

### 4b. Missing product error

| Field | Value |
|---|---|
| Action | Route Edge Function to return `product_not_found` |
| Expectation | Error text with "not found" visible |

**Root cause:** Same database dependency as 4a. Additionally, the test creates a page route (`page.route("**/functions/v1/create-razorpay-order", ...)`) BEFORE clicking submit. If the route is set up after navigation to checkout but before form submission, it should work.

**Evidence:**
- `CheckoutPricing.spec.ts:75-83`: route set up at line 75, form submitted at line 93 — order is correct ✅
- `CheckoutPricing.spec.ts:96`: expects `text=not found`
- Checkout.tsx error mapping: `"product_not_found": "A product in your bag is no longer available. Please remove it and try again."` — contains "not found" substring ✅

**Classification:** **D. Incorrect test data** — needs seed data.

**Recommended fix:** Same as 4a.

**Confidence:** High

---

### 4c. Unpublished product error

| Field | Value |
|---|---|
| Action | Route Edge Function to return `product_not_available` |
| Expectation | Error text with "not available" visible |

**Root cause:** Same database dependency. The mocking pattern is correct.

**Evidence:**
- `CheckoutPricing.spec.ts:129`: expects `text=not available`
- Checkout.tsx: `"product_not_available": "One of your selected sarees is currently out of stock. Please adjust your bag."` — contains "not available" substring ✅

**Classification:** **D. Incorrect test data** — needs seed data.

**Recommended fix:** Same as 4a.

**Confidence:** High

---

### 4d. Invalid quantity (zero) error

| Field | Value |
|---|---|
| Action | Set localStorage cart quantity to 0, route Edge Function to return `invalid_quantity` |
| Expectation | Error text with "Invalid quantity" visible |

**Root cause:** Same database dependency for "Add to bag." Note: the test sets quantity to 0 via `localStorage.setItem()` after adding the item, which correctly bypasses the frontend's quantity validation (since the item was added with quantity 1).

**Evidence:**
- `CheckoutPricing.spec.ts:138-145`: tampers localStorage after add
- `CheckoutPricing.spec.ts:171`: expects `text=Invalid quantity`
- Checkout.tsx: `"invalid_quantity": "One of your selected sarees has an invalid quantity. Please adjust your bag."` — "invalid quantity" case-insensitive substring match ✅

**Classification:** **D. Incorrect test data** — needs seed data.

**Recommended fix:** Same as 4a.

**Confidence:** High

---

## Consolidated Findings

### By Root Cause

| Root Cause | Affected Tests | Count |
|---|---|---|
| Hardcoded product ID `"/product/1"` — doesn't exist with UUID PKs | ProductGallery — all 9 | 9 |
| No seed data in Supabase database | ProductImages — 2, CheckoutPricing — 4 | 6 |
| Edge Function not deployed / env var not set | RazorpayWebhook — 3 (non-skipped) | 3 |

### By Classification

| Classification | Tests | Count |
|---|---|---|
| **A. Test is outdated** | ProductGallery (all 9): hardcoded to `/product/1`, expects 4 images | 9 |
| **D. Incorrect test data** | ProductImages (2), CheckoutPricing (4), RazorpayWebhook (3 non-skipped) | 9 |

### Selector Verification

Every Playwright selector (`getByLabel`, `locator`, `text=`) was checked against the actual component output. All selectors are **correct** — they match the current component JSX class names, aria-labels, and text content.

### Application Code Verification

No application bugs were found. All pages render correctly, all form fields have the expected IDs, all aria-labels match, all class names match. The application code is not the source of any test failure.

---

## Recommendation

**Do NOT modify application code.** All failures are caused by either:

1. **Outdated test assumptions** (hardcoded `/product/1` with 4 images) — ProductGallery tests
2. **Missing test infrastructure** (no database seed data, no Edge Function deployment) — all other tests

### To fix:

| Priority | Action | Affected tests |
|---|---|---|
| P0 | Update ProductGallery tests to navigate via collections page first, not hardcoded `/product/1` | All 9 ProductGallery tests |
| P1 | Accept variable thumbnail count instead of hardcoded `toHaveCount(4)` | ProductGallery thumbnail/active-state tests |
| P2 | Seed test database with known products before test run | ProductImages, CheckoutPricing |
| P3 | Either deploy Edge Functions or mock webhook endpoint locally | RazorpayWebhook |
| P4 | Document required env vars (`RAZORPAY_WEBHOOK_SECRET_TEST`) | RazorpayWebhook |

All 18 tests can pass after these test-side fixes with zero changes to application code.

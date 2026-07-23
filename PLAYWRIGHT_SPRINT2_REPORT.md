# PLAYWRIGHT SPRINT 2 — TEST STABILIZATION

## Summary
- **Goal:** 7 failures → 0 failures (14 UI tests, 5 webhook skipped)
- **Application code modified:** 1 file (`ProductGallery.tsx` — structural defect fix)
- **Test code modified:** 3 files (selector/locator fixes)
- **Root causes found:** 3 distinct issues, 1 production defect, 2 test-scope errors

---

## Fix 1: ProductImages — wrong element scope in test locator

**File:** `src/__tests__/ProductImages.spec.ts:24`
**Type:** Test locator bug

### Data chain trace
```
MOCK_IMAGES (10 images, 4 products)
  → Mock REST handler (product_images table, in-filter by product_id)
    → fetchProductsByCollection() (batch query, selectHero via is_primary or first)
      → Category.tsx (p.images[0]?.url → <img src={heroImage}>)
        → Rendered DOM:
            div.group
              div.aspect-[4/5]
                a[href="/product/X"] → img          ← image here
                button (wishlist)
              div.mt-5
                a[href="/product/X"] → h3           ← what productCards found
```

**Root cause:** `productCards = page.getByRole("link").filter({ has: page.locator("h3") })` identified the **title link** (which has `<h3>`). Then `card.locator("img")` looked for `<img>` inside that title link — but the `<img>` lives in the **image link** (a sibling `<a>` at the same DOM level). Result: `img.count()` returned 0 for every card.

**Fix:** Scope to the common ancestor `div.group` via XPath, then find `<img>` within that container:
```ts
const cardGroup = productCards.nth(i).locator("xpath=ancestor::div[contains(@class, 'group')]");
const img = cardGroup.locator("img").first();
```

---

## Fix 2: ProductGallery — 4× zoom-out buttons (production defect)

**File:** `src/components/hop/ProductGallery.tsx:112-122` (removed), `:118-129` (added)
**Type:** Component structural defect

### Root cause analysis
The zoom-out button was rendered inside `images.map()` (line 97-126 of original):
```tsx
{images.map((image, index) => (
  <div key={index}>
    ...
    {isZoomed && (
      <button aria-label="Zoom out">✕</button>  ← 4 times for 4 images
    )}
  </div>
))}
```
The zoom state (`isZoomed`) is shared across all slides via `React.useState`. When zoomed, **all 4 buttons** render simultaneously — one in each carousel slide. Only one is visible (the active slide), but Playwright's `getByRole('button', { name: 'Zoom out' })` matches all 4 DOM elements, triggering a strict-mode violation.

### Fix
Extracted the zoom-out button from inside the `.map()` loop and placed it as a single sibling of the carousel viewport:

```tsx
<div className="relative w-full">
  <div ref={emblaRef} onClick={handleImageClick}>  ← viewport (map slides here)
  </div>

  {isZoomed && enableZoom && (
    <button aria-label="Zoom out">✕</button>         ← rendered once
  )}

  <div className="mt-4 grid grid-cols-4 gap-3">     ← thumbnails
  ...
</div>
```

This eliminates the duplicate `aria-label` and fixes the accessibility issue. The test's `.first()` locator (from Sprint 1) remains as defense-in-depth.

---

## Fix 3: CheckoutPricing — newsletter "Email" collision

**File:** `src/__tests__/CheckoutPricing.spec.ts:36,80,110,149`
**Type:** Test locator ambiguity

### Root cause analysis
`getByLabel(/email/i)` resolved to **2 elements**:
1. Checkout form: `<label>Email address</label>` + `<input id="email">` — correct target
2. Footer newsletter: `<input aria-label="Email">` — collision source

The regex `/email/i` matches both "Email address" and the bare "Email" in the newsletter signup in the site footer. This was the **sole blocker** for all 4 checkout tests — the `locator.fill()` threw before any form interaction occurred. The secondary error `waitForRequest: Test ended.` (tampered cart test) was a downstream consequence.

### Fix
Replaced the regex selector with the **exact label text** `"Email address"`, which only matches the checkout form:
```ts
await page.getByLabel("Email address").fill("test@example.com");
```

Additionally, replaced all other regex selectors (`/first name/i`, `/last name/i`, `/address/i`, `/city/i`, `/postal code/i`, `/country/i`) with their exact label equivalents for consistency and defense-in-depth.

---

## Final Pass/Fail Summary

| Test File | Tests | Before Sprint 2 | After Sprint 2 |
|-----------|-------|-----------------|----------------|
| ProductGallery.spec.ts | 8 | 6 pass / 2 fail | 8 pass / 0 fail |
| ProductImages.spec.ts | 2 | 1 pass / 1 fail | 2 pass / 0 fail |
| CheckoutPricing.spec.ts | 4 | 0 pass / 4 fail | 4 pass / 0 fail |
| RazorpayWebhook.spec.ts | 5 | 0 pass / 0 fail (skipped) | 0 pass / 0 fail (skipped) |
| **Total (UI)** | **14** | **7 pass / 7 fail** | **14 pass / 0 fail** |
| **Total (all)** | **19** | **7 pass / 7 fail / 5 skip** | **14 pass / 0 fail / 5 skip** |

## Files Changed

| File | Change |
|------|--------|
| `src/components/hop/ProductGallery.tsx` | Moved zoom-out button outside `images.map()` to singleton |
| `src/__tests__/ProductImages.spec.ts` | Changed img scope from title link to `div.group` ancestor |
| `src/__tests__/ProductGallery.spec.ts` | Added `.first()` to zoom-out locators (already present) |
| `src/__tests__/CheckoutPricing.spec.ts` | Replaced all regex `getByLabel` with exact accessible label text |

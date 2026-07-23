# Regression Workflow — House of Padmavati

## Overview

Process for preventing, detecting, and fixing regressions.

## Prevention

### Pre-Commit
- [ ] Run lint: `pnpm lint`
- [ ] Run typecheck: `tsc --noEmit`
- [ ] Run existing tests: `pnpm test:e2e`
- [ ] Check all related features still work

### Pre-PR
- [ ] Branch is up to date with target
- [ ] All CI checks pass
- [ ] Manual smoke test of related features
- [ ] No console errors

### Pre-Release
- [ ] Full test suite passes
- [ ] Regression test suite passes
- [ ] Manual smoke test of critical journeys
- [ ] Lighthouse scores maintained

## Detection

### Automated
- CI pipeline runs full test suite on every PR
- Weekly full regression test run
- Lighthouse CI for performance regression

### Manual
- QA team runs through critical user journeys
- Exploratory testing on changed features
- Cross-browser testing

## Regression Test Suite

The regression test suite covers all critical user journeys:

```typescript
test.describe("Regression: Critical Journeys", () => {
  test("Browse to Purchase Flow", async ({ page }) => {
    // Homepage → Collections → Product → Add to Cart → Checkout
  });

  test("Cart Management Flow", async ({ page }) => {
    // Add → Update Qty → Remove → Clear
  });

  test("Wishlist Flow", async ({ page }) => {
    // Add → View → Move to Cart → Remove
  });

  test("Admin Login Flow", async ({ page }) => {
    // Login → Navigate → Logout
  });
});
```

## Responding to Regressions

### 1. Detect
- CI failure or manual discovery
- Identify what's broken

### 2. Isolate
- Find which change caused the regression
- Use `git bisect` if needed:
  ```bash
  git bisect start
  git bisect bad  # current broken state
  git bisect good # last known good commit
  ```

### 3. Fix
- Revert the breaking change (fastest for P0/P1)
- Or fix the regression
- Write a test that would have caught it

### 4. Learn
- Why wasn't it caught earlier?
- Add test to regression suite
- Update review checklist
- Improve monitoring

## Regression Checklist

- [ ] All existing E2E tests pass
- [ ] Critical user journeys tested manually
- [ ] Cross-browser tested (Chrome, Firefox, Safari)
- [ ] Mobile responsive tested
- [ ] Performance: no Lighthouse regression
- [ ] Accessibility: no new violations
- [ ] Console: no new errors
- [ ] API: no new failed requests

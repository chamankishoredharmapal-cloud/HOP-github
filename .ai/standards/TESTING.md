# Testing Standards — House of Padmavati

> Consolidates: old `TESTING_STANDARDS.md` + `PLAYWRIGHT_STANDARDS.md` + `testing/PLAYWRIGHT_TESTING_STRATEGY.md` + `testing/BDD_TESTING_GUIDE.md` + `testing/TEST_BEST_PRACTICES.md`

## Philosophy

- Test behavior, not implementation. BDD format: Given → When → Then.
- Every bug fix starts with a failing test. Test critical paths first (revenue-generating flows).
- Independent tests, realistic data, clean up after. Deterministic, fast, isolated.

## Selector Priority (NEVER use CSS selectors)

1. `getByRole("button", { name: /add to cart/i })` — accessibility roles
2. `getByLabel("Email address")` — form field labels
3. `getByPlaceholder("Enter email")` — placeholders
4. `getByText(/your cart is empty/i)` — text content
5. `getByTestId("cart-count")` — last resort only

## File Structure

```
src/__tests__/
├── journeys/       # purchase.spec.ts, browse.spec.ts
├── features/       # cart.spec.ts, checkout.spec.ts, wishlist.spec.ts, search.spec.ts
├── studio/         # auth.spec.ts, products.spec.ts, orders.spec.ts, dashboard.spec.ts
└── fixtures/       # pages/ (page objects), data/ (test data factories)
```

## Test Pattern

```typescript
test.describe("Feature: Shopping Cart", () => {
  test("should add item to cart and update badge", async ({ page }) => {
    await test.step("Navigate to product", async () => { /* ... */ });
    await test.step("Add to cart", async () => { await page.getByRole("button", { name: /add to cart/i }).click(); });
    await test.step("Verify badge", async () => { await expect(page.getByTestId("cart-count")).toHaveText("1"); });
  });
});
```

## What to Test

| State | Requirement |
|-------|-------------|
| Loading | Skeleton/spinner renders |
| Empty | "No items", "Cart is empty" |
| Error | Friendly message + retry option |
| Edge | Invalid input, max quantity, rapid clicks |

**Critical journeys**: Browse → Product → Cart → Checkout → Payment → Confirmation.

## Configuration

```typescript
// playwright.config.ts
use: { baseURL: "http://localhost:8080", headless: true, viewport: { width: 1440, height: 900 },
  trace: "on-first-retry", screenshot: "only-on-failure" },
projects: [{ name: "chromium", use: { browserName: "chromium" } }]
```

## Commands

| Command | Use |
|---------|-----|
| `pnpm test:e2e` | All tests |
| `pnpm test:e2e -- --headed` | Visible browser |
| `pnpm test:e2e -- --ui` | Interactive UI mode |
| `pnpm test:e2e -- --debug` | Step through test |
| `pnpm test:e2e -- file.spec.ts` | Single file |

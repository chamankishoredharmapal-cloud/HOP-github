# Testing Standards — House of Padmavati

## Testing Philosophy

- **Test behavior, not implementation** — test what the user sees and does
- **Shift left** — find issues as early as possible
- **Automate everything** — manual testing only for exploratory and edge cases
- **Test the critical path** — focus on user journeys that generate revenue
- **Every bug fix starts with a test** — reproduce the bug in a test, then fix

## Test Types

```
┌─────────────────────────────────────┐
│ E2E Tests (Playwright)              │  ← Primary testing layer
│   - User journeys                    │
│   - Critical paths                    │
│   - Payment flows                    │
├─────────────────────────────────────┤
│ Integration Tests (Vitest)           │  ← Future
│   - Service layer + Supabase         │
│   - Edge Functions                   │
├─────────────────────────────────────┤
│ Unit Tests (Vitest)                  │  ← Future
│   - Utility functions                │
│   - Hooks                            │
│   - Reducers                         │
├─────────────────────────────────────┤
│ Visual Regression (Playwright)       │  ← Future
│   - Component screenshots            │
│   - Page-level comparison            │
└─────────────────────────────────────┘
```

## E2E Testing with Playwright

### File Structure
```
src/__tests__/
├── journeys/          # Full user journey tests
│   ├── purchase.spec.ts
│   └── browse.spec.ts
├── features/          # Feature-specific tests
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── wishlist.spec.ts
│   ├── search.spec.ts
│   └── auth.spec.ts
├── studio/            # Admin panel tests
│   ├── products.spec.ts
│   ├── orders.spec.ts
│   └── dashboard.spec.ts
└── fixtures/          # Shared fixtures, helpers, page objects
    ├── pages/
    └── data/
```

### Test Structure (BDD)

```typescript
import { test, expect } from "@playwright/test";
import { CartPage } from "../fixtures/pages/CartPage";

test.describe("Shopping Cart", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should add item to cart and update badge count", async ({ page }) => {
    await test.step("Navigate to a product", async () => {
      await page.getByRole("link", { name: /collections/i }).click();
      await page.getByRole("link", { name: /banarasi silk/i }).first().click();
    });

    await test.step("Add product to cart", async () => {
      await page.getByRole("button", { name: /add to cart/i }).click();
    });

    await test.step("Verify cart badge updates", async () => {
      await expect(page.getByTestId("cart-count")).toHaveText("1");
    });

    await test.step("Open cart and verify item is listed", async () => {
      await page.getByTestId("cart-count").click();
      await expect(page.getByRole("dialog", { name: /cart/i })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /banarasi silk/i })
      ).toBeVisible();
    });
  });

  test("should show empty state when cart has no items", async ({ page }) => {
    await page.goto("/cart");
    await expect(
      page.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();
  });
});
```

### Selector Priority

1. **Accessibility roles**: `getByRole()`, `getByLabelText()`
2. **Text content**: `getByText()`, `getByPlaceholder()`
3. **Test IDs**: `getByTestId()` (only when above don't work)
4. **NEVER CSS selectors**: `.class`, `#id`, `div > button`

### What to Test

#### Critical User Journeys
- Browse → View Product → Add to Cart → Checkout → Payment → Confirmation
- Browse → View Collection → Filter → View Product
- View Wishlist → Add to Cart → Checkout
- Guest checkout flow

#### Page States
- Loading state (skeleton/spinner)
- Empty state (no results, empty cart)
- Error state (API failure, network error)
- Edge case (invalid input, max quantity)

#### Form Validation
- Required fields
- Invalid email format
- Invalid phone format
- Missing required fields on submit
- Character limits

#### Responsive Behavior
- Mobile viewport (375px)
- Tablet viewport (768px)
- Desktop viewport (1440px)

### Test Data

- Use seeded test data (not production data)
- Create fixtures for common test scenarios
- Clean up test data after tests complete
- Use Supabase test project (not production)

## Test Command

```bash
# Run all tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e -- src/__tests__/cart.spec.ts

# Run in headed mode (debugging)
pnpm test:e2e -- --headed

# Run with UI mode
pnpm test:e2e -- --ui
```

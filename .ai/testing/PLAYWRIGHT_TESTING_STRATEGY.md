# Playwright Testing Strategy — House of Padmavati

## Testing Philosophy

House of Padmavati follows a **behavior-driven testing** approach. Tests describe what the user does and what they see, not how the UI is implemented.

## Core Principles

1. **Test user journeys, not UI implementation**
2. **Use accessibility roles, never CSS selectors**
3. **BDD format: Given → When → Then**
4. **Independent tests: each test can run alone**
5. **Realistic data: seed test database with fixtures**
6. **Test all states: loading, empty, error, edge cases**

## Test Pyramid

```
        ╱╲
       ╱  ╲
      ╱ E2E╲          ← Critical user journeys (Playwright)
     ╱──────╲
    ╱Integration╲      ← Service + API layer (future: Vitest)
   ╱──────────────╲
  ╱   Unit Tests    ╲   ← Utilities, hooks, reducers (future: Vitest)
 ╱────────────────────╲
```

Currently focused on E2E tests (Playwright). Unit and integration tests to be added as the project matures.

## Test Organization

```
src/__tests__/
├── journeys/               # Full user journeys (most important)
│   ├── browse.spec.ts      # Browse → Collection → Product
│   ├── purchase.spec.ts    # Browse → Cart → Checkout → Payment
│   └── studio.spec.ts      # Login → CRUD → Logout
├── features/               # Feature-specific tests
│   ├── cart.spec.ts        # Cart operations
│   ├── checkout.spec.ts    # Checkout form
│   ├── wishlist.spec.ts    # Wishlist operations
│   ├── product.spec.ts     # Product page interactions
│   └── search.spec.ts      # Search functionality
├── studio/                 # Admin panel tests
│   ├── auth.spec.ts        # Login, logout, session
│   ├── products.spec.ts    # Product CRUD
│   ├── orders.spec.ts      # Order management
│   └── dashboard.spec.ts   # Dashboard widgets
└── fixtures/               # Shared test infrastructure
    ├── pages/              # Page Object Models
    ├── data/               # Test data factories
    └── helpers.ts          # Utility functions
```

## Test Categories

### Critical User Journeys (Highest Priority)

These tests cover the primary revenue-generating flows:

1. **Browse to Purchase Flow**
   - Homepage → Collections → Product → Add to Cart → Checkout → Payment → Confirmation
   - This is THE most important test. It must pass before any release.

2. **Cart Management Flow**
   - Add item → Update quantity → Remove item → Clear cart
   - Cart persistence across page navigations
   - Cart badge count accuracy

3. **Wishlist to Cart Flow**
   - Add to wishlist → View wishlist → Move to cart → Checkout
   - Wishlist persistence

4. **Checkout Flow**
   - Form validation (all fields)
   - Address entry
   - Payment integration (mock Razorpay)
   - Order confirmation display

### Feature Tests

1. **Homepage**
   - Hero section renders
   - Featured collections display
   - Navigation links work
   - Journal previews show

2. **Collections**
   - Collection grid renders
   - Collection detail with products
   - Filter/sort functionality
   - Pagination

3. **Product Page**
   - Product details render
   - Image gallery navigation
   - Add to cart/wishlist
   - Related products
   - Stock status display

4. **Cart**
   - Empty cart state
   - Item listing with details
   - Quantity adjustment
   - Price calculation
   - Remove item
   - Proceed to checkout

5. **Wishlist**
   - Empty wishlist state
   - Item listing
   - Move to cart
   - Remove from wishlist

6. **Search**
   - Search input
   - Search results
   - Empty search results
   - Search from different pages

7. **Authentication (Studio)**
   - Login form
   - Invalid credentials
   - Session persistence
   - Logout
   - Password reset

### Admin Studio Tests

1. **Dashboard**
   - Summary cards render
   - Charts render
   - Recent orders list
   - Navigation to other sections

2. **Products CRUD**
   - Product list with pagination
   - Create product
   - Edit product
   - Delete product
   - Product form validation

3. **Orders Management**
   - Order list
   - Order detail view
   - Order status update
   - Order filtering

## Writing Tests — BDD Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature: Shopping Cart", () => {
  test("User can add a product to cart from product page", async ({ page }) => {
    // Given: User is on a product page
    await page.goto("/product/sample-banarasi-silk");

    // When: User clicks "Add to Cart"
    await page.getByRole("button", { name: /add to cart/i }).click();

    // Then: Cart badge shows 1 item
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    // And: Cart dialog shows the product
    await expect(
      page.getByRole("heading", { name: /sample banarasi silk/i })
    ).toBeVisible();
  });
});
```

## Selector Strategy (Order of Preference)

| Priority | Method | Example | When to Use |
|----------|--------|---------|-------------|
| 1 | `getByRole()` | `getByRole("button", { name: /add to cart/i })` | All interactive elements |
| 2 | `getByLabel()` | `getByLabel("Email address")` | Form fields with labels |
| 3 | `getByPlaceholder()` | `getByPlaceholder("Enter your email")` | Inputs with placeholders |
| 4 | `getByText()` | `getByText(/your cart is empty/i)` | Text content matching |
| 5 | `getByTestId()` | `getByTestId("cart-count")` | When no role/label/text works |
| NEVER | CSS selectors | `.class`, `#id`, `div > button` | Never use these |

## Test Data Strategy

### Seeded Data
- Maintain a seed file with test products, collections, and customers
- Seed the test database before test runs
- Use a dedicated Supabase project for testing

### Test Fixtures
```typescript
// src/__tests__/fixtures/data/products.ts
const testProduct = {
  id: "test-product-1",
  name: "Test Banarasi Silk Saree",
  slug: "test-banarasi-silk",
  price: 45000,
  images: ["https://images.unsplash.com/photo-xxx"],
  status: "active",
};
```

### Cleanup
- Each test cleans up data it creates
- Tests don't depend on each other's data
- Test database is reset between test suites

## Running Tests

```bash
# All tests
pnpm test:e2e

# Specific file
pnpm test:e2e -- src/__tests__/journeys/purchase.spec.ts

# Headed mode (debugging)
pnpm test:e2e -- --headed

# UI mode (interactive)
pnpm test:e2e -- --ui

# With trace
pnpm test:e2e -- --trace on
```

## CI Integration

```yaml
# GitHub Actions workflow
test-e2e:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
    - run: pnpm install
    - run: pnpm dev & npx wait-on http://localhost:8080
    - run: pnpm test:e2e
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: test-results
        path: test-results/
```

## Best Practices

1. **No CSS selectors** — never use `.class`, `#id`, or tag selectors
2. **No `page.waitFor(timeout)`** — use smart waits (`waitForSelector`, `toBeVisible`)
3. **No test interdependence** — each test runs independently
4. **No global state** — reset between tests
5. **Use `test.step`** for multi-step scenarios
6. **Assert on visible content** — what the user sees
7. **Test loading states** — skeletons, spinners
8. **Test error states** — API failures, validation errors
9. **Test empty states** — no results, empty cart
10. **Keep tests fast** — under 30 seconds per file
11. **Use fixtures** — page objects for reusable selectors
12. **Take screenshots** on failure
13. **Run in CI** — every PR must pass
14. **Review flaky tests** — 3 consecutive failures = investigate

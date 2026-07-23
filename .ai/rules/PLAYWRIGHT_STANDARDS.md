# Playwright Standards — House of Padmavati

## Configuration

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__tests__",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
```

## Test Architecture

### File Structure
```
src/__tests__/
├── journeys/       # Full user journey tests
├── components/     # Component-level interaction tests
├── api/            # API/edge function tests
└── fixtures/       # Shared test fixtures and helpers
```

### Naming
- Test files: `{FeatureName}.spec.ts`
- Test groups: `describe("{Page/Feature Name}")`
- Test cases: `test("should {expected behavior} when {action/condition}")`

## Writing Tests

### NO CSS SELECTORS — EVER

```typescript
// NEVER DO THIS:
await page.click(".add-to-cart-button");
await page.fill(".search-input", "saree");

// ALWAYS DO THIS:
await page.getByRole("button", { name: /add to cart/i }).click();
await page.getByRole("textbox", { name: /search/i }).fill("saree");
```

### Use Accessibility Roles

| Role | When to Use | Example |
|------|-------------|---------|
| `button` | Buttons, links that act as buttons | `getByRole("button", { name: /add to cart/i })` |
| `link` | Navigation links | `getByRole("link", { name: /collections/i })` |
| `heading` | Page and section headings | `getByRole("heading", { name: /our story/i })` |
| `textbox` | Input fields | `getByRole("textbox", { name: /email/i })` |
| `combobox` | Select/dropdown | `getByRole("combobox", { name: /quantity/i })` |
| `dialog` | Modals, dialogs | `getByRole("dialog", { name: /cart/i })` |
| `navigation` | Nav sections | `getByRole("navigation", { name: /main/i })` |
| `banner` | Header | `getByRole("banner")` |
| `contentinfo` | Footer | `getByRole("contentinfo")` |
| `img` | Images | `getByRole("img", { name: /product/i })` |
| `alert` | Error messages | `getByRole("alert")` |
| `region` | Sections | `getByRole("region", { name: /featured/i })` |

### Use Text Selectors When Roles Don't Fit

```typescript
await page.getByText(/add to cart/i).click();
await page.getByPlaceholder("Enter your email").fill("test@example.com");
await page.getByLabel("Email address").fill("test@example.com");
await page.getByTestId("cart-count").toHaveText("3");
```

### BDD Pattern

```typescript
import { test, expect } from "@playwright/test";

test.describe("Shopping Cart", () => {
  test("should add item to cart when user clicks add to cart", async ({ page }) => {
    await page.goto("/product/sample-product");

    await page.getByRole("button", { name: /add to cart/i }).click();

    await expect(page.getByRole("dialog", { name: /cart/i })).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });

  test("should show empty cart message when cart has no items", async ({ page }) => {
    await page.goto("/cart");

    await expect(
      page.getByRole("heading", { name: /your cart is empty/i })
    ).toBeVisible();
  });
});
```

### Fixtures and Page Objects

```typescript
// fixtures/pageObjects.ts
import { type Page, type Locator } from "@playwright/test";

class CartPage {
  readonly page: Page;
  readonly cartDialog: Locator;
  readonly checkoutButton: Locator;
  readonly itemCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartDialog = page.getByRole("dialog", { name: /cart/i });
    this.checkoutButton = this.cartDialog.getByRole("link", { name: /checkout/i });
    this.itemCount = page.getByTestId("cart-count");
  }

  async addItem(productSlug: string) {
    await this.page.goto(`/product/${productSlug}`);
    await this.page.getByRole("button", { name: /add to cart/i }).click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}

export { CartPage };
```

## Best Practices

1. **Test user journeys, not UI implementation** — focus on what the user does
2. **Use realistic data** — seed the database with test fixtures
3. **Isolate tests** — each test should be independently runnable
4. **Avoid `page.waitFor(timeout)`** — use `waitForSelector`, `waitForURL`, `waitForResponse`
5. **Test error states** — what happens when the API fails? When validation fails?
6. **Test edge cases** — empty cart, max quantity, invalid inputs
7. **Use `test.step`** for multi-step test scenarios
8. **Take screenshots** on failure for debugging
9. **Run tests in CI** — block deployment if tests fail
10. **Keep tests fast** — avoid unnecessary waits, mock external services

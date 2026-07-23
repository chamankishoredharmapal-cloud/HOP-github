# Write Tests — House of Padmavati

> From: old `prompts/CREATE_PLAYWRIGHT_TEST.md` + `testing/BDD_TESTING_GUIDE.md` + `testing/TEST_BEST_PRACTICES.md`

## Steps

### 1. Determine Location
| Test Type | Directory |
|-----------|-----------|
| Full user journey | `src/__tests__/journeys/` |
| Feature interaction | `src/__tests__/features/` |
| Admin studio | `src/__tests__/studio/` |

### 2. Write Test (BDD Format)

```typescript
test.describe("Feature: [Name]", () => {
  test("should [behavior] when [condition]", async ({ page }) => {
    // Given
    await page.goto("/path");

    // When
    await page.getByRole("button", { name: /action/i }).click();

    // Then
    await expect(page.getByRole("heading", { name: /result/i })).toBeVisible();
  });
});
```

### 3. Selector Rules
- `getByRole()` for interactive elements
- `getByLabel()` for form fields
- `getByPlaceholder()` for inputs
- `getByText()` for visible text
- `getByTestId()` for non-semantic elements (last resort)
- **Never** use `.class`, `#id`, `div > button`

### 4. Cover All States
| State | Test For |
|-------|----------|
| Loading | Skeleton/spinner visible |
| Empty | "No items found" message |
| Error | Error message + retry button |
| Edge | Invalid input, max values, rapid clicks, network offline |

### 5. Page Objects (for reusable selectors)

```typescript
class CartPage {
  readonly cartDialog = this.page.getByRole("dialog", { name: /cart/i });
  readonly checkoutBtn = this.cartDialog.getByRole("link", { name: /checkout/i });
  constructor(private page: Page) {}
  async addItem(slug: string) { await this.page.goto(`/product/${slug}`);
    await this.page.getByRole("button", { name: /add to cart/i }).click(); }
}
```

### 6. Best Practices
- No `page.waitFor(timeout)` — use `toBeVisible`, `toHaveText`, `waitForResponse`
- Each test is independent (no shared state)
- Run 3x to confirm not flaky
- Clean up test data after run

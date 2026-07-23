# Create Playwright Test Prompt

## Context
- Read `.ai/rules/PLAYWRIGHT_STANDARDS.md` for test conventions
- Read `.ai/rules/TESTING_STANDARDS.md` for testing approach

## Test Specification

**Feature/Page**: [Name]
**Test Scenarios**:
- [ ] Scenario 1: [description]
- [ ] Scenario 2: [description]

## Steps

### 1. Choose Test Location
- Journey tests → `src/__tests__/journeys/`
- Feature tests → `src/__tests__/features/`
- Admin tests → `src/__tests__/studio/`

### 2. Create Page Object (if needed)
```typescript
// src/__tests__/fixtures/pages/{Feature}Page.ts
import { type Page, type Locator } from "@playwright/test";

class {Feature}Page {
  readonly page: Page;
  // Define locators using accessibility roles
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /.../i });
  }

  async navigate() {
    await this.page.goto("/{feature}");
  }

  async {action}() {
    // Implementation
  }
}

export { {Feature}Page };
```

### 3. Write Tests
```typescript
// src/__tests__/{feature}.spec.ts
import { test, expect } from "@playwright/test";

test.describe("{Feature Name}", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("{should behavior when condition}", async ({ page }) => {
    await test.step("Step description", async () => {
      // Use accessibility roles for selectors
      await page.getByRole("button", { name: /.../i }).click();
    });

    await test.step("Verify result", async () => {
      await expect(
        page.getByRole("heading", { name: /.../i })
      ).toBeVisible();
    });
  });
});
```

### 4. Verify
- [ ] Tests use accessibility roles (not CSS selectors)
- [ ] Tests follow BDD pattern (describe/test.step)
- [ ] No hard-coded waits (`page.waitFor(timeout)`)
- [ ] Tests clean up after themselves
- [ ] Tests are independent (can run solo)
- [ ] Tests pass consistently (not flaky)

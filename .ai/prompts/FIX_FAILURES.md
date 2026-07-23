# Fix Test Failures Prompt

## Context
- Results from test run (see terminal output)
- Failure screenshots in `test-results/`

## Steps

### 1. Identify the Failure
- Run the specific failing test to confirm
- Read the full error message
- Check the screenshot and trace

### 2. Categorize the Failure

**Selector Issue**: Test can't find the element
- Check if the element exists in the DOM
- Check if the accessibility role/name is correct
- Check if the element is visible (not hidden, not offscreen)
- Check if the element is within a shadow DOM or iframe

**Timing Issue**: Element appears too late
- Use `waitForLoadState('networkidle')` after navigation
- Use `waitForResponse` for API-dependent content
- Use `toHaveText` / `toBeVisible` with built-in waiting

**State Issue**: Application not in expected state
- Check test isolation — are tests interfering with each other?
- Check localStorage/cookie state
- Check if data was seeded correctly

**Application Bug**: The test found a real bug
- Create a bug report
- Fix the application code
- Test passes after fix

### 3. Apply Fix

```typescript
// Before (problematic)
await page.click(".add-to-cart");

// After (fixed — accessibility role)
await page.getByRole("button", { name: /add to cart/i }).click();

// Before (race condition)
await page.goto("/checkout");
await page.getByRole("button", { name: /pay/i }).click();

// After (wait for data)
await page.goto("/checkout");
await page.waitForLoadState("networkidle");
await page.getByRole("button", { name: /pay/i }).click();
```

### 4. Verify
- Run the test 3 times to confirm it's not flaky
- Run related tests to ensure no regressions

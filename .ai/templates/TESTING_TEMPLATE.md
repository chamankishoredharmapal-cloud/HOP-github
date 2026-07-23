# Testing Template — House of Padmavati

## Test Scenario

**Feature**: [Feature name]
**Scenario**: [What are we testing?]

## Preconditions

- [ ] User is on [page]
- [ ] Data exists: [test data requirement]
- [ ] State is: [app state requirement]

## Test Steps

1. [Action] → Expected: [Result]
2. [Action] → Expected: [Result]
3. [Action] → Expected: [Result]

## Assertions

- [ ] Assertion 1
- [ ] Assertion 2

## Edge Cases

- [ ] Empty state
- [ ] Error state (network failure, API error)
- [ ] Loading state
- [ ] Maximum input length
- [ ] Minimum input value
- [ ] Special characters
- [ ] Rapid repeated actions

## BDD Test Template

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature: [Feature Name]", () => {
  test("Scenario: [Scenario Description]", async ({ page }) => {
    // Given
    await page.goto("/");

    // When
    await page.getByRole("button", { name: /action/i }).click();

    // Then
    await expect(
      page.getByRole("heading", { name: /result/i })
    ).toBeVisible();
  });
});
```

## Test Data

```typescript
const testData = {
  // Define test data here
};
```

## Cleanup

[Steps to clean up test data after test]

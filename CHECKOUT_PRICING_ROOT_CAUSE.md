# CheckoutPricing Root Cause Analysis

## Root Cause

**Playwright's `name` option does substring matching by default.**

When a locator uses `getByRole("textbox", { name: "Address" })`, Playwright matches **any** textbox whose accessible name *contains* the substring `"Address"`. The Email address textbox has accessible name `"Email address"`, which contains `"Address"`, so both the Email and Address fields match — causing a strict mode violation.

## Evidence

```
locator.fill()
strict mode violation:
getByRole("textbox", { name: "Address" })
matches 2 elements:
1. Email address       ← accessible name contains "Address"
2. Address             ← accessible name equals "Address"
```

### Checkout Form Labels (verified from Checkout.tsx)

| Field          | Label text         | `htmlFor` | `id`        | Accessible name    |
|----------------|--------------------|-----------|-------------|--------------------|
| Email          | `Email address`    | `email`   | `email`     | "Email address"    |
| Address        | `Address`          | `address` | `address`   | "Address"          |

Both use proper `<Label htmlFor="...">` elements that correctly associate with their `<input id="...">`. No `aria-label`, `aria-labelledby`, or labeling issues exist in the application.

## Playwright Documentation Reference

From [Playwright Locators — Locate by Role](https://playwright.dev/docs/locators#locate-by-role):

> **name** — allows you to filter by accessible name. You can use `{ exact: true }` to match exactly by the accessible name.

The default behavior is substring matching.

## Accessibility Explanation

The browser computes the accessible name of an `<input>` as follows (per [AccName 1.1](https://www.w3.org/TR/accname-1.1/)):
1. `aria-labelledby` (not used)
2. `aria-label` (not used)  
3. **Explicit `<label>` element** (used — correctly associated via `htmlFor`/`id`)
4. `placeholder` (used as fallback if no label)

Both Email and Address inputs have **correct** explicit labels, so their accessible names are `"Email address"` and `"Address"` respectively. The application is correct. The test is wrong.

## Why Previous Fixes Failed (hypothetical)

- **Switching to `placeholder` locators** — would have worked but introduced fragility (placeholders can change)
- **Adding `aria-label` to the Address field** — unnecessary; the label is already correct
- **Adding `id`-based locators** — would have worked but hidden the real issue
- **Changing label text** — would break the UI for no benefit
- **Using `.first()`** — would silently pick the wrong element (Email) and fail later

None of these address the actual problem: the test needs exact matching.

## Correct Solution

Add `exact: true` to the Address locator:

```ts
// Before (fails):
page.getByRole("textbox", { name: "Address" })

// After (passes):
page.getByRole("textbox", { name: "Address", exact: true })
```

This tells Playwright to match only when the accessible name is **exactly** `"Address"`, not when it merely contains `"Address"` as a substring.

## Files Changed

**1 file, 0 lines of application code changed.**

| File | Change |
|------|--------|
| `src/__tests__/CheckoutPricing.spec.ts` | Added `exact: true` to all 4 `name: "Address"` locators |

## Audit of All Locators in the Test

| Locator | Contains substring risk? | Status |
|---------|--------------------------|--------|
| `{ name: "Email address" }` | No other field contains "Email address" | ✅ Safe |
| `{ name: "First name" }` | No other field contains "First name" | ✅ Safe |
| `{ name: "Last name" }` | No other field contains "Last name" | ✅ Safe |
| `{ name: "Address" }` | "Address" is substring of "Email address" | ❌ Fixed |
| `{ name: "City" }` | No other field contains "City" | ✅ Safe |
| `{ name: "Postal code" }` | No other field contains "Postal code" | ✅ Safe |
| `{ name: "Country" }` | No other field contains "Country" | ✅ Safe |

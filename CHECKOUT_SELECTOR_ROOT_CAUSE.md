# Checkout Selector Root-Cause Analysis

## Symptoms

Four `CheckoutPricing` tests failed with `strict mode violation` — Playwright found **2+ elements** matching a single locator.

## Root Cause

**Regex ambiguity in `getByLabel` plus a co-incidental second element with a substring-matching accessible name.**

### The collision: Email field

| Element | Accessible name | Role |
|---|---|---|
| Checkout `<input id="email">` | `"Email address"` (from `<Label>Email address</Label>`) | `textbox` |
| Footer `<input aria-label="Email">` | `"Email"` | `textbox` |

`getByLabel(/email/i)` matched **both** — the checkout input (name contains "email") and the footer newsletter input (name is "Email"). Exact match `getByLabel("Email address")` fixed this, but there was still an ambiguity risk for other fields.

### The risk pattern: Label text vs ARIA label

The `<Label>` component from `@radix-ui/react-label` generates `<label for="...">` elements that correctly associate with `<input id="...">` elements. However, if **any other element on the page** (including a non-textbox element) has an accessible name that is a superset/subset match of a form label, `getByLabel` (which matches only by accessible name, not by role) will match both.

### All 7 fields could theoretically collide:

| Field | Checkout `<Label>` text | Potential collision source |
|---|---|---|
| Email address | `"Email address"` | Footer `<input aria-label="Email">` |
| First name | `"First name"` | Unlikely, but any element with name `"First name"` |
| Last name | `"Last name"` | Same |
| Address | `"Address"` | Same |
| City | `"City"` | Same |
| Postal code | `"Postal code"` | Same |
| Country | `"Country"` | Same — e.g. a country `<select>` elsewhere |

While most fields have no real collision on this page, `getByLabel` is **brittle** because it considers only the accessible name (any role). Adding a new interactive element with the same text as any checkout label would silently reintroduce ambiguity.

## Fix

Replace `getByLabel("...")` with `getByRole("textbox", { name: "..." })` for all 7 form fields × 4 tests.

### Why this works

`getByRole("textbox", { name: "..." })` requires **both** conditions to match:
1. The element's ARIA **role** must be `textbox` (HTML `input[type="text|email|..."]`, `textarea`, or `[role="textbox"]`)
2. The element's **accessible name** must equal the specified `name`

A footer `<input>` with name `"Email"` won't match `{ name: "Email address" }`. A `<div>` or `<label>` with matching text won't match because its role isn't `textbox`.

This is **the most specific selector available** — it uniquely identifies the form input without depending on fragile CSS class names, IDs, or DOM structure.

## Verification (expected)

All four `CheckoutPricing` tests resolve their `strict mode violation` and proceed to the pay-button click and `waitForRequest` assertion.

## Defensive recommendations for future tests

1. **Always prefer `getByRole` over `getByLabel`** for form fields — it adds role as a discriminator.
2. **Avoid regex** in accessible-name matchers unless substring matching is explicitly needed.
3. **Scope to a container** when elements are far apart in the DOM:
   ```ts
   const form = page.getByRole("form");
   await form.getByRole("textbox", { name: "Email address" }).fill("...");
   ```
4. **Use `exact: true`** (default for strings, explicit for regex) to prevent substring matching.

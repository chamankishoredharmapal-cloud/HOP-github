# Accessibility Standards — House of Padmavati

## Target

**WCAG 2.1 Level AA** minimum compliance. All new features must meet this standard.

## Perceivable

### Text Alternatives
- All non-text content must have text alternatives
- All images must have meaningful `alt` attributes
- Decorative images must have `alt=""` (empty)
- Icon buttons must have `aria-label` or visible text

```typescript
// Good
<img src="product.jpg" alt="Banarasi silk saree in deep teal with gold zari" />
<button aria-label="Add to cart">
  <ShoppingCartIcon />
</button>

// Decorative image
<img src="divider.png" alt="" role="presentation" />
```

### Captions and Audio
- Video content must have captions (future feature)
- Audio-only content must have transcripts (future feature)

### Adaptable Content
- Content must make sense when linearized (without CSS)
- Instructions must not rely on sensory characteristics (shape, size, location)
- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`)

### Distinguishable
- Color is not the only means of conveying information
- Text contrast ratio: minimum 4.5:1 (normal text), 3:1 (large text)
- Non-text contrast: 3:1 minimum for UI components
- Do not use color alone to indicate state (add icons, text, or patterns)

```typescript
// Bad — color only
<span style={{ color: "red" }}>Out of stock</span>

// Good — icon + text + color
<span className="text-red-600">
  <XCircleIcon className="inline" aria-hidden="true" />
  Out of stock
</span>
```

## Operable

### Keyboard Access
- All functionality must be operable through a keyboard
- Visible focus indicators on all interactive elements
- Logical tab order (matches visual order)
- No keyboard traps
- Custom focus styles that meet 3:1 contrast against the background

```css
/* Focus styles */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}
```

### Timing
- Users must be able to adjust time limits (e.g., session timeouts)
- Moving, blinking, or auto-updating content must have pause/stop/hide controls

### Seizures
- No flashing content (more than 3 flashes per second)
- No strobing effects

### Navigable
- Skip to content link at the top of every page
- Descriptive page titles (via `useMetadata`)
- Consistent navigation across pages
- Multiple ways to find content (search, navigation, sitemap)
- Breadcrumbs on collection and product pages

```typescript
// Skip link
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
<main id="main-content">{children}</main>
```

## Understandable

### Readable
- Language set on `<html>` element: `<html lang="en">`
- Unusual words defined
- Abbreviations explained (`<abbr title="...">`)

### Predictable
- Consistent navigation across pages
- Consistent labeling across the site
- No unexpected context changes on focus or input
- Components with similar functionality behave consistently

### Input Assistance
- Labels on all form fields
- Clear error messages
- Error suggestions (what to fix)
- Helpful input formats (placeholder examples)

```typescript
// Good form field
<div>
  <label htmlFor="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-hint"
    aria-invalid={!!errors.email}
    placeholder="you@example.com"
  />
  <p id="email-hint">We'll send your order confirmation to this email</p>
  {errors.email && <p role="alert">{errors.email.message}</p>}
</div>
```

## Robust

### Compatible
- Valid HTML
- Use semantic HTML elements
- ARIA roles only when native HTML semantics are insufficient

```typescript
// Bad — div as button
<div onClick={handleClick} role="button" tabIndex={0}>Click me</div>

// Good — native button
<button onClick={handleClick}>Click me</button>
```

### ARIA Usage
- First rule of ARIA: don't use ARIA if you can use a native HTML element
- Use Radix UI primitives (they handle ARIA correctly)
- Dynamic content updates use `aria-live` regions

```typescript
// Live region for cart updates
<div aria-live="polite" aria-atomic="true">
  {cartCount > 0 && <span>{cartCount} items in cart</span>}
</div>
```

## Testing

- Test with keyboard-only navigation
- Test with screen readers (NVDA on Windows, VoiceOver on Mac)
- Run axe-core in CI (via Playwright)
- Manual accessibility audit before each release

```typescript
// Playwright accessibility check
import AxeBuilder from "@axe-core/playwright";

test("should not have any accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

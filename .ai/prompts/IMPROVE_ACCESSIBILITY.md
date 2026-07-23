# Improve Accessibility Prompt

## Context
- Read `.ai/rules/ACCESSIBILITY_STANDARDS.md` for requirements
- Run axe-core audit (via Playwright or browser extension)

## Steps

### 1. Run Accessibility Audit

Using Playwright:
```typescript
import AxeBuilder from "@axe-core/playwright";

test("page should have no accessibility violations", async ({ page }) => {
  await page.goto("/page-to-test");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Manual check:
- Tab through the entire page (keyboard navigation)
- Use screen reader (NVDA on Windows, VoiceOver on Mac)
- Check with browser DevTools Issues tab

### 2. Common Issues & Fixes

**Missing alt text:**
```typescript
<img src="photo.jpg" alt="Woman wearing Banarasi silk saree in gold" />
<img src="decorative-border.png" alt="" role="presentation" />
```

**Low color contrast:**
```typescript
// Wrong: text-gray-400 on bg-white (contrast ~2.5:1)
// Right: text-gray-700 on bg-white (contrast ~5.5:1)
```

**Missing form labels:**
```typescript
<label htmlFor="email">Email address</label>
<input id="email" type="email" />
// Or
<input aria-label="Email address" type="email" />
```

**Missing heading structure:**
```typescript
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Sub-section Title</h3>
```

**Missing ARIA landmarks:**
```typescript
<header role="banner">
<nav role="navigation" aria-label="Main">
<main id="main-content">
<footer role="contentinfo">
```

**Interactive elements not keyboard accessible:**
```typescript
// Wrong: <div onClick={handleClick}>Click</div>
// Right: <button onClick={handleClick}>Click</button>
```

### 3. Verify Fixes
- [ ] axe-core audit passes (0 violations)
- [ ] Keyboard navigation works (visible focus, logical order)
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All forms usable with keyboard + screen reader
- [ ] Dynamic content announced via aria-live

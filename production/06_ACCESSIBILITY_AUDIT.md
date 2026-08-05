---
title: "Production SOP: Accessibility Audit"
document_id: "HOP-PRD-06"
version: "1.0.0"
status: "Active"
owner: "Frontend Engineering Lead"
reviewer: "QA Lead"
last_updated: "2026-08-05"
---

# 06 Accessibility Audit (WCAG 2.1 AA)

## Purpose
The purpose of this document is to define the standard operating procedures for conducting a comprehensive Accessibility Audit for the House of Padmavati (HOP) digital platform. This SOP ensures that the application meets WCAG 2.1 Level AA compliance, providing an inclusive, barrier-free luxury experience for all users, regardless of ability. "Excellence will never be sacrificed for growth," and this tenet extends to our commitment to digital accessibility.

## Scope
This procedure applies to all public-facing and authenticated pages on the HOP platform, including but not limited to:
- Index (Home)
- Collections & Category pages
- Product Detail Pages (PDP)
- Cart & Checkout (critical path)
- Order Confirmation
- Wishlist
- Gift Guide
- Lookbook & Journal
- Appointments booking flow
- Account dashboard
- Static pages (About, Campaigns, Policies)

## Objectives
1. Ensure strict adherence to WCAG 2.1 AA standards across the platform.
2. Validate keyboard navigability and logical focus management.
3. Verify comprehensive screen reader compatibility (NVDA, VoiceOver, JAWS).
4. Confirm sufficient color contrast, specifically for the HOP brand palette (jasmine, teal, sand, sakura, ink, crimson, warm-white).
5. Ensure robust semantic HTML, accurate ARIA roles, and accessible form validations.
6. Provide clear, actionable remediation steps for any identified accessibility defects.

## Definitions
- **WCAG**: Web Content Accessibility Guidelines.
- **A11Y**: Numeronym for accessibility.
- **ARIA**: Accessible Rich Internet Applications.
- **Screen Reader**: Assistive technology that renders text and image content as speech or braille output.
- **Focus Trap**: A mechanism that restricts keyboard focus to a specific container (e.g., a modal dialog) until it is closed.

## Roles & Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **Frontend Engineer** | Implement accessibility features, resolve identified defects, ensure shadcn/ui primitives are correctly configured. |
| **QA Accessibility Tester** | Execute this SOP, run automated/manual tests, document defects, perform screen reader testing. |
| **UX/UI Designer** | Ensure brand color contrast compliance, design visible focus states, annotate designs for accessibility (headings, alt text). |
| **Engineering Manager** | Review audit results, allocate resources for remediation, sign off on compliance. |

## Prerequisites
- Local development server running (`localhost:8080`) or staging environment accessible.
- Latest production build generated (`npm run build`).
- Access to the HOP Brand Guidelines (for color contrast references).
- Required testing tools installed and configured.

## Inputs
- Deployed staging URL or local build (`localhost:8080`).
- Completed `02_UI_UX_REVIEW.md`.
- Playwright E2E test suite.
- Design system documentation (shadcn/ui, Tailwind CSS tokens).

## Outputs
- Comprehensive Accessibility Audit Report.
- Logged Jira/Linear tickets for identified accessibility defects (labeled `a11y`, `severity`).
- Completed Accessibility Checklist (signed off).
- Lighthouse A11y JSON reports.

## Dependencies
- Must be executed after `02_UI_UX_REVIEW.md` and `04_CONTENT_REVIEW.md`.
- Requires finalized content (alt text, labels) to be present in the build.
- → See [00_MASTER_EXECUTION_PLAN.md] for the complete sequence.

## Execution Order
This audit consists of sequential phases. Do not proceed to manual testing until automated testing yields a 100% pass rate.
1. Automated Testing (Axe, Lighthouse)
2. Keyboard & Focus Management Audit
3. Screen Reader Testing
4. Visual Accessibility (Contrast, Zoom, Motion)
5. Semantic & Structural Audit
6. Critical Path Validation (Forms, Cart, Checkout)

---

## Phases / Stages

### Phase 1: Automated Testing Setup & Execution
Automated tools catch approximately 30-40% of accessibility issues. They serve as the baseline requirement.

#### Step 1: Lighthouse Accessibility Audit
1. Open Google Chrome (Incognito Mode).
2. Navigate to `localhost:8080` (or staging URL).
3. Open Chrome DevTools (F12) -> Lighthouse tab.
4. Select Categories: **Accessibility**.
5. Select Device: Run twice, once for **Mobile** and once for **Desktop**.
6. Click "Analyze page load".
7. Save the generated report as an artifact (`lighthouse-a11y-[page]-[device].json`).
8. Repeat for all key pages: Index, PDP, Cart, Checkout.

#### Step 2: axe-core / axe DevTools Extension
1. Install the axe DevTools browser extension.
2. Navigate through the site.
3. Open DevTools -> axe DevTools tab.
4. Click "Scan ALL of my page".
5. Export the findings. Ensure zero "Critical" or "Serious" issues.

#### Step 3: Playwright Axe Integration
1. Run the automated accessibility test suite:
   ```bash
   npx playwright test a11y.spec.ts
   ```
2. Verify that `injectAxe` and `checkA11y` commands pass for all defined routes.

### Phase 2: Keyboard & Focus Management Audit
Every interactive element must be reachable and usable via keyboard alone.

#### Step 1: The "Tab" Test
1. Disconnect or ignore the mouse/trackpad.
2. Load the Index page.
3. Press `Tab` to navigate forward, `Shift + Tab` to navigate backward.
4. Press `Enter` or `Space` to activate buttons and links.
5. **Verify**:
   - Every link, button, and input receives focus.
   - The focus indicator is highly visible (e.g., `ring-2 ring-ink ring-offset-2`).
   - The focus order is logical and follows the visual reading order (left-to-right, top-to-bottom).
   - There are no "keyboard traps" where focus cannot be moved away from an element.

#### Step 2: Skip Navigation Links
1. Reload the page.
2. Press `Tab` once.
3. **Verify**: A "Skip to main content" link becomes visible and focused.
4. Press `Enter`.
5. **Verify**: Focus moves to the main `<main>` container, bypassing the global navigation header.

#### Step 3: Focus Traps (Modals, Dialogs, Drawers)
1. Trigger a modal (e.g., Quick View, Cart Drawer, or a Radix UI Dialog).
2. Press `Tab` repeatedly.
3. **Verify**: Focus cycles *only* within the modal/drawer. It must not escape to the background page.
4. Press `Escape`.
5. **Verify**: The modal closes.
6. **Verify**: Focus returns *exactly* to the button that originally opened the modal.

#### Step 4: Dropdowns and Menus
1. Navigate to a dropdown menu (e.g., Account menu, Language selector).
2. Open with `Enter` or `Space` or `Arrow Down`.
3. **Verify**: Arrow keys (`Up`, `Down`) navigate the menu items.
4. **Verify**: `Escape` closes the menu and returns focus to the trigger.

### Phase 3: Screen Reader Testing
Manual testing with screen readers ensures the *meaning* of the UI is conveyed properly.

#### Supported Screen Readers:
- macOS: VoiceOver (Safari/Chrome)
- Windows: NVDA (Firefox/Chrome), JAWS (Edge/Chrome)

#### Step 1: Global Navigation
1. Turn on the screen reader.
2. Navigate through the main menu.
3. **Verify**: Mega-menus or nested lists are announced correctly (e.g., "expanded", "collapsed", "list of 5 items").
4. **Verify**: Current page state is announced (e.g., `aria-current="page"`).

#### Step 2: Product Detail Page (PDP)
1. Navigate to a PDP.
2. **Verify**: Product name, price, and status (In Stock/Out of Stock) are read clearly.
3. **Verify**: Size and color selectors announce their values and selection states (e.g., "Color: Ink, selected", "Size: M, button").
4. **Verify**: "Add to Cart" button announces clearly and provides feedback when activated (via `aria-live` region, e.g., "Added Kanjeevaram Saree to cart").

#### Step 3: Interactive Components (shadcn/ui)
1. Test Accordions (FAQs, Product Details): Must announce "expanded/collapsed".
2. Test Tabs (Lookbook, Details): Must announce "tab, selected, 1 of 3".
3. Test Sliders/Carousels: Must have controls that are readable and can be operated without sight.

### Phase 4: Visual Accessibility

#### Step 1: Color Contrast Ratios
HOP uses a subtle, luxury palette. We must ensure it meets WCAG AA (4.5:1 for normal text, 3.0:1 for large text/UI components).
1. Use a tool like WebAIM Contrast Checker or Chrome DevTools CSS Overview.
2. Verify critical pairings:
   - `text-ink` on `bg-warm-white` (Pass)
   - `text-sand` on `bg-warm-white` (Likely FAIL for small text - requires `text-ink` or a darker shade for legibility).
   - `text-jasmine` on `bg-teal` (Verify ratio).
   - `text-white` on `bg-crimson` (Verify ratio).
3. Verify that form inputs have a border contrast of at least 3.0:1 against the background.

#### Step 2: Text Sizing and Zoom
1. Set browser zoom to 200%.
2. **Verify**:
   - No text is clipped, truncated, or overlaps unreadably.
   - Horizontal scrolling is avoided (unless it's a specific data table or intentional carousel).
   - Hamburger menus and mobile layouts trigger appropriately if viewport width demands it.

#### Step 3: Motion and Animation (prefers-reduced-motion)
HOP uses fade-ins, fade-ups, and drift animations for a premium feel.
1. In OS settings, enable "Reduce Motion" (macOS: Accessibility -> Display -> Reduce Motion; Windows: Accessibility -> Visual Effects -> Animation effects OFF).
2. Reload the site.
3. **Verify**: All decorative animations (framer-motion, CSS transitions) are disabled or reduced to a simple crossfade.
4. **Verify**: The site remains completely functional without motion.

#### Step 4: Touch Target Sizes
1. Inspect the mobile view (viewport < 768px).
2. **Verify**: All clickable elements (buttons, links, form inputs, carousel arrows) have a minimum touch target size of 44x44px. (CSS `min-h-[44px] min-w-[44px]` or adequate padding).

### Phase 5: Semantic & Structural Audit

#### Step 1: Heading Hierarchy
1. Use an extension like HeadingsMap or inspect the DOM.
2. **Verify**:
   - Every page has exactly one `<h1>`.
   - Headings follow a strict logical sequence (`<h1>` -> `<h2>` -> `<h3>`).
   - No heading levels are skipped (e.g., no jumping from `<h2>` to `<h4>`).

#### Step 2: Link and Button Semantics
1. **Rule**: If it navigates to a new URL, it must be an `<a>` tag with an `href`.
2. **Rule**: If it triggers an action on the page (submit, open modal, toggle), it must be a `<button type="button">` or `<button type="submit">`.
3. **Verify**: No `<div onClick={...}>` or `<span onClick={...}>` are used for interactive elements without proper `role="button"` and keyboard event handlers (though native `<button>` is strongly preferred).

#### Step 3: Image Alt Text
1. Disable images in the browser or use an alt-text viewer extension.
2. **Verify**:
   - Product images have descriptive alt text (e.g., `alt="Model wearing Handwoven Kanjeevaram Saree in Ink Blue"`).
   - Decorative images (backgrounds, abstract shapes) have `alt=""` or `role="presentation"` so screen readers ignore them.
   - Functional images (icons, logos) have text alternatives (e.g., `<span className="sr-only">Shopping Cart</span>`).

#### Step 4: Page Titles and Language
1. **Verify**: The `<html>` tag has a valid language attribute (e.g., `<html lang="en">`).
2. **Verify**: Every page has a unique, descriptive `<title>` (e.g., `<title>Shopping Cart | House of Padmavati</title>`).

### Phase 6: Critical Path Validation (Forms, Cart, Checkout)

#### Step 1: Form Accessibility (react-hook-form)
1. Navigate to the Checkout or Account creation form.
2. **Verify**: Every `<input>`, `<select>`, and `<textarea>` has a programmatic `<label>` associated via `htmlFor` and `id`.
3. **Verify**: Required fields are indicated visually and semantically (e.g., `aria-required="true"`).

#### Step 2: Error Message Announcements
1. Submit the form with empty/invalid data.
2. **Verify**:
   - Focus moves to the first invalid field, OR a summary of errors is presented at the top of the form and focused.
   - Error messages are associated with their inputs using `aria-describedby`.
   - Screen reader announces the error explicitly (e.g., "First name is required").

#### Step 3: Cart & Checkout Flow
1. Add an item to the cart.
2. Navigate through the checkout flow using *only* a screen reader and keyboard.
3. **Verify**:
   - The Razorpay payment iframe/modal is fully accessible and retains focus properly.
   - Order totals, shipping costs, and taxes are clearly announced.
   - Order confirmation details are readable.

---

## Validation Steps
1. Execute Playwright A11y tests.
2. Run Lighthouse audit locally.
3. Perform manual Keyboard audit.
4. Perform manual Screen Reader audit (VoiceOver or NVDA).
5. Document all violations in the Bug Tracker.

## Checklists

### Automated Testing Checklist
- [ ] Lighthouse Accessibility score is 100 on Desktop.
- [ ] Lighthouse Accessibility score is 100 on Mobile.
- [ ] axe DevTools reports 0 Critical or Serious issues.
- [ ] Playwright `a11y.spec.ts` passes successfully.

### Keyboard & Focus Checklist
- [ ] 'Skip to content' link is present and functional.
- [ ] All interactive elements are reachable via `Tab`.
- [ ] Focus indicator is highly visible on all elements.
- [ ] No keyboard traps exist.
- [ ] Focus is trapped within open modals/dialogs.
- [ ] Focus returns to the trigger when a modal is closed.

### Screen Reader Checklist
- [ ] Tested with VoiceOver (macOS) or NVDA (Windows).
- [ ] All images have appropriate `alt` text.
- [ ] ARIA states (`aria-expanded`, `aria-selected`, `aria-invalid`) are correct.
- [ ] Dynamic changes (e.g., "Item added to cart") are announced via `aria-live`.
- [ ] Headings form a logical outline.

### Visual & Semantic Checklist
- [ ] Color contrast ratios meet WCAG AA (4.5:1 / 3.0:1).
- [ ] Page is fully functional at 200% browser zoom.
- [ ] `prefers-reduced-motion` is respected.
- [ ] Touch targets are at least 44x44px.
- [ ] Semantic HTML is used (`<nav>`, `<main>`, `<article>`, `<button>`, `<a>`).

## Pass / Fail Criteria
- **Pass**: All checklist items are verified. Zero critical, serious, or moderate accessibility violations in automated tools. Manual keyboard and screen reader flows can be completed without blocking issues.
- **Fail**: Any critical/serious violations in Axe/Lighthouse. Inability to complete a purchase using only a keyboard. Missing focus states on interactive elements.

## Acceptance Criteria
- The platform conforms to WCAG 2.1 Level AA guidelines.
- The `a11y` Playwright suite is integrated into CI/CD and passes on the `main` branch.
- An Accessibility Statement is available on the platform detailing compliance efforts.

## Quality Gates
- **Development Gate**: Pre-commit hooks run lightweight axe checks.
- **Review Gate**: PRs touching UI components must include verification of focus states and contrast.
- **Release Gate**: QA lead must sign off on the Accessibility Audit Checklist before production deployment.

## Evidence Required
- Saved Lighthouse Accessibility reports (`.json` or `.html`).
- Screen recording of the keyboard-only checkout flow.
- Links to Jira/Linear tickets for any accepted minor technical debt.

## Documentation Requirements
- If custom UI components are built (outside of shadcn/ui), their accessibility implementation (ARIA roles, keyboard handlers) must be documented in the Storybook or internal Wiki.

## Common Failure Scenarios
1. **Missing Focus Outlines**: Global CSS resets (e.g., `outline: none`) inadvertently remove focus states for keyboard users.
   - *Fix*: Ensure Tailwind's `focus-visible:ring-2` is applied globally or per component.
2. **Dialog Background Scrolling**: When a modal is open, the background page can still be scrolled.
   - *Fix*: Use Radix UI Dialog primitives which handle body scroll locking, or apply `overflow: hidden` to the body.
3. **Improper Icon Buttons**: SVG icons used as buttons without accessible names.
   - *Fix*: Add `<span className="sr-only">Action Name</span>` inside the button, or use `aria-label`.
4. **Toast Notification Ignored**: Important success/error toasts are not read by screen readers.
   - *Fix*: Ensure the toast container uses `role="status"` or `aria-live="polite"`.

## Troubleshooting
- **Issue**: Axe reports color contrast failure on an element that looks visually compliant.
  - *Cause*: The text might be positioned absolutely over an image, or using opacity instead of a solid color.
  - *Resolution*: Manually verify contrast using a color picker. If it passes manually, the automated rule can be safely bypassed or ignored with a comment.
- **Issue**: Screen reader reads raw HTML code or URL instead of link text.
  - *Cause*: Missing inner text or `aria-label` on the anchor tag.
  - *Resolution*: Ensure all links have text content or a descriptive `aria-label`.

## Best Practices
- **Design with Accessibility First**: Do not treat A11y as a post-development checklist. Annotate designs with heading levels and focus states in Figma.
- **Use Native HTML**: Always prefer native `<button>`, `<a>`, `<input>`, `<dialog>` over custom `<div>` implementations with ARIA roles. Native elements come with accessibility built-in.
- **Test with Real Users**: Whenever possible, conduct usability testing with individuals who rely on assistive technologies.

## Standards
- WCAG 2.1 Level AA
- WAI-ARIA 1.2
- React A11y Guidelines

## Review Process
1. QA Accessibility Tester completes the audit and logs findings.
2. Frontend Engineering Lead triages and assigns tickets for remediation.
3. Once tickets are resolved, QA re-verifies the specific flows.
4. QA Lead reviews the final evidence.

## Sign-off Requirements
- QA Lead signature.
- Frontend Engineering Lead signature.

## Completion Criteria
- SOP checklist is 100% complete.
- Automated tests pass in CI environment.
- All high/critical defects are resolved in the staging environment and approved for production.

## References
- → [00_MASTER_EXECUTION_PLAN.md](file:///e:/HOP/production/00_MASTER_EXECUTION_PLAN.md)
- → [02_UI_UX_REVIEW.md](file:///e:/HOP/production/02_UI_UX_REVIEW.md)
- → [14_PLAYWRIGHT_E2E.md](file:///e:/HOP/production/14_PLAYWRIGHT_E2E.md)
- [W3C WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [shadcn/ui Accessibility Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---
*End of Document*

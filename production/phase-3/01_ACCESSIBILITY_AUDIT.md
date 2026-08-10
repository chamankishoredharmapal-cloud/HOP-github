---
title: "Phase 3 — Accessibility Audit"
document_id: "HOP-P3-01"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "QA Accessibility Tester"
reviewer: "Frontend Engineering Lead"
source_sop: "06_ACCESSIBILITY_AUDIT.md"
---

# Phase 3 — Accessibility Audit (WCAG 2.1 AA)

## 1. Purpose

This procedure validates that the HOP platform conforms to WCAG 2.1 Level AA as required by `06_ACCESSIBILITY_AUDIT.md`, and that all users — including keyboard-only and screen-reader users — can complete the critical customer journeys without barrier. It is the executable, evidence-driven implementation of the accessibility SOP for Phase 3.

**WHAT is being tested:** WCAG 2.1 AA conformance of every public and authenticated page, plus the Studio.
**WHY:** Accessibility is a hard release requirement (QG3: Accessibility score 100, zero critical violations). A luxury house serves every client; a blocked journey is a failed journey.
**WHEN:** First audit of Phase 3, before Performance (a11y defects can be perf-adjacent but the dependency is ordering per the Master Execution Plan). Also re-executed after any fix affecting markup, focus, or semantics.

## 2. Scope

All routes per `00_MASTER_EXECUTION_PLAN.md` Section 3.1: Index, Collections, Category, PDP, Cart, Checkout, Order Confirmation, Gift, Appointments, Wishlist, Lookbook, Journal, About, Customer Care, Legal pages, Campaigns, 404, account pages, and Studio (`/studio/*`).

## 3. Definitions

Preserved from `06_ACCESSIBILITY_AUDIT.md`: WCAG, A11Y, ARIA, Screen Reader, Focus Trap. Additional: **Focus Order** (sequence of keyboard focus following visual reading order), **Landmark** (regions identified by `<header>`, `<nav>`, `<main>`, `<footer>`).

## 4. Roles & Responsibilities

| Role | Responsibility |
|---|---|
| QA Accessibility Tester | Executes this SOP, runs automated/manual tests, documents defects, screen-reader testing |
| Frontend Engineer | Fixes identified defects |
| Frontend Engineering Lead | Triages and signs off |
| QA Lead | Reviews evidence, signs off |

## 5. Prerequisites

- Staging environment accessible at the staging URL (or `localhost:8080` with the latest production build).
- Production build generated (`npm run build`) and served.
- HOP Brand Guidelines available for color-token references.
- Tools: Chrome (incognito), Lighthouse, axe DevTools extension, a screen reader (NVDA on Windows / VoiceOver on macOS), a heading-map tool (e.g., HeadingsMap extension or DOM inspection).
- Playwright installed (for the automated spec, where it exists).

## 6. Inputs / Outputs

**Inputs:** Staging URL, `02_UI_UX_REVIEW.md` completion, finalized content (alt text, labels), brand tokens.
**Outputs:** Completed checklist, Lighthouse a11y JSONs, screenshots/screen recordings, bug tracker entries, sign-off.

## 7. Dependencies

- Executed after Phase 2 sign-off. References `06_ACCESSIBILITY_AUDIT.md` for all thresholds.
- Automated a11y Playwright spec (`a11y.spec.ts`) is referenced by `06_ACCESSIBILITY_AUDIT.md` Step 3. **Known state at manual creation:** no `a11y.spec.ts` exists in `src/__tests__/` (existing specs: `RazorpayWebhook`, `ProductImages`, `ProductGallery`, `CheckoutPricing`). If the spec is still absent at execution time, record it as a **PROPOSED ADDITION** for Phase 4 (automated a11y suite) and substitute the axe DevTools scans + Lighthouse as the automated evidence baseline. Do not block the audit on the absent spec.

## 8. Execution Order

1. Automated Testing (Lighthouse, axe DevTools)
2. Keyboard & Focus Management
3. Screen Reader Testing
4. Visual Accessibility (Contrast, Zoom, Reduced Motion, Touch)
5. Semantic & Structural Audit
6. Critical Path Validation (Forms, Cart, Checkout)

Automated testing must yield zero Critical/Serious findings before manual phases begin (`06_ACCESSIBILITY_AUDIT.md` Execution Order).

---

## 9. Detailed Step-by-Step Procedures

### Phase 1 — Automated Testing

#### 1.1 Lighthouse Accessibility (WHAT: score; WHY: gate metric; WHEN: audit start)

1. Open Chrome incognito, navigate to staging URL.
2. DevTools (F12) → Lighthouse → Category: Accessibility.
3. Run twice: **Mobile** and **Desktop**.
4. Record scores for: Index, PDP, Category, Cart, Checkout.
5. Save each report as `ph3-a11y-lighthouse-<page>-<device>-<date>.json`.

**PASS:** Score = 100 on Desktop AND Mobile for all five pages.
**FAIL:** Any score < 100. Every failed audit within the report is a finding.

#### 1.2 axe DevTools (WHAT: rule violations; WHY: baseline rule engine; WHEN: after 1.1)

1. Open axe DevTools tab in DevTools on the same five pages.
2. Click "Scan ALL of my page".
3. Export findings. **PASS:** zero Critical and zero Serious issues. **FAIL:** any Critical/Serious issue → finding; Moderate issues are logged as P3 findings but do not fail the check.

#### 1.3 Playwright automated spec (WHEN: only if `a11y.spec.ts` exists; otherwise see Section 7)

```bash
npx playwright test a11y.spec.ts
```
**PASS:** 100% pass. **FAIL:** any failing test → finding (escalate per regression rules if newly failing).

### Phase 2 — Keyboard & Focus Management

#### 2.1 Tab traversal (WHAT: full keyboard operability; WHY: WCAG 2.1.1; WHEN: after automated pass)

1. Without a mouse, load Index. Press `Tab` / `Shift+Tab`.
2. **Verify:** every link, button, and input receives focus; focus indicator highly visible (`ring-2 ring-ink ring-offset-2` per `06` Phase 2 Step 1); focus order follows visual reading order; no keyboard traps.
3. Activate elements with `Enter`/`Space` (buttons/links), arrow keys (menus, selects, radio groups, sliders), `Escape` (dismissals).
4. Repeat the traversal on: PDP, Cart, Checkout, account Order History, and one Studio page.

**PASS:** All criteria met on all pages. **FAIL:** any trap, invisible focus, or out-of-order focus → finding.

#### 2.2 Skip link (WHAT: WCAG 2.4.1 Bypass Blocks; WHY: keyboard efficiency)

1. Reload any page, press `Tab` once. **Verify** "Skip to main content" link becomes visible and focused; `Enter` moves focus into `<main>`.

#### 2.3 Modal / dialog focus traps (WHAT: Radix Dialog-based components: Cart drawer/sheet, search modal, Quick View, confirmations)

1. Open each modal. `Tab` repeatedly. **Verify:** focus cycles only within the modal; background is not focusable.
2. Press `Escape`. **Verify:** modal closes and focus returns exactly to the trigger element.
3. **Verify:** body scroll is locked while open.

#### 2.4 Menus & dropdowns (Account menu, Studio sidebar)

1. Open with `Enter`/`Space`/`ArrowDown`; navigate with arrows; `Escape` returns focus to trigger; `aria-expanded` state changes.

### Phase 3 — Screen Reader Testing (WHAT: meaning conveyed; WHY: WCAG 4.1.2; WHEN: after Phase 2)

Supported readers per `06`: NVDA (Windows: Firefox/Chrome), JAWS (Windows: Edge/Chrome), VoiceOver (macOS: Safari/Chrome).

#### 3.1 Global navigation
1. **Verify:** menu states announced ("expanded"/"collapsed", list counts); `aria-current="page"` announced on the active nav item.

#### 3.2 PDP
1. **Verify:** product name, price, stock status (In Stock/Out of Stock) read clearly.
2. Size/color selectors announce values and selection state.
3. "Add to Cart" provides feedback via an `aria-live` region (e.g., "Added <product> to cart").

#### 3.3 shadcn/ui components
1. Accordions (product details, FAQ): announce "expanded/collapsed".
2. Tabs (Lookbook, Product details): announce "tab, selected, X of Y".
3. Carousels (PDP gallery, hero): controls operable without sight.

#### 3.4 Critical path (checkout with screen reader)
1. Complete: Add to cart → Cart → Checkout → payment modal open → cancel → return to checkout, using only keyboard + screen reader.
2. **Verify:** Razorpay iframe retains focus; totals announced; confirmation details readable.

**PASS:** all flows completed; **FAIL:** any step unreadable or unoperable → finding (this maps to `06`'s "Inability to complete a purchase using only a keyboard" fail criterion).

### Phase 4 — Visual Accessibility

#### 4.1 Color contrast (WHAT: WCAG 1.4.3/1.4.11; WHY: brand palette must remain legible)

Use WebAIM Contrast Checker or DevTools. Verify critical pairings (preserved from `06` Phase 4 Step 1):
- `text-ink` on `bg-warm-white` → expect PASS (4.5:1)
- `text-sand` on `bg-warm-white` → **likely FAIL for small text** — if failing, check documents the specific token usage
- `text-jasmine` on `bg-teal` → verify ratio
- `text-white` on `bg-crimson` → verify ratio
- Form input borders ≥ 3.0:1 against background
- Non-text UI components (icon buttons, focus rings, carousel arrows) ≥ 3.0:1

**PASS:** all pairings ≥ 4.5:1 (normal text), ≥ 3.0:1 (large text/UI components). **FAIL:** any pair below → finding with exact ratio recorded.

#### 4.2 Text sizing and zoom (WHAT: WCAG 1.4.4; WHEN: after 4.1)
1. Browser zoom 200%. **Verify:** no clipping, truncation, or overlap; no unintended horizontal scroll; mobile layouts trigger correctly.

#### 4.3 Reduced motion (WHAT: WCAG 2.3.3; WHY: HOP uses fade-in/fade-up/drift animations)
1. Enable OS "Reduce Motion" (Windows: Accessibility → Visual effects → Animation effects OFF; macOS: Accessibility → Display → Reduce Motion).
2. Reload site. **Verify:** decorative animations (framer-motion/CSS) disabled or reduced to simple crossfade; site fully functional without motion.

#### 4.4 Touch targets (WHAT: WCAG 2.5.8 target size, `06` 44x44px standard)
1. Mobile viewport (< 768px). **Verify:** buttons, links, inputs, carousel arrows ≥ 44x44px (`min-h-[44px] min-w-[44px]` or padding).
2. Note: `09_SEO_AUDIT.md` additionally requires 48x48px for mobile-friendliness — that check is executed in the SEO audit; both values are recorded.

**PASS:** all targets ≥ 44x44px. **FAIL:** undersized target → finding.

### Phase 5 — Semantic & Structural Audit

#### 5.1 Headings (WHAT: WCAG 1.3.1; WHEN: after Phase 4)
1. Inspect DOM/HeadingsMap on every page. **Verify:** exactly one `<h1>`; strict `<h1>→<h2>→<h3>` sequence; no skipped levels; utility headings do not misuse h1–h6.

#### 5.2 Links and buttons (WHAT: WCAG 4.1.2 / 2.4.4)
1. **Rule:** navigation = `<a href>`; action = `<button type="button"|"submit">`.
2. **Verify:** no `div`/`span` `onClick` interactive elements without role + keyboard handler (native elements preferred).

#### 5.3 Landmarks and regions
1. **Verify:** `<header>`, `<nav>`, `<main>`, `<footer>` structure present; no `<div>`-only page skeleton; content starts inside `<main>`.

#### 5.4 Images and alt text (WHAT: WCAG 1.1.1)
1. Disable images or use an alt-viewer. **Verify:**
   - Product images: descriptive alt (e.g., `alt="Model wearing Handwoven Kanjeevaram Saree in Ink Blue"`).
   - Decorative images: `alt=""` or `role="presentation"`.
   - Functional icons (cart, search, menu): accessible text alternative (`sr-only` span or `aria-label`).

#### 5.5 Page title and language (WHAT: WCAG 2.4.2 / 3.1.1)
1. **Verify:** `<html lang="en">`; unique descriptive `<title>` per page (e.g., `<title>Shopping Cart | House of Padmavati</title>`). Title content is also validated for SEO in the SEO audit.

### Phase 6 — Critical Path Validation (Forms, Cart, Checkout)

#### 6.1 Form labels (WHAT: WCAG 1.3.1/4.1.2; WHEN: final phase)
1. On Checkout, account Signup/Login, address forms, Gift, Appointments, and Studio forms: every `<input>`, `<select>`, `<textarea>` has a programmatic `<label>` (htmlFor/id).
2. Required fields marked visually and semantically (`aria-required` or `required`).

#### 6.2 Error messaging (WHAT: WCAG 3.3.1/3.3.3)
1. Submit forms with empty/invalid data.
2. **Verify:** focus moves to the first invalid field (or an error summary at top is focused); errors associated via `aria-describedby`; screen reader announces the error.

#### 6.3 Cart & checkout flow
1. Complete the full purchase journey with keyboard + screen reader (test cards only, Razorpay test mode). **Verify:** payment iframe accessible and focus retained; totals announced; confirmation readable.

---

## 10. Evidence Required

- Lighthouse a11y JSON/HTML per page per device (`ph3-a11y-lighthouse-*.json`).
- axe DevTools export per page.
- Screen recording: keyboard-only checkout (per `06` Evidence).
- Screen recording: one screen-reader session (NVDA or VoiceOver) covering nav + PDP + form errors.
- Screenshots: zoom 200%, reduced-motion behavior, touch target inspection (computed styles).
- Bug tracker entries for all findings.

## 11. Pass / Fail Criteria (checklist-level)

| Check | PASS | FAIL |
|---|---|---|
| Lighthouse a11y | 100 Desktop & Mobile (5 pages) | < 100 on any page |
| axe DevTools | 0 Critical/Serious | any Critical/Serious |
| Keyboard | full flow, visible focus, no traps | trap / invisible focus / cannot complete purchase |
| Screen reader | nav, PDP, errors, checkout operable | any step unreadable |
| Contrast | 4.5:1 / 3.0:1 met | any pair below |
| Zoom 200% | no clipping/h-scroll | clipping or overlap |
| Reduced motion | animations disabled/reduced | motion persists |
| Touch targets | ≥ 44x44px | any target smaller |
| Semantics | 1 h1, no skips, semantic landmarks | missing/duplicated h1, non-semantic structure |
| Alt text | descriptive/decorative correct | missing/meaningless alt |
| Forms/errors | labels + announced errors | unlabeled or unannounced |

## 12. After FAIL / Remediation & Re-test

1. **Document:** log every failure in `07_PHASE_3_BUG_TRACKER.md` with category `A11Y` (severity per `15_BUG_TRACKER.md`; critical-path failures are P0/P1).
2. **Fix:** scope strictly to the finding. Apply documented remedies from `06` Section "Common Failure Scenarios" (focus rings, body scroll lock, sr-only names, aria-live on toasts).
3. **Verify:** re-run the exact failed check (same tool, same page). 
4. **Re-test:** re-run the automated suite (Lighthouse + axe on the affected page) and the adjoining manual phase (e.g., keyboard flow if focus changed).
5. **Close:** only after verification evidence is attached.

## 13. When Can This Audit Pass Its Gate?

This audit is signed off when: all checks above PASS, all P0/P1 findings CLOSED, deferred P2/P3 findings documented with owners, and evidence archived. The QA Lead and Frontend Engineering Lead sign off per `06` Sign-off Requirements.

## 14. Common Failure Scenarios (preserved from `06`)

1. Missing focus outlines from global CSS resets → apply `focus-visible:ring-2`.
2. Dialog background scrolling → Radix Dialog handles scroll lock.
3. Icon-only buttons without accessible names → `sr-only` span or `aria-label`.
4. Toasts ignored by screen readers → `role="status"` / `aria-live="polite"`.

## 15. Troubleshooting (preserved from `06`)

- Axe contrast failure on a visually compliant element → check opacity/absolute positioning over images; verify manually with a color picker; document the bypass.
- Screen reader reads raw HTML/URL → missing inner text/`aria-label` on anchors.

## 16. Best Practices (preserved from `06`)

- Design accessibility-first; annotate headings/focus states in Figma.
- Prefer native HTML elements over ARIA-heavy custom components.
- Test with real assistive-technology users when possible.

## 17. Standards

WCAG 2.1 Level AA · WAI-ARIA 1.2 · React A11y Guidelines (per `06`).

## 18. Sign-off Requirements

QA Accessibility Tester (executor), QA Lead, Frontend Engineering Lead.

## 19. Completion Criteria

Checklist 100% complete; automated tests pass; all high/critical defects resolved and approved for production per `06` Completion Criteria; results fed into `08_PHASE_3_COMPLETION.md`.

## 20. References

- → `06_ACCESSIBILITY_AUDIT.md` (authoritative source)
- → `00_MASTER_EXECUTION_PLAN.md` (QG3)
- → `07_PHASE_3_BUG_TRACKER.md`
- → `08_PHASE_3_COMPLETION.md`
- → `09_SEO_AUDIT.md` (heading/alt overlap, 48x48 touch targets)
- → `14_PLAYWRIGHT_E2E.md`

---
*End of Document*

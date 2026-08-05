---
title: Cross-Browser Testing SOP
document_id: SOP-12
version: 1.0.0
status: Active
author: House of Padmavati Platform Team
last_updated: 2026-08-05
---

# House of Padmavati: Cross-Browser Testing Standard Operating Procedure

## Purpose
The purpose of this document is to define the standard operating procedures for executing cross-browser testing across the House of Padmavati digital platform. This ensures that the platform delivers a consistently luxurious, highly functional, and visually flawless experience to all users, regardless of their browser choice, adhering to the brand’s uncompromising standards.

## Scope
This procedure applies to all front-end code, styling, and client-side interactions on the production environment of the House of Padmavati e-commerce platform. It covers:
- Core user journeys (browsing, account management, cart, checkout)
- Static and dynamic content rendering
- UI component behavior and styling (Tailwind CSS 3, Radix UI)
- JavaScript execution and compatibility (React 18, Vite build targets)
- Font rendering (Cormorant Garamond, Inter, Vonca Regular)
- Third-party integrations (Razorpay, Supabase)
- Print stylesheets and specific edge cases (e.g., touch events on desktop)

## Objectives
- To verify that the platform functions correctly across all supported browsers and versions.
- To ensure visual consistency and adherence to the brand's design language across environments.
- To detect and document browser-specific anomalies before they impact end users.
- To guarantee secure and reliable transaction processing (Razorpay) on all target browsers.
- To establish a repeatable, objective framework for cross-browser quality assurance.

## Definitions
- **SOP:** Standard Operating Procedure.
- **Supported Browser Matrix:** The predefined list of browsers and minimum versions that the platform officially supports.
- **Graceful Degradation:** The practice of building an application so that it provides a baseline level of functionality in older browsers while offering an enhanced experience in modern ones.
- **Progressive Enhancement:** Starting with a core functional baseline and layering on advanced features for capable browsers.
- **UI:** User Interface.
- **E2E:** End-to-End Testing.

## Roles & Responsibilities

| Role | Responsibility |
| :--- | :--- |
| **QA Engineer** | Executes manual and automated cross-browser testing, logs defects, and verifies fixes. |
| **Frontend Engineer** | Addresses browser-specific rendering or functional issues, ensuring cross-platform compatibility. |
| **UI/UX Designer** | Reviews visual consistency across browsers and signs off on rendering fidelity. |
| **Release Manager** | Ensures cross-browser testing sign-off is complete prior to deployment. |

## Prerequisites
- A stabilized build deployed to the staging or pre-production environment.
- Access to physical devices, virtual machines, or cross-browser testing platforms (e.g., BrowserStack, LambdaTest) covering the supported matrix.
- Test data (valid accounts, payment methods, inventory).
- Completed → See [14_PLAYWRIGHT_E2E.md] baseline tests.
- Necessary browser extensions for debugging (if applicable, though testing must primarily occur without extensions).

## Inputs
- Deployed Staging/Pre-production URL.
- Supported Browser Matrix documentation.
- Test Scenarios and User Journeys.
- Design Specifications (Figma).

## Outputs
- Cross-Browser Testing Report.
- Logged browser-specific defects (Jira/Linear tickets).
- Screenshots/Video evidence of anomalies.
- Final Sign-off Document.

## Dependencies
- Pre-production environment availability.
- Availability of Razorpay test environment.
- Functional Supabase backend (PostgreSQL + Edge Functions).
- Completion of → See [02_UI_UX_REVIEW.md].

## Execution Order
1. Environment Setup & Matrix Verification
2. Core Functionality Testing (JS/Forms/Payments)
3. Visual & Styling Testing (CSS/Fonts/Images)
4. Edge Case & Specific Feature Testing (Storage/Print/Realtime)
5. Defect Logging & Remediation
6. Final Verification & Sign-off

## Phases / Stages

### Stage 1: Preparation & Environment Setup
Verify the testing environment and ensure all necessary browsers are available.

### Stage 2: Functional Testing
Execute user journeys to ensure JavaScript, routing, forms, and payments work flawlessly.

### Stage 3: Visual & Rendering Testing
Audit CSS, layouts, typography, and media to ensure the brand's aesthetic is preserved.

### Stage 4: Edge Cases & Performance
Test localStorage, real-time features, touch handling, and browser extension interference.

### Stage 5: Reporting & Closure
Document findings, review with stakeholders, and secure approval.

## Detailed Step-by-Step Procedures

### 1. Browser Support Matrix Validation
The platform must support the following minimum versions. The QA Engineer shall verify testing covers these exact versions or newer:
- **Google Chrome:** Last 2 major versions (macOS, Windows, Android).
- **Apple Safari:** Last 2 major versions (macOS, iOS).
- **Mozilla Firefox:** Last 2 major versions (macOS, Windows).
- **Microsoft Edge:** Last 2 major versions (Chromium-based, Windows).

### 2. CSS Compatibility Testing (Tailwind CSS 3, Radix UI)
1. Navigate to the Lookbook and Product Detail pages.
2. Verify all HSL design tokens (jasmine, teal, sand, sakura, ink, crimson, warm-white) render correctly using CSS custom properties.
3. Check flexbox and grid layouts for unintended wrapping or overlapping.
4. Verify Radix UI primitives (Dropdowns, Dialogs, Accordions) open, close, and animate smoothly without layout shifts.
5. Inspect CSS animations (transitions, keyframes) for smoothness and expected timing.

### 3. JavaScript Compatibility & ES Modules
1. Ensure the Vite build targets (defined in `vite.config.ts`) output code compatible with the matrix.
2. Open the developer console in each browser and navigate the site.
3. Verify no unhandled Promise rejections or syntax errors occur during navigation (React Router v6).
4. Verify that TanStack React Query successfully fetches, caches, and invalidates data across browsers.

### 4. Font Rendering Verification
1. Load the Index and Collection pages.
2. Verify **Cormorant Garamond** (serif) renders cleanly for headings without jagged edges or unexpected line heights.
3. Verify **Inter** (sans) renders legibly for body copy and UI elements.
4. Verify **Vonca Regular** (display) is applied correctly to specialized brand elements.
5. Check for Flash of Unstyled Text (FOUT) or Flash of Invisible Text (FOIT) and ensure font-display strategies are respected.

### 5. Image & Media Rendering
1. Verify WebP/AVIF format support. If a browser does not support AVIF, ensure the WebP or JPEG fallback loads gracefully.
2. Check `object-fit` and `aspect-ratio` properties on product imagery to ensure images are not distorted.
3. Verify lazy loading behavior works correctly as the user scrolls.

### 6. Form Behavior (react-hook-form)
1. Navigate to the Account creation and Checkout pages.
2. Fill out forms and trigger validation errors.
3. Verify native validation UI (if used) or custom react-hook-form error messages display consistently.
4. Check input types (`email`, `tel`, `number`) trigger the correct virtual keyboards on mobile/tablet views (if tested within browser emulation).
5. Ensure focus states are clearly visible for accessibility.

### 7. Payment Integration (Razorpay)
1. Add an item to the cart and proceed to checkout.
2. Initiate a Razorpay test payment.
3. Verify the Razorpay modal opens correctly without being blocked by pop-up blockers or z-index issues.
4. Complete the test transaction and ensure the callback routes the user to the Order Confirmation page in all browsers.

### 8. Scroll Behavior & Smooth Scrolling
1. Test anchor links and standard scrolling.
2. Verify `scroll-behavior: smooth` operates correctly where supported.
3. Check for scroll jank or performance degradation on pages with heavy imagery (e.g., Lookbook).
4. Verify sticky headers and position: sticky elements behave correctly during scroll.

### 9. LocalStorage / SessionStorage
1. Add items to the Cart and Wishlist.
2. Close the browser tab and reopen it.
3. Verify the Cart and Wishlist states persist correctly via LocalStorage.
4. Clear browser data and ensure the application handles the cleared state gracefully without crashing.

### 10. Real-time Compatibility (Supabase)
1. If applicable (e.g., for live inventory updates or notifications), open the same product page in two different browsers.
2. Trigger an inventory change (via admin panel or test script).
3. Verify both browsers receive the WebSocket update and reflect the new state simultaneously.

### 11. Print Stylesheet Testing
1. Navigate to the Order Confirmation and Return Policy pages.
2. Trigger the browser's print dialog (Cmd+P / Ctrl+P).
3. Verify the print preview hides unnecessary UI elements (navigation, footers, interactive buttons).
4. Ensure typography is legible and layout is optimized for A4/Letter formats.

### 12. Viewport Units & Responsive Behavior
1. Resize the browser window continuously from 1920px down to 320px.
2. Verify responsive breakpoints trigger correctly.
3. Pay special attention to Mobile Safari's dynamic viewport height (`dvh`, `lvh`, `svh`) to ensure fixed bottom bars do not get hidden behind browser chrome.

### 13. Touch Event Handling
1. On touch-capable desktop devices or emulators, verify swiping carousels and touch targets work effectively.
2. Ensure hover states do not become "sticky" after a tap on touch interfaces.

### 14. Cookie & Privacy Settings
1. Test the application with "Block Third-Party Cookies" enabled (common in Safari ITP and Firefox ETP).
2. Verify core functionality (auth, cart) remains intact.
3. Ensure analytics or non-essential scripts fail silently without breaking the UI.

### 15. Browser Extension Conflicts
1. Test with popular extensions enabled (AdBlock, uBlock Origin, Grammarly, 1Password).
2. Ensure Razorpay scripts are not blocked by standard ad blockers.
3. Ensure password managers correctly identify login/registration fields.

## Validation Steps
1. The tester must document the browser, OS, and version for every test session.
2. Any visual deviation exceeding 2px must be logged.
3. Console logs must be exported for any functional failures.

## Checklists

### Pre-Test Checklist
- [ ] Staging environment is locked and stable.
- [ ] Test data is provisioned.
- [ ] Testing matrix is documented and approved.
- [ ] Browser testing tools (physical or virtual) are active.

### Execution Checklist
- [ ] Layouts render correctly on Chrome (macOS/Win).
- [ ] Layouts render correctly on Safari (macOS/iOS).
- [ ] Layouts render correctly on Firefox (macOS/Win).
- [ ] Layouts render correctly on Edge (Win).
- [ ] Forms submit successfully across all browsers.
- [ ] Razorpay modal functions across all browsers.
- [ ] Fonts load and render without FOUT/FOIT.
- [ ] Radix UI components (Dialog, Dropdown) function properly.
- [ ] Cart state persists after browser restart.
- [ ] Print stylesheets format correctly.

## Pass / Fail Criteria
- **Pass:** The platform functions flawlessly across all supported browsers with zero critical or high-severity functional/visual defects. Brand aesthetics are perfectly maintained.
- **Fail:** Any core journey (checkout, auth, browsing) is blocked on a supported browser. Significant visual degradation occurs that compromises brand perception.

## Acceptance Criteria
- 100% of the Supported Browser Matrix has been tested.
- All high and critical bugs are resolved.
- Visual fidelity matches Figma designs across all environments.
- QA and UI/UX have signed off on the results.

## Quality Gates
- Code cannot be merged to the main production branch without passing automated cross-browser Playwright E2E tests.
- Manual cross-browser sign-off is required before final production deployment.

## Evidence Required
- A completed Cross-Browser Testing Matrix spreadsheet.
- Screenshots of the Index, Product Detail, and Checkout pages from each tested browser.
- Network and Console logs for any reported anomalies.

## Documentation Requirements
- All browser-specific bugs must be tagged in Jira/Linear with labels indicating the browser and version (e.g., `bug`, `safari`, `ios16`).
- Workarounds or polyfills added to the codebase must be documented in code comments and architectural decision records (ADRs).

## Common Failure Scenarios
- **Safari `dvh` issues:** Bottom navigation gets hidden behind Safari's collapsible address bar.
- **Firefox Flexbox:** Nested flex containers collapsing unexpectedly in Firefox.
- **Safari Date Parsing:** `Date.parse()` failing on non-ISO 8601 strings in Safari.
- **AdBlockers blocking Razorpay:** Checkout failing silently because the Razorpay SDK is blocked.
- **Font loading timeouts:** Custom fonts failing to load on slow connections, leaving invisible text.

## Troubleshooting
- If styling differs, inspect computed styles to ensure CSS variables are resolved correctly.
- Use BrowserStack local testing to debug staging issues on rare device/browser combinations.
- If JavaScript fails in an older browser, check the Vite Babel/SWC configuration for appropriate polyfills.
- Ensure proper Autoprefixer configurations are present for Tailwind CSS.

## Best Practices
- Develop with Progressive Enhancement in mind.
- Rely on feature detection rather than user-agent sniffing.
- Keep CSS selectors simple to avoid performance hits in older rendering engines.
- Test frequently during development, not just at the end of the sprint.

## Standards
- W3C Web Standards compliance.
- Brand Design System guidelines.
- ECMA-262 (ECMAScript) compliance for target environments.

## Review Process
1. QA executes tests and files reports.
2. Frontend Engineers resolve logged defects.
3. QA retests and marks defects as verified.
4. UI/UX Designer conducts a final aesthetic review.
5. Release Manager reviews the holistic report.

## Sign-off Requirements
- QA Lead signature.
- Lead Frontend Engineer signature.
- UI/UX Director signature.

## Completion Criteria
- All items on the Execution Checklist are marked complete.
- No open Critical/High defects related to cross-browser compatibility.
- Documentation and evidence are stored in the release repository.

## References to other Production Manual documents
- → See [00_MASTER_EXECUTION_PLAN.md]
- → See [02_UI_UX_REVIEW.md]
- → See [07_PERFORMANCE_AUDIT.md]
- → See [14_PLAYWRIGHT_E2E.md]
- → See [16_PRODUCTION_READINESS.md]

---
title: "02 - UI/UX Review Standard Operating Procedure"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Production Ready"
last_updated: "2026-08-05"
author: "Design Operations Team"
---

# UI/UX Review Standard Operating Procedure

## 1. Purpose
The purpose of this document is to establish the definitive procedures, quality gates, and standards for conducting comprehensive UI/UX reviews for House of Padmavati (HOP). This review ensures that all digital interfaces reflect the unyielding standards of luxury, maintain absolute visual consistency, and deliver an intuitive, emotionally intelligent user experience that aligns with our brand philosophy of "quiet elegance."

## 2. Scope
This UI/UX review encompasses the entirety of the House of Padmavati frontend web application. 
The specific pages under review include:
- Index (Home)
- Collections
- Category
- ProductDetail
- Cart
- Checkout
- OrderConfirmation
- Wishlist
- Gift
- Lookbook
- Journal
- Appointments
- About
- Account
- Campaigns
- Policy Pages (Privacy, Terms, Shipping, Returns)
- NotFound (404)

The scope explicitly covers visual design consistency, design token verification, component library implementation, interaction design, navigation flow, form UX, notifications, modals, loading states, error/empty states, responsive layouts, typography, spacing, dark mode, and luxury brand aesthetic compliance.

## 3. Objectives
- Guarantee absolute adherence to HOP design tokens (colors, typography, spacing).
- Validate the seamless implementation of shadcn/ui components (Radix primitives) combined with Tailwind CSS 3.
- Ensure flawless interaction design across all states (hover, focus, active, disabled).
- Confirm robust user flows via React Router v6 navigation.
- Validate accessible, gracefully handling form interfaces using react-hook-form and Zod.
- Deliver a digital experience comparable to luxury houses such as Hermès, Loro Piana, and Brunello Cucinelli.
- Prevent generic UI patterns that compromise brand equity.

## 4. Definitions
- **Design Tokens**: The atomic values needed to construct and maintain the design system (e.g., spacing, HSL color codes, font families).
- **Quiet Elegance**: The core brand ethos prioritizing restraint, intentionality, and flawless execution over ostentatious displays.
- **Radix Primitives**: Unstyled, accessible UI components forming the base of our shadcn/ui implementation.
- **E2E**: End-to-End, referring to the entire user journey through the application.

## 5. Roles & Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **Lead UI Designer** | Oversees aesthetic compliance, approves typography/color rendering, ensures luxury feel. |
| **Frontend Engineer** | Executes token verification, resolves component-level defects, ensures responsive fidelity. |
| **UX Researcher** | Evaluates navigation flows, interaction pacing, and form usability. |
| **Brand Director** | Final arbiter of "quiet elegance" and brand alignment (Sign-off authority). |
| **QA Specialist** | Validates edge cases, error states, and cross-browser consistency (covered deeply in other SOPs). |

## 6. Prerequisites
- The frontend development server must be running at `localhost:8080`.
- All design files (Figma) must be locked for the current release candidate.
- Test accounts must be provisioned with varied states (new user, user with order history, user with active wishlist).
- Browser cache must be cleared, or the review must be conducted in isolated testing environments.

## 7. Inputs
- Figma Design Specifications (Release Candidate).
- Frontend Codebase (Vite 5, React 18, Tailwind CSS 3).
- Defined Brand Guidelines (HOP Brand Book).
- Product Catalog Test Data.

## 8. Outputs
- UI/UX Defect Log (integrated into Bug Tracker).
- Signed-off UI/UX Audit Report.
- Approved Component Library documentation updates (if applicable).
- Figma vs. Implementation Delta Report.

## 9. Dependencies
- Execution of this procedure depends on the successful completion of the pre-production build.
- → See [01_PRE_PRODUCTION_AUDIT.md](01_PRE_PRODUCTION_AUDIT.md).
- Dependent on API mocking or a stable staging backend (Supabase) for dynamic state reviews.

## 10. Execution Order
This review must be conducted after the Pre-Production Audit but prior to the Accessibility Audit, Editorial Review, and Performance Audit.
1. Design Token Verification
2. Typography Hierarchy Audit
3. Global Component Library Audit
4. Page-by-Page Visual Consistency Audit
5. Interaction & Animation Review
6. Navigation Flow Validation
7. Form, Error, and State UX Review
8. Responsive Layout Verification
9. Luxury Aesthetic Compliance Check

## 11. Phases / Stages

### Phase 1: Foundation Audit
Focuses on design tokens, typography, colors, and global CSS utility application.

### Phase 2: Component & Pattern Review
Examines the building blocks (buttons, inputs, modals, toasts) across all states using shadcn/ui.

### Phase 3: Page & Flow Review
A meticulous walkthrough of every page template and key user journey (Checkout, Account Management, Lookbook exploration).

### Phase 4: State Management & Feedback
Evaluating how the system communicates with the user (loading, error, empty states, toasts).

## 12. Detailed Step-by-Step Procedures

### Step 1: Design Token Verification (Colors)
The UI reviewer shall inspect the application to ensure only approved HSL color tokens are used.
1. Open Chrome DevTools (`F12`).
2. Inspect the computed styles of root elements and key components.
3. Verify that the primary background colors utilize `warm-white` for light mode.
4. Verify that text colors utilize `ink` or `teal` appropriately.
5. Verify accent colors are restricted to `jasmine`, `sakura`, `sand`, and `crimson` (for destructive actions).
6. Ensure no raw hex codes or standard Tailwind colors (e.g., `bg-blue-500`) exist in the production stylesheets unless mapped directly to a brand token.

### Step 2: Typography Hierarchy Audit
HOP utilizes a specific typographic pairing to convey heritage and modernity.
1. Inspect headings (H1-H6). Verify they utilize `Cormorant Garamond` (serif) or `Vonca Regular` (display).
2. Inspect body text, captions, and UI labels. Verify they utilize `Inter` (sans).
3. Check computed font weights. Ensure restraint (avoid excessive bolding; favor regular/medium weights).
4. Verify `line-height` and `letter-spacing` (tracking) match Figma specifications precisely. Display typography should have slightly tighter tracking, while uppercase UI labels should have looser tracking.

### Step 3: Component Library Audit (shadcn/ui & Radix)
1. Navigate to a page containing complex components (e.g., Product Detail with Select/Dropdowns, Accordions).
2. Interact with Accordions (e.g., Product Details, Shipping Info). Verify smooth expansion/collapse without layout shifting.
3. Test Dropdown Menus (e.g., Sort By, User Account). Ensure they open precisely relative to the trigger.
4. Test Dialogs/Modals (e.g., Quick Shop, Size Guide). Verify the overlay backdrop blurs/darkens appropriately and focus is trapped inside the modal.

### Step 4: Interaction Design Review
1. Hover states: Verify that all interactive elements (buttons, links, product cards) have distinct, subtle hover states (e.g., a slight opacity shift, a graceful underline).
2. Focus states: Ensure keyboard focus states are visible but elegantly styled (not default browser outlines, unless explicitly styled to match the brand).
3. Animations:
   - Check fade-in on page load.
   - Check fade-up on scroll (using Intersection Observer).
   - Check drift animations on Lookbook imagery.
   - Ensure all animations use an easing curve that feels deliberate and unhurried (e.g., `cubic-bezier(0.4, 0, 0.2, 1)`).

### Step 5: Navigation Flow Validation (React Router v6)
1. Start at the Index page. Click through to Collections -> Category -> ProductDetail.
2. Observe page transitions. Ensure there are no abrupt flashes of unstyled content (FOUC).
3. Verify that scrolling position is reset to the top upon route change (unless navigating back).
4. Verify breadcrumbs update accurately.

### Step 6: Form UX Review
1. Navigate to the Checkout or Account creation page.
2. Interact with inputs. Verify floating labels or placeholder behavior.
3. Submit the form empty to trigger Zod validation.
4. Verify inline error messages appear gracefully, utilizing the `crimson` token color.
5. Test successful form submission. Ensure loading spinners appear inside the submit button to prevent double-submission.

### Step 7: Toast/Notification Review (Sonner)
1. Add an item to the Cart.
2. Verify the Sonner toast appears.
3. Check the toast positioning (typically bottom-right or top-center).
4. Verify the toast matches brand aesthetics (minimalist, correct typography, subtle shadow).
5. Ensure toasts auto-dismiss after an appropriate duration (e.g., 4000ms).

### Step 8: Loading State Review
1. Simulate a slow network connection in DevTools (Fast 3G).
2. Navigate to the Category page.
3. Verify that skeleton screens accurately reflect the layout of the incoming product cards.
4. Ensure skeletons use a subtle shimmering effect rather than harsh pulsating.
5. Verify spinners are minimalist and use brand colors (e.g., `ink` or `teal`).

### Step 9: Error & Empty State Review
1. Deliberately navigate to a non-existent route to trigger the NotFound (404) page. Verify its elegance and helpful routing back to shopping.
2. Disconnect the network and attempt an API call to verify the global error boundary gracefully handles the failure without exposing stack traces.
3. Navigate to an empty Cart and empty Wishlist.
4. Verify the empty states contain poetic, encouraging copy and a clear Call to Action (CTA) to browse collections, rather than a generic "No items found."

### Step 10: Responsive Layout Verification
1. Resize the browser window from 1920px down to 320px.
2. Verify breakpoints.
3. Ensure the Desktop Navigation morphs into an elegant Mobile Drawer (Hamburger menu) below the `lg` breakpoint.
4. Verify product grids transition from 4 columns to 2 or 1 column gracefully.
5. Ensure touch targets on mobile (buttons, links) are at least 44x44px for usability.

### Step 11: Dark Mode Verification (next-themes)
1. Toggle the theme to Dark Mode.
2. Verify the background shifts to a deep, rich color (e.g., a very dark teal or charcoal, not pure black `#000000`).
3. Verify text colors invert properly to `warm-white` or `sand` for readability.
4. Ensure images do not become blindingly bright (consider a subtle opacity filter on images in dark mode if specified by design).

## 13. Validation Steps
The reviewer must execute the following verifications systematically:
- Execute the Page Walkthrough Validation for all 17 specified pages.
- Execute the Component State Validation for Button, Input, Select, Dialog, Sheet, and Accordion.
- Execute the Theme Toggle Validation across 5 different distinct page templates.

## 14. Checklists

### Global UI Checklist
- [ ] Root HSL variables are correctly defined and mapped to Tailwind config.
- [ ] No inline styles are overriding Tailwind utility classes inappropriately.
- [ ] `Cormorant Garamond` is applied to headings.
- [ ] `Inter` is applied to body text.
- [ ] `Vonca Regular` is applied to designated display areas.
- [ ] Dark mode toggle functions without flicker.
- [ ] Hover states exist for all clickable elements.
- [ ] Focus rings are styled consistently and elegantly.

### Page-Specific Checklist
- [ ] **Index**: Hero section takes up appropriate viewport height (e.g., `min-h-screen`).
- [ ] **Collections**: Grid gap spacing is consistent (e.g., `gap-8` or `gap-12`).
- [ ] **ProductDetail**: Image gallery sticky scrolling behaves correctly on desktop.
- [ ] **Cart**: Sticky summary section on desktop remains visible.
- [ ] **Checkout**: Form inputs align perfectly; Razorpay integration iframe/modal integrates seamlessly.
- [ ] **Lookbook**: Drift animations trigger at the correct scroll threshold.

### State Checklist
- [ ] Skeleton loaders match the final content dimensions.
- [ ] Empty cart displays "Your cart is empty" with a CTA to shop.
- [ ] 404 page is styled with brand fonts and colors.
- [ ] Form validation errors use the `crimson` color token.
- [ ] Success toasts (Sonner) appear upon Wishlist add.

## 15. Pass / Fail Criteria

**Pass:**
- Zero (0) critical visual inconsistencies across the specified 17 pages.
- All brand tokens (colors, fonts) are strictly adhered to.
- Animations run smoothly without jank (60fps).
- Forms validate correctly with elegant error messaging.
- Responsive design adapts flawlessly down to 320px width.

**Fail:**
- Use of unauthorized colors or typography.
- Broken layouts on any standard viewport size.
- Clunky, jittery, or missing animations.
- Unstyled browser default form elements or focus outlines.
- Generic, unbranded empty/error states.
- Any UI element feeling "cheap" or misaligned with the luxury aesthetic.

## 16. Acceptance Criteria
The UI/UX Review is considered accepted when the Lead UI Designer and Brand Director review the findings, sign off on the delta report, and confirm that the digital experience embodies "quiet elegance" akin to our reference luxury brands.

## 17. Quality Gates
- **Gate 1: Token Compliance**: Automated or manual check confirming no unauthorized colors/fonts.
- **Gate 2: Component Integrity**: Visual regression tests or manual review of all shadcn/ui components.
- **Gate 3: Luxury Aesthetic Approval**: Manual review by the Brand Director.

## 18. Evidence Required
- Screenshots of any defects found, annotated with Figma vs. Implementation differences.
- Screen recordings of broken animations or interaction bugs.
- Completed and signed markdown checklists from this document.

## 19. Documentation Requirements
- All bugs must be logged in the Bug Tracker.
- Any intentional deviations from Figma due to technical constraints must be documented in the Component Library documentation.

## 20. Common Failure Scenarios
- **FOUC (Flash of Unstyled Content)**: Usually caused by fonts loading late or CSS hydration issues.
- **Z-Index Conflicts**: Modals, sticky headers, and dropdowns overlapping incorrectly.
- **Mobile Safari Bottom Bar**: 100vh elements behaving poorly due to the dynamic browser UI on iOS.
- **Hydration Mismatches**: React throwing errors because server/static markup differs from client markup (e.g., timestamp rendering).
- **Form Jitter**: Layout shifting when validation error messages appear below inputs.

## 21. Troubleshooting
- **Fixing Form Jitter**: Ensure input wrappers have a fixed minimum height or reserve space for error text.
- **Fixing Z-Index**: Rely on a standardized z-index scale (e.g., header: 40, modal: 50, toast: 100) rather than arbitrary large numbers like `9999`.
- **Fixing 100vh on iOS**: Use the CSS `dvh` (dynamic viewport height) unit instead of `vh`.

## 22. Best Practices
- **Spacing**: Use multiples of 4 or 8 for spacing (Tailwind defaults). Never use arbitrary spacing values unless strictly required by design.
- **Contrast**: While maintaining elegance, ensure text contrast meets WCAG AA standards (to be fully verified in the Accessibility Audit).
- **Restraint**: If an animation or interaction feels "too much," it likely is. Erring on the side of subtlety is required for luxury UI.

## 23. Standards
- Framework: React 18
- Styling: Tailwind CSS 3
- Components: shadcn/ui (Radix)
- Routing: React Router v6
- Icons: Lucide React (with stroke width adjusted to 1.5 or 1 for elegance)
- Forms: react-hook-form + zod

## 24. Review Process
1. Frontend Engineer conducts the initial pass using this SOP.
2. Lead UI Designer reviews the staging environment.
3. Defects are logged and triaged.
4. Fixes are implemented.
5. Brand Director conducts the final visual sign-off.

## 25. Sign-off Requirements
- Name and Signature of Lead UI Designer: _______________________
- Name and Signature of Brand Director: _______________________
- Date of Sign-off: _______________________

## 26. Completion Criteria
This SOP is marked as complete when all checks pass, all evidence is collected, zero Critical/High UI defects remain open, and all required signatures are obtained.

## 27. References
- → See [00_MASTER_EXECUTION_PLAN.md](00_MASTER_EXECUTION_PLAN.md)
- → See [01_PRE_PRODUCTION_AUDIT.md](01_PRE_PRODUCTION_AUDIT.md)
- → See [05_BRAND_REVIEW.md](05_BRAND_REVIEW.md)
- → See [06_ACCESSIBILITY_AUDIT.md](06_ACCESSIBILITY_AUDIT.md)
- → See [15_BUG_TRACKER.md](15_BUG_TRACKER.md)

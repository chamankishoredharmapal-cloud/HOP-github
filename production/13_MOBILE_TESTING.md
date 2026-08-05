---
document_id: SOP-PROD-013
title: 13. Mobile Testing Procedures
version: 1.0.0
owner: QA / UX Team
status: Approved
---

# 13. Mobile Testing Procedures

## Purpose
The purpose of this Standard Operating Procedure (SOP) is to outline the comprehensive mobile testing strategy for the House of Padmavati (HOP) digital platform. This document ensures that the mobile experience is flawless, responsive, and adheres to the brand's luxury standards across all supported devices and viewports.

## Scope
This procedure applies to all frontend application interfaces of the HOP platform, including all key pages (Index, Collections, Category, ProductDetail, Cart, Checkout, OrderConfirmation, Wishlist, Gift, Lookbook, Journal, Appointments, About, Account, Campaigns) and critical flows (browsing, checkout, account management). It covers functional, visual, interaction, and performance testing on mobile and tablet devices.

## Objectives
- Ensure pixel-perfect responsive design across all defined breakpoints up to 1440px.
- Validate touch interactions, gestures, and tap targets for optimal mobile usability.
- Verify seamless end-to-end user journeys (cart, checkout, payment) on mobile devices.
- Guarantee consistent typography, color rendering, and media display on mobile screens.
- Ensure accessibility standards are met for mobile screen readers (VoiceOver, TalkBack).
- Document and resolve all mobile-specific rendering or interaction defects before launch.

## Definitions
- **Breakpoint**: A specific viewport width at which the layout adapts to the screen size (defined by Tailwind config).
- **Safe Area**: The visible area of the screen not occluded by hardware features like notches, dynamic islands, or software indicators (home indicator, status bar).
- **Tap Target**: Any interactive UI element (button, link, input) that a user can interact with via touch.
- **Embla Carousel**: The specific library (`embla-carousel-react`) used for swipeable product galleries on mobile.

## Roles & Responsibilities
| Role | Responsibility |
|------|----------------|
| **QA Lead** | Oversees execution of mobile testing, approves test results, signs off on quality gates. |
| **Mobile QA Tester** | Executes physical device and emulator testing according to the matrix, logs defects. |
| **Frontend Developer** | Resolves responsive layout issues, touch interaction bugs, and performance bottlenecks. |
| **UX Designer** | Reviews mobile implementations to ensure they meet the quiet elegance and brand standards. |

## Prerequisites
- Validated baseline functionality on desktop (`→ See [12_CROSS_BROWSER_TESTING.md]`).
- Access to physical devices and/or cloud testing platforms (BrowserStack, LambdaTest) matching the device matrix.
- Environment provisioned with Production-like data (products, categories, users).
- Test accounts configured for mobile payment testing (Razorpay test credentials).
- Tailwind configuration confirmed and breakpoints documented.

## Inputs
- Test scripts and scenarios derived from core user journeys.
- Design specifications and mobile mockups for all key pages.
- Access credentials for test environments.
- Tailwind configuration file containing breakpoint values.

## Outputs
- Executed mobile test cases with pass/fail status.
- Comprehensive defect log for any identified mobile issues.
- Mobile accessibility validation report.
- Visual evidence (screenshots/recordings) of key flows on major devices.
- Signed-off Mobile Readiness Certificate.

## Dependencies
- Backend APIs and Supabase Edge Functions must be stable.
- Responsive design implementation completed by the development team.
- `embla-carousel-react` integration completed for galleries.
- Razorpay mobile integrations configured and functional.

## Execution Order
1. Device Matrix Definition & Setup
2. Responsive Breakpoint Verification
3. Mobile Navigation & Interaction Testing
4. Critical User Flow Execution (Cart & Checkout)
5. Touch Gesture & Hardware Integration Testing
6. Performance & Network Condition Simulation
7. Accessibility Testing (Mobile Screen Readers)
8. Defect Triage & Resolution
9. Final Sign-off

---

## Phases / Stages

### Stage 1: Device Matrix Definition & Setup
To guarantee an uncompromising experience, testing must be executed on a representative sample of modern luxury consumer devices.

**Target Device Matrix:**
| OS | Device Class | Specific Models | Primary Browser | Secondary Browser |
|----|--------------|-----------------|-----------------|-------------------|
| iOS | Mobile | iPhone 14/15 Pro Max, iPhone 13 mini, iPhone SE (3rd Gen) | Safari | Chrome for iOS |
| iOS | Tablet | iPad Pro 12.9", iPad Air, iPad mini | Safari | Chrome for iOS |
| Android | Mobile | Samsung Galaxy S23/S24 Ultra, Google Pixel 7/8 Pro, Samsung Z Fold 5 | Chrome | Samsung Internet |
| Android | Tablet | Samsung Galaxy Tab S9 | Chrome | - |

**Setup Steps:**
1. Provision physical devices or configure cloud testing environments for the matrix above.
2. Ensure devices are running the latest stable OS version and the one immediately prior (e.g., iOS 17 and iOS 16).
3. Clear browser cache, cookies, and local storage on all test devices before beginning execution.
4. Disable any ad-blockers or experimental browser flags that might interfere with rendering.

### Stage 2: Responsive Breakpoint Verification
Verify the structural integrity of the layout across all defined Tailwind container breakpoints up to max 1440px.

**Standard Breakpoints:**
- Mobile (sm): `< 640px`
- Tablet Portrait (md): `640px - 767px`
- Tablet Landscape (lg): `768px - 1023px`
- Desktop (xl): `1024px - 1279px`
- Large Desktop (2xl): `1280px - 1440px` (Max width containment)

**Execution Steps:**
1. Load the application on devices representing each breakpoint category.
2. Verify that horizontal scrolling is strictly prohibited on all pages (unless intentionally designed for elements like carousels).
3. Confirm that typography scales appropriately (Cormorant Garamond and Inter) without clipping or overlapping.
4. Verify that grid layouts collapse gracefully from multi-column (desktop) to single or double columns (mobile).
5. Ensure padding and margins adjust to provide adequate breathing room while maximizing screen real estate on smaller devices.

### Stage 3: Mobile Navigation & Interaction Testing
Navigation on mobile devices requires precision and intuitive interaction models.

**Navigation Header:**
1. Verify the hamburger menu icon is prominent, has a sufficient tap target (min 44x44pt), and toggles the mobile drawer smoothly.
2. Confirm the mobile menu drawer uses a backdrop blur or overlay to obscure the main content.
3. Validate that tapping outside the menu drawer or pressing a "close" icon dismisses the menu correctly.
4. Verify that deep navigation (categories, sub-categories) within the menu drawer functions logically without excessive nesting.

**Touch Interaction & Tap Targets:**
1. Inspect all interactive elements (buttons, links, form inputs) to ensure a minimum tap target area of 44x44 CSS pixels.
2. Verify adequate spacing between tap targets to prevent accidental mis-taps (especially critical in Cart and Checkout).
3. Confirm that touch states (active/pressed) are visually represented immediately upon interaction.
4. Validate that scrolling over interactive elements does not inadvertently trigger them.

### Stage 4: Critical User Flow Execution (Cart & Checkout)
The path to purchase must be frictionless on mobile devices.

**Product Discovery & Image Gallery (`embla-carousel-react`):**
1. Navigate to a `ProductDetail` page on a mobile device.
2. Swipe left and right on the product image gallery. Ensure the swipe is fluid, responsive, and snaps to the next image cleanly.
3. Verify pinch-to-zoom functionality on product images if implemented, ensuring the image can be dismissed or reset easily.
4. Test the "Add to Cart" button, ensuring the action is confirmed via a mobile-friendly notification or mini-cart slide-out.

**Mobile Cart Experience:**
1. Open the mobile cart (either a dedicated page or a slide-out drawer).
2. Verify that product details, sizes, quantities, and pricing are clearly legible on small screens.
3. Test quantity adjustments (+/- buttons) and item removal, ensuring the UI updates responsively.
4. Validate that the checkout button remains persistently visible or easily accessible within the cart view.

**Mobile Checkout (`Checkout.tsx`):**
1. Proceed to the checkout flow.
2. Verify that the form layout is optimized for vertical scrolling.
3. **Form Usability:**
   - Confirm appropriate keyboard types are invoked (e.g., numeric keypad for phone numbers/PIN codes, email keyboard for email addresses).
   - Test browser autofill and autocomplete attributes for shipping and billing addresses.
4. **Mobile Payment (Razorpay):**
   - Execute a transaction using the Razorpay mobile SDK or mobile web checkout.
   - Verify that the payment gateway overlay is fully responsive and does not break the viewport.
   - Test UPI intent flows (if applicable for Indian market) to ensure they deep-link correctly to installed UPI apps (GPay, PhonePe).

### Stage 5: Touch Gesture & Hardware Integration Testing

**Orientation & Safe Areas:**
1. Rotate the device between portrait and landscape modes on key pages (Index, Product Detail). Ensure the UI reflows without breaking or requiring a manual refresh.
2. On devices with notches or dynamic islands (e.g., iPhone 14/15), verify that the header, navigation, and content respect the CSS `env(safe-area-inset-*)` variables. Ensure nothing is obscured.
3. Confirm that fixed elements (bottom sticky CTA buttons) respect the safe area at the bottom of the screen (home indicator area).

**Gesture Conflicts & Browser UI:**
1. Test "Pull-to-refresh" behavior. Ensure it functions natively where appropriate, but does not interfere with internal scrollable areas (like a modal or a map).
2. Verify that internal swipe gestures (e.g., swiping on an Embla carousel) do not trigger the browser's native "swipe back/forward" history navigation.
3. Observe the behavior of the browser's address bar (expanding/collapsing on scroll). Ensure fixed UI elements (like bottom navigation or sticky add-to-cart buttons) reposition correctly without jitter when the viewport height changes dynamically.

### Stage 6: Performance & Network Condition Simulation
Mobile users often experience variable network conditions.

1. Connect the test device (or configure the emulator) to simulate 3G and 4G network speeds.
2. Load the Index page and a media-heavy Lookbook page.
3. Verify that the application remains responsive during loading.
4. Confirm that images are properly optimized, utilizing `srcset` and `sizes` attributes to serve appropriately scaled images for the mobile viewport.
5. Verify that skeleton loaders or fallback UI are displayed smoothly while data is fetched.
6. Test application behavior when transitioning from online to offline, ensuring graceful error handling.

### Stage 7: Accessibility on Mobile
Ensure the quiet elegance of the brand is accessible to all users.

1. Enable VoiceOver (iOS) or TalkBack (Android).
2. Navigate through the core flow (Home -> Category -> Product -> Cart -> Checkout) using only screen reader gestures (swipe right/left to navigate, double-tap to activate).
3. Verify that all essential elements have meaningful ARIA labels or accessible names.
4. Ensure the mobile menu and modal dialogs trap focus correctly when opened, preventing the screen reader from accessing background content.
5. Confirm that carousel navigation (Embla) is accessible via screen reader or provides alternative navigation controls.

### Stage 8: Deep Linking & PWA Verification (If Applicable)
1. If Progressive Web App (PWA) capabilities are implemented, verify the "Add to Home Screen" prompt and functionality.
2. Launch the application from the home screen icon and ensure it opens in standalone mode without browser chrome.
3. Test deep links (e.g., a link to a specific product sent via email or SMS). Ensure tapping the link opens the correct page directly within the mobile browser or PWA.

---

## Validation Steps
1. Execute the full test suite against the Device Matrix.
2. Capture screenshots of the Index, Product Detail, and Checkout pages on iPhone 15 Pro, Galaxy S24 Ultra, and an iPad.
3. Record video evidence of the swipe interaction on the Embla carousel and the Razorpay mobile payment flow.
4. Run Lighthouse mobile performance audits and attach the reports.
5. Document any visual discrepancies, interaction failures, or performance issues in the bug tracker (`→ See [15_BUG_TRACKER.md]`).

---

## Checklists

### Mobile Layout & Responsive Checklist
- [ ] No horizontal scrolling exists on any page on viewport widths < 1440px.
- [ ] Grid layouts collapse correctly across all Tailwind breakpoints.
- [ ] Safe area insets (notches, dynamic islands, home indicators) are respected.
- [ ] Typography scales smoothly and remains legible (minimum 16px for body text to prevent iOS zoom on focus).
- [ ] Orientation changes (portrait/landscape) reflow the UI gracefully.

### Interaction & Navigation Checklist
- [ ] All tap targets are a minimum of 44x44 pixels.
- [ ] Hamburger menu opens/closes smoothly with background obscurement.
- [ ] Embla carousel swipe gestures are fluid and do not conflict with browser history navigation.
- [ ] Active/pressed states are visible immediately upon touch.
- [ ] Pull-to-refresh does not interfere with internal scrolling regions.

### Forms & Checkout Checklist
- [ ] Correct mobile keyboard types invoke automatically (email, tel, numeric).
- [ ] Browser autofill/autocomplete functions correctly for address forms.
- [ ] Input focus does not cause the page layout to break when the software keyboard appears.
- [ ] Fixed CTA buttons (e.g., sticky "Add to Cart" or "Pay Now") remain visible and accessible.
- [ ] Razorpay mobile integration handles popups/redirects gracefully within the mobile browser.

### Mobile Accessibility & Performance Checklist
- [ ] VoiceOver (iOS) can successfully complete a checkout flow.
- [ ] TalkBack (Android) can successfully complete a checkout flow.
- [ ] Images serve appropriately sized assets for mobile viewports (srcset/sizes).
- [ ] UI remains responsive and provides feedback during slow network simulation (3G/4G).

---

## Pass / Fail Criteria
| Metric | Pass Condition | Fail Condition |
|--------|----------------|----------------|
| Responsiveness | Layout adapts flawlessly across all breakpoints; no horizontal scrolling. | Layout breaks, horizontal scroll exists, text clips. |
| Tap Targets | 100% of critical interactive elements meet 44x44px minimum. | Key buttons/links are too small or too close together. |
| Core Flows | Cart and Checkout can be completed without errors on all matrix devices. | Blocker or critical errors prevent checkout on mobile. |
| Touch Gestures | Carousels and menus respond smoothly to touch without native browser conflicts. | Swiping carousel triggers browser back navigation. |
| Accessibility | Screen readers can navigate and purchase products. | Critical elements are hidden from screen readers or focus traps fail. |

## Acceptance Criteria
- All tests in the execution phase pass on the devices specified in the Device Matrix.
- No CRITICAL or HIGH severity mobile-specific defects remain open.
- The UX team has reviewed and approved the mobile implementation for brand consistency.
- Mobile screenshots and performance reports are documented and attached.

## Quality Gates
- **Design Review Gate:** UX approval of mobile specific implementations (menus, carousels).
- **Functional Gate:** Successful execution of E2E flows on physical mobile devices.
- **Performance Gate:** Lighthouse mobile score > 85 for core pages.

## Evidence Required
- Links to defect tickets (Jira/Linear) tagged with `mobile`.
- Zip file containing screenshots of key pages across representative iOS and Android devices.
- Screen recordings of complex interactions (Embla carousel, Razorpay checkout, mobile menu).
- Lighthouse mobile audit HTML reports.

## Documentation Requirements
- Update this SOP if new mobile devices or form factors (e.g., foldables) require specific testing strategies.
- Maintain a separate repository of the approved mobile screenshots for visual regression baselining.

## Common Failure Scenarios
1. **iOS Input Zoom:** iOS Safari automatically zooms in when an input field is focused if the font size is less than 16px. Ensure all form inputs use at least `text-base` (16px) on mobile.
2. **100vh on Mobile Browsers:** Using `h-screen` or `100vh` often causes issues on mobile browsers due to the dynamic address bar. Use `h-[100dvh]` (dynamic viewport height) where available, or rely on content-driven height.
3. **Sticky Elements Obscuring Content:** A sticky bottom "Add to Cart" button might overlap the site footer or important information. Ensure sufficient padding (`pb-safe`) is added to the bottom of the main layout to account for fixed elements.
4. **Hover States Sticking:** On touch devices, `:hover` states can sometimes stick after a tap. Use `@media (hover: hover)` media queries in CSS to apply hover effects only on devices that support them.

## Troubleshooting
- **Layout breaking on specific device:** Use remote debugging (Chrome DevTools for Android, Safari Web Inspector for iOS) to inspect the DOM and CSS directly on the physical device.
- **Carousel swipe issues:** Check `embla-carousel-react` configuration options (dragFree, containScroll) and ensure touch-action CSS properties are set correctly to prevent browser intervention.
- **Payment gateway overlay fails:** Ensure the viewport meta tag is configured correctly (`<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">`) and that cross-origin policies allow the Razorpay iframe/popup.

## Best Practices
- Always test on physical devices, not just browser emulators (Chrome DevTools device mode), as physical devices reveal true touch behavior, performance constraints, and hardware-specific UI overlays.
- Prioritize the "thumb zone" – place critical actions (Add to Cart, Checkout) within easy reach of the thumb when holding the device one-handed.
- Minimize text input on mobile; leverage dropdowns, checkboxes, and autofill wherever possible.

## Standards
- Tailwind CSS mobile-first approach.
- WCAG 2.1 AA for touch target sizes and contrast.
- House of Padmavati Design System (mobile typography and spacing scales).

## Review Process
- Mobile QA Tester compiles the test results and visual evidence.
- QA Lead reviews the findings and ensures all critical issues are logged and addressed.
- Frontend Lead verifies technical fixes for any reported layout or interaction bugs.

## Sign-off Requirements
- Signature / Approval from the QA Lead.
- Signature / Approval from the UX Lead.
- All Mobile Checklists verified.

## Completion Criteria
- Testing executed across all devices in the matrix.
- No blocking defects exist.
- Documentation and evidence artifacts are securely stored.

## References
- `→ See [02_UI_UX_REVIEW.md]`
- `→ See [06_ACCESSIBILITY_AUDIT.md]`
- `→ See [07_PERFORMANCE_AUDIT.md]`
- `→ See [12_CROSS_BROWSER_TESTING.md]`
- `→ See [14_PLAYWRIGHT_E2E.md]`

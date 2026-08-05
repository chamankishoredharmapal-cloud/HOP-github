---
title: "Playwright E2E Testing Standard Operating Procedure"
document_id: "HOP-PROD-14"
version: "1.0.0"
status: "Active"
owner: "QA Engineering Lead"
classification: "Internal - Confidential"
last_updated: "2026-08-05"
---

# 14: Playwright E2E Testing Standard Operating Procedure

## Purpose
The purpose of this document is to define the standard operating procedures, architectural patterns, and execution standards for End-to-End (E2E) testing of the House of Padmavati (HOP) platform using Playwright. This ensures that all critical user journeys remain intact, performant, and bug-free across iterations, safeguarding the brand's luxury digital experience.

## Scope
This procedure applies to all frontend and integration E2E tests for the HOP web platform, executed via Playwright in the `src/__tests__/` directory. It covers test creation, execution, CI/CD integration, and maintenance.

## Objectives
- Standardize the approach to E2E testing using Playwright.
- Ensure 100% test coverage for Critical User Journeys (CUJs).
- Establish guidelines for test data management, mocking, and Page Object Models (POM).
- Define procedures for visual regression and test stability.
- Mandate reporting and CI integration standards.

## Definitions
- **CUJ**: Critical User Journey (e.g., Checkout, Add to Cart).
- **POM**: Page Object Model, a design pattern for test maintenance.
- **E2E**: End-to-End, testing the flow of an application from start to finish.
- **Flaky Test**: A test that both passes and fails intermittently without code changes.

## Roles & Responsibilities
| Role | Responsibility |
|------|----------------|
| **QA Engineer** | Writing, maintaining, and executing Playwright tests. Monitoring CI pipelines. |
| **Frontend Engineer** | Adding `data-testid` attributes to UI components, ensuring testability. |
| **DevOps Engineer** | Maintaining the CI/CD pipeline integration for Playwright. |
| **Tech Lead** | Reviewing E2E test PRs, ensuring alignment with architectural standards. |

## Prerequisites
- Node.js environment configured.
- HOP platform dependencies installed (`npm install`).
- Playwright dependencies installed (`npx playwright install`).
- Access to `playwright.config.ts`.
- Local development server functional on `http://localhost:8080`.

## Inputs
- Feature requirements and User Stories.
- Figma designs (for visual regression).
- `playwright.config.ts` configuration file.

## Outputs
- Automated test suites in `src/__tests__/`.
- Playwright HTML and JSON reports.
- Video recordings and trace logs of failed tests.
- CI/CD build statuses.

## Dependencies
- Vite dev server (`npm run dev`).
- Chromium browser binaries.
- Supabase (mocked or staging environment).
- Razorpay test environment keys.

## Execution Order
1. Environment Setup
2. Test Architecture Definition
3. CUJ Specification & Implementation
4. Test Data & Mocking Setup
5. Local Execution & Validation
6. CI/CD Integration
7. Maintenance & Reporting

---

## Phases / Stages

### Phase 1: E2E Test Architecture and Directory Structure

The E2E tests are located in `src/__tests__/`. The directory structure MUST adhere to the following layout:

```text
src/__tests__/
├── e2e/                     # Core end-to-end tests
│   ├── journeys/            # Critical User Journeys (CUJs)
│   │   ├── checkout.spec.ts
│   │   ├── browse.spec.ts
│   │   └── ...
│   ├── pages/               # Page Object Models (POM)
│   │   ├── BasePage.ts
│   │   ├── CheckoutPage.ts
│   │   ├── ProductPage.ts
│   │   └── ...
│   ├── fixtures/            # Test data and Playwright fixtures
│   │   ├── user.fixture.ts
│   │   └── cart.fixture.ts
│   ├── mocks/               # API Mocking definitions
│   │   ├── supabase.mock.ts
│   │   └── razorpay.mock.ts
│   └── visual/              # Visual regression test baselines
└── playwright.config.ts     # Root config (linked/referenced)
```

**Configuration Baseline (`playwright.config.ts`)**:
- Browser: Chromium (headless)
- Base URL: `http://localhost:8080`
- Viewport: 1440x900
- Web Server Command: `npm run dev`
- Sandbox: Disabled (for CI compatibility).

### Phase 2: Test Environment Setup Procedures

1. **Install Playwright:**
   ```bash
   npm init playwright@latest
   # Or if already initialized:
   npx playwright install chromium
   ```
2. **Environment Variables:**
   Create a `.env.test` file. Ensure `VITE_API_URL` points to the mock server or local staging, and `RAZORPAY_KEY_ID` uses the test key.
3. **Start Local Server:**
   The Playwright config must define the web server to start automatically.
   ```typescript
   webServer: {
     command: 'npm run dev',
     url: 'http://localhost:8080',
     reuseExistingServer: !process.env.CI,
   },
   ```

### Phase 3: Critical User Journey (CUJ) Test Specifications

All CUJs must be covered by automated tests.

#### a. Homepage to Product Browse Flow
- **Start:** `http://localhost:8080/`
- **Actions:** Navigate via primary navigation (`/collections`).
- **Assertions:** Verify hero banner rendering. Verify category links route correctly.

#### b. Product Search and Filtering
- **Start:** `http://localhost:8080/search`
- **Actions:** Enter query, apply filters (color, material, price).
- **Assertions:** Verify product grid updates corresponding to filter criteria. Verify empty states.

#### c. Product Detail View
- **Start:** `http://localhost:8080/product/:slug`
- **Actions:** View images, read descriptions. Select size/variant.
- **Assertions:** Verify price display, 'Add to Cart' button state, image zoom functionality.

#### d. Add to Cart Flow
- **Actions:** Click 'Add to Cart' on a product detail page.
- **Assertions:** Verify slide-out cart appears. Verify product details match. Verify subtotal.

#### e. Cart Management
- **Start:** Slide-out cart or `/cart` page.
- **Actions:** Increase/decrease quantity, remove item.
- **Assertions:** Verify total price updates, empty cart messaging appears when appropriate.

#### f. Checkout Flow (End-to-End)
- **Start:** `/checkout`
- **Actions:** Enter shipping details, select shipping method, proceed to payment.
- **Assertions:** Form validation errors, shipping cost calculation.

#### g. Razorpay Payment Simulation
- **Actions:** Intercept Razorpay popup or mock the Razorpay SDK response.
- **Assertions:** Verify successful payment payload is sent to the backend.

#### h. Order Confirmation Verification
- **Start:** `/checkout/success`
- **Assertions:** Verify order number is present. Verify items ordered match.

#### i. Wishlist Management
- **Actions:** Click heart icon on product card.
- **Assertions:** Item added to wishlist. Counter increments. (Requires user auth context).

#### j. User Registration and Login
- **Actions:** Submit registration form, login via OTP or password.
- **Assertions:** Token stored, UI updates to authenticated state, redirect to account dashboard.

#### k. Account Management
- **Start:** `/account`
- **Actions:** View order history, update addresses.
- **Assertions:** Data accurately reflects test fixtures.

#### l. Gift Purchase Flow
- **Actions:** Add gift wrapping option during checkout, enter gift message.
- **Assertions:** Gift details appear in order summary.

#### m. Appointment Booking
- **Start:** `/appointments`
- **Actions:** Select date/time, submit form.
- **Assertions:** Confirmation message displayed, API call made.

#### n. Journal/Blog Navigation
- **Start:** `/journal`
- **Assertions:** Articles load, pagination works, article content renders.

#### o. Lookbook Browsing
- **Start:** `/lookbook`
- **Assertions:** High-res images load, carousel controls function.

### Phase 4: Test Data Management

- **Fixtures:** Use Playwright's `test.extend` to inject specific user states (e.g., `authenticatedUser`, `guestWithCart`).
- **Factories:** Utilize factory functions to generate mock JSON payloads for Supabase responses.
- **Seed Data:** Do not rely on persistent DB state. Tests must inject necessary data via API mocks or ensure isolation.

### Phase 5: API Mocking Strategy

Mocking external APIs is critical for speed and reliability.

- **Supabase Mocking:** Intercept network requests to `*.supabase.co`.
  ```typescript
  await page.route('**/rest/v1/products**', async (route) => {
    const json = [ /* mock product data */ ];
    await route.fulfill({ json });
  });
  ```
- **Razorpay Mocking:** Intercept the Razorpay script or API endpoint to simulate success/failure without actual transactions.

### Phase 6: Page Object Model (POM) Patterns

All tests MUST use POMs to encapsulate element selectors and actions.

```typescript
// src/__tests__/e2e/pages/CheckoutPage.ts
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('checkout-email-input');
    this.submitBtn = page.getByRole('button', { name: 'Proceed to Payment' });
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }
}
```

### Phase 7: Visual Regression Testing

- Use Playwright's `toHaveScreenshot()` for critical UI components (e.g., Product Cards, Header).
- Store baselines in `src/__tests__/e2e/visual/`.
- Update baselines ONLY when deliberate UI changes are made: `npx playwright test --update-snapshots`.
- Viewport size MUST be strictly enforced (1440x900) for visual tests.

### Phase 8: Test Execution & CI/CD Integration

**Local Execution Commands:**
- UI Mode: `npx playwright test --ui`
- Headless: `npx playwright test`
- Specific File: `npx playwright test checkout.spec.ts`
- Debug: `npx playwright test --debug`

**CI/CD Pipeline:**
- Tests must run on every Pull Request to `main`.
- Use the official Playwright GitHub Action or equivalent container.
- Artifacts (traces, videos, HTML report) must be uploaded on failure.

### Phase 9: Reporting and Artifact Collection

- The Playwright config must specify:
  ```typescript
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  }
  ```
- Artifacts must be stored for 14 days in the CI artifact repository for debugging.

### Phase 10: Flaky Test Management

- Flaky tests must be marked with `test.fixme()` until resolved.
- Implement retries in CI (e.g., `retries: 2`).
- Do not use fixed timeouts (`page.waitForTimeout()`). Always use web-first assertions (e.g., `expect(locator).toBeVisible()`).

### Phase 11: Smoke Test vs Full Regression

- **Smoke Suite:** A subset of critical tests (Checkout, Login, Add to Cart). Tagged with `@smoke`. Runs on minor deployments.
  `npx playwright test --grep @smoke`
- **Full Regression:** Runs all tests. Executed nightly and before major releases.

### Phase 12: Test Maintenance Procedures

- **Selector Updates:** If UI changes, update the POM, not the test files.
- **Dead Code:** Remove unused mocks and fixtures periodically.
- **Documentation:** Keep the POM documentation updated if complex interactions are added.

---

## Example Test Specification

```typescript
// src/__tests__/e2e/journeys/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CartPage } from '../pages/CartPage';

test.describe('Checkout Flow @smoke', () => {
  test('User can complete purchase as guest', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    // Mock network responses
    await page.route('**/api/checkout/init', async (route) => {
      await route.fulfill({ json: { sessionId: 'mock-session-123' } });
    });

    await page.goto('/checkout');
    await checkoutPage.enterEmail('test@houseofpadmavati.com');
    await checkoutPage.fillShippingDetails({
      firstName: 'Padmavati',
      lastName: 'Tester',
      address: '123 Silk Lane',
      city: 'Mumbai',
      pincode: '400001'
    });
    
    await checkoutPage.submitBtn.click();
    
    // Verify routing to payment or success
    await expect(page).toHaveURL(/.*checkout\/payment/);
  });
});
```

---

## Detailed Step-by-Step Procedures

1. **Creating a New Test:**
   - Identify the user journey.
   - Create or update the necessary POM files.
   - Create a `*.spec.ts` file in the appropriate `journeys` folder.
   - Implement mocking for any external API calls.
   - Write steps using POM methods.
   - Add web-first assertions.
2. **Debugging a Failure:**
   - Download the trace file (`trace.zip`) from the CI artifact.
   - Run `npx playwright show-trace trace.zip`.
   - Analyze the network timeline, console logs, and DOM snapshots.
   - Reproduce locally using `npx playwright test --debug`.
3. **Updating Visual Baselines:**
   - Ensure you are on the target branch.
   - Run the specific visual test: `npx playwright test visual.spec.ts --update-snapshots`.
   - Commit the updated image baselines.

## Validation Steps
- Execute `npm run test:e2e` locally.
- Verify that 100% of tests pass.
- Verify that the HTML report is generated in the `playwright-report/` directory.

## Checklists

### Test Creation Checklist
- [ ] Test covers a defined User Story or CUJ.
- [ ] Test utilizes Page Object Models.
- [ ] No hardcoded `waitForTimeout` used.
- [ ] `data-testid` used for element selection where possible.
- [ ] Network dependencies are mocked or isolated.
- [ ] Tags (e.g., `@smoke`) applied appropriately.

### Pre-Merge Checklist
- [ ] All E2E tests pass locally.
- [ ] Visual regression snapshots updated if UI changed.
- [ ] Linting passes on test files.
- [ ] CI pipeline is green.

## Pass / Fail Criteria
- **Pass:** All tests in the suite execute successfully with exit code 0. Visual diffs are within acceptable threshold (0.1%).
- **Fail:** Any single test fails. Playwright process exits with code 1.

## Acceptance Criteria
- E2E suite executes in under 10 minutes in CI.
- All defined CUJs have corresponding test coverage.
- Traces and video artifacts are successfully captured on failure.

## Quality Gates
- Code cannot be merged to `main` if the E2E CI job fails.
- PRs modifying core UI must include corresponding E2E test updates.

## Evidence Required
- Links to CI job runs showing successful execution.
- Playwright HTML reports linked in release notes.

## Documentation Requirements
- POM methods must have JSDoc comments explaining complex interactions.
- Mock payloads must be documented with reference to the API version they simulate.

## Common Failure Scenarios
- **Flaky Selectors:** Element not ready. Solution: Use `.toBeVisible()` assertions before interaction.
- **Timeouts:** API taking too long. Solution: Ensure API is mocked or increase test timeout for specific staging environments.
- **Port Conflicts:** Local dev server failing to start. Solution: Playwright config should handle server teardown and use `reuseExistingServer`.

## Troubleshooting
- **Tests hang:** Check if a prompt or unhandled dialog is blocking execution. Use `page.on('dialog', ...)` to handle.
- **Snapshots differ slightly across OS:** Generate snapshots in a Docker container matching the CI environment, or use `test.info().project.name` to scope snapshots.

## Best Practices
- **Isolation:** Tests must not depend on the state of other tests.
- **Soft Assertions:** Use `expect.soft()` for non-critical visual checks to allow the test to continue and collect more data.
- **Data-TestId:** Always prefer `page.getByTestId()` over CSS or XPath selectors for resilience against styling changes.

## Standards
- Follow Playwright's Best Practices guide.
- Adhere to TypeScript strict mode in test files.
- Name test cases clearly: "User should be able to..." or "Action results in...".

## Review Process
- E2E tests must be reviewed by at least one QA Engineer and one Frontend Engineer.
- Reviewers must check for assertion strictness and correct use of mocks.

## Sign-off Requirements
- QA Lead approval required for changes to `playwright.config.ts`.
- Technical Lead approval required for bypassing any test failures via `@skip`.

## Completion Criteria
- Test files are committed and merged to `main`.
- CI pipeline confirms green build.
- SOP documentation is up to date with any new practices introduced.

## References
- → See [00_MASTER_EXECUTION_PLAN.md]
- → See [11_ECOMMERCE_AUDIT.md]
- → See [16_PRODUCTION_READINESS.md]
- [Playwright Documentation](https://playwright.dev/docs/intro)

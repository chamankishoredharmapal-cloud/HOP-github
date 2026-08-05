---
title: E-Commerce Functionality Audit
document_id: HOP-PROD-11
version: 1.0.0
status: DRAFT
last_updated: 2026-08-05
author: HOP Production Team
---

# E-Commerce Functionality Audit

## 1. Purpose
The purpose of this document is to define the standard operating procedures for auditing the e-commerce functionality of the House of Padmavati (HOP) digital platform. This audit ensures that all transactional and catalog-related systems function flawlessly, providing a seamless, secure, and luxurious shopping experience consistent with the brand's uncompromising standards.

## 2. Scope
This audit encompasses all user-facing and backend integrations related to product discovery, selection, transaction, and post-purchase activities. Specifically, it covers:
- Product catalog system verification
- Product detail page functionality
- Category and collection browsing
- Shopping cart and wishlist functionality
- Checkout flow end-to-end
- Razorpay payment integration testing
- Order confirmation, history, and tracking
- Gift and appointment booking functionality
- Pricing, tax, currency, and inventory management
- Shipping, returns, discounts, and email notifications
- Search, filter, sort, and user account management

## 3. Objectives
- Ensure zero transactional errors during the checkout process.
- Validate accurate representation of all product data, pricing, and inventory.
- Verify secure and accurate processing of payments via Razorpay.
- Confirm seamless operation of all cart, wishlist, and account management features.
- Uphold the luxury brand experience through flawless functional execution.

## 4. Definitions
- **HOP**: House of Padmavati.
- **E2E**: End-to-End.
- **SKU**: Stock Keeping Unit.
- **INR**: Indian Rupee.
- **Razorpay**: The designated payment gateway for all transactions.
- **Supabase**: The backend database and edge functions provider.

## 5. Roles & Responsibilities
| Role | Responsibility |
|------|----------------|
| **Lead QA Engineer** | Oversee the e-commerce audit, coordinate testing efforts, and authorize sign-off. |
| **Backend Developer** | Verify Supabase data integrity, edge functions, and Razorpay integrations. |
| **Frontend Developer** | Address UI/UX issues identified during e-commerce flows on Vite/React application. |
| **Product Manager** | Validate catalog accuracy, pricing rules, and business logic execution. |

## 6. Prerequisites
- Access to the staging and production environments (`localhost:8080` for local dev).
- Test accounts configured with various user states (new, returning, with/without saved addresses).
- Razorpay test credentials and API keys configured in the environment variables.
- Supabase project linked and test data seeded.
- Playwright testing suite installed and configured.

## 7. Inputs
- Completed `10_STUDIO_AUDIT.md` (Product content readiness).
- Defined pricing, tax, and shipping matrix.
- Razorpay integration documentation.
- Playwright E2E test scripts for e-commerce flows.

## 8. Outputs
- Comprehensive e-commerce functionality test report.
- Log of all identified transactional or catalog bugs in the Bug Tracker (`15_BUG_TRACKER.md`).
- Razorpay transaction logs (test mode).
- Sign-off document certifying e-commerce readiness.

## 9. Dependencies
- Supabase database availability and correct schema implementation.
- Razorpay API uptime and accessibility.
- Completion of `08_SECURITY_AUDIT.md` to ensure transaction data is handled securely.
- Successful execution of `14_PLAYWRIGHT_E2E.md` for baseline functional tests.

## 10. Execution Order
1. Product Catalog & Browsing Verification
2. Product Detail Page (PDP) Validation
3. Cart & Wishlist Functionality Testing
4. User Account & Address Management Testing
5. Checkout Flow & Payment Gateway (Razorpay) Testing
6. Post-Purchase Flow (Order Confirmation, History, Email) Verification
7. Ancillary E-commerce Features (Gifts, Appointments, Search, Filters)
8. Administrative & Inventory Management Verification

## 11. Phases / Stages

### Phase 1: Catalog and Discovery
Ensure products are accurately displayed, searchable, and categorizable.

### Phase 2: Selection and Retention
Verify that users can add items to their cart or wishlist, and that state persists correctly.

### Phase 3: Transaction and Payment
Rigorous testing of the checkout pipeline, ensuring accurate pricing, tax, shipping calculations, and successful payment processing.

### Phase 4: Post-Transaction and Lifecycle
Confirm that orders are recorded correctly, confirmations are sent, and users can track their order status.

## 12. Detailed Step-by-Step Procedures

### 12.1. Product Catalog System Verification
1. Access the Supabase dashboard and navigate to the `products` table.
2. Verify that all required fields (ID, Name, Description, Price, SKU, Inventory, Category ID) are populated correctly.
3. Cross-reference a random sample of 10 SKUs between Supabase and the frontend catalog.
4. Ensure related data (images, variants, metadata) fetch correctly via TanStack React Query.

### 12.2. Product Detail Page Functionality (`ProductDetail.tsx`)
1. Navigate to a minimum of 5 distinct product detail pages.
2. Verify high-resolution images load quickly and image zoom functionality works without lag.
3. Validate that product descriptions, materials, and care instructions render using correct typography (Cormorant Garamond/Inter).
4. Check that pricing displays correctly formatted in INR (e.g., ₹ 1,50,000).
5. Test variant selection (if applicable, e.g., blouse stitching options).
6. Click "Add to Cart" and verify the success toast notification appears and the cart counter updates immediately.

### 12.3. Category and Collection Browsing (`Category.tsx`, `Collections.tsx`)
1. Navigate through main navigation categories (e.g., Kanjeevaram, Banarasi).
2. Verify category header images and editorial text render correctly.
3. Ensure products listed under the category accurately match the category assignment in Supabase.
4. Navigate to Curated Collections (`Collections.tsx`) and verify themed grouping and aesthetic presentation.

### 12.4. Shopping Cart Functionality (`Cart.tsx`)
1. Add multiple items to the cart.
2. Open the cart drawer/page and verify item details, thumbnails, and individual prices.
3. Increment and decrement quantities; ensure the subtotal updates instantly.
4. Attempt to increase quantity beyond available inventory; verify proper error handling ("Insufficient stock").
5. Remove an item from the cart; verify subtotal updates and item disappears seamlessly.
6. Refresh the page to verify cart state persistence (via local storage or Supabase user session).

### 12.5. Wishlist Functionality (`Wishlist.tsx`)
1. Log into a user account.
2. Navigate to a PDP and click the "Add to Wishlist" icon.
3. Verify the icon state changes (e.g., filled heart).
4. Navigate to `Wishlist.tsx` and confirm the item is listed.
5. Add the item from the wishlist directly to the cart.
6. Remove the item from the wishlist; verify the UI updates correctly.
7. Log out and log back in to ensure wishlist state persists in the database.

### 12.6. Checkout Flow End-to-End (`Checkout.tsx`)
1. Proceed to checkout with at least 2 items in the cart.
2. Verify the checkout page requests Shipping Information.
3. Enter valid and invalid shipping addresses to test form validation.
4. Verify Billing Information defaults to Shipping Information, with an option to enter a distinct billing address.
5. Review the Order Summary block; verify subtotal, tax calculation, and shipping fees are mathematically accurate.
6. Submit the checkout form to transition to the payment phase.

### 12.7. Razorpay Payment Integration Testing
1. Ensure the environment is set to use Razorpay TEST keys.
2. Initiate a payment from the checkout page.
3. Verify the Razorpay modal opens seamlessly without being blocked by pop-up blockers.
4. Test a successful transaction using Razorpay's provided test card credentials.
5. Test a failed transaction using failure card credentials; verify the application gracefully handles the error and allows retry.
6. Test payment cancellation by closing the modal; verify the user is returned to the checkout page with cart intact.
7. Verify webhook endpoints in Supabase Edge Functions correctly update order status upon `payment.authorized` and `payment.captured` events.
8. Verify refund initiation logic via Razorpay dashboard reflects appropriately in the HOP database.

### 12.8. Order Confirmation Flow (`OrderConfirmation.tsx`)
1. Complete a successful test transaction.
2. Verify the user is redirected to `OrderConfirmation.tsx`.
3. Check that the page displays the generated Order ID, estimated delivery date, and a summary of purchased items.
4. Confirm the tone of the messaging aligns with the luxury brand philosophy.

### 12.9. Order History and Tracking (Account Section)
1. Navigate to the Account dashboard.
2. View the "Order History" section.
3. Verify the recently placed test order appears with the correct status ("Processing").
4. Click on the order to view detailed tracking information and receipt breakdown.

### 12.10. Gift Functionality (`Gift.tsx`)
1. Navigate to the Gifting section.
2. Select an item to be packaged as a gift.
3. Add a personalized gift message.
4. Proceed to checkout and verify the gift message is saved with the order metadata.
5. Ensure the pricing is hidden on the physical packing slip (simulated via order logic verification).

### 12.11. Appointment Booking (`Appointments.tsx`)
1. Navigate to the bespoke/bridal appointments page.
2. Select an available date and time from the calendar component.
3. Fill in the required consultation details.
4. Submit the booking request.
5. Verify the appointment is saved in the database and a confirmation notification is scheduled.

### 12.12. Pricing Accuracy and Tax Calculation
1. Create a matrix of products with different tax brackets (if applicable).
2. Add combinations to the cart.
3. Verify that the calculated tax exactly matches the required GST/VAT regulations for the shipping destination.
4. Ensure rounding errors do not occur at the subtotal or grand total level.

### 12.13. Currency Display (INR Formatting)
1. Verify that all prices across the site (Index, PDP, Cart, Checkout, Emails) use standard Indian comma formatting (e.g., 1,00,000, not 100,000).
2. Ensure the currency symbol (₹) is consistently applied.

### 12.14. Inventory Management and Stock Status
1. Add an item to the cart and complete a purchase.
2. Verify the inventory count for that SKU in Supabase decreases by the purchased amount.
3. Set an item's inventory to 0 in Supabase.
4. Verify the frontend displays "Out of Stock" and disables the "Add to Cart" button.

### 12.15. Shipping Calculation and Options
1. During checkout, enter a domestic (Indian) address. Verify standard shipping rates apply.
2. Enter an international address (if supported). Verify international shipping rates and estimated delivery times apply.
3. Verify free shipping thresholds trigger correctly (e.g., free shipping on orders over ₹ 50,000).

### 12.16. Return/Exchange Policy Integration
1. Review the Return/Exchange policy pages for accuracy.
2. Verify that links to these policies are visible during checkout.
3. In the Order History section, verify that eligible orders have a "Request Return" option based on the defined return window (e.g., 14 days).

### 12.17. Promotional Code / Discount Functionality
1. Generate a test discount code in the backend (e.g., 10% off).
2. Enter the code in the cart/checkout interface.
3. Verify the discount is applied correctly to eligible items only.
4. Test invalid, expired, and single-use codes to ensure proper error messages are displayed.

### 12.18. Email Notification System
1. Complete a test purchase.
2. Verify that an order confirmation email is generated and sent to the provided email address.
3. Update the order status in Supabase to "Shipped".
4. Verify that a shipping update email containing a tracking link is dispatched.

### 12.19. Cart Recovery / Abandonment Handling
1. Log in, add items to the cart, and abandon the session without completing checkout.
2. Verify the system logs the abandoned cart.
3. Check the scheduled edge functions to ensure an automated recovery email is queued according to the brand's quiet elegance communication strategy (no aggressive spamming).

### 12.20. Cross-sell and Upsell Functionality
1. Navigate to a PDP.
2. Verify the "You May Also Like" or "Complete the Look" section displays relevant items (e.g., matching accessories or jewelry).
3. Ensure these recommendations are dynamically fetched based on tag or category relationships, not hardcoded.

### 12.21. Search Functionality
1. Use the global search bar to query a specific product name.
2. Verify the results page displays accurate matches.
3. Search for broad terms (e.g., "red saree") and verify the results include items with corresponding attributes or descriptions.
4. Search for a non-existent item and verify the empty state messaging is helpful and brand-aligned.

### 12.22. Filter and Sort Functionality
1. Navigate to a category page.
2. Apply filters (e.g., Price Range, Color, Fabric).
3. Verify the product grid updates instantly (via React Query) to reflect the filtered results.
4. Apply sorting (e.g., Price: High to Low). Verify the list order is strictly accurate.
5. Combine multiple filters and sorting options simultaneously to test query robustness.

### 12.23. User Account Management
1. Register a new user account. Verify password constraints and email validation.
2. Log in and navigate to the Account dashboard.
3. Test updating profile information (name, phone number).
4. Test the password reset flow.

### 12.24. Address Management
1. Within the Account section, navigate to the Address Book.
2. Add a new address.
3. Edit an existing address.
4. Delete an address.
5. Verify these changes propagate to the checkout flow during the next purchase.

### 12.25. Order Status Lifecycle
1. Place a test order.
2. Manually transition the order status in the Supabase backend through the full lifecycle: `Pending` -> `Processing` -> `Shipped` -> `Delivered`.
3. Verify the user-facing Order History accurately reflects these status changes at each step.

## 13. Validation Steps
- Run Playwright E2E commerce tests: `npm run test:e2e:commerce`.
- Manually execute a minimum of 5 end-to-end purchases simulating different scenarios (guest checkout, logged in, international, discounted).
- Review Supabase logs for any database transaction errors during test purchases.
- Verify Razorpay dashboard logs match the test environment database records.

## 14. Checklists

### E-Commerce Readiness Checklist
- [ ] Product catalog completely seeded and verified.
- [ ] PDP images, descriptions, and prices are accurate.
- [ ] Cart state persists across reloads.
- [ ] Checkout form validation handles all edge cases.
- [ ] Taxes and shipping calculated flawlessly.
- [ ] Razorpay integration tested (Success/Failure/Cancel).
- [ ] Order confirmation page displays correctly.
- [ ] Order history tracks accurate status.
- [ ] Automated emails (Confirm/Ship) tested and formatted correctly.
- [ ] Inventory decrements automatically upon purchase.
- [ ] Out of stock items cannot be added to cart.
- [ ] Search, filter, and sort return accurate results.
- [ ] Wishlist, Gift, and Appointment features fully functional.

## 15. Pass / Fail Criteria
- **Pass**: All checklist items are checked. End-to-end checkout completes without any console errors, network failures, or mathematical inaccuracies. Payment gateway handles success and failure states correctly.
- **Fail**: Any failure in the checkout pipeline, incorrect price calculation, inventory mismanagement, or inability to process a test payment.

## 16. Acceptance Criteria
- 100% pass rate on `Playwright` e-commerce test suite.
- Zero Critical or High severity bugs open regarding catalog, cart, checkout, or user account functionality.
- Razorpay Webhooks successfully update backend order status 100% of the time during testing.

## 17. Quality Gates
- **Pre-Staging Gate**: All E2E tests must pass locally.
- **Staging Gate**: Manual UAT by the Product Manager confirming all pricing and catalog details.
- **Production Gate**: Final verification using a ₹1 live transaction (immediately refunded) to ensure production API keys and webhooks are correctly configured.

## 18. Evidence Required
- Screenshot/Screen recording of a complete E2E successful checkout flow.
- Exported Razorpay test transaction log.
- Link to passed Playwright test run in CI/CD pipeline.
- Screenshot of the Supabase `orders` table reflecting the correct test data.

## 19. Documentation Requirements
- Document any specific quirks regarding Indian tax calculation if they deviate from standard logic.
- Log the steps taken to configure Razorpay webhooks in Supabase.
- Update the developer onboarding guide if local database seeding procedures change.

## 20. Common Failure Scenarios
- **Webhook Failure**: Razorpay processes payment, but Supabase Edge Function fails to update order status.
- **Stale Cart Data**: Item price changes in backend while user has it in their cart.
- **Race Conditions**: Two users attempt to purchase the last available SKU simultaneously.
- **Rounding Errors**: Tax percentage calculation results in fractional rupees that cause payment gateway rejection.

## 21. Troubleshooting
- **Cart not updating**: Check TanStack React Query cache invalidation logic. Ensure `queryClient.invalidateQueries({ queryKey: ['cart'] })` is called after mutations.
- **Payment Gateway Modal not opening**: Check for JavaScript errors preventing the script load. Ensure Content Security Policy (CSP) allows Razorpay scripts.
- **Emails not sending**: Verify SMTP/Email provider configuration in Supabase Edge Functions. Check function execution logs.

## 22. Best Practices
- Always calculate final totals on the server/backend, never trust frontend calculations for payment amounts.
- Implement idempotency keys for payment requests to prevent accidental double-charging.
- Use pessimistic locking or atomic decrement operations in Supabase for inventory updates to handle race conditions.
- Design for failure: gracefully handle upstream API timeouts (e.g., if Razorpay is slow to respond).

## 23. Standards
- ISO 8583 standards regarding electronic payment messaging concepts (conceptually applied).
- All prices must use the standard Indian locale formatting (`en-IN`).
- All e-commerce code must conform to the project's TypeScript strict mode requirements.

## 24. Review Process
1. QA Engineer executes the test plan.
2. Backend Developer reviews transaction logs.
3. Frontend Developer reviews UI responsiveness and error states.
4. Product Manager reviews business logic and final user experience.

## 25. Sign-off Requirements
- Signature from Lead QA Engineer.
- Signature from Lead Backend Developer.
- Signature from Product Manager.

## 26. Completion Criteria
- Document is fully reviewed.
- All tests pass.
- No blocking bugs remain in the tracker.
- System is authorized for production launch.

## 27. References
- → See `00_MASTER_EXECUTION_PLAN.md`
- → See `08_SECURITY_AUDIT.md`
- → See `10_STUDIO_AUDIT.md`
- → See `14_PLAYWRIGHT_E2E.md`
- → See `15_BUG_TRACKER.md`
- [Razorpay Integration Guidelines](https://razorpay.com/docs/)
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)

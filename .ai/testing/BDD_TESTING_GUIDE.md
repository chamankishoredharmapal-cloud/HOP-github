# BDD Testing Guide — House of Padmavati

## What is BDD?

Behavior-Driven Development (BDD) focuses on the behavior of the application from the user's perspective. Tests are written in a natural language format that describes what the user does and what they expect to see.

## BDD Format

```
Feature: [Feature Name]
  As a [user role]
  I want to [action]
  So that [benefit]

  Scenario: [Scenario description]
    Given [initial context]
    When [action is taken]
    Then [expected outcome]
```

## Implementation in Playwright

```typescript
test.describe("Feature: Shopping Cart", () => {
  test("User can add items to cart and see correct total", async ({ page }) => {
    // Given: User is browsing products
    await page.goto("/collections/silk-sarees");

    // When: User adds a product to cart
    await page.getByRole("button", { name: /add to cart/i }).first().click();

    // Then: Cart badge shows updated count
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });
});
```

## Test Naming Convention

Test cases should read like sentences:

```
test("should {expected behavior} when {action/condition}")
test("shows empty cart message when cart has no items")
test("disables checkout button when cart is empty")
test("updates total when quantity changes")
test("shows error when payment fails")
test("preserves cart items after page refresh")
```

## BDD Examples by Feature

### Cart Feature
```
Feature: Cart
  As a shopper
  I want to manage items in my cart
  So that I can purchase products I'm interested in

  Scenario: Adding items to cart
    Given I am on a product page
    When I click "Add to Cart"
    Then the cart badge shows 1 item
    And the cart dialog shows the product

  Scenario: Empty cart
    Given I have no items in my cart
    When I navigate to the cart page
    Then I see "Your cart is empty" message

  Scenario: Quantity update
    Given I have a product in my cart
    When I increase the quantity to 2
    Then the subtotal doubles

  Scenario: Removing items
    Given I have 2 items in my cart
    When I remove one item
    Then the cart badge shows 1 item
```

### Checkout Feature
```
Feature: Checkout
  As a shopper
  I want to complete my purchase
  So that I can receive my sarees

  Scenario: Successful checkout
    Given I have items in my cart
    When I complete the checkout form with valid data
    And I complete the payment
    Then I see the order confirmation page
    And I receive a confirmation email

  Scenario: Invalid form data
    Given I have items in my cart
    When I submit the checkout form with invalid email
    Then I see validation errors
    And I cannot proceed to payment

  Scenario: Payment failure
    Given I have items in my cart
    When I submit the checkout form with valid data
    And the payment fails
    Then I see a payment error message
    And I can retry payment
```

### Product Page Feature
```
Feature: Product Page
  As a shopper
  I want to view product details
  So that I can make informed purchase decisions

  Scenario: Viewing product details
    Given I am on a product page
    Then I see the product name, price, and description
    And I see product images
    And I see the "Add to Cart" button
    And I see stock status

  Scenario: Image gallery navigation
    Given I am on a product page
    When I click the next image button
    Then the displayed image changes
```

## Guidelines

1. **Focus on behavior, not implementation** — describe what the user does
2. **Use business language** — "Add to Cart", not "dispatch ADD_ITEM action"
3. **Be specific** — "the cart badge shows 1 item", not "the cart updates"
4. **Be consistent** — same terminology as the UI
5. **Test one behavior per test** — don't test adding items and removing items in the same test
6. **Cover edge cases** — empty states, error states, boundary values
7. **Test real scenarios** — test what real users actually do

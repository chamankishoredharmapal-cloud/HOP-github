# Specification: Cart

## Purpose
Allow users to review, manage, and proceed with selected products before purchase.

## Functional Requirements
- Cart icon in header with badge (item count)
- Cart dialog (slide-in overlay) for quick view
- Cart page (full view) with all items
- Line items: image, name, variant, price, quantity, subtotal
- Quantity adjustment (+/- with min 1, max stock)
- Remove item button (with undo option)
- Price breakdown: subtotal, shipping (calculated), tax, total
- Empty cart state: "Your cart is empty" + "Continue Shopping" link
- Proceed to Checkout button (disabled if cart empty or out-of-stock items)
- Save for later / move to wishlist

## User Journey
1. User adds item → cart badge updates → brief toast confirmation
2. Clicks cart icon → slide-in overlay shows items
3. Adjusts quantity or removes items → totals update
4. Clicks "View Cart" → full cart page with details
5. Reviews order, applies any adjustments
6. Clicks "Proceed to Checkout" → navigates to checkout

## Edge Cases
- Empty cart → empty state with CTA to shop
- Max stock reached → quantity input disabled at max, tooltip
- Item goes out of stock while in cart → warning message, option to remove
- Multiple same items → grouped or separate lines (decision: grouped with qty)
- Cart across sessions → persisted in localStorage
- Very old cart (products no longer exist) → graceful removal with message

## Acceptance Criteria
- Badge updates in real-time (no page reload)
- Cart overlay opens/closes smoothly (slide animation)
- Quantity changes update subtotal and total immediately
- Remove item: animation, undo option (3s toast)
- Price breakdown accurate (subtotal, shipping, tax, total)
- Empty cart: heading + description + CTA button
- Checkout button disabled when cart empty
- Cart persists across page navigation and browser close

## Analytics Events
- `cart_view` { source: "icon" | "page" | "after_add" }
- `cart_item_added` { product_id, quantity, price }
- `cart_item_removed` { product_id, quantity }
- `cart_quantity_updated` { product_id, old_qty, new_qty }
- `cart_proceed_checkout` { item_count, total_value }

## Accessibility Requirements
- Cart overlay: focus trap, Escape to close, aria-label="Cart"
- Quantity stepper: accessible button pair with aria-live
- Remove button: confirmation via aria-live polite
- Price totals: clear labels, proper formatting
- Empty cart: heading, description, link

## Performance Targets
- Cart state: in-memory + localStorage (no API calls for read)
- Overlay open/close: 200ms animation, 60fps
- Cart operations: instant feedback (optimistic updates)
- Page weight: minimal (no images on empty cart)

## Future Expansion
- Coupon/promo code input
- Gift message option
- Estimated delivery date
- Save cart for later (user accounts)
- Multi-currency display
- Back-in-stock notifications for out-of-stock cart items

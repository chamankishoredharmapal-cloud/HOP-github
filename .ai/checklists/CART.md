# Cart Engineering Checklist

## Layout
- [ ] Cart icon in header with badge count
- [ ] Cart dialog/overlay (quick view)
- [ ] Cart page (full view)
- [ ] Empty cart state
- [ ] Cart item list (image, name, price, quantity, subtotal)
- [ ] Quantity adjustment per item
- [ ] Remove item button
- [ ] Price breakdown (subtotal, shipping, tax, total)
- [ ] Proceed to checkout button
- [ ] Continue shopping link
- [ ] Save for later / Wishlist move option

## Components
- [ ] CartBadge (header icon with count)
- [ ] CartDialog (slide-in overlay)
- [ ] CartItem (line item)
- [ ] CartSummary (price totals)
- [ ] EmptyCart (empty state)
- [ ] QuantityStepper (for Qty adjustment)

## State Management
- [ ] CartContext with useReducer
- [ ] ADD_ITEM: adds product or increments quantity
- [ ] REMOVE_ITEM: removes line item
- [ ] UPDATE_QUANTITY: changes quantity
- [ ] CLEAR_CART: empties cart
- [ ] localStorage persistence
- [ ] Hydration on app load

## SEO
- [ ] Meta title: "Shopping Cart | House of Padmavati"
- [ ] Noindex meta tag (cart is user-specific)
- [ ] Canonical URL

## Performance
- [ ] Cart state in memory (localStorage for persistence)
- [ ] No API calls for cart operations (client-side only)

## Accessibility
- [ ] Cart dialog: focus trap, Escape to close
- [ ] Quantity stepper: accessible buttons
- [ ] Remove button: confirmation or undo
- [ ] Price totals: clearly labeled
- [ ] Checkout button: clear, visible

## Responsive
- [ ] Mobile: cart as full-screen overlay
- [ ] Desktop: cart as slide-in panel
- [ ] Cart page: single column on mobile, 2-column on desktop

## Testing
- [ ] E2E: add item to cart
- [ ] E2E: cart badge updates
- [ ] E2E: cart dialog opens/shows items
- [ ] E2E: quantity adjustment updates total
- [ ] E2E: remove item updates badge
- [ ] E2E: cart persists across page navigation
- [ ] E2E: empty cart state renders
- [ ] E2E: proceed to checkout navigates correctly
- [ ] E2E: clear cart works

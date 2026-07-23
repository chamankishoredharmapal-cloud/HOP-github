# Wishlist Engineering Checklist

## Layout
- [ ] Wishlist icon in header (heart)
- [ ] Wishlist page (full view)
- [ ] Empty wishlist state
- [ ] Wishlist item list (image, name, price, in-stock status)
- [ ] Add to Cart button per item
- [ ] Remove from Wishlist button
- [ ] Share wishlist (future)

## Components
- [ ] WishlistButton (product page toggle)
- [ ] WishlistBadge (header count)
- [ ] WishlistItem (line item)
- [ ] EmptyWishlist (empty state)

## State Management
- [ ] WishlistContext with useReducer
- [ ] TOGGLE_ITEM: add or remove
- [ ] REMOVE_ITEM: remove from list
- [ ] CLEAR_WISHLIST: empty all
- [ ] localStorage persistence
- [ ] Hydration on app load

## Accessibility
- [ ] Heart icon: toggle state announced
- [ ] Remove button: confirmation
- [ ] Add to cart: from wishlist works

## Testing
- [ ] E2E: add item to wishlist from product page
- [ ] E2E: wishlist badge updates
- [ ] E2E: wishlist page shows items
- [ ] E2E: remove from wishlist
- [ ] E2E: move to cart from wishlist
- [ ] E2E: empty wishlist state
- [ ] E2E: wishlist persists across sessions

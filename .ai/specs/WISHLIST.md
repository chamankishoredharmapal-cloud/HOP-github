# Specification: Wishlist

## Purpose
Allow users to save products for future consideration without committing to purchase.

## Functional Requirements
- Heart icon on product cards and product page
- Wishlist icon in header with count badge
- Wishlist page (full view): grid of saved products
- Line items: image, name, price, stock status
- Add to Cart button per item (from wishlist)
- Remove from Wishlist button
- Empty wishlist state: "Your wishlist is empty" + "Discover Products" link
- Persist across sessions (localStorage)

## User Journey
1. User browses products, clicks heart icon on a product
2. Heart fills with animation, wishlist badge increments
3. User continues browsing, adds more products to wishlist
4. Later, user opens wishlist page
5. Reviews saved products, clicks "Add to Cart" for one
6. Item moves to cart, removed from wishlist
7. OR removes items no longer interested in

## Edge Cases
- Empty wishlist → empty state with CTA
- Product goes out of stock while in wishlist → "Currently Unavailable" label
- Product deleted from catalog → removed from wishlist with notification
- Duplicate add → wishlist is a set (no duplicates)
- Max wishlist size → no limit defined (monitor usage)
- Wishlist across sessions → persisted in localStorage

## Acceptance Criteria
- Heart toggle: filled/unfilled with animation
- Badge updates on add/remove (no page reload)
- Wishlist page: grid consistent with product cards
- Add to Cart from wishlist removes from wishlist
- Remove button with confirmation (or undo toast)
- Empty state: heading + description + CTA link
- Wishlist persists across page navigation and browser close

## Analytics Events
- `wishlist_add` { product_id, source: "product_page" | "card" }
- `wishlist_remove` { product_id, source: "page" | "card" }
- `wishlist_view`
- `wishlist_move_to_cart` { product_id }

## Accessibility Requirements
- Heart icon: toggle button with aria-pressed state
- Add to Cart: accessible button with loading state
- Remove: button with aria-label="Remove from wishlist"
- Empty state: heading, description, link

## Performance Targets
- Wishlist state: in-memory + localStorage (no API calls)
- Heart toggle: < 100ms feedback
- Wishlist page: same perf as collection page

## Future Expansion
- Share wishlist (public link)
- Wishlist price-drop notifications
- Move multiple items to cart
- Collaborative wishlist (wedding registry)

# Test Coverage — House of Padmavati

## Coverage Targets

| Layer | Target | Current |
|-------|--------|---------|
| Critical user journeys | 100% | — |
| Feature interactions | 90% | — |
| Error states | 80% | — |
| Edge cases | 70% | — |
| Accessibility (axe-core) | 100% of pages | — |

## Critical User Journeys (Must Test)

1. **Purchase Flow** (highest priority)
   - [ ] Homepage → Collections → Product → Add to Cart → Checkout → Payment → Confirmation

2. **Browse Flow**
   - [ ] Homepage → Collections → Collection Detail → Product
   - [ ] Navigation menu → all sections
   - [ ] Search → results → product

3. **Cart Management**
   - [ ] Add item to cart
   - [ ] Update quantity
   - [ ] Remove item
   - [ ] Clear cart
   - [ ] Cart persistence across pages

4. **Wishlist Management**
   - [ ] Add item to wishlist
   - [ ] View wishlist
   - [ ] Move to cart
   - [ ] Remove from wishlist
   - [ ] Wishlist persistence

5. **Checkout**
   - [ ] Form rendering
   - [ ] Validation (all fields)
   - [ ] Successful submission
   - [ ] Payment integration

6. **Admin Authentication**
   - [ ] Login page
   - [ ] Successful login
   - [ ] Invalid login
   - [ ] Session persistence
   - [ ] Logout
   - [ ] Protected routes redirect

## Feature Pages

| Page | Journey Coverage | Feature Coverage | Error States | Edge Cases |
|------|-----------------|-----------------|--------------|------------|
| Homepage | | | | |
| Collections | | | | |
| Collection Detail | | | | |
| Product Detail | | | | |
| Cart | | | | |
| Wishlist | | | | |
| Checkout | | | | |
| Order Confirmation | | | | |
| Journal | | | | |
| Journal Detail | | | | |
| About / Our Story | | | | |
| Customer Care | | | | |
| Privacy Policy | | | | |
| Terms of Service | | | | |
| 404 | | | | |

## Admin Studio Pages

| Page | Journey Coverage | Feature Coverage | Error States | Edge Cases |
|------|-----------------|-----------------|--------------|------------|
| Dashboard | | | | |
| Products List | | | | |
| Product Create | | | | |
| Product Edit | | | | |
| Collections List | | | | |
| Collection Create | | | | |
| Collection Edit | | | | |
| Orders List | | | | |
| Order Detail | | | | |
| Customers | | | | |
| Inventory | | | | |
| Journal | | | | |
| Media | | | | |
| Settings | | | | |

## Coverage Checklist Legend
- Blank: Not yet tested
- ✓: Tested, passing
- ✗: Tested, failing
- N/A: Not applicable

## Coverage Improvement Plan

1. **Phase 1**: Critical user journeys (purchase flow)
2. **Phase 2**: Feature interactions (cart, wishlist, checkout)
3. **Phase 3**: Error states and edge cases
4. **Phase 4**: Admin studio pages
5. **Phase 5**: Accessibility scanning
6. **Phase 6**: Performance regression tests

## Tracking

Update this file as tests are added. Use the checklist to track progress toward coverage targets.

# Product Page Engineering Checklist

## Layout
- [ ] Image gallery (main image + thumbnails)
- [ ] Product name
- [ ] Price (with compare-at price if on sale)
- [ ] Description (fabric, weave, technique, origin)
- [ ] Product details / specifications
- [ ] Size / dimensions guide
- [ ] Color / variant selector
- [ ] Quantity selector
- [ ] Add to Cart button
- [ ] Add to Wishlist button
- [ ] Stock status
- [ ] Care instructions
- [ ] Related products section
- [ ] Breadcrumbs

## Components
- [ ] ProductGallery with image navigation and zoom
- [ ] ProductInfo with details
- [ ] VariantSelector (if applicable)
- [ ] QuantitySelector
- [ ] AddToCartButton with loading state
- [ ] WishlistButton with toggle state
- [ ] RelatedProducts carousel/grid

## SEO
- [ ] Meta title: "[Product Name] | House of Padmavati"
- [ ] Meta description: unique product description
- [ ] Open Graph tags (og:type: product, price, image)
- [ ] JSON-LD: Product structured data
- [ ] H1: product name
- [ ] Canonical URL
- [ ] Product schema with offers, brand, availability

## Performance
- [ ] Main product image preloaded
- [ ] Gallery images lazy-loaded
- [ ] Image zoom: high-res loaded on demand
- [ ] Related products lazy-loaded

## Accessibility
- [ ] Gallery: aria-label for thumbnails, keyboard navigation
- [ ] Variant selector: clear labels
- [ ] Quantity input: labeled, with +/- buttons
- [ ] Add to cart: loading state announced
- [ ] Price: clear formatting for screen readers
- [ ] All images: descriptive alt text

## Responsive
- [ ] Mobile: single column, full-width images
- [ ] Tablet: 2-column (image left, info right)
- [ ] Desktop: gallery left, info right, sticky add-to-cart
- [ ] Image gallery: swipe on mobile

## Data
- [ ] Product loaded from API by ID
- [ ] Related products loaded from API
- [ ] Stock status from database
- [ ] Loading state: product skeleton
- [ ] Error state: "Product not found" with navigation
- [ ] 404 state: product doesn't exist

## Testing
- [ ] E2E: product details render correctly
- [ ] E2E: image gallery navigation works
- [ ] E2E: add to cart works
- [ ] E2E: add to wishlist works
- [ ] E2E: quantity selector works
- [ ] E2E: related products click navigates
- [ ] E2E: breadcrumb navigation works
- [ ] E2E: 404 state renders
- [ ] E2E: out of stock state renders (no add to cart)

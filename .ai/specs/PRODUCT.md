# Specification: Product Page

## Purpose
Provide comprehensive product information to drive purchase decisions. Showcase the craftsmanship, detail, and story behind each piece.

## Functional Requirements
- Image gallery: main image + thumbnails, zoom on hover/click
- Product name, price (with compare-at if on sale)
- Description: fabric, weave, technique, origin, craftsmanship
- Product details: length, width, care instructions
- Variant selector: color, size (if applicable)
- Quantity selector (+/- buttons, min 1, max stock)
- Add to Cart button (disabled if out of stock)
- Add to Wishlist toggle
- Stock status: "In Stock", "Low Stock (X left)", "Currently Unavailable"
- Related products section (4-8 products)
- Breadcrumbs: Home > Collections > Collection Name > Product Name

## User Journey
1. User arrives from collection, search, or direct link
2. Views main image, clicks thumbnails to browse gallery
3. Hovers to zoom on details (weave, embroidery)
4. Reads description, fabric details, care instructions
5. Selects variant (if applicable), sets quantity
6. Adds to cart → cart badge updates, confirmation toast
7. Scrolls to related products → explores more
8. OR adds to wishlist for later

## Edge Cases
- Out of stock → "Currently Unavailable" message, "Notify Me" button (future), no Add to Cart
- No images → placeholder with product name
- Very long description → "Read more" expandable section
- Invalid product ID → 404 page with "Product not found"
- Price on sale → original price struck through, sale price highlighted
- Multiple variants → variant selector updates price, stock, images

## Acceptance Criteria
- Gallery navigation: thumbnails, keyboard arrows, swipe on mobile
- Zoom: high-res image on hover/click
- Add to Cart: shows loading → success feedback → badge update
- Add to Wishlist: heart toggle with animation
- Related products: 4 items, scrollable on mobile
- Breadcrumbs: clickable, correct hierarchy
- Stock status: accurate, real-time from database

## Analytics Events
- `product_view` { product_id, product_name, variant }
- `product_image_click` { image_index, product_id }
- `product_variant_change` { variant_id, variant_name }
- `product_add_to_cart` { product_id, quantity, price }
- `product_add_to_wishlist` { product_id }
- `product_related_click` { product_id, related_product_id }

## Accessibility Requirements
- Gallery: keyboard nav (arrow keys), aria-label on thumbnails
- Zoom: announced for screen readers
- Variant selector: clearly labeled radio group or select
- Quantity: labeled input with +/- buttons, aria-live for value change
- Add to Cart: loading state announced
- Price: clearly formatted with currency symbol

## Performance Targets
- Main product image preloaded (LCP candidate)
- Gallery images lazy-loaded
- Zoom image loaded on demand
- Related products lazy-loaded section
- LCP < 2.5s, CLS < 0.1

## Future Expansion
- 360-degree product view
- Video lookbook
- Size recommendation tool
- Customer reviews and ratings
- "Complete the look" AI suggestions
- Share product link

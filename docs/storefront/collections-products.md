# Storefront: Collections & Products

## Collection Listing — `/collections`

- Queries `fetchCollections()` — all published collections ordered by `display_order`
- Renders a grid of collection cards
- Each card links to `/collections/:slug`
- Loading: skeleton grid, Error: error card, Empty: "No collections found."

## Collection Detail — `/collections/:slug`

- Queries `fetchCollectionBySlug(slug)` from `collectionService.ts`
- If found: renders collection header (name, tagline, story) + product grid
- Products queried via `fetchProductsByCollection(slug)` from `productService.ts`
  - If slug provided: `collection.slug=eq.{slug}` AND `status=eq.active` AND `deleted_at.is.null`
  - If no slug: all active products
  - Select: `id, name, selling_price, slug, product_images(url)` — only primary image URL
- Each product renders as `ProductCard` with image, name, price
- Loading: skeleton grid, Error: error card, Empty: "No products in this collection."

## Product Detail — `/product/:productId`

- Queries `fetchProductById(productId)` from `productService.ts`
  - Select: `*, product_images(*)` (all fields)
- Renders `ProductGallery` with:
  - Primary image as main display
  - Thumbnail strip below
  - Click thumbnail to switch main image
- Product info panel:
  - Name (serif heading)
  - Price: selling price in INR (with MRP strikethrough if higher)
  - Story: editorial narrative
  - Technical details: fabric, weave, colour, occasion, length, weight
  - Care instructions
  - Dispatch estimate
- Related products section:
  - Query: `fetchRelatedProducts(collectionId, currentId, 4)`
  - Same collection, exclude current, limit 4
- Loading: skeleton, Error: error card, Not found: "Product not found"

## ProductCard Component

Used in collection detail and related products sections.

| Prop | Description |
|------|-------------|
| `product` | `{ id, name, selling_price, slug, product_images? }` |
| Link | `/product/:id` |
| Image | Primary image from `product_images` (first where `is_primary`, else first) |
| Placeholder | `image-off` icon when no images |
| Price | INR formatted via `formatPrice()` in `src/lib/utils.ts` |

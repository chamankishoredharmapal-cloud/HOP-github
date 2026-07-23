# Studio: Products Workspace

## List Page — `/studio/products`

Grid of `ProductCard` components, each with:
- Primary image (or `image-off` placeholder)
- Name, SKU, selling price (INR formatted)
- Stock status badge
- Status badge (Active green, Draft amber, Archived gray)

## Editor Page — `/studio/products/:id` or `/studio/products/new`

7 sections in a scrollable workspace with sticky `TopActionBar`.

### Section 1: Identity
- `name` → auto-generates `slug`
- `sku` — manual entry
- `collection_id` — select from all collections

### Section 2: Pricing
- `selling_price` (required), `mrp`, `cost_price`
- All stored in paise

### Section 3: Technical Details
- `fabric`, `weave`, `colour`, `occasion`
- `length`, `weight`
- `care_instructions`, `country_of_origin`
- `estimated_dispatch_days`, `stock`, `low_stock_alert`

### Section 4: Editorial Story
- `story` textarea
- `short_description`, `customer_description`

### Section 5: SEO
- `meta_title`, `meta_description`
- `og_image_url`

### Section 6: Media Workspace
- Upload button → `uploadImage()` → `product-images` bucket + INSERT `product_images`
- Image grid with drag-to-reorder
- Set primary image (star icon)
- Delete image (trash icon with confirmation)

### Section 7: Editorial Checklist
Auto-calculated progress:
- Hero Image, Product Name, Story, Collection, Price, Inventory, SEO

## TopActionBar
Sticky bar with:
- Save Draft button
- Publish button
- Unsaved changes indicator (dirty tracking from `useProductForm`)
- Archive button (for existing products)

## Hooks

### `useProductForm`
Complex form state hook:
- Initializes from `existing` product or blank for new
- Dirty tracking via `dirtyFields` set
- Auto-slug generation on name change
- Debounced slug editing (manual overrides preserved)
- Reset on `existing?.id` change via `initialisedRef`

### `useProducts`
- `useProducts()` — list all
- `useProduct(id)` — single with images
- `useCreateProduct()` — insert
- `useUpdateProduct()` — update
- `useUpdateProductStatus()` — status toggle
- `useUploadImage()` — file upload + DB insert
- `useDeleteImage()` — file + DB delete
- `useReorderImages()` — sort order batch update
- `useSetPrimaryImage()` — primary flag management

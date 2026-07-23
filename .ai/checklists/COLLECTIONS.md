# Collections Page Engineering Checklist

## Layout
- [ ] Collection grid (3-4 columns desktop, 2 tablet, 1 mobile)
- [ ] Collection cards with image, name, short description
- [ ] Collection detail page with products
- [ ] Breadcrumbs on collection detail
- [ ] Filter/sort options
- [ ] Pagination or infinite scroll

## Components
- [ ] Collection card renders correctly
- [ ] Product card renders correctly
- [ ] Filter sidebar/dropdown
- [ ] Sort dropdown (Newest, Price: Low-High, Price: High-Low)
- [ ] Pagination component

## SEO
- [ ] Meta title: "[Collection Name] | House of Padmavati"
- [ ] Meta description: unique per collection
- [ ] Open Graph tags per collection
- [ ] JSON-LD: CollectionPage, Product
- [ ] H1: collection name
- [ ] Canonical URL per collection
- [ ] BreadcrumbList structured data

## Performance
- [ ] Product images optimized (WebP/AVIF, responsive)
- [ ] Lazy load below-fold images
- [ ] Pagination or infinite scroll with proper loading
- [ ] Filter/sort updates without full page reload

## Accessibility
- [ ] Collection cards: keyboard accessible
- [ ] Filter/sort: accessible form controls
- [ ] Product cards: keyboard accessible
- [ ] Pagination: aria-live for page changes
- [ ] Heading hierarchy: h1 (collection name), h2 (section), h3 (product names)

## Responsive
- [ ] Mobile: single column product grid
- [ ] Tablet: 2-column product grid
- [ ] Desktop: 3-column product grid
- [ ] Filter: slide-in drawer on mobile, sidebar on desktop

## Data
- [ ] Collections loaded from API
- [ ] Products loaded per collection
- [ ] Filter/sort queries correct
- [ ] Loading state: skeleton grid
- [ ] Error state: retry option
- [ ] Empty state: "No products found"

## Testing
- [ ] E2E: collection listing renders
- [ ] E2E: click collection navigates to detail
- [ ] E2E: products displayed correctly
- [ ] E2E: filter works
- [ ] E2E: sort works
- [ ] E2E: pagination works
- [ ] E2E: empty state renders
- [ ] E2E: error state with retry

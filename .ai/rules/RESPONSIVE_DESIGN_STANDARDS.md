# Responsive Design Standards — House of Padmavati

## Breakpoints

| Breakpoint | Width | Device |
|------------|-------|--------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops/tablets (landscape) |
| `xl` | 1280px | Standard desktops |
| `2xl` | 1440px | Large desktops (max content width) |

## Approach

**Mobile-first** — design for mobile, then enhance for larger screens.

```tsx
// Mobile-first: single column, stack vertically
// Tablet: 2 columns
// Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## Layout

### Mobile (< 768px)
- Single column layout
- Hamburger menu for navigation
- Full-width sections
- Larger touch targets (minimum 44x44px)
- Bottom navigation for key actions (cart, wishlist)
- Content padding: 16px (px-4)

### Tablet (768px - 1024px)
- 2-column grids where appropriate
- Sidebar navigation (collapsible)
- Content padding: 24px (px-6)
- Product cards in a 2-column grid

### Desktop (1024px+)
- Multi-column layouts (3-4 columns)
- Full navigation visible
- Content padding: 32px (px-8)
- Max-width container: 1440px (centered)
- Product cards in 3-4 column grid

## Typography Scale

```typescript
// Responsive typography using Tailwind
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  Heritage Collection
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Handwoven craftsmanship passed down through generations.
</p>
```

## Images

```typescript
// Responsive images
<img
  srcSet="
    product-400.jpg 400w,
    product-800.jpg 800w,
    product-1200.jpg 1200w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  src="product-800.jpg"
  alt="Product description"
  className="w-full h-auto"
/>

// Or using Tailwind responsive classes
<img
  src="product.jpg"
  alt="Product description"
  className="w-full sm:w-1/2 lg:w-1/3"
/>
```

## Navigation

### Mobile (< 768px)
- Hamburger menu (left-aligned)
- Slide-in drawer for navigation
- Bottom bar: Home, Collections, Cart, Wishlist, Account
- Search icon (expandable on tap)

### Tablet (768px - 1024px)
- Hamburger menu or condensed navigation
- Sidebar for secondary navigation
- Cart and wishlist icons in header

### Desktop (1024px+)
- Full horizontal navigation
- Mega menu for collections
- Search bar (full width or expandable)
- Cart preview on hover

## Touch Targets

- Minimum touch target: 44x44px (per WCAG)
- Adequate spacing between touch targets (8px minimum)
- Buttons full-width on mobile for easy tapping
- No hover-dependent functionality on touch devices

## Testing

Test on:
- iPhone SE (375px width)
- iPhone 14 Pro (390px width)
- iPad Air (820px width)
- iPad Pro (1024px width)
- Desktop 1440px
- Desktop 1920px

Check for:
- No horizontal scrolling
- All content visible without zooming
- Tap targets are tappable
- Text is readable without zooming
- Images are not distorted
- Forms are usable
- Navigation is accessible

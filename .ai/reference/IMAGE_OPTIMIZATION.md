# Image Optimization — House of Padmavati

> From: old `performance/IMAGE_OPTIMIZATION.md`

## Sizing

| Use Case | Max Width | Aspect | Format | Quality |
|----------|-----------|--------|--------|---------|
| Hero (full-width) | 2400px | 16:9 | WebP/AVIF | 85% |
| Product gallery | 1200px | 4:5 | WebP/AVIF | 90% |
| Product card | 600px | 4:5 | WebP/AVIF | 85% |
| Collection thumb | 800px | 16:9 | WebP/AVIF | 85% |
| Journal article | 1200px | 16:9 | WebP/AVIF | 85% |
| Thumbnail | 150px | 1:1 | WebP | 80% |
| Logo | 200px | — | SVG/PNG | — |

## Format Decision

- Photo/realistic → WebP (primary), AVIF (bleeding edge, smaller), JPEG fallback
- Graphic with text → SVG (simple) or PNG (complex)
- Transparency → WebP (modern) or PNG (legacy)

## Responsive Images

```typescript
<picture>
  <source srcSet="product-400.avif 400w, product-800.avif 800w" type="image/avif" />
  <source srcSet="product-400.webp 400w, product-800.webp 800w" type="image/webp" />
  <img
    src="product-800.jpg"
    srcSet="product-400.jpg 400w, product-800.jpg 800w"
    sizes="(max-width: 640px) 100vw, 50vw"
    alt="Product" loading="lazy" decoding="async"
    style={{ aspectRatio: "4/5" }}
  />
</picture>
```

## Prevent CLS

```typescript
// Always set dimensions or aspect-ratio
<img width="800" height="1000" src="..." alt="..." />
// or
<div style={{ aspectRatio: "4/5" }}>
  <img className="object-cover w-full h-full" src="..." alt="..." />
</div>
```

## Delivery

- CDN (Supabase Storage or Cloudinary/Imgix)
- `Cache-Control: public, max-age=31536000, immutable`
- Alt text required on all images

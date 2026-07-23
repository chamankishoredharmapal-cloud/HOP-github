# Image Optimization — House of Padmavati

## Image Sizing Guidelines

| Usage | Max Width | Aspect Ratio | Format | Quality |
|-------|-----------|-------------|--------|---------|
| Hero image (full-width) | 2400px | 16:9 or 3:2 | WebP/AVIF | 85% |
| Product image (gallery) | 1200px | 4:5 | WebP/AVIF | 90% |
| Product card (grid) | 600px | 4:5 | WebP/AVIF | 85% |
| Collection thumbnail | 800px | 16:9 | WebP/AVIF | 85% |
| Journal article image | 1200px | 16:9 | WebP/AVIF | 85% |
| Thumbnail (avatar/icon) | 150px | 1:1 | WebP | 80% |
| Logo | 200px | Original | PNG/SVG | N/A |

## Format Decision Tree

```
Is it a photo or realistic image?
  → Use WebP (primary) or AVIF (bleeding edge, smaller files)
  → Fallback: JPEG

Is it a graphic with text or sharp edges?
  → Use SVG (vector) if simple
  → Use PNG if complex (screenshots, diagrams)

Does it have transparency?
  → Use PNG (legacy)
  → Use WebP with transparency (modern)
```

## Responsive Images

```typescript
// Generate multiple sizes for responsive images
function ResponsiveImage({
  src,
  alt,
  widths = [400, 800, 1200],
  aspectRatio = "4/5",
}: ResponsiveImageProps) {
  const srcSet = widths
    .map((w) => `${src.replace(".jpg", `-${w}.webp`)} ${w}w`)
    .join(", ");

  return (
    <picture>
      {widths.map((w) => (
        <source
          key={w}
          srcSet={`${src.replace(".jpg", `-${w}.avif`)} ${w}w`}
          type="image/avif"
        />
      ))}
      {widths.map((w) => (
        <source
          key={w}
          srcSet={`${src.replace(".jpg", `-${w}.webp`)} ${w}w`}
          type="image/webp"
        />
      ))}
      <img
        src={`${src.replace(".jpg", "-800.jpg")}`}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ aspectRatio }}
      />
    </picture>
  );
}
```

## Lazy Loading

```typescript
// Native lazy loading (modern browsers)
<img loading="lazy" src="product.jpg" alt="..." />

// Lazy load below the fold
// Eager load above the fold (hero, first product row)
<img loading="eager" src="hero.jpg" alt="..." fetchpriority="high" />

// Intersection Observer for custom lazy loading
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "200px" }
  );

  document.querySelectorAll("[data-src]").forEach((img) => {
    observer.observe(img);
  });

  return () => observer.disconnect();
}, []);
```

## Preventing CLS

```typescript
// Always set dimensions
<img width="800" height="1000" src="product.jpg" alt="..." />

// Or use aspect-ratio
<div className="relative" style={{ aspectRatio: "4/5" }}>
  <img
    className="absolute inset-0 w-full h-full object-cover"
    src="product.jpg"
    alt="..."
  />
</div>

// Or use placeholder (blur-up or color)
<div
  className="bg-gray-100"
  style={{ aspectRatio: "4/5" }}
>
  <img
    className="opacity-0 transition-opacity duration-300"
    onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
    src="product.jpg"
    alt="..."
  />
</div>
```

## CDN & Caching

- Serve images from CDN (Supabase Storage or dedicated image CDN like Cloudinary/Imgix)
- Set Cache-Control headers: `public, max-age=31536000, immutable`
- Use image CDN features (automatic format conversion, resizing, compression)

```typescript
// Example with image CDN (future)
const imageUrl = `https://images.houseofpadmavati.com/${path}?w=800&q=85&f=webp`;
```

## Image Delivery Checklist

- [ ] Images compressed (quality appropriate for use case)
- [ ] Modern formats (WebP/AVIF with JPEG fallback)
- [ ] Responsive sizes (correct srcSet and sizes attributes)
- [ ] Lazy loaded (below the fold)
- [ ] Explicit dimensions (prevent CLS)
- [ ] CDN delivered (fast global access)
- [ ] Cache headers set (long max-age for hashed files)
- [ ] Alt text present (accessibility)

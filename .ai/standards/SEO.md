# SEO Standards — House of Padmavati

> Moved from: old `rules/SEO_STANDARDS.md` (unchanged content, single-responsibility preserved)

## Metadata

Every page must have unique metadata via `useMetadata`:

```typescript
useMetadata({
  title: "Banarasi Silk Saree | House of Padmavati",
  description: "Handwoven Banarasi silk saree in deep teal with gold zari.",
  canonical: "https://houseofpadmavati.com/product/123",
  ogImage: "https://...", ogType: "product",
});
```

| Tag | Required |
|-----|----------|
| `<title>` | Yes, format: "Page Name | House of Padmavati" |
| `<meta name="description">` | Yes, unique per page, < 160 chars |
| `<link rel="canonical">` | Yes |
| `og:title`, `og:description`, `og:image`, `og:url` | Yes |
| `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` | Yes |

## Structured Data (JSON-LD)

- **Product pages**: `Product` schema with `offers` (price, currency, availability).
- **Organization**: `Organization` on homepage (name, url, logo, sameAs).
- **Breadcrumbs**: `BreadcrumbList` on collection + product pages.
- **Articles**: `Article` on journal detail pages.

## Technical SEO

- URLs: kebab-case, readable (`/collections/banarasi-silk`), no query params for content.
- Sitemap at `/sitemap.xml` — include all public pages, collections, products, journal articles.
- `robots.txt`: Allow `/`, Disallow `/studio/`, `/cart`, `/checkout`, `/order/confirmation/`.
- One `<h1>` per page. Hierarchical headings (no skipping levels).
- Unique product descriptions (no manufacturer defaults). Internal links between related products.

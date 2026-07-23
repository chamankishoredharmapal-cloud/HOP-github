# SEO Standards — House of Padmavati

## Metadata

Every page must have unique, descriptive metadata:

```typescript
// Using the useMetadata hook (src/hooks/useMetadata.ts)
function ProductPage() {
  useMetadata({
    title: "Banarasi Silk Saree | House of Padmavati",
    description: "Handwoven Banarasi silk saree in deep teal with gold zari work. Part of the Heritage Collection.",
    canonical: `https://houseofpadmavati.com/product/${productId}`,
    ogImage: product.images[0],
    ogType: "product",
  });
}
```

### Required Meta Tags
```html
<title>Page Title | House of Padmavati</title>
<meta name="description" content="Unique description of this page" />
<link rel="canonical" href="https://houseofpadmavati.com/page" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

## Structured Data (JSON-LD)

### Product
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Banarasi Silk Saree",
  "description": "Handwoven Banarasi silk saree...",
  "image": "https://houseofpadmavati.com/images/product.jpg",
  "brand": { "@type": "Brand", "name": "House of Padmavati" },
  "offers": {
    "@type": "Offer",
    "price": "45000",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### Organization
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "House of Padmavati",
  "url": "https://houseofpadmavati.com",
  "logo": "https://houseofpadmavati.com/logo.png",
  "sameAs": ["https://instagram.com/houseofpadmavati"]
}
</script>
```

### BreadcrumbList
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://houseofpadmavati.com" },
    { "@type": "ListItem", "position": 2, "name": "Collections", "item": "https://houseofpadmavati.com/collections" },
    { "@type": "ListItem", "position": 3, "name": "Product Name", "item": "https://houseofpadmavati.com/product/123" }
  ]
}
</script>
```

## Technical SEO

### URLs
- Clean, readable URLs: `/collections/banarasi-silk`
- No query parameters for content pages
- Use kebab-case for URL slugs
- Consistent trailing slash (recommended: no trailing slash)

### Sitemap
- XML sitemap at `/sitemap.xml`
- Include all public pages, collections, products, and journal articles
- Update sitemap on content changes
- Submit to Google Search Console

### Robots.txt
```
User-agent: *
Allow: /
Disallow: /studio/
Disallow: /cart
Disallow: /checkout
Disallow: /order/confirmation/

Sitemap: https://houseofpadmavati.com/sitemap.xml
```

### Heading Hierarchy
- One `<h1>` per page (brand or page title)
- Hierarchical headings: `h1` → `h2` → `h3` (no skipping levels)
- Product names as `h2` in listing pages, `h1` on product detail page

## Content SEO

### Product Pages
- Unique product descriptions (no manufacturer default text)
- Include key attributes in descriptions (fabric, weave, color, occasion)
- Customer reviews (when available) as user-generated content
- Related products as internal links

### Collections/Category Pages
- Rich category descriptions (150+ words)
- Filter options that update URL params
- Paginated with rel="next"/rel="prev" (or infinite scroll with proper history)

### Journal/Blog
- Each article is a unique URL with full metadata
- Internal links to relevant products and collections
- Author byline and publication date
- Social sharing buttons

# Improve SEO Prompt

## Context
- Read `.ai/rules/SEO_STANDARDS.md` for SEO requirements
- Current page SEO audit

## Steps

### 1. Audit Current SEO

Check per page:
- [ ] Meta title (unique, descriptive, < 60 chars)
- [ ] Meta description (unique, compelling, < 160 chars)
- [ ] Canonical URL (correct, no duplicates)
- [ ] Open Graph tags (title, description, image, url, type)
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (Product, Organization, BreadcrumbList)
- [ ] H1 tag (one per page, descriptive)
- [ ] Heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Image alt text (descriptive, keyword-rich)
- [ ] Internal links (descriptive anchor text)
- [ ] Robots meta tag (index/noindex, follow/nofollow)
- [ ] Page speed (Lighthouse SEO score ≥ 95)

### 2. Fix Issues

**Per missing metadata:**
```typescript
// Add or update useMetadata call
useMetadata({
  title: "Page Title | House of Padmavati",
  description: "Compelling description with primary keyword.",
  canonical: "https://houseofpadmavati.com/page-path",
  ogImage: "https://houseofpadmavati.com/images/og-image.jpg",
  ogType: "website",
});
```

**Per missing structured data:**
```html
<!-- Add JSON-LD to the page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  ...
}
</script>
```

**Per image missing alt:**
```typescript
<img
  src={product.image}
  alt={`${product.name} — ${product.fabric} saree in ${product.color}`}
/>
```

### 3. Verify
- [ ] Search engines can crawl the page (check robots.txt, meta robots)
- [ ] Sitemap includes the page
- [ ] Page is indexed (Search Console)
- [ ] Lighthouse SEO score ≥ 95
- [ ] No duplicate content issues
- [ ] All links are valid (no 404s)

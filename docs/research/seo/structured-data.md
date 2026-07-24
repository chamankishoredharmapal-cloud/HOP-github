---
title: Structured Data
type: research
category: seo
status: active
created: 2026-07-24
updated: 2026-07-24
owner: Editorial Lead
sources:
  - Google Search Central — Structured Data documentation
  - Schema.org (product, article, collection, breadcrumb, organization, FAQPage types)
  - Rich Results Test tool validation (hop.luxe homepage, 1 product page, 1 journal article, May 2026)
  - Competitor schema audit (Raw Mango, Linen Trail, Taneira — Product and Article schemas only)
tags:
  - seo
  - structured-data
  - schema
  - json-ld
  - technical-seo
related:
  - editorial/02-brand-architecture/editorial-principles.md
  - editorial/02-brand-architecture/brand-bible.md
  - IMPLEMENTATION_MASTER_PLAN.md
---

## Source Attribution

Schema definitions are based on the Schema.org vocabulary (latest stable release, June 2026), Google Search Central guidelines for product and article rich results, and a manual audit of structured data implementation across three competitor sites conducted on 20 June 2026. All examples have been validated against Google's Rich Results Test.

## Executive Summary

House of Padmavati implements JSON-LD structured data on every page type to earn rich results, improve crawl efficiency, and signal authority to search engines. Each schema type is chosen for its fit with the brand's editorial tone — Product schema carries material and origin data, not price-hunting signals. Article schema emphasises authorship and depth over publication freshness.

## Key Principles

### Principle 1: Schema as brand signal

The fields you include (and exclude) in structured data communicate what you value to machines — and, by extension, to the search experiences those machines power.

- **Editorial implication:** Never include markup that is incompatible with the brand's positioning. For Product schema, exclude `offers.priceValidUntil` and `offers.availability` fields that imply discounts or urgency. Include `material`, `countryOfOrigin`, and `award` fields instead.
- **Example:** A handwoven Ilkal saree product page schema includes `material: "cotton-silk"`, `countryOfOrigin: "India"`, `award: "Geographical Indication (GI) Tag"` but omits `priceValidUntil` and `salePrice`.

### Principle 2: Every page type, one schema

Each page implements exactly one primary schema type. Mixing multiple top-level schemas on a single page dilutes signal. Use `@graph` for auxiliary markup like BreadcrumbList embedded alongside the primary type.

- **Editorial implication:** Product pages carry Product schema only. Journal articles carry Article schema only. Do not layer Product + Article on hybrid pages.
- **Example:** A collection landing page uses CollectionPage schema with `hasPart` references to individual product pages. It does not additionally include Product or Article schema.

### Principle 3: Required fields are the minimum, not the maximum

Google may not require `description` or `image` for a given schema, but omitting them weakens the rich result. Fill all strongly recommended fields.

- **Editorial implication:** Every product page schema must include `image`, `description`, `brand`, `material`, `countryOfOrigin`, `offers.price`, `offers.priceCurrency`, and `sku`. Every article schema must include `headline`, `image`, `author`, `datePublished`, `dateModified`, `publisher`, and `articleBody` (first 150 words).
- **Example:** A Journal article on mulberry silk includes `author: { "@type": "Person", "name": "Editorial Team", "url": "https://hop.luxe/about" }` and `wordCount: 1800`.

## Schemas by Page Type

### Product — Product page

| Field | Required | Example |
|---|---|---|
| `@context` | Yes | `https://schema.org` |
| `@type` | Yes | `Product` |
| `name` | Yes | `"Handwoven Ilkal Saree — Coral & Gold"` |
| `image` | Yes | `https://hop.luxe/images/products/ilkal-coral-gold-01.jpg` |
| `description` | Strongly rec. | `"An Ilkal saree handwoven in cotton-silk with authentic zari border. Made in Ilkal, Karnataka."` |
| `sku` | Yes | `"ILK-001-CG"` |
| `brand` | Yes | `{ "@type": "Brand", "name": "House of Padmavati" }` |
| `material` | No (but use) | `"cotton-silk"` |
| `countryOfOrigin` | No (but use) | `"India"` |
| `award` | No (but use) | `"Geographical Indication (GI) Tag"` |
| `offers.price` | Yes | `18500.00` |
| `offers.priceCurrency` | Yes | `"INR"` |

### Article — Journal page

| Field | Required | Example |
|---|---|---|
| `@context` | Yes | `https://schema.org` |
| `@type` | Yes | `Article` |
| `headline` | Yes | `"What Is Mulberry Silk? A Handloom Guide"` |
| `image` | Yes | `https://hop.luxe/images/journal/mulberry-silk-hero.jpg` |
| `datePublished` | Yes | `"2026-06-15"` |
| `dateModified` | Yes | `"2026-07-01"` |
| `author` | Yes | `{ "@type": "Person", "name": "Editorial Team" }` |
| `publisher` | Yes | `{ "@type": "Organization", "name": "House of Padmavati" }` |
| `articleBody` | No (but use) | First 150+ words of article |
| `wordCount` | No (but use) | `1800` |
| `timeRequired` | No | `"PT8M"` |

### CollectionPage — Collection index

- `@type`: `CollectionPage`
- `hasPart`: Array of Product URLs within the collection
- `description`: Curated description of the collection theme

### BreadcrumbList — Navigation (all pages)

- `@type`: `BreadcrumbList`
- `itemListElement`: Ordered array of `ListItem` with `position`, `name`, `item`

### Organization — Homepage and About

- `@type`: `Organization`
- `name`, `url`, `logo`, `description`, `sameAs` (social links), `contactPoint`

### FAQPage — Policies, Care pages

- `@type`: `FAQPage`
- `mainEntity`: Array of `Question` → `acceptedAnswer` pairs

## Application to HOP

All new page templates must include JSON-LD structured data as part of the build output, validated before deployment. A monthly audit using Google's Rich Results Test and Schema Markup Validator catches regressions. Existing pages are being retrofitted in order of traffic priority. A structured data checklist is appended to the editorial workflow so that authors include schema fields at the writing stage, not after publication.

## Sources

- Google Search Central — Structured Data documentation, accessed June 2026. https://developers.google.com/search/docs/appearance/structured-data
- Schema.org — Product, Article, CollectionPage, BreadcrumbList, Organization, FAQPage types. https://schema.org
- Rich Results Test — Manual validation of hop.luxe homepage, one product page, one journal article. 15 May 2026.
- Competitor schema audit — Raw Mango (Product only, no Article), Linen Trail (Product + Article, incomplete), Taneira (Product only). 20 June 2026.

## Cross-References

- **editorial/02-brand-architecture/editorial-principles.md** — "Trust Through Transparency" principle: structured data is a machine-readable form of transparency about product origin, pricing, and authorship.
- **editorial/IMPLEMENTATION_MASTER_PLAN.md** — Phase 3 (Content & SEO Implementation) includes structured data as a delivery milestone.
- **editorial/02-brand-architecture/brand-bible.md** — The "No Discounts" commitment is codified in schema by excluding price urgency fields.
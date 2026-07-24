# PROMPT: JSON-LD Structured Data Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: seo
# CONTENT TYPE: all

## Description

Generates valid JSON-LD structured data for any HOP content unit. The schema type depends on the content type: Journal Article → Article, Product Detail → Product, Collection → CollectionPage, Homepage → WebSite + Organization, About Page → AboutPage + Organization, Policy pages → WebPage.

## Context Requirements

**Knowledge Base:**
- docs/research/seo/structured-data.md

## Input

- Content type: journal | collection | product | craft-note | weaver-portrait | field-note | house-letter | ritual-guide | glossary | homepage | about | policy
- Title (the editorial title)
- URL (full canonical URL)
- Description (the meta description or dek)
- Image URL (full URL to the hero image, if applicable)
- Published date (ISO 8601)
- Updated date (ISO 8601, optional — use published date if no update)
- Author name (default: "House of Padmavati")
- For products: SKU, price, currency, availability
- For articles: word count, reading time (in minutes)

## Output Format

A valid JSON-LD script block wrapped in `<script type="application/ld+json">` tags. Include only the schema types listed below — do not add schema types not specified.

### Schema Mapping

| Content Type | Schema Type(s) |
|---|---|
| Journal Article | `Article` |
| Craft Note | `Article` |
| Weaver Portrait | `Article` with `author` nested |
| Field Note | `Article` |
| House Letter | `Article` |
| Ritual Guide | `Article` with `step` (HowTo partial) |
| Glossary | `WebPage` |
| Collection | `CollectionPage` |
| Product Detail | `Product` |
| Homepage | `WebSite` + `Organization` |
| About | `AboutPage` + `Organization` |
| Policies | `WebPage` |

### Organization Base (for WebSite and AboutPage)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "House of Padmavati",
  "url": "https://houseofpadmavati.com",
  "logo": "https://houseofpadmavati.com/logo.png",
  "sameAs": []
}
```

### Article Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "image": "{image url}",
  "author": {
    "@type": "Organization",
    "name": "House of Padmavati"
  },
  "datePublished": "{published}",
  "dateModified": "{updated}",
  "wordCount": {word count},
  "timeRequired": "PT{readingTime}M",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{url}"
  }
}
```

## Quality Criteria

- Valid JSON (no trailing commas, no syntax errors)
- All required fields per schema type are present
- URLs are absolute (https://houseofpadmavati.com/...)
- Dates are ISO 8601 format (YYYY-MM-DD)
- The Organization schema uses the same name and url across all pages
- `sameAs` is an empty array (no social links — HOP does not prioritize social media)
- No forbidden words in any text field within the JSON-LD

## Review Prompts to Run After Generation

- `seo-check-v1` — validates JSON-LD presence and structure

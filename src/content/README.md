# Runtime Content Architecture

**Status:** Active
**Owner:** Editorial Lead
**Last updated:** July 2026

---

## Purpose

This directory is the single source of truth for all editorial content at House of Padmavati. Every content unit — journal article, collection narrative, product story, craft note, weaver portrait, field note, house letter, ritual guide, and glossary entry — lives here as a structured Markdown file with YAML frontmatter.

The Content Compiler (Phase 4) reads this directory, validates every content unit against its schema, resolves relationships, and generates typed TypeScript index files that the React application imports.

## Directory Structure

```
src/content/
├── _schemas/                          # YAML schema files for all content types
├── journal/                           # Journal articles
├── collections/                       # Extended collection narratives
├── products/                          # Extended product stories
├── craft-notes/                       # Educational content
├── weaver-portraits/                  # Artisan stories
├── field-notes/                       # Travel/loom diaries
├── house-letters/                     # Brand manifestos
├── ritual-guides/                     # Occasion and care guides
└── glossary/                          # Textile terminology
```

## Content Unit Structure

Every content unit is a directory containing:

| File | Required | Purpose |
|------|----------|---------|
| `index.md` | Yes | Markdown body content with YAML frontmatter |
| `hero.jpg` | Yes (articles, collections, letters) | Hero/social sharing image |
| `images/` | No | In-body images, named sequentially |

## Content Types

| Type | Directory | Schema | Frontmatter Required |
|------|-----------|--------|---------------------|
| Journal Article | `journal/{slug}/` | `_schemas/journal.yaml` | type, title, slug, published, status, author, tag, dek, hero, alt, seo |
| Collection Narrative | `collections/{slug}/` | `_schemas/collection.yaml` | type, name, slug, status, tagline, hero, lookbook, seo |
| Product Story | `products/{uuid}/` | `_schemas/product.yaml` | type, productId, status, hero, alt, sensoryStory, seo |
| Craft Note | `craft-notes/{slug}/` | `_schemas/craft-note.yaml` | type, title, slug, published, status, author, tag, dek, hero, seo |
| Weaver Portrait | `weaver-portraits/{slug}/` | `_schemas/weaver-portrait.yaml` | type, title, slug, published, status, author, weaverName, generation, location, technique, hero, alt, quote, portraits, seo |
| Field Note | `field-notes/{slug}/` | `_schemas/field-note.yaml` | type, title, slug, published, status, author, location, dateVisited, hero, seo |
| House Letter | `house-letters/{slug}/` | `_schemas/house-letter.yaml` | type, title, slug, published, status, occasion, hero, seo |
| Ritual Guide | `ritual-guides/{slug}/` | `_schemas/ritual-guide.yaml` | type, title, slug, published, status, occasion, hero, seo |
| Glossary Entry | `glossary/{slug}.md` | `_schemas/glossary.yaml` | type, term, slug, category, definition |

## Frontmatter Standards

- All dates use ISO 8601 format: `YYYY-MM-DD`
- Slugs are kebab-case: lowercase, hyphens, no special characters
- All images require `alt` text in the block or frontmatter that references them
- SEO titles must not exceed 70 characters
- SEO descriptions must not exceed 160 characters

## Body Block Types

Body content uses `---` delimited blocks. Each block has a `type` field that determines how it is rendered:

| Block Type | Used In | Renders As |
|------------|---------|------------|
| `hero` | All types | Full-bleed hero image with caption |
| `intro` | Articles, Notes, Letters | Large leading paragraph |
| `body` | All types | Standard prose |
| `pull-quote` | All types | Centered, italic, serif |
| `image` | All types | In-body image with caption |
| `video` | Notes, Portraits | Embedded video player |
| `system-2` | Products, Craft Notes | Accordion-triggered technical details |
| `related` | All types | Linked content cards |
| `closure` | All types | Signature paragraph |
| `divider` | All types | Section break |
| `step` | Ritual Guides | Numbered step |
| `gallery` | Portraits, Field Notes | Image grid |

## Relationship Rules

Content units reference each other through frontmatter fields:

| Field | Type | Resolved By | Validation |
|-------|------|-------------|------------|
| `relatedProducts` | UUID array | Compiler checks UUID exists | Warning if not found |
| `relatedArticles` | Slug array | Compiler checks slug exists | Error if not found |
| `glossaryTerms` | Slug array | Compiler checks slug exists | Warning if not found |
| `collections` | Slug array | Compiler checks slug exists | Warning if not found |
| `products` | UUID array | Compiler checks UUID exists | Warning if not found |

## Slug Rules

- All slugs are kebab-case
- Generated from title by: lowercase → remove punctuation → replace spaces with hyphens → collapse consecutive hyphens → trim leading/trailing hyphens
- Slugs must be unique within their content type
- Slugs should be stable — changing a slug breaks links

## UUID Strategy

- Products are identified by their database UUID (v4). This UUID appears in frontmatter `relatedProducts` fields.
- Collections are identified by their database slug (human-readable, stable).
- Content types (journal, craft-notes, etc.) are identified by their file-slug (derived from directory name).

## Image Standards

| Image Type | Location | Naming | Max Size |
|------------|----------|--------|----------|
| Hero | `{content-unit}/hero.jpg` | `hero.jpg` | 1600×900, <200KB |
| In-body | `{content-unit}/images/` | `01-{descriptive}.jpg` | 1200px wide, <150KB |
| Lookbook | `{content-unit}/lookbook/` | `01-{descriptive}.jpg` | 2000px wide, <300KB |
| Portrait | `{content-unit}/portraits/` | `01-{descriptive}.jpg` | 2000px wide, <300KB |

All images should be provided as WebP with JPEG fallback. Every image requires `alt` text.

## Related Documents

- Schema files: `src/content/_schemas/`
- TypeScript interfaces: `src/types/content.ts`
- Content service contract: `src/services/contentService.ts`
- Generated index files: `src/data/__generated__/` (created by Phase 4)
- Editorial Operating System: `docs/editorial/`
- Implementation plan: `docs/editorial/IMPLEMENTATION_MASTER_PLAN.md`

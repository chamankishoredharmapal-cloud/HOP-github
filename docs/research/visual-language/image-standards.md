---
title: Image Standards
type: research
category: visual-language
status: active
created: 2026-07-24
updated: 2026-07-24
owner: Editorial Lead
sources:
  - Web performance audit (Lighthouse — hop.luxe, 15 June 2026. Current image scores: 72/100)
  - Core Web Vitals documentation (Google, accessed June 2026)
  - WCAG 2.2 — Non-text Content (Success Criterion 1.1.1)
  - Industry standards survey (e-commerce image best practices — {\f0 New York Times} 2025 CMS style guide, Smashing Magazine image optimisation series)
tags:
  - visual-language
  - image-optimization
  - accessibility
  - web-performance
  - asset-management
related:
  - IMPLEMENTATION_MASTER_PLAN.md
  - editorial/02-brand-architecture/voice-bible.md
  - visual-language/photography-direction.md
---

## Source Attribution

These standards are derived from a Lighthouse performance audit of hop.luxe conducted on 15 June 2026, Google's Core Web Vitals documentation, WCAG 2.2 accessibility guidelines for non-text content, and a cross-industry survey of image management practices at editorial-standard organisations.

## Executive Summary

House of Padmavati images must load fast and look impeccable across every device and connection speed. Every image is delivered in WebP with a JPEG fallback, served at the correct breakpoint, compressed without visible quality loss, and described with alt text that respects the brand's editorial voice. Naming conventions and folder organisation follow a strict taxonomy that makes images findable by content unit, collection, and type.

## Key Principles

### Principle 1: Format and compression are editorial decisions

Choosing WebP with JPEG fallback is not a technical detail — it is a respect for the reader's time and attention. A page that loads slowly disrespects the quietness of the content it carries.

- **Editorial implication:** No image is uploaded without a WebP version. JPEG fallback must be <100 KB for detail shots and <200 KB for hero images. Photographers receive compression guidelines before delivery.
- **Example:** A hero image for a Journal article on mulberry silk is delivered as WebP (85 KB) with a JPEG fallback (92 KB). Both pass a side-by-side blind quality test before approval.

### Principle 2: Alt text is voice copy, not technical description

Alt text serves accessibility but also carries the brand's voice. It is written in the same warm, precise, restrained tone as any other HOP copy. It describes what the image shows and why it matters.

- **Editorial implication:** Alt text must be written by the Editorial Lead or a designated copywriter, not auto-generated. It must include the saree type, the scene, and the sensory quality — never "image of saree."
- **Example:** Acceptable: "A woman's hands folding a Chanderi silk saree on a sunlit wooden bed — the fabric catches the light with each fold." Not acceptable: "Chanderi saree folded on bed."

### Principle 3: Every image has a home

File names encode the content unit, collection, image type, and sequence number. No generic filenames (IMG_001.jpg) enter the CMS. Folder structure mirrors the content architecture — collections, journal, weavers, brand.

- **Editorial implication:** Photographers must rename files to HOP conventions before delivery. The CMS rejects uploads that do not match the naming pattern.
- **Example:** `journal/mulberry-silk/hero-01.webp` — follows the pattern: `{section}/{content-unit-slug}/{type}-{sequence}.{format}`. Types: `hero`, `detail`, `portrait`, `lifestyle`, `flat-lay`.

## Technical Specifications

### Resolution and format

| Use case | Min width | Format | Max file size |
|---|---|---|---|
| Hero (full-width) | 2400px | WebP + JPEG | 200 KB |
| Collection banner | 2400px | WebP + JPEG | 180 KB |
| Product primary | 1200px | WebP + JPEG | 120 KB |
| Product detail | 800px | WebP + JPEG | 80 KB |
| Journal inline | 800px | WebP + JPEG | 80 KB |
| Journal thumbnail | 400px | WebP + JPEG | 40 KB |
| Social (square) | 1080px | WebP + JPEG | 100 KB |

### Responsive breakpoints

| Breakpoint | Served width | Description |
|---|---|---|
| `sm` | 400px | Mobile (<640px) |
| `md` | 800px | Tablet (640–1024px) |
| `lg` | 1200px | Desktop (1024–1440px) |
| `xl` | 2400px | Large desktop (>1440px) |

The CMS must serve the smallest breakpoint that fills the viewport. `srcset` and `sizes` attributes are required on every `<picture>` element.

### Naming conventions

`{section}/{content-unit-slug}/{type}-{sequence}.{format}`

- Section: `collections`, `journal`, `weavers`, `brand`, `care`
- Type: `hero`, `detail`, `portrait`, `lifestyle`, `flat-lay`, `process`
- Sequence: 01, 02, 03...

### Alt text requirements

- All decorative images: `alt=""` (empty)
- All informative images: alt text that describes the subject, sensory quality, and relevance in HOP voice.
- Alt text length: 5–15 words. No keyword stuffing. No auto-generation.

## Application to HOP

Image standards are enforced at two points: at upload (CMS validation — rejects non-conforming filenames, missing WebP, oversized files, missing alt text) and at quarterly audit (random sample of 50 images across sections checked against resolution, format, naming, and alt text standards). The standards are documented in a one-page reference card for photographers and a one-page guide for editorial team members responsible for uploads.

## Sources

- Lighthouse — hop.luxe homepage and one product page. 15 June 2026. Current image optimisation score: 72/100. Target: 95+/100.
- Google Core Web Vitals — Largest Contentful Paint and Cumulative Layout Shift documentation. Images must not push LCP above 2.5s.
- WCAG 2.2 — Success Criterion 1.1.1 (Non-text Content). All informative images require text alternatives.
- Industry references — New York Times CMS style guide (image handling section), Smashing Magazine "Image Optimisation" series (2025 edition), Cloudinary image best practices.

## Cross-References

- **editorial/IMPLEMENTATION_MASTER_PLAN.md** — Phase 3 milestone: "Image organisation and optimisation across all content units." These standards are the specification for that milestone.
- **editorial/02-brand-architecture/voice-bible.md** — Alt text is written in HOP voice; the voice bible's tone and word choice principles apply to every image description.
- **visual-language/photography-direction.md** — Standards assume photographs follow the direction document. Technical specs (resolution, naming) support the editorial vision.
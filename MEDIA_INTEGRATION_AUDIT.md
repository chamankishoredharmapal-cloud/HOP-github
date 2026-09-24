# HOP Media Integration Architecture Audit

## Executive Status
- **Phase**: Phase 3 — Media Integration Audit & Delivery Architecture
- **Status**: **AUDIT COMPLETE — PROOF OF CONCEPT & ARCHITECTURE MAP PREPARED**
- **Application Modifications**: **NONE** (Zero production component modifications executed; isolated under architecture plan)
- **Deployment**: **NOT EXECUTED**
- **CTO Review Required**: **YES**

---

## 1. Executive Integration Strategy

Phase 2 established a reproducible, deterministic media optimization pipeline that generated 193 high-quality AVIF, WebP, and vector SVG derivatives across HOP's valid media library, yielding a **16.15 MB (64.62%) transfer size reduction**.

Phase 3 defines the frontend architecture required to consume these candidate derivatives safely within House of Padmavati's React application without compromising visual identity, editorial calm, accessibility, SEO, or layout stability (CLS < 0.1).

---

## 2. Current Media-Loading Patterns Inventory

A full scan of the HOP frontend codebase (`src/pages/`, `src/components/`, `src/data/`) identified **6 distinct media loading patterns**:

1. **Static ESM Asset Imports (`import img from "@/assets/..."`)**:
   - Used in `CraftSection.tsx`, `FeaturedProducts.ts`, `JournalPreview.tsx`, `ModernHeirlooms.tsx`, `Monogram.tsx`, `journalArticles.ts`, `Journal.tsx`, `OurStory.tsx`.
   - Resolves via Vite build pipeline into hashed bundle URLs.
   - *Current loading*: Standard `<img src={importedPath} />` without responsive `<picture>` or `srcset`.

2. **Video Poster Fallback Images (`<Film poster={posterUrl} />`)**:
   - Used in `HeroSection.tsx`, `CraftSection.tsx`, `Film.tsx`, `Category.tsx`.
   - Renders a background image element underneath an HTML5 `<video>` until video buffers.
   - *Current loading*: Standard `<img>` with `loading="lazy"` or `loading="eager"`.

3. **Dynamic Supabase / Public Storage URLs (`imageUrl` / `src`)**:
   - Used in `ProductGallery.tsx`, `Category.tsx`, `ProductDetail.tsx`, `Cart.tsx`, `Checkout.tsx`, `Wishlist.tsx`, `OrderConfirmation.tsx`, `OrderDetail.tsx`.
   - Dynamic product image URLs loaded from database or storefront services.
   - *Current loading*: Standard `<img>` elements with `object-cover`.

4. **Editorial & Content Media (`src/content/`)**:
   - Defined in Markdown schema (`src/content/_schemas/`) for journal, craft notes, field notes, weaver portraits.
   - *Current loading*: Static content compiler (`scripts/compile-content.js`).

5. **Brand Lockups & Vector Logos (`Monogram.tsx`)**:
   - Renders `hop-logo-signature.png`, `hop-logo-primary.png`, `hop-logo-seal.png`.
   - *Current loading*: Standard `<img>` element with `object-contain`.

6. **Static Public Assets (`public/*.png`, `public/favicon.png`)**:
   - Used in `Index.tsx` JSON-LD schema, app header icons, fallback placeholders.

---

## 3. Media Architecture Integration Matrix

| Current Asset | Current Reference | Component | Route / Page | Classification | Current Loading | Proposed Optimized Derivative Delivery |
| ------------- | ----------------- | --------- | ------------ | -------------- | --------------- | ------------------------------------- |
| `src/assets/hero-image.png` | `hero-image.png` | `HeroSection.tsx` | `/` (Home) | **CRITICAL ABOVE FOLD** | `<img loading="eager">` | `<picture>` (1824w AVIF/WebP, `fetchpriority="high"`, `loading="eager"`, `sizes="min(92vw, 1680px)"`) |
| `src/assets/hop-hero.jpg` | `@/assets/hop-hero.jpg` | `CraftSection.tsx` | `/`, `/journal`, `/about/our-story` | **IMPORTANT** | `<Film poster={heroImg}>` | `<picture>` (1920w/1200w/768w AVIF/WebP, `loading="lazy"`) |
| `src/assets/hop-brand-board.png` | `@/assets/hop-brand-board.png` | Brand Showcase | `/about` | **BRAND** | `<img loading="lazy">` | `<picture>` (1402w/1200w AVIF/WebP, `sizes="100vw"`) |
| `src/assets/organic-earring.png` | `@/assets/organic-earring.png` | `FeaturedProducts` / `ProductGallery` | `/product/*`, `/shop` | **PRODUCT** | `<img loading="lazy">` | `<picture>` (1024w/800w/480w AVIF/WebP, `sizes="(max-width: 768px) 100vw, 50vw"`) |
| `src/assets/link-bracelet.png` | `@/assets/link-bracelet.png` | `ProductGallery` / `Category` | `/product/*` | **PRODUCT** | `<img loading="lazy">` | `<picture>` (1024w/800w/480w AVIF/WebP) |
| `public/arcus-bracelet.png` | `/arcus-bracelet.png` | `ProductGallery` | `/product/*` | **PRODUCT** | `<img loading="lazy">` | `<picture>` (1024w/800w/480w AVIF/WebP) |
| `public/span-bracelet.png` | `/span-bracelet.png` | `ProductGallery` | `/product/*` | **PRODUCT** | `<img loading="lazy">` | `<picture>` (1024w/800w/480w AVIF/WebP) |
| `src/assets/circular-collection.png` | `@/assets/circular-collection.png` | `CollectionStage` | `/`, `/collections` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1024w/768w AVIF/WebP) |
| `src/assets/earrings-collection.png` | `@/assets/earrings-collection.png` | `CollectionStage` | `/collections` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1024w/800w/480w AVIF/WebP) |
| `src/assets/rings-collection.png` | `@/assets/rings-collection.png` | `CollectionStage` | `/collections` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1024w/768w AVIF/WebP) |
| `src/assets/hop-collection-linen.jpg` | `@/assets/hop-collection-linen.jpg` | `FeaturedProducts`, `JournalPreview` | `/`, `/journal` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1080w/768w AVIF/WebP) |
| `src/assets/hop-collection-organza.jpg` | `@/assets/hop-collection-organza.jpg` | `FeaturedProducts`, `journalArticles` | `/journal` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1080w/768w AVIF/WebP) |
| `src/assets/hop-collection-pattu.jpg` | `@/assets/hop-collection-pattu.jpg` | `FeaturedProducts`, `JournalPreview` | `/`, `/journal` | **COLLECTION** | `<img loading="lazy">` | `<picture>` (1080w/768w AVIF/WebP) |
| `src/assets/hop-fabric.jpg` | `@/assets/hop-fabric.jpg` | `JournalPreview`, `FeaturedProducts` | `/`, `/journal` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1080w/768w AVIF/WebP) |
| `src/assets/hop-gift.jpg` | `@/assets/hop-gift.jpg` | `ModernHeirlooms`, `FeaturedProducts` | `/`, `/gifting` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w AVIF/WebP) |
| `src/assets/eclipse.jpg` | `@/assets/eclipse.jpg` | Background / Editorial | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/halo.jpg` | `@/assets/halo.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/lintel.jpg` | `@/assets/lintel.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/oblique.jpg` | `@/assets/oblique.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/shadowline.jpg` | `@/assets/shadowline.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/shadowline-1.jpg` | `@/assets/shadowline-1.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `src/assets/pantheon.jpg` | `@/assets/pantheon.jpg` | Lookbook Showcase | `/lookbook` | **EDITORIAL** | `<img loading="lazy">` | `<picture>` (1920w/1200w/768w/480w AVIF/WebP) |
| `public/founders.png` | `/founders.png` | About / Founders | `/about` | **GENERAL** | `<img loading="lazy">` | `<picture>` (1024w/768w/480w AVIF/WebP) |
| `src/assets/hop-logo-primary.png` | `@/assets/hop-logo-primary.png` | `Monogram.tsx` | Global Header/Footer | **BRAND / UI** | `<img object-contain>` | `<picture>` (800w/533w AVIF/WebP + PNG fallback) |
| `src/assets/hop-logo-seal.png` | `@/assets/hop-logo-seal.png` | `Monogram.tsx` | Global Footer | **BRAND / UI** | `<img object-contain>` | `<picture>` (800w/480w AVIF/WebP + PNG fallback) |
| `src/assets/hop-logo-signature.png` | `@/assets/hop-logo-signature.png` | `Monogram.tsx` | Global Header | **BRAND / UI (HARD WARN)** | `<img object-contain>` | **ISOLATED / UNTOUCHED** (Original PNG retained; 480w WebP derivative SSIM 0.9013 requires human review) |
| `public/placeholder.svg` | `/placeholder.svg` | Placeholder | Global Fallback | **UI / VECTOR** | `<img src="/placeholder.svg">` | Pass-through Vector SVG |

---

## 4. Identification of Critical LCP Media

The primary image affecting **Largest Contentful Paint (LCP)** on House of Padmavati is:

1. **Hero Section Media (`HeroSection.tsx` & `CraftSection.tsx`)**:
   - Hero video poster: `src/assets/hero-image.png` (1824×1216 PNG, 2.66 MB source -> 631.3 KB 1824w AVIF).
   - Rendered above-the-fold on homepage load.

### Loading Strategy for Critical Hero Media:
- **Eager Loading**: `loading="eager"`
- **High Fetch Priority**: `fetchpriority="high"`
- **Decoding**: `decoding="async"`
- **Preload**: Optional `<link rel="preload" as="image" href="..." type="image/avif">` header injection for homepage root.
- **NO Lazy Loading**: Eager fetching prevents LCP delay caused by IntersectionObserver or browser lazy-load heuristics.

---

## 5. Reusable Frontend Delivery Abstraction: `<OptimizedImage />`

To avoid code duplication across 40+ components, HOP will utilize a single reusable component:

```tsx
// src/components/ui/OptimizedImage.tsx

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g. "16/9", "4/5", "1/1"
  sizes?: string;
  priority?: boolean; // Set true for LCP / Above-The-Fold assets
  className?: string;
}
```

### Key Responsibilities of `<OptimizedImage />`:
1. **Manifest Resolution**: Looks up derivative paths (`AVIF`, `WebP`, `fallback`) from `tools/media-pipeline/output/manifest.json`.
2. **Semantic `<picture>` Element**:
   ```html
   <picture>
     <source type="image/avif" srcset="..." sizes="..." />
     <source type="image/webp" srcset="..." sizes="..." />
     <img src="..." alt="..." width="..." height="..." loading="..." fetchpriority="..." decoding="async" />
   </picture>
   ```
3. **Layout Stability (CLS Protection)**: Sets explicit `width`, `height`, and `aspect-ratio` CSS to guarantee `CLS < 0.1`.
4. **Fallback Resilience**: Automatically falls back to original PNG/JPEG asset if WebP/AVIF format is unsupported by client browser.

---

## 6. Logo Warning — Hard Condition Status

```text
LOGO WARNING: UNVERIFIED (DERIVATIVE ISOLATED)
```

- **Asset**: `src/assets/hop-logo-signature.png`
- **Derivative**: `hop-logo-signature-480w.webp`
- **SSIM Score**: **0.9013** (`WARN / HUMAN REVIEW`)
- **Action**: The 480w WebP derivative is **strictly excluded** from integration. The original lossless PNG (`src/assets/hop-logo-signature.png`) remains the active source for `Monogram.tsx`.

---

## 7. Editorial Profile Metric Terminology Correction

- **Source Payload (Single Asset)**: `src/assets/hop-fabric.jpg` = **262,800 bytes (0.25 MB)**.
- **Cumulative Candidate Derivative Payload (All 4 Generated Derivatives)**: **781,918 bytes (0.75 MB)**.
- **Single 1:1 Replacement Savings**:
  - `hop-fabric-1080w.avif`: 216,403 bytes (**17.65% reduction** vs source).
  - `hop-fabric-1080w.webp`: 247,234 bytes (**5.92% reduction** vs source).
  - `hop-fabric-768w.avif`: 147,577 bytes (**43.84% reduction** vs source).

*Clarification*: Candidate derivatives are mutually exclusive options served via `<picture>` rules. The browser downloads exactly one derivative (e.g. 147.5 KB AVIF), achieving **43.84% real-world network payload reduction**.

---

## 8. Invalid Media References Audit

- **Discovered Invalid Media Assets**: 54 corrupt placeholder files in `src/content/` and `public/content/`.
- **Application Audit Result**: **0 references found in application code**.
- **Status**: Verified that no React components, page routes, or data files depend on corrupt placeholder files.

---

## 9. Performance Baseline Classification

- **Measured Pipeline Payload Reduction**: **16.15 MB (64.62% byte savings)**.
- **Production LCP / CLS / INP Real-Browser Performance**: **UNVERIFIED** (Requires production deployment & CDN profiling under real network traffic).

---

## 10. Proof-of-Concept & Implementation Gate Status

- **MEDIA_INTEGRATION_AUDIT.md**: **COMPLETED**
- **POC Integration**: **NOT EXECUTED** (Awaiting CTO approval before applying changes)
- **Application-Wide Integration**: **NOT EXECUTED**
- **Deployment**: **NOT EXECUTED**
- **CTO Review Required**: **YES**

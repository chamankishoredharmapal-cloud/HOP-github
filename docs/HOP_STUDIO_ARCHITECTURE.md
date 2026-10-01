# HOP STUDIO — ARCHITECTURE AND IMPLEMENTATION MASTER

**Status:** PRODUCTION CONFIRMED  
**Version:** 1.0.0  
**Authors:** Senior Product Architect, Lead Security Engineer, Senior Full-Stack Engineer  
**Date:** 2026-09-27  
**Production Deployment:** `hop-production.pages.dev` (commit `da6158f`)  
**Production Database:** Supabase `kbvjmcnaaogkbnerjcoc` (21/21 migrations)  
**Verification Date:** 2026-09-27  

---

## 1. Executive Summary & Purpose

**HOP Studio** is the private operational control room for the House of Padmavati (HOP). It is the dedicated atelier instrument through which the house owner and authorized operators curate, govern, and evolve the digital house—spanning collections, collection films, products, product media, editorial content, availability, and site metadata—without modifying source code, opening Supabase manually, or executing redeployments for routine content changes.

### Core Architectural Principle
> **HOP is a House, Not a Shop.**  
> Studio is the private atelier behind the house. The public storefront consumes content; the Studio authors and publishes content.  
> **Studio controls WHAT; Frontend controls HOW.**

---

## 2. Current System Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PUBLIC STOREFRONT                              │
│                          (Cloudflare Pages Hosted)                          │
│                                                                             │
│  - React 18 + Vite + TypeScript + Tailwind CSS                              │
│  - Cinematic Homepage Experience (Full-screen films, Worlds, Monograms)     │
│  - Collection Chapters (/collections, /collections/:slug)                   │
│  - Product Details (/product/:id) & Bag/Checkout                            │
│  - Editorial Journal (/journal, /journal/:slug)                             │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Reads published content via RLS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SUPABASE BACKEND CLOUD                             │
│                         (kbvjmcnaaogkbnerjcoc)                              │
│                                                                             │
│  - PostgreSQL Database with Strict RLS (collections, products, images, etc.)│
│  - Storage Buckets:                                                         │
│      * HOP-films (Collection films, hero media, posters)                    │
│      * product-images (Product gallery photography, alt metadata)           │
│  - Auth with JWT app_metadata role claims ('admin', 'owner')                │
│  - Database Functions & RPCs (is_admin(), stock adjustments, order flows)   │
└──────────────────────────────────────▲──────────────────────────────────────┘
                                       │ Reads/Writes authorized content via RLS
                                       │ Protected routes & Server-side auth
┌──────────────────────────────────────┴──────────────────────────────────────┐
│                                 HOP STUDIO                                  │
│                      (Private Atelier Control Room)                         │
│                                                                             │
│  - Protected surface: /studio/*                                             │
│  - Server-verified Admin Authorization (auth.jwt() -> app_metadata)         │
│  - Collection Management (Cinematic film upload, validation, replace)       │
│  - Media Library (Central asset management across films & products)         │
│  - Product Catalog & Workspace (Stories, variants, pricing, photography)   │
│  - Editorial / Journal Management (Articles, excerpts, covers)              │
│  - Activity / Audit Log (Traceability of administrative actions)            │
│  - Environment Separation Indicator (STAGING vs PRODUCTION)                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Existing Content Models & Database Schema

### 3.1 Collections (`collections` table)
- `id`: UUID (Primary Key)
- `name`: Text (e.g., "Kalyani", "Viara", "Arya", "Padma", "YŪGEN")
- `slug`: Text (Unique, e.g., "kalyani")
- `tagline`: Text (Editorial descriptor)
- `description`: Text (Brief narrative)
- `editorial_story`: Text (Full-length atelier narrative)
- `hero_image_url`: Text (Poster / fallback photograph URL)
- `hero_video_url`: Text (Cinematic film MP4 URL in `HOP-films` bucket)
- `featured_on_homepage`: Boolean (Controls threshold hero feature)
- `display_order`: Integer (Sort order across homepage and collection directory)
- `status`: Text (`draft`, `published`, `archived`)
- `created_at` / `updated_at`: Timestamptz

### 3.2 Products (`products` table)
- `id`: UUID (Primary Key)
- `sku`: Text (Unique)
- `name`: Text
- `slug`: Text (Unique)
- `story`: Text (Long-form craft & material narrative)
- `short_description`: Text
- `customer_description`: Text
- `selling_price`: Integer (in paise)
- `mrp`: Integer (in paise)
- `cost_price`: Integer (in paise)
- `stock`: Integer (Current inventory units)
- `low_stock_alert`: Integer
- `fabric`: Text (e.g., Mulberry Silk, Pit-loom Pattu, Handspun Cotton)
- `weave`: Text (e.g., Kanchipuram, Chanderi, Molakalmuru)
- `colour`: Text
- `occasion`: Text
- `length` / `weight` / `blouse_included` / `care_instructions`: Material descriptors
- `estimated_dispatch_days`: Integer
- `featured`: Boolean
- `meta_title` / `meta_description` / `og_image_url`: SEO metadata
- `collection_id`: UUID (Foreign Key -> `collections.id`)
- `status`: Text (`draft`, `review`, `published`, `archived`)
- `created_at` / `updated_at`: Timestamptz

### 3.3 Product Images (`product_images` table)
- `id`: UUID (Primary Key)
- `product_id`: UUID (Foreign Key -> `products.id`, nullable for unassigned media)
- `url`: Text (Public Storage URL)
- `alt_text`: Text (Editorial description conforming to voice bible)
- `sort_order`: Integer
- `is_primary`: Boolean
- `created_at`: Timestamptz

### 3.4 Settings (`settings` table)
Key-value configuration store for brand, operations, shipping, contact, and system toggles.

---

## 4. Authentication, Authorization & Security Architecture

### 4.1 Strict Access Boundary
- **No Public Registration**: There is no sign-up route, no registration button, and no public user creation.
- **Server-Side Enforcement**: Authorization is enforced via Postgres RLS and `public.is_admin()`:
  ```sql
  CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
  RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT user_id IS NOT NULL AND (
      COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    );
  $$;
  ```
- **Client Route Protection**: `AuthGuard` checks the authenticated user's session and verifies administrative role claims before rendering Studio views. Unauthorized or anonymous visitors are immediately redirected to `/studio/login` or shown an access-denied state.
- **Credential Hygiene**: No service-role keys, Razorpay secrets, or database master passwords are ever exposed to client bundles or Studio screens.

---

## 5. Storage & Media Pipeline Architecture

### 5.1 Storage Buckets
1. **`HOP-films`**:
   - Stores collection films, hero loops, and collection poster still frames.
   - Public read access for web playback.
   - Admin-only write/update/delete access enforced via Storage RLS.
2. **`product-images`**:
   - Stores product photography, detail close-ups, and lookbook imagery.
   - Public read access.
   - Admin-only write/update/delete access enforced via Storage RLS.

### 5.2 Video Specifications & Performance Budget
Based on HOP's cinematic video guidelines (`docs/research/visual-language/video-direction.md` and web performance standards):
- **Container / Codec**: MP4 (H.264 / AAC) or WebM.
- **Aspect Ratio**: 16:9 landscape (typically 1920x1080) for full-screen collection showcase; 9:16 for vertical crops.
- **Maximum File Size**: 30 MB (Target: 10–20 MB for rapid LCP and edge streaming).
- **Duration**: 10 to 60 seconds (cinematic ambient loop).
- **Client-Side Pre-flight Validation**:
  - Validates MIME type (`video/mp4`, `video/webm`).
  - Reads video metadata using an offscreen HTMLVideoElement (duration, naturalWidth, naturalHeight).
  - Verifies duration <= 60s and aspect ratio compatibility.
  - Generates feedback badge with width, height, duration, and file size.
  - Automatically extracts a high-quality video poster frame at second 1 via HTML5 Canvas if none is supplied.

---

## 6. Gaps Identified in Existing Implementation

1. **Collection Film Workflow**:
   - `CollectionWorkspace` had basic file upload, but lacked video pre-flight validation (resolution, duration, size, format check), poster extraction, visual replace/preview modal, and a clean Publish/Draft lifecycle with status toggling.
2. **Homepage Dynamic Hero Connection**:
   - The homepage Threshold component was hardcoded to `COLLECTION_VIDEOS.hero` instead of consuming `featured?.hero_video_url` when present.
3. **Media Library Scope & Safe Deletion**:
   - The existing `Media.tsx` only queried `product_images`, ignoring `HOP-films` and collection videos.
   - Deletion had no dependency check to prevent breaking live collections or products.
4. **Editorial / Journal in Studio**:
   - `src/studio/pages/Journal.tsx` was an empty stub ("Journal module coming soon"). Needs a functional management interface for journal articles.
5. **Operational Audit / Activity Log**:
   - No unified activity table or activity page exists to track administrative mutations (film uploaded, product saved, collection published).
6. **Environment Separation & Atelier Aesthetics**:
   - Studio header lacked an explicit STAGING / PRODUCTION indicator and operator badge.
   - Dashboard was focused on generic e-commerce metrics rather than calm operational stewardship.

---

## 7. Proposed Solutions & Architecture Upgrades

### 7.1 Phase B & C: Studio Foundation & Atelier Design
- Add environment detection (`STAGING` vs `PRODUCTION`) to `StudioHeader` with distinct visual badge.
- Add operational overview to `Dashboard` with atelier metrics (Collections count, Films count, Products active, Media count, Recent Activity).
- Introduce `studio_activities` tracking system with local logging fallback so all administrative actions are auditable.
- Add `/studio/activity` route and navigation link.

### 7.2 Phase D: First-Class Collection & Film Management
- Elevate Collection Management in `src/studio/pages/CollectionWorkspace.tsx`:
  - Dedicated **Collection Film Suite**:
    * Video player preview with play/pause and time indicators.
    * Video pre-flight validator checking size (<30MB), format (MP4/WebM), dimensions, duration (<60s).
    * Auto-capture poster still frame from video canvas if no poster uploaded.
    * One-click "Replace Film" and "Remove Film" workflows.
    * Explicit Draft vs Published status control with immediate visual state.
    * Real-time preview link to `/collections/:slug` and `/`.

### 7.3 Phase E: Centralized Media Library & Safe Delete
- Extend `mediaService` to unify `product_images` and collection media.
- Filter by media type: All, Images, Videos / Films.
- Add dependency check before deletion: warns if media URL matches any collection's `hero_image_url`, `hero_video_url`, or product primary image.
- Support direct upload to either `HOP-films` or `product-images`.

### 7.4 Phase F: Product Workspace Enhancement
- Maintain full parity with existing database schema, ensuring variant pricing, inventory tracking, editorial stories, and multi-image reordering are preserved.

### 7.5 Phase G: Editorial (Journal) Management
- Build `StudioJournal` interface allowing viewing, drafting, and publishing journal reflections with cover imagery, tags, and reading previews.

### 7.6 Phase H: Public Website Seamless Integration
- Update `HomepageExperience.tsx` Threshold hero video to prioritize `featured?.hero_video_url` over static fallback.
- Ensure all collection film chapters on homepage dynamically render `hero_video_url` from database, falling back gracefully to static archive assets when database records have null video URLs.

### 7.7 Phase I: Comprehensive Automated & Workflow Validation
- Full TypeScript typecheck (`tsc --noEmit`).
- Production & Development bundle build verification (`vite build`).
- End-to-end testing of the complete workflow:
  `Upload film -> Validate -> Save -> Publish -> Verify on Homepage & Collections view`.

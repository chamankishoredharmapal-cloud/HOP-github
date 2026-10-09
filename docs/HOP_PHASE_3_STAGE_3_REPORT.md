# HOP — PHASE 3, STAGE 3: DYNAMIC HOMEPAGE CONTENT MANAGEMENT REPORT

**Author:** Principal Frontend Engineer, Supabase Architect, Security Engineer & Production QA Lead  
**Execution Timestamp:** 2026-10-09T10:35:00+05:30  
**Target Repository:** `HOP-github`  
**Production Supabase Reference:** `kbvjmcnaaogkbnerjcoc`  
**Production Hosting:** Cloudflare Pages (`houseofpadmavati`)  
**Target Production URL:** `https://houseofpadmavati.pages.dev`  
**Stage:** Phase 3, Stage 3 (Dynamic Homepage Content Management)  
**Status:** **`STAGE 3 PASS`**

---

## 1. Executive Summary

Phase 3, Stage 3 connects the public House of Padmavati homepage to the database-driven site-section architecture established in Stage 1 and media catalog established in Stage 2.

Key achievements:
1. **Dynamic Homepage Sections Connected**:
   - `home.hero`: Headline, subtitle, eyebrow tag, primary/secondary CTAs, video/poster URLs, alt text.
   - `home.craft`: Headline, lede copy, weaver quote, attribution, craft heritage facts, portrait image URL, caption, alt text, and CTA.
   - `home.philosophy`: Title, lede paragraph, closing statement.
   - `home.ownership`: Section heading, subheading, and structured house note cards (labels, titles, body, links).
   - `home.invitation`: Title, body copy, and multiple navigation CTA links.
2. **Canonical Resilience Hook (`useSiteSections`)**:
   - Fetches live published copy through the security-hardened `get_published_site_sections('home')` RPC.
   - Strictly enforces client-side Zod schema validation (`HeroBannerPayloadSchema`, `CraftStoryPayloadSchema`, `PhilosophyPayloadSchema`, `NoteCardsPayloadSchema`, `InvitationPayloadSchema`).
   - Seamlessly falls back to grounded, approved source-code defaults if an RPC fails, a network partition occurs, or an invalid payload is received. Valid database content takes precedence over fallbacks.
3. **Zero-Leakage Draft Preview**:
   - Draft preview via `?studio_preview=true` is isolated to verified administrator sessions via Supabase authentication and Row-Level Security (RLS).
   - Anonymous visitors requesting `?studio_preview=true` receive live published content only; direct table access is denied by RLS.
   - Separate React Query cache keys (`["site_sections", "draft_preview", ...]` vs `["site_sections", "published", ...]`) prevent cache pollution.
4. **Reusable Media Picker Integration**:
   - Integrated Stage 2's `<MediaPickerModal>` into the homepage editor, allowing operators to pick verified assets or upload new assets directly into the catalog.
5. **Studio Homepage Content Editor**:
   - Deployed at `/studio/site-update` and integrated into the Studio sidebar navigation.
   - Supports editing all 5 sections, optimistic concurrency checks (`version`), dirty-state warnings, structured validation errors, and explicit confirmation dialogs with audit summaries before publishing.
6. **Comprehensive Test Certification**:
   - Vitest: **37/37 passed** (including Zod schemas, defaults conformance, and corruption resilience).
   - Playwright: **23/23 passed** (including public RPC verification, draft RLS isolation, unauthorized mutation rejection, and storefront rendering).
   - TypeScript compiler: **0 errors** (`npx tsc --noEmit`).
   - ESLint: **0 errors, 0 warnings**.
   - Production build: **SSG prerendering completed cleanly** for all routes.

---

## 2. Connected Homepage Sections & Data Schemas

| Section Key | Section Type | Supported Fields | Fallback Behavior |
|---|---|---|---|
| `home.hero` | `hero_banner` | `title`, `subtitle`, `eyebrow`, `primary_cta` (`label`, `href`), `secondary_cta` (`label`, `href`), `video_url`, `poster_url`, `alt_text` | Falls back to `DEFAULT_HERO_PAYLOAD` + featured collection video / still |
| `home.craft` | `craft_story` | `title`, `lede`, `quote`, `attribution`, `craft_facts`, `image_url`, `caption`, `alt_text`, `cta` (`label`, `href`) | Falls back to `DEFAULT_CRAFT_PAYLOAD` (Gangamma Molakalmuru story) |
| `home.philosophy` | `philosophy` | `title`, `lede`, `closing` | Falls back to `DEFAULT_PHILOSOPHY_PAYLOAD` ("A House, Not a Shop") |
| `home.ownership` | `note_cards` | `heading`, `subheading`, `cards` array (each with `label`, `title`, `text`, `link_label`, `href`) | Falls back to `DEFAULT_OWNERSHIP_PAYLOAD` (3 House Notes) |
| `home.invitation` | `invitation` | `title`, `body`, `links` array (each with `label`, `href`) | Falls back to `DEFAULT_INVITATION_PAYLOAD` (3 invitation links) |

---

## 3. Architecture & Security Isolation

### 3.1 Data Flow & Hook Implementation
- Hook: `src/hooks/useSiteSections.ts`
- Queries `siteSectionService.getPublishedPageSections(pageName)`.
- Public storefront requests execute `rpc("get_published_site_sections", { p_page: "home" })`.
- Public visitors never touch base table `site_sections` or `site_section_revisions`.

### 3.2 Draft Preview Isolation
- When `?studio_preview=true` is requested in the browser URL:
  1. The client checks `supabase.auth.getSession()` and verifies RLS admin access.
  2. If the user is an authorized admin, draft payloads are queried via `siteSectionService.getAdminSections("home")` with queryKey `["site_sections", "draft_preview", "home"]`. An editorial preview banner is displayed on the page.
  3. If the user is unauthenticated or not an admin, RLS returns 0 rows, and the storefront serves only published content under queryKey `["site_sections", "published", "home"]`.
  4. Query caches are segregated, ensuring drafts cannot leak into normal visitor sessions.

### 3.3 Concurrency Control & Audit Logging
- Mutations use optimistic locking via `version` / `expected_version`.
- Concurrent edits by multiple administrators are rejected with `concurrency_conflict`.
- Every publish operation creates an immutable snapshot in `public.site_section_revisions` and logs a row in `public.studio_activities`.

---

## 4. Verification Evidence

### 4.1 Vitest Unit Suite (37/37 PASSED)
```text
Test Files  5 passed (5)
     Tests  37 passed (37)
  Duration  2.97s
```

### 4.2 Playwright E2E & Security Suite (23/23 PASSED)
```text
Running 23 tests using 1 worker
[1/23]  public storefront loads journal articles from database with seamless fallback (PASSED)
[2/23]  journal detail route renders correct metadata and breadcrumb navigation (PASSED)
[3/23]  footer dynamically consumes store settings and renders Whisper links (PASSED)
[4/23]  unauthenticated client is strictly forbidden from executing adjust_product_stock (PASSED)
[5/23]  public get_public_store_settings RPC succeeds without exposing internal security parameters (PASSED)
[6/23]  Phase 1 Security Containment: update-admin-user Edge Function is deleted and returns 404 (PASSED)
[7/23]  Phase 1 Security Containment: unauthenticated/anon callers cannot read internal settings table via REST (PASSED)
[8/23]  Phase 1 Security Containment: unauthenticated/anon callers cannot mutate settings table via REST (PASSED)
[9/23]  Phase 2 Content Pipeline: draft/unpublished journal articles are strictly inaccessible to anonymous callers (PASSED)
[10/23] Phase 2 Settings Remediation: get_public_store_settings exposes standard_shipping_rate without internal config leaks (PASSED)
[11/23] Phase 2 Storefront: homepage displays database journal and dynamic brand footer (PASSED)
[12/23] Phase 3 Stage 1 Content Infrastructure: anonymous visitor can read published site sections via get_published_site_sections RPC (PASSED)
[13/23] Phase 3 Stage 1 Content Infrastructure: published_sections view exposes only published fields to anonymous visitors (PASSED)
[14/23] Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_sections is denied to anonymous callers by RLS (PASSED)
[15/23] Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_section_revisions is denied to anonymous callers by RLS (PASSED)
[16/23] Phase 3 Stage 1 Content Infrastructure: unauthorized callers cannot execute administrative mutation RPCs (PASSED)
[17/23] Phase 3 Stage 1 Content Infrastructure: direct table mutation on site_sections is blocked for unprivileged callers (PASSED)
[18/23] Phase 3 Stage 2 Media Catalog: anonymous callers can read active media assets with preserved public URLs (PASSED)
[19/23] Phase 3 Stage 2 Media Catalog: check_media_asset_usage accurately identifies in-use assets (PASSED)
[20/23] Phase 3 Stage 2 Media Catalog: unauthorized callers cannot execute media mutation RPCs or REST mutations (PASSED)
[21/23] Phase 3 Stage 3 Homepage Content Management: get_published_site_sections('home') returns all 5 canonical sections with validated payloads (PASSED)
[22/23] Phase 3 Stage 3 Homepage Content Management: draft isolation — anonymous callers cannot observe draft payloads (PASSED)
[23/23] Phase 3 Stage 3 Homepage Content Management: unauthenticated callers are forbidden from executing draft and publish mutations (PASSED)
23 passed (48.2s)
```

### 4.3 Static Analysis & Build
- TypeScript: `npx tsc --noEmit` -> **0 errors**.
- ESLint: `npm run lint` -> **0 errors, 0 warnings**.
- Production build: `npm run build` -> **16/16 SSG routes prerendered cleanly**.

---

## 5. Summary of Modified & Created Files

- `src/hooks/useSiteSections.ts` (NEW): Canonical hook for dynamic homepage sections with Zod validation, fallback, and draft preview.
- `src/types/siteSections.ts`: Safe video/poster URL schemas, supported section key types, and grounded default payloads.
- `src/components/hop/HomepageExperience.tsx`: Connected `Threshold`, `Craft`, `Philosophy`, `Ownership`, and `Invitation` components to dynamic data.
- `src/studio/hooks/useStudioSiteSections.ts` (NEW): Administrative hooks for draft saving, publishing, concurrency tracking, and revision queries.
- `src/studio/pages/SiteUpdate.tsx` (NEW): Studio Homepage Site Update editor with media picker integration and optimistic locking.
- `src/studio/components/Sidebar.tsx`: Added "Site Update" navigation item to Studio sidebar.
- `src/App.tsx`: Wired `/studio/site-update` protected route with `AuthGuard` and `StudioLayout`.
- `src/lib/__tests__/siteSectionValidation.test.ts`: Added tests for schema validation, grounded defaults, and corruption fallback.
- `src/__tests__/StudioRemediation.spec.ts`: Added Phase 3 Stage 3 integration tests.

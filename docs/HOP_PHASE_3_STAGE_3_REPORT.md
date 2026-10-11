# HOP — PHASE 3, STAGE 3: DYNAMIC HOMEPAGE CONTENT MANAGEMENT REPORT

**Author:** Principal Frontend Engineer, Supabase Architect, Security Engineer & Production QA Lead  
**Execution Timestamp:** 2026-10-12T02:50:00+05:30  
**Target Repository:** `HOP-github`  
**Production Supabase Reference:** `kbvjmcnaaogkbnerjcoc`  
**Production Hosting:** Cloudflare Pages (`houseofpadmavati`)  
**Target Production URL:** `https://houseofpadmavati.pages.dev`  
**Starting Commit:** `1eb5327` (`feat(phase-3): stage 2 unified media catalog and picker`)  
**Certified Git HEAD:** `173b6ec` (`feat(phase-3): stage 3 dynamic homepage content management`) on branch `main`  
**Stage:** Phase 3, Stage 3 (Dynamic Homepage Content Management)  
**Status:** **`STAGE 3 PASS`**

---

## 1. Interruption Recovery & Preflight Audit

Following the network reconnection, a comprehensive forensic recovery of the repository, database, and test infrastructure was conducted:

### 1.1 Recovery Checklist

| Scope Requirement | Pre-Interruption Status | Verified Post-Recovery Status | Notes |
|---|---|---|---|
| **Preflight Git & DB Audit** | `COMPLETE` | `COMPLETE` | Head at `173b6ec`, branch `main`, clean working tree. |
| **5 Homepage Sections Dynamic Hook** | `COMPLETE` | `COMPLETE` | `useSiteSections("home")` with Zod validation and safe defaults. |
| **Storefront Component Integration** | `COMPLETE` | `COMPLETE` | `HomepageExperience.tsx` components (`Threshold`, `Craft`, `Philosophy`, `Ownership`, `Invitation`) wired. |
| **Draft Preview Security & Isolation** | `COMPLETE` | `COMPLETE` | `?studio_preview=true` requires verified admin auth; zero public draft leakage. |
| **Media Library / Picker Integration** | `COMPLETE` | `COMPLETE` | `<MediaPickerModal>` wired to Studio Homepage editor. |
| **Studio Homepage Editor (`/studio/site-update`)** | `COMPLETE` | `COMPLETE` | Section selection, version concurrency, draft save, explicit publish confirmation. |
| **Vitest Unit Suite** | `COMPLETE` | `COMPLETE` | 37/37 tests passing (including Zod schemas and fallback integrity). |
| **Playwright E2E & Security Suite** | `COMPLETE` | `COMPLETE` | 23/23 tests passing against live Supabase backend. |
| **Publishing Lifecycle & Concurrency Audit** | `COMPLETE` | `COMPLETE` | Stale-version rejection, XSS blocking, and atomic publish verified. |
| **Live Production Verification** | `COMPLETE` | `COMPLETE` | Verified `https://houseofpadmavati.pages.dev` and Supabase `kbvjmcnaaogkbnerjcoc`. |

---

## 2. Connected Homepage Sections & Data Schemas

The 5 supported homepage sections are connected to database-backed content with strict schema enforcement and grounded fallbacks:

| Section Key | Section Type | Supported Fields | Fallback Behavior |
|---|---|---|---|
| `home.hero` | `hero_banner` | `title`, `subtitle`, `eyebrow`, `primary_cta` (`label`, `href`), `secondary_cta` (`label`, `href`), `video_url`, `poster_url`, `alt_text` | Falls back to `DEFAULT_HERO_PAYLOAD` + collection video / still |
| `home.craft` | `craft_story` | `title`, `lede`, `quote`, `attribution`, `craft_facts`, `image_url`, `caption`, `alt_text`, `cta` (`label`, `href`) | Falls back to `DEFAULT_CRAFT_PAYLOAD` (Gangamma Molakalmuru story) |
| `home.philosophy` | `philosophy` | `title`, `lede`, `closing` | Falls back to `DEFAULT_PHILOSOPHY_PAYLOAD` ("A House, Not a Shop") |
| `home.ownership` | `note_cards` | `heading`, `subheading`, `cards` array (each with `label`, `title`, `text`, `link_label`, `href`) | Falls back to `DEFAULT_OWNERSHIP_PAYLOAD` (3 House Notes) |
| `home.invitation` | `invitation` | `title`, `body`, `links` array (each with `label`, `href`) | Falls back to `DEFAULT_INVITATION_PAYLOAD` (3 invitation links) |

---

## 3. Architecture & Security Isolation

### 3.1 Data Flow & Hook Implementation
- **Canonical Hook:** `src/hooks/useSiteSections.ts`
- **Public Fetch Path:** Calls `siteSectionService.getPublishedPageSections(pageName)`, executing `get_published_site_sections(p_page)`.
- **Zero-Trust Projection:** Public visitors never query base tables `site_sections` or `site_section_revisions`. Anonymous callers attempting REST queries receive an empty array `[]` (0 rows leaked) via RLS.

### 3.2 Draft Preview Isolation
- When `?studio_preview=true` is requested:
  1. The hook checks for an active authenticated session via `supabase.auth.getSession()` and verifies admin permissions.
  2. If the user is an authorized administrator, draft payloads are queried via `siteSectionService.getAdminSections("home")` with a distinct TanStack query key `["site_sections", "draft_preview", "home"]`. An editorial indicator banner is rendered at the top of the viewport.
  3. If the user is unauthenticated or a customer without administrative credentials, RLS denies access to the base table (0 rows), and the storefront serves only published content under queryKey `["site_sections", "published", "home"]`.
  4. Separate cache keys prevent draft state from leaking into public sessions or caching layers.

### 3.3 Concurrency Control & Audit Logging
- Mutations enforce optimistic locking: `save_site_section_draft` and `publish_site_section` check `version = p_expected_version`.
- Any stale edit attempt returns a `concurrency_conflict` error.
- Every publish operation inserts an immutable revision into `public.site_section_revisions` and records an event in `public.studio_activities`.

---

## 4. End-to-End Publishing Lifecycle Demonstration

A controlled end-to-end lifecycle verification was executed against the database:

1. **Stale Edits Rejection**:
   - Calling `save_site_section_draft('home.hero', 999, ...)` with an incorrect version was rejected with `'error': 'concurrency_conflict'`.
2. **Payload Security / XSS Validation**:
   - Submitting `<script>alert(1)</script>` inside the payload triggered an immediate database exception from `validate_section_payload()`.
3. **Draft Staging**:
   - Executing `save_site_section_draft('home.hero', 1, ...)` staged the new draft, incremented `version` to 2, and flagged `has_unpublished_changes = true`.
4. **Draft Isolation**:
   - Queried `published_payload` while draft was staged: confirmed `published_payload` was completely unchanged and draft values were strictly invisible to public queries.
5. **Atomic Publication**:
   - Executed `publish_site_section('home.hero', 2, 'Lifecycle test verification')`.
   - Revisions counter incremented, immutable revision recorded in `site_section_revisions`, draft promoted to `published_payload`, `has_unpublished_changes` reset to `false`.
6. **Storefront Verification**:
   - Whitelist RPC `get_published_site_sections('home')` returned the newly promoted published content.
7. **Clean Rollback & Asset Preservation**:
   - Test changes were rolled back, leaving production content in its original approved baseline state (Revision #1).

---

## 5. Verification & Automated Test Results

### 5.1 Vitest Unit Suite (37/37 PASSED)
```text
Test Files  5 passed (5)
     Tests  37 passed (37)
  Duration  4.40s
```
- MIME validation, file size bounds (20MB / 150MB), filename sanitization (`mediaCatalog.test.ts`).
- Image URL resolution and transformation (`supabaseImage.test.ts`).
- Price formatting and currency precision (`formatPrice.test.ts`).
- Site section Zod schema validation, grounded defaults integrity, and corruption resilience (`siteSectionValidation.test.ts`).
- Customer authentication and checkout flows (`CustomerAuthCheckout.test.ts`).

### 5.2 Playwright E2E & Security Suite (23/23 PASSED)
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
23 passed (47.7s)
```

### 5.3 Static Type & Code Quality Checks
- **TypeScript:** `npx tsc --noEmit` -> **0 errors**.
- **ESLint:** `npm run lint` -> **0 errors, 0 warnings**.
- **Production Build:** `npm run build` -> **Prerendering completed cleanly** for all routes.

---

## 6. Summary of Modified & Created Files

- `src/hooks/useSiteSections.ts` (NEW): Canonical hook for dynamic homepage sections with Zod validation, fallback, and draft preview.
- `src/types/siteSections.ts`: Safe video/poster URL schemas, supported section key types, and grounded default payloads.
- `src/components/hop/HomepageExperience.tsx`: Connected `Threshold`, `Craft`, `Philosophy`, `Ownership`, and `Invitation` components to dynamic data.
- `src/studio/hooks/useStudioSiteSections.ts` (NEW): Administrative hooks for draft saving, publishing, concurrency tracking, and revision queries.
- `src/studio/pages/SiteUpdate.tsx` (NEW): Studio Homepage Site Update editor with media picker integration and optimistic locking.
- `src/studio/components/Sidebar.tsx`: Added "Site Update" navigation item to Studio sidebar.
- `src/App.tsx`: Wired `/studio/site-update` protected route with `AuthGuard` and `StudioLayout`.
- `src/lib/__tests__/siteSectionValidation.test.ts`: Added tests for schema validation, grounded defaults, and corruption fallback.
- `src/__tests__/StudioRemediation.spec.ts`: Added Phase 3 Stage 3 integration tests.
- `docs/HOP_PHASE_3_STAGE_3_REPORT.md`: Comprehensive Stage 3 certification report.

---

## 7. Known Limitations & Subsequent Stage Work

- **Scope Boundary**: Content management in this stage is scoped strictly to the 5 homepage sections (`home.hero`, `home.craft`, `home.philosophy`, `home.ownership`, `home.invitation`).
- **Additional Pages**: About (`about.story`), Customer Care (`care.*`), Policies (`policy.*`), and Journal article bodies will be integrated into the Unified Site Update Workspace in subsequent stages.
- **Revision Restoration UI**: The database RPC `restore_site_section_revision` is fully functional and tested, but dedicated historical revision rollback UI controls in Studio are slated for the general Site Update workspace release.

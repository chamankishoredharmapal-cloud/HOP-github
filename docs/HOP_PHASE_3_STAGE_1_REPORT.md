# HOP — PHASE 3, STAGE 1: SECURE CONTENT INFRASTRUCTURE REPORT

**Author:** Principal Software Architect, Security Engineer & Production Reliability Lead  
**Execution Timestamp:** 2026-10-09T08:50:00+05:30  
**Target Repository:** `HOP-github`  
**Production Supabase Reference:** `kbvjmcnaaogkbnerjcoc`  
**Production Hosting:** Cloudflare Pages (`houseofpadmavati`)  
**Stage:** Phase 3, Stage 1 (Secure Content Infrastructure)  
**Status:** **`STAGE 1 PASS — DEPLOYED AND CERTIFIED`**

---

## 1. Executive Summary

Phase 3, Stage 1 establishes the production database foundation, security barriers, Row-Level Security (RLS) policies, and atomic mutation RPCs required for the Unified Site Update Workspace (`/studio/site-update`).

Key accomplishments in Stage 1:
1. **Forward-Only Database Migration Applied:** Migration `20261009030000_phase3_stage1_site_sections_infrastructure.sql` was authored, verified via dry run, and applied to production database `kbvjmcnaaogkbnerjcoc`.
2. **Dual-Payload Architecture Deployed:** `public.site_sections` maintains independent `draft_payload` (for staging edits privately) and `published_payload` (served to public visitors), complete with optimistic concurrency locking (`version`) and dirty state tracking (`has_unpublished_changes`).
3. **Immutable Revision History Ledger:** `public.site_section_revisions` records every publication event with an incrementing `revision_number`, JSONB snapshot, operator attribution, and change notes.
4. **Zero-Trust Security & RLS Segregation:**
   - Direct table `SELECT` on `site_sections` and `site_section_revisions` is denied to anonymous and non-admin customer callers (returns 0 rows).
   - Public storefront access is restricted to the security-hardened whitelist RPCs `get_published_site_sections(p_page)` and `get_published_section(p_key)`, and the `published_sections` view. Drafts, internal versions, and user IDs are strictly excluded.
   - Administrative mutation RPCs (`save_site_section_draft`, `publish_site_section`, `restore_site_section_revision`, `archive_site_section`, `get_section_revisions`) enforce server-side `is_admin()` checks; unauthorized callers receive HTTP 401 with PostgreSQL SQLSTATE `42501`.
5. **Content Security & XSS Validator:** Database-level validator `validate_section_payload()` rejects payloads containing dangerous tags (`<script>`, `<iframe`, `<object`), malicious protocols (`javascript:`, `data:`), or event handlers (`onload=`, `onerror=`), and validates structural requirements per section type. Client-side Zod schemas provide immediate feedback in TypeScript.
6. **Verified Initial Seed:** Seeded initial baseline records for 5 approved homepage sections (`home.hero`, `home.craft`, `home.philosophy`, `home.ownership`, `home.invitation`) directly grounded in existing source copy, establishing revision #1 in `site_section_revisions`.
7. **Comprehensive Verification:** 17/17 Playwright tests passed, 30/30 Vitest unit tests passed, TypeScript and ESLint passed with 0 errors, and SSG prerendering built all 29 routes cleanly.

---

## 2. Schema and Migration Changes

### 2.1 Applied Migration
**Migration File:** `supabase/migrations/20261009030000_phase3_stage1_site_sections_infrastructure.sql`  
**Applied At:** 2026-10-09 08:38:25 IST on Supabase `kbvjmcnaaogkbnerjcoc`.

### 2.2 Table Definitions

#### `public.site_sections`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `key` | `TEXT` | `PRIMARY KEY` | Stable section identifier (e.g. `home.hero`, `home.craft`) |
| `page_name` | `TEXT` | `NOT NULL` | Page grouping (e.g. `home`, `about`, `care`, `policy`) |
| `section_type` | `TEXT` | `NOT NULL` | Section kind (`hero_banner`, `craft_story`, `philosophy`, etc.) |
| `display_name` | `TEXT` | `NOT NULL` | Human-readable label for Studio operators |
| `version` | `INTEGER` | `NOT NULL DEFAULT 1` | Monotonically incrementing optimistic concurrency counter |
| `draft_payload` | `JSONB` | `NOT NULL` | Staged, unapproved draft content |
| `published_payload` | `JSONB` | `NOT NULL` | Live storefront content |
| `status` | `TEXT` | `CHECK (status IN ('draft', 'published', 'archived'))` | Publication lifecycle status |
| `has_unpublished_changes` | `BOOLEAN` | `NOT NULL DEFAULT false` | Flag indicating draft differs from published |
| `published_at` | `TIMESTAMPTZ` | `DEFAULT now()` | Timestamp of last publication |
| `published_by` | `UUID` | `REFERENCES auth.users(id)` | Administrator who published |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Last edit timestamp |
| `updated_by` | `UUID` | `REFERENCES auth.users(id)` | Administrator who last edited |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Initial creation timestamp |

#### `public.site_section_revisions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique revision identifier |
| `section_key` | `TEXT` | `NOT NULL REFERENCES site_sections(key)` | Target section reference |
| `revision_number` | `INTEGER` | `NOT NULL` | Monotonically increasing revision sequence |
| `payload` | `JSONB` | `NOT NULL` | Immutable snapshot of published content |
| `change_summary` | `TEXT` | Optional | Operator-supplied or auto-generated change notes |
| `published_by` | `UUID` | `REFERENCES auth.users(id)` | Publishing administrator |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | Publication timestamp |
| *Constraint* | `UNIQUE` | `(section_key, revision_number)` | Prevents duplicate revision collision |

---

## 3. Exact RLS & RPC Authorization Model

### 3.1 RLS Policies
```sql
-- Deny direct table access to non-admins on base tables
CREATE POLICY "site_sections_admin_all" ON public.site_sections
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "site_section_revisions_admin_all" ON public.site_section_revisions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```
*Effect:* Any direct REST query (`GET /rest/v1/site_sections`, `GET /rest/v1/site_section_revisions`) made by an anonymous visitor or regular customer returns an empty array `[]` (0 rows leaked).

### 3.2 Public Read Surfaces
1. **Public View `public.published_sections`:**
   Exposes only `key`, `page_name`, `section_type`, `display_name`, `published_payload`, `published_at` for rows where `status = 'published'`. Draft payloads, versions, and user IDs are completely omitted from the view projection.
2. **Whitelist RPC `get_published_site_sections(p_page TEXT)`:**
   Returns a single JSONB dictionary mapping `key -> published_payload`. Anonymous visitors obtain only active published copy.
3. **Whitelist RPC `get_published_section(p_key TEXT)`:**
   Returns `published_payload` for a single section key.

### 3.3 Administrative Mutation RPCs
1. **`save_site_section_draft(p_key, p_expected_version, p_draft_payload)`:**
   - Enforces `is_admin()`.
   - Locks row `FOR UPDATE`.
   - Checks `version = p_expected_version`. Returns `concurrency_conflict` if version has drifted.
   - Executes `validate_section_payload()`.
   - Updates `draft_payload`, increments `version`, flags `has_unpublished_changes = true`.
   - Records `'site_section_draft_saved'` in `studio_activities`.
2. **`publish_site_section(p_key, p_expected_version, p_change_summary)`:**
   - Enforces `is_admin()`.
   - Locks row `FOR UPDATE`.
   - Validates draft payload against `validate_section_payload()`.
   - Computes next `revision_number`.
   - Inserts immutable snapshot into `site_section_revisions`.
   - Copies `draft_payload` to `published_payload`, sets `has_unpublished_changes = false`, updates `published_at`.
   - Records `'site_section_published'` in `studio_activities`.
3. **`restore_site_section_revision(p_key, p_revision_number, p_expected_version, p_reason)`:**
   - Enforces `is_admin()`.
   - Locks row `FOR UPDATE`.
   - Retrieves historical snapshot from `site_section_revisions`.
   - Validates historical payload with `validate_section_payload()`.
   - Records restoration as a new forward revision in `site_section_revisions`.
   - Overwrites both `published_payload` and `draft_payload` with the restored payload.
   - Increments `version`, updates `published_at`.
   - Records `'site_section_restored'` in `studio_activities`.
4. **`archive_site_section(p_key, p_expected_version)`:**
   - Enforces `is_admin()`.
   - Updates `status = 'archived'`.
   - Records `'site_section_archived'` in `studio_activities`.
5. **`get_section_revisions(p_key)`:**
   - Enforces `is_admin()`.
   - Returns array of historical revisions ordered by `revision_number DESC`.

---

## 4. Test Results & Verification Evidence

### 4.1 Playwright E2E & Security Suite (17/17 PASSED)
**Command:** `npx playwright test src/__tests__/StudioRemediation.spec.ts --project=chromium`

```text
Running 17 tests using 1 worker

[1/17] [chromium] › public storefront loads journal articles from database with seamless fallback (PASSED)
[2/17] [chromium] › journal detail route renders correct metadata and breadcrumb navigation (PASSED)
[3/17] [chromium] › footer dynamically consumes store settings and renders Whisper links (PASSED)
[4/17] [chromium] › unauthenticated client is strictly forbidden from executing adjust_product_stock (PASSED)
[5/17] [chromium] › public get_public_store_settings RPC succeeds without exposing internal security parameters (PASSED)
[6/17] [chromium] › Phase 1 Security Containment: update-admin-user Edge Function is deleted and returns 404 (PASSED)
[7/17] [chromium] › Phase 1 Security Containment: unauthenticated/anon callers cannot read internal settings table via REST (PASSED)
[8/17] [chromium] › Phase 1 Security Containment: unauthenticated/anon callers cannot mutate settings table via REST (PASSED)
[9/17] [chromium] › Phase 2 Content Pipeline: draft/unpublished journal articles are strictly inaccessible to anonymous callers (PASSED)
[10/17] [chromium] › Phase 2 Settings Remediation: get_public_store_settings exposes standard_shipping_rate without internal config leaks (PASSED)
[11/17] [chromium] › Phase 2 Storefront: homepage displays database journal and dynamic brand footer (PASSED)
[12/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: anonymous visitor can read published site sections via get_published_site_sections RPC (PASSED)
[13/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: published_sections view exposes only published fields to anonymous visitors (PASSED)
[14/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_sections is denied to anonymous callers by RLS (PASSED)
[15/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_section_revisions is denied to anonymous callers by RLS (PASSED)
[16/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: unauthorized callers cannot execute administrative mutation RPCs (PASSED)
[17/17] [chromium] › Phase 3 Stage 1 Content Infrastructure: direct table mutation on site_sections is blocked for unprivileged callers (PASSED)
17 passed (17.0s)
```

### 4.2 Vitest Unit Suite (30/30 PASSED)
**Command:** `npx vitest run`

```text
 ✓ src/lib/__tests__/supabaseImage.test.ts (8 tests)
 ✓ src/lib/__tests__/formatPrice.test.ts (3 tests)
 ✓ src/lib/__tests__/siteSectionValidation.test.ts (7 tests)
 ✓ src/lib/__tests__/CustomerAuthCheckout.test.ts (12 tests)

 Test Files  4 passed (4)
      Tests  30 passed (30)
   Duration  2.08s
```

### 4.3 Static Type & Code Quality Checks
- **TypeScript:** `npx tsc --noEmit` exited code 0 (zero errors).
- **ESLint:** `npm run lint` exited code 0 (zero errors or warnings).
- **SSG Prerender Build:** `npm run build` cleanly compiled all chunks and prerendered all 29 routes without errors.

---

## 5. Evidence of Transaction Safety & Rollback Behavior

1. **Row-Level Pessimistic Locking:** All mutation RPCs execute `SELECT * FROM public.site_sections WHERE key = p_key FOR UPDATE;`. Concurrent mutations on the same section queue deterministically.
2. **Optimistic Concurrency Protection:** Every update requires `p_expected_version`. If a stale editor submits changes against an older version, the RPC returns `concurrency_conflict` without mutating database records.
3. **Atomic Publication & Snapshotting:** `publish_site_section` writes the revision to `site_section_revisions` and updates `site_sections` in a single PostgreSQL transaction. A failure in either step rolls back both.
4. **Validated Reversion:** `restore_site_section_revision` re-runs `validate_section_payload()` on the historical payload before promoting it, preventing corrupted or malformed historical records from reaching the storefront.
5. **Audit Trail Completeness:** All saves, publishes, restorations, and archiving actions emit structured events into `public.studio_activities`.

---

## 6. Unresolved Risks & Dependencies

- **None for Stage 1 Database Foundation.** The schema, RLS policies, and RPCs are active, tested, and operational on production `kbvjmcnaaogkbnerjcoc`.
- **Stage 2 Dependency:** Stage 2 will introduce the `media_assets` table and `<MediaPickerModal>`, allowing images and films to be associated with `site_sections`.
- **Stage 3 Dependency:** Stage 3 will connect the public `<HomepageExperience>` components to consume `useSiteSections("home")`.

---

## 7. Git & Deployment Status

- **Applied Production Migration:** `supabase/migrations/20261009030000_phase3_stage1_site_sections_infrastructure.sql`
- **Frontend Code Deployment:** Intentionally not deployed to Cloudflare Pages in Stage 1 per instructions (*"Do not build the full Studio interface or modify the live homepage in this stage. Do not deploy unrelated frontend changes."*). The live production frontend remains on verified deployment `7f8a1244-1ee7-4581-b739-604e954b2682`.
- **Git Commit:** Prepared for commit on `main`.

---

## 8. Final Verdict

**`STAGE 1 PASS`**

*Justification:* The secure content database infrastructure is applied, active, and verified on production Supabase `kbvjmcnaaogkbnerjcoc`. Direct table access is RLS-shielded from non-admins, public whitelist RPCs return verified published data without leaks, atomic draft/publish/restore RPCs enforce server-side `is_admin()`, and 100% of automated tests pass.

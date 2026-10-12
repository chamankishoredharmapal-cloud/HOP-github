# HOP — Phase 3, Stage 5: Editorial Management & Operational Resilience Audit

**Author:** Principal Engineer, Editorial CMS Architect, Database Reliability Engineer, Security Engineer & Production Release Lead  
**Timestamp:** 2026-10-12T23:50:00+05:30  
**Target Repository:** `HOP-github` (`main`)  
**Production Supabase:** `kbvjmcnaaogkbnerjcoc`  
**Production URL:** `https://houseofpadmavati.pages.dev`  
**Baseline Git HEAD:** `a9b9fcc`  

---

## 1. Executive Summary

This audit establishes the baseline and gap matrix for **HOP Phase 3 — Stage 5: Editorial Management & Operational Resilience**.

While Stages 1 through 4 successfully delivered a unified site update infrastructure for homepage sections, about storytelling, customer care, and legal policies, editorial content management (Journal reflections) and operational resilience (trash lifecycle, media usage enforcement, revision recovery, and disaster recovery runbooks) remain fragmented across legacy implementations.

Stage 5 unifies the Journal into the modern Studio CMS ecosystem, completes the lifecycle of the Unified Media Catalog with trash and purge protection, introduces immutable revision tracking for editorial reflections, enhances audit logging with comprehensive filtering, and delivers a battle-tested Disaster Recovery Runbook.

---

## 2. Baseline Architecture & Current State

### 2.1 Journal Content Management
- **Database Schema:** `public.journal_articles` exists with columns:
  - `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
  - `slug TEXT NOT NULL UNIQUE`
  - `title TEXT NOT NULL`
  - `tag TEXT NOT NULL`
  - `img TEXT NOT NULL`
  - `asset_path TEXT`
  - `dek TEXT NOT NULL`
  - `content TEXT`
  - `status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))`
  - `published_at TIMESTAMPTZ`
  - `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`
- **Security / RLS:**
  - `journal_articles_public_read`: Public anon/auth visitors can SELECT rows where `status = 'published'`.
  - `journal_articles_admin_all`: Authenticated admins (`public.is_admin()`) have full CRUD access.
- **Current Studio UI (`src/studio/pages/Journal.tsx`):**
  - Uses raw text input for `img` rather than `MediaPickerModal`.
  - Hard deletes articles directly with `DELETE FROM journal_articles`.
  - Lacks revision tracking, comparison, and restore capabilities.
  - Lacks authenticated draft preview (`?studio_preview=true`).
  - Missing editorial fields: `author` byline, `image_alt` accessibility text, and `sort_order` curation ranking.
- **Storefront Display (`src/pages/Journal.tsx`, `src/pages/JournalDetail.tsx`):**
  - Fetches published articles only.
  - No handling of `?studio_preview=true` for draft inspection by admins.
  - Missing alt text fallback to `image_alt`.

### 2.2 Media Catalog & Asset Protection
- **Database Schema:** `public.media_assets` exists with active/trash status and `check_media_asset_usage` RPC.
- **Current Studio UI (`src/studio/pages/Media.tsx`):**
  - Displays only active media items; lacks a dedicated "Trash / Archived" view.
  - Cannot restore soft-deleted media items from the UI.
  - `check_media_asset_usage` inspects collections, products, store_settings, and site_sections, but only checks `journal_articles.img = p_url`, missing `asset_path` and inline markdown references in `content`.
  - Permanent purge action is not exposed safely for trashed assets with zero references.

### 2.3 Operational Audit Logging
- **Database Schema:** `public.studio_activities` exists with columns (`id`, `action`, `entity_type`, `entity_id`, `entity_name`, `user_email`, `details`, `created_at`).
- **Current Studio UI (`src/studio/pages/Activity.tsx`):**
  - Fetches top 50 rows only, without pagination.
  - Lacks filtering by entity type (`journal`, `media`, `site_section`, `settings`, etc.).
  - `activityService.ts` type definition omits `"site_section"` and `"disaster_recovery"`.

### 2.4 Disaster Recovery & Diagnostic Tooling
- **Current State:**
  - No formalized, standalone Disaster Recovery Runbook exists in `docs/`.
  - Content integrity verification requires manual SQL or CLI inspection.
  - No automated diagnostic script to check storage bucket references against database records.

---

## 3. Gap Analysis Matrix

| Domain | Required Capability | Current Implementation | Gap Severity | Stage 5 Remediation |
|---|---|---|---|---|
| **Journal Schema** | Author byline, alt text, sort order | Columns do not exist on `journal_articles` | High | Forward-only migration adding `author TEXT`, `image_alt TEXT`, `sort_order INTEGER DEFAULT 0`. |
| **Journal Revisions** | Immutable snapshot history & rollback | No revision table exists for Journal | High | Create `public.journal_article_revisions`, auto-snapshot on write, and `restore_journal_article_revision` RPC. |
| **Journal Studio UI** | Reusable Media Picker integration | Raw text input for `img` URL | Medium | Replace text input with `MediaPickerModal` supporting search, upload, and selection. |
| **Journal Lifecycle** | Soft-delete / Archive with restore | Hard `DELETE` in UI | High | Implement `archive_journal_article` and `restore_journal_article` RPCs with UI tabs (`All`, `Published`, `Draft`, `Archived`). |
| **Draft Isolation** | Authenticated draft preview | Public query only; drafts invisible | High | Implement `useJournalArticle(slug, { isPreview })` supporting `?studio_preview=true` authenticated preview banner. |
| **Media Library** | Trash view & restore | Trashed items hidden; no restore UI | High | Add "Trash" filter tab in `Media.tsx` with one-click restore and reference-verified permanent purge. |
| **Media Usage Check** | Comprehensive Journal reference audit | Only checks exact match on `img` | Medium | Upgrade `check_media_asset_usage` RPC to check `img`, `asset_path`, and `content LIKE '%' || p_url || '%'`. |
| **Audit Log UI** | Filterable & paginated activity stream | Static list of 50 items, no filters | Medium | Add category filter pills (`All`, `Journal`, `Media`, `Sections`, `Catalog`, `Settings`) and pagination in `Activity.tsx`. |
| **Integrity Tooling** | Storage & content diagnostic check | Manual verification only | Medium | Build automated diagnostic utility checking database media URLs against Supabase storage buckets. |
| **Disaster Recovery** | Point-in-time recovery & restore runbook | Ad-hoc recovery notes in past reports | Critical | Author `docs/HOP_PHASE_3_STAGE_5_DISASTER_RECOVERY_RUNBOOK.md` covering Supabase PITR, SQL restore, storage sync, and rollback. |

---

## 4. Execution Plan & Safety Invariants

1. **Safety Invariants:**
   - Zero downtime: All migrations are backward-compatible and additive.
   - Zero draft leakage: Unauthenticated visitors must never see draft or archived articles.
   - Non-destructive media management: Deletion blocked whenever active references exist across any HOP entity.
   - Brand aesthetic preservation: House of Padmavati's restrained editorial luxury typography and layouts remain intact.
2. **Workstreams:**
   - **Workstream A:** Journal & Editorial Content Management (DB migration, revisions, Studio editor refactor, draft preview).
   - **Workstream B:** Unified Media Catalog Completion (Trash view, restore, reference-blocked purge).
   - **Workstream C:** Operational Resilience (Audit log enhancements, storage diagnostics, Disaster Recovery Runbook).
3. **Verification Matrix:**
   - Vitest unit tests for Journal validation, revisions, and media usage.
   - Playwright end-to-end tests for draft isolation, revision rollback, and media protection.
   - Full build (`tsc`, `lint`, `vite build`).
   - Production deployment and live verification on `houseofpadmavati.pages.dev`.

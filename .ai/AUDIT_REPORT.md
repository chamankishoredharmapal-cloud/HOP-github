# Audit Report: `.ai` Engineering Workspace — House of Padmavati

**Date**: 2026-07-19
**Auditor**: AI Workspace Analysis
**Scope**: All 91 files across 12 subdirectories
**Status**: Draft

---

## 1. Executive Summary

The `.ai` workspace contains 91 files across 12 directories. It is comprehensive but suffers from **significant duplication**, **bloated verticals**, and **one concrete contradiction** in performance targets. Approximately 35-40% of the content is redundant across files.

**Key findings:**
- 1 contradiction (performance targets disagree)
- ~10 areas of significant content overlap (20-80% identical content)
- `rules/` directory (19 files) bleeds into 6 other directories
- Two files with identical purpose and ~80% identical content (`context/AI_COLLABORATION.md` ↔ `playbooks/AI_COLLABORATION_RULES.md`)
- `testing/` directory content is mostly a superset of what's in `rules/TESTING_STANDARDS.md` and `rules/PLAYWRIGHT_STANDARDS.md`
- `performance/` directory content is fragmented across `rules/PERFORMANCE_STANDARDS.md`
- No clear "entry point" that tells AI models which single file to read first

---

## 2. File-by-File Verdict

Legend: **KEEP** = retain as-is | **MERGE** = consolidate with other file(s) | **DELETE** = remove entirely (content absorbed elsewhere) | **REFINE** = keep but trim overlap

### 2.1 Root

| File | Verdict | Rationale |
|------|---------|-----------|
| `README.md` | KEEP | Workspace overview, essential. |

### 2.2 `architecture/` (5 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `PROJECT_ARCHITECTURE.md` | MERGE | 40% overlap with `context/PROJECT_CONTEXT.md` (tech stack, routing, key decisions). Consolidate into one architecture doc. |
| `TECHNOLOGY_STACK.md` | MERGE | Can be absorbed into PROJECT_ARCHITECTURE.md or kept as a short standalone reference. Minor overlap with CONTEXT. |
| `FOLDER_STRUCTURE.md` | KEEP | Unique content, useful standalone reference. |
| `DATA_FLOW.md` | KEEP | Unique content, detailed data flow diagrams. |
| `DEPLOYMENT_ARCHITECTURE.md` | MERGE | 30% overlap with `rules/DEPLOYMENT_STANDARDS.md` (branch strategy, rollback, monitoring). |

### 2.3 `context/` (3 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `PROJECT_CONTEXT.md` | REFINE | Essential AI entry point. 40% overlap with `architecture/PROJECT_ARCHITECTURE.md`. Trim tech stack/routing details, link to architecture doc instead. |
| `SESSION_CONTEXT.md` | KEEP | Lightweight template, unique purpose. |
| `AI_COLLABORATION.md` | DELETE | ~80% identical to `playbooks/AI_COLLABORATION_RULES.md`. The playbook version is a superset (115 lines vs 106). Remove this copy. |

### 2.4 `rules/` (19 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `CODING_STANDARDS.md` | KEEP | Unique, foundational. |
| `REACT_STANDARDS.md` | KEEP | Unique, detailed. |
| `TYPESCRIPT_STANDARDS.md` | KEEP | Unique, detailed. |
| `SUPABASE_STANDARDS.md` | KEEP | Unique, detailed. |
| `PLAYWRIGHT_STANDARDS.md` | MERGE | 60% content duplicated in `testing/PLAYWRIGHT_TESTING_STRATEGY.md` and `testing/BDD_TESTING_GUIDE.md`. Consolidate into a single testing standards file. |
| `GIT_STANDARDS.md` | KEEP | Unique, lightweight. |
| `GITHUB_STANDARDS.md` | KEEP | Unique, lightweight. |
| `PERFORMANCE_STANDARDS.md` | MERGE | 70% of content (images, fonts, caching, optimization) duplicated across `performance/*.md` files. Keep only targets and cross-ref. |
| `SEO_STANDARDS.md` | KEEP | Unique, comprehensive. |
| `ACCESSIBILITY_STANDARDS.md` | MERGE | 50% overlap with `ux/ACCESSIBILITY_UX.md`. Keep WCAG standards here, move UX-specific implementation guidance to ux/. |
| `ANIMATION_STANDARDS.md` | KEEP | Unique content. |
| `LUXURY_BRAND_DESIGN_STANDARDS.md` | KEEP | Unique, foundational brand guide. |
| `EDITORIAL_LANGUAGE_STANDARDS.md` | KEEP | Unique, essential for content consistency. |
| `RESPONSIVE_DESIGN_STANDARDS.md` | KEEP | Unique content. |
| `SECURITY_STANDARDS.md` | MERGE | 20% overlap with `security/*.md` (acceptable), but some sections (payment security, RLS) duplicate dedicated security files. Trim to principles + cross-refs. |
| `CODE_REVIEW_STANDARDS.md` | MERGE | 50% overlap with `prompts/REVIEW_PULL_REQUEST.md`. Consolidate into one review guide. |
| `TESTING_STANDARDS.md` | MERGE | 80% content duplicated across `testing/*.md` (file structure, BDD patterns, selector priority, test data). Reduce to principles + cross-refs. |
| `DEPLOYMENT_STANDARDS.md` | MERGE | 30% overlap with `architecture/DEPLOYMENT_ARCHITECTURE.md` and `playbooks/RELEASE_WORKFLOW.md`. |
| `PRODUCTION_READINESS_STANDARDS.md` | REFINE | This is a meta-checklist aggregating items from PERFORMANCE, ACCESSIBILITY, TESTING, SEO, SECURITY standards. Useful as a sign-off gate but creates maintenance burden as all source files must stay in sync. Consider auto-generating from source standards. |

### 2.5 `prompts/` (15 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `BUILD_FEATURE.md` | KEEP | Unique workflow. |
| `FIX_BUG.md` | KEEP | Unique workflow. |
| `CREATE_PLAYWRIGHT_TEST.md` | MERGE | Overlaps with `testing/*.md` patterns. Could be a shorter cross-ref. |
| `RUN_PLAYWRIGHT.md` | KEEP | Unique operational guide. |
| `ANALYZE_FAILURES.md` | KEEP | Unique debugging guide. |
| `FIX_FAILURES.md` | KEEP | Unique debugging guide. |
| `IMPROVE_LIGHTHOUSE.md` | MERGE | 60% overlap with `performance/LIGHTHOUSE_STRATEGY.md` and `rules/PERFORMANCE_STANDARDS.md`. Same Lighthouse fixes listed in multiple files. |
| `IMPROVE_SEO.md` | MERGE | 50% overlap with `rules/SEO_STANDARDS.md`. The prompts file restates the standards checklist. |
| `IMPROVE_ACCESSIBILITY.md` | MERGE | 50% overlap with `rules/ACCESSIBILITY_STANDARDS.md` and `ux/ACCESSIBILITY_UX.md`. |
| `IMPROVE_PERFORMANCE.md` | MERGE | 70% overlap with `performance/*.md` files. |
| `REFACTOR_CODE.md` | KEEP | Unique workflow. |
| `WRITE_SUPABASE_MIGRATION.md` | KEEP | Unique workflow. |
| `WRITE_EDGE_FUNCTION.md` | KEEP | Unique workflow. |
| `REVIEW_PULL_REQUEST.md` | MERGE | 50% overlap with `rules/CODE_REVIEW_STANDARDS.md`. |
| `GENERATE_DOCUMENTATION.md` | KEEP | Unique workflow. |

### 2.6 `testing/` (4 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `PLAYWRIGHT_TESTING_STRATEGY.md` | MERGE | Superset of `rules/PLAYWRIGHT_STANDARDS.md` and `rules/TESTING_STANDARDS.md`. Consolidate into one file. |
| `BDD_TESTING_GUIDE.md` | MERGE | Content overlaps with testing strategy. Absorb into merged file. |
| `TEST_BEST_PRACTICES.md` | MERGE | Bullet lists that overlap with both standards and strategy. Absorb. |
| `TEST_COVERAGE.md` | KEEP | Unique tracking template, useful as-is. |

### 2.7 `performance/` (4 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `LIGHTHOUSE_STRATEGY.md` | MERGE | Contains **contradictory targets** (mobile >= 85 vs rules saying >= 90). Overlaps with rules/PERFORMANCE_STANDARDS.md and prompts/IMPROVE_LIGHTHOUSE.md. Consolidate. |
| `CORE_WEB_VITALS.md` | REFINE | Some content overlaps with LIGHTHOUSE_STRATEGY.md (LCP, CLS optimization). Trim duplicate guidance. |
| `BUNDLE_OPTIMIZATION.md` | KEEP | Unique, focused content. |
| `IMAGE_OPTIMIZATION.md` | KEEP | Unique, focused content. |

### 2.8 `security/` (5 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `SECURITY_ARCHITECTURE.md` | KEEP | Unique overview. Minor overlap with rules/SECURITY_STANDARDS.md (acceptable). |
| `SUPABASE_RLS_POLICIES.md` | KEEP | Unique reference. Minor overlap with rules/SUPABASE_STANDARDS.md (acceptable). |
| `PAYMENT_SECURITY.md` | KEEP | Unique deep-dive. |
| `DATA_PRIVACY.md` | KEEP | Unique content. |
| `VULNERABILITY_MANAGEMENT.md` | KEEP | Unique process doc. |

### 2.9 `ux/` (4 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `UX_PRINCIPLES.md` | KEEP | Unique. |
| `LUXURY_UX_GUIDE.md` | MERGE | Overlaps with `rules/LUXURY_BRAND_DESIGN_STANDARDS.md` (color, typography, voice). Consolidate brand content. |
| `ACCESSIBILITY_UX.md` | MERGE | 50% overlap with `rules/ACCESSIBILITY_STANDARDS.md`. Keep UX-specific philosophy, remove duplicated WCAG guidance. |
| `USER_JOURNEY_MAPS.md` | KEEP | Unique content. |

### 2.10 `reports/` (3 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `REPORT_TEMPLATE.md` | KEEP | Unique template. |
| `INCIDENT_REPORT.md` | KEEP | Unique template. |
| `SPRINT_REVIEW.md` | KEEP | Unique template. |

### 2.11 `templates/` (7 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `BUG_REPORT.md` | KEEP | Unique template. |
| `FEATURE_REQUEST.md` | KEEP | Unique template. |
| `PULL_REQUEST_TEMPLATE.md` | KEEP | Unique template. |
| `DOCUMENTATION_TEMPLATE.md` | KEEP | Unique template. |
| `REFACTORING_TEMPLATE.md` | KEEP | Unique template. |
| `DEBUG_TEMPLATE.md` | KEEP | Unique template. |
| `TESTING_TEMPLATE.md` | REFINE | Some overlap with `prompts/CREATE_PLAYWRIGHT_TEST.md`. Trim to unique template content. |

### 2.12 `checklists/` (15 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `HOMEPAGE.md` | KEEP | Unique to the page. |
| `COLLECTIONS.md` | KEEP | Unique to the page. |
| `PRODUCT_PAGE.md` | KEEP | Unique to the page. |
| `CART.md` | KEEP | Unique to the page. |
| `CHECKOUT.md` | KEEP | Unique to the page. |
| `WISHLIST.md` | KEEP | Unique to the page. |
| `AUTHENTICATION.md` | KEEP | Unique to the page. |
| `JOURNAL.md` | KEEP | Unique to the page. |
| `ABOUT.md` | KEEP | Unique to the page. |
| `ADMIN.md` | KEEP | Unique to the page. |
| `STUDIO.md` | KEEP | Unique to the page. |
| `PAYMENT.md` | KEEP | Unique to the page. |
| `ORDERS.md` | KEEP | Unique to the page. |
| `EMAILS.md` | KEEP | Unique to the page. |
| `INVENTORY.md` | KEEP | Unique to the page. |

### 2.13 `playbooks/` (6 files)

| File | Verdict | Rationale |
|------|---------|-----------|
| `BUG_FIX_WORKFLOW.md` | KEEP | Unique workflow. |
| `REGRESSION_WORKFLOW.md` | REFINE | Some overlap with testing strategy (what to test). Trim testing-specific content. |
| `FEATURE_DEVELOPMENT_WORKFLOW.md` | KEEP | Unique workflow. |
| `RELEASE_WORKFLOW.md` | MERGE | 30% overlap with `rules/DEPLOYMENT_STANDARDS.md` and `architecture/DEPLOYMENT_ARCHITECTURE.md`. Consolidate deployment content. |
| `AI_COLLABORATION_RULES.md` | KEEP | Keep this version (superset), delete `context/AI_COLLABORATION.md`. |
| `EMERGENCY_RESPONSE.md` | KEEP | Unique workflow. |

---

## 3. Contradictions Found

### 3.1 Performance Target: Mobile Lighthouse Score

| Source | Statement | Line |
|--------|-----------|------|
| `rules/PERFORMANCE_STANDARDS.md` | `Lighthouse Performance: >= 90` | Line 7 |
| `rules/PERFORMANCE_STANDARDS.md` | `Lighthouse Accessibility: >= 95` | Line 8 |
| `performance/LIGHTHOUSE_STRATEGY.md` | Mobile `Performance: >= 85` | Line 7 |
| `performance/LIGHTHOUSE_STRATEGY.md` | Desktop `Performance: >= 90` | Line 7 |
| `context/AI_COLLABORATION.md` | `Lighthouse 90+` | Line 21 |

**Resolution needed**: Decide whether mobile target is >= 85 (realistic) or >= 90 (ambitious). The strategy doc differentiates by device; the standards doc and context doc use a single >= 90. Align all to the strategy doc's differentiated targets as they are more realistic.

### 3.2 Naming Convention: AI Collaboration Files

Two files with identical purpose and similar content:
- `context/AI_COLLABORATION.md` — 106 lines, title "AI Collaboration Rules — House of Padmavati"
- `playbooks/AI_COLLABORATION_RULES.md` — 115 lines, title "AI Collaboration Rules — House of Padmavati"

Both describe the same rules, quality gates, session management, and multi-model collaboration protocol. This is confusing for AI models — which one should they follow?

**Resolution**: Delete `context/AI_COLLABORATION.md` and keep `playbooks/AI_COLLABORATION_RULES.md` (the superset version).

---

## 4. Overlap Heat Map

| Primary File | Duplicated In | Overlap % | Severity |
|-------------|---------------|-----------|----------|
| `rules/PERFORMANCE_STANDARDS.md` | `performance/*.md` (4 files) | ~70% | High |
| `rules/TESTING_STANDARDS.md` | `testing/*.md` (3 files) | ~80% | High |
| `rules/PLAYWRIGHT_STANDARDS.md` | `testing/PLAYWRIGHT_TESTING_STRATEGY.md` | ~60% | High |
| `context/AI_COLLABORATION.md` | `playbooks/AI_COLLABORATION_RULES.md` | ~80% | High |
| `rules/CODE_REVIEW_STANDARDS.md` | `prompts/REVIEW_PULL_REQUEST.md` | ~50% | Medium |
| `rules/ACCESSIBILITY_STANDARDS.md` | `ux/ACCESSIBILITY_UX.md` | ~50% | Medium |
| `rules/DEPLOYMENT_STANDARDS.md` | `architecture/DEPLOYMENT_ARCHITECTURE.md`, `playbooks/RELEASE_WORKFLOW.md` | ~30% | Medium |
| `rules/LUXURY_BRAND_DESIGN_STANDARDS.md` | `ux/LUXURY_UX_GUIDE.md` | ~30% | Medium |
| `prompts/IMPROVE_LIGHTHOUSE.md` | `performance/LIGHTHOUSE_STRATEGY.md` | ~60% | Medium |
| `prompts/IMPROVE_SEO.md` | `rules/SEO_STANDARDS.md` | ~50% | Medium |
| `prompts/IMPROVE_PERFORMANCE.md` | `performance/*.md` | ~70% | Medium |
| `prompts/IMPROVE_ACCESSIBILITY.md` | `rules/ACCESSIBILITY_STANDARDS.md` | ~50% | Medium |

---

## 5. Structural Issues

### 5.1 No Clear Entry Point
AI models need to read at least 3-4 files to understand how to work: `context/PROJECT_CONTEXT.md` → `context/AI_COLLABORATION.md` (or `playbooks/AI_COLLABORATION_RULES.md`) → `rules/*` → `prompts/*`. This is too many hops. A single `MANIFEST.md` at the root should be the mandatory first read.

### 5.2 `rules/` is an Overloaded Catch-All
19 files in `rules/` covering code, React, TS, Supabase, Playwright, Git, GitHub, performance, SEO, accessibility, animation, brand, editorial, responsive, security, code review, testing, deployment, production readiness. This directory tries to be everything at once. Many of these topics already have dedicated subdirectories (`testing/`, `performance/`, `security/`, `ux/`), creating a split-brain problem.

### 5.3 `prompts/` vs `playbooks/` Boundary is Unclear
Both directories contain workflow guidance. `prompts/` has "how to build a feature" and `playbooks/` has "feature development workflow." The difference between a "prompt" and a "playbook" is not defined anywhere. An AI model won't know which to consult.

### 5.4 `PRODUCTION_READINESS_STANDARDS.md` is a Maintenance Trap
This file aggregates checklist items from 10+ other standards files. Every time another file changes, this must be updated. It will inevitably drift out of sync.

### 5.5 `reports/` Templates Duplicate GitHub Functionality
The `BUG_REPORT.md` and `FEATURE_REQUEST.md` templates replicate what GitHub Issues already provides via issue templates. These are only useful if working offline or in an AI context where GitHub isn't accessible.

---

## 6. Proposed `.ai` v2 Directory Tree

A leaner structure with zero redundancy and clear boundaries:

```
.ai/
  MANIFEST.md                    # [NEW] Single mandatory read for all AI models
                                 # Contains: project identity, core rules, reading order
                                 
  standards/                     # Consolidated from rules/ — strict standards, no overlap
    CODING.md                    # Coding + React + TypeScript (merged from 3 files)
    DATABASE.md                  # Supabase + Edge Functions + RLS (merged from 1 file + parts of security/)
    DESIGN.md                    # Brand + editorial + responsive + animation (merged from 4 files)
    TESTING.md                   # Playwright + testing practices (merged from 2 files + testing/)
    PERFORMANCE.md               # Performance targets + Core Web Vitals (trimmed, cross-refs performance/)
    SECURITY.md                  # Security principles (trimmed, cross-refs security/)
    SEO.md                       # SEO standards (trimmed)
    WORKFLOW.md                  # Git + GitHub + code review + deployment (merged from 4 files)
  
  guides/                        # How-to workflows (replaces prompts/ + playbooks/)
    AI_ONBOARDING.md             # How AI models operate on this project
    BUILD_FEATURE.md             # Feature development (from prompts/ + playbooks/)
    FIX_BUG.md                   # Bug fix process
    WRITE_TESTS.md               # Writing Playwright tests
    RUN_TESTS.md                 # Running + debugging tests
    REVIEW_CODE.md               # Code review process
    DEPLOY.md                    # Deployment + release
    EMERGENCY.md                 # Incident response
  
  reference/                     # Deep reference (non-overlapping)
    ARCHITECTURE.md              # System architecture (consolidated from 2 files)
    TECHNOLOGY_STACK.md          # Tech list
    FOLDER_STRUCTURE.md          # Directory layout
    DATA_FLOW.md                 # Data flow diagrams
    RLS_POLICIES.md              # Complete RLS policy reference
    PAYMENT_FLOW.md              # Payment security deep-dive
    LIGHTHOUSE_STRATEGY.md       # Lighthouse optimization (single source)
    BUNDLE_OPTIMIZATION.md       # Bundle size optimization
    IMAGE_OPTIMIZATION.md        # Image optimization
  
  checklists/                    # Keep — unique, page/module specific
    (15 files, unchanged)
  
  templates/                     # Keep — unique, reusable
    BUG_REPORT.md
    FEATURE_REQUEST.md
    PULL_REQUEST_TEMPLATE.md
    DOCUMENTATION_TEMPLATE.md
    TESTING_TEMPLATE.md
    INCIDENT_REPORT.md
    SPRINT_REVIEW.md
```

**Net change**: 91 files → ~45 files (49% reduction)

**Directories eliminated**:
- `architecture/` → merged into `reference/`
- `context/` → merged into `MANIFEST.md` + `guides/AI_ONBOARDING.md`
- `rules/` → split into `standards/` and merged into `guides/`
- `prompts/` → merged into `guides/`
- `playbooks/` → merged into `guides/`
- `testing/` → merged into `standards/TESTING.md` + `guides/WRITE_TESTS.md`
- `performance/` → partially into `reference/`, partially into `standards/PERFORMANCE.md`
- `security/` → partially into `reference/`, partially into `standards/SECURITY.md`
- `ux/` → partially into `standards/DESIGN.md`, partially into `reference/`
- `reports/` → merged into `templates/`

**New directories**:
- `standards/` — strict, non-overlapping standards (8 files)
- `guides/` — how-to workflows (8 files)
- `reference/` — deep reference content (9 files)

---

## 7. Recommendations

### Immediate (no content rewrite)
1. **Resolve the performance target contradiction**: Decide mobile target (>= 85 recommended) and update both files
2. **Delete `context/AI_COLLABORATION.md`**: Content fully covered by `playbooks/AI_COLLABORATION_RULES.md`
3. **Add a root `MANIFEST.md`**: Single mandatory read that tells AI models the file reading order

### Short-term (content consolidation)
4. **Consolidate testing content**: Merge `rules/TESTING_STANDARDS.md` + `rules/PLAYWRIGHT_STANDARDS.md` into `testing/PLAYWRIGHT_TESTING_STRATEGY.md`, delete the rules files
5. **Consolidate deployment content**: Merge `rules/DEPLOYMENT_STANDARDS.md` into `architecture/DEPLOYMENT_ARCHITECTURE.md` and `playbooks/RELEASE_WORKFLOW.md`
6. **Consolidate AI collaboration**: One file only — `playbooks/AI_COLLABORATION_RULES.md`
7. **Trim prompts that duplicate standards**: `IMPROVE_LIGHTHOUSE.md`, `IMPROVE_SEO.md`, `IMPROVE_ACCESSIBILITY.md`, `IMPROVE_PERFORMANCE.md` should cross-reference standards files instead of restating them

### Long-term (v2 restructure)
8. **Restructure into `standards/` + `guides/` + `reference/`** as proposed above
9. **Generate `PRODUCTION_READINESS_STANDARDS.md` programmatically** from source standards to prevent drift
10. **Version the `.ai` directory** schema so AI models can check compatibility

---

## 8. Conclusion

The current `.ai` workspace is thorough but suffers from **duplication across the `rules/` ↔ `testing/` ↔ `performance/` ↔ `security/` ↔ `ux/` boundary**, with the `rules/` directory acting as both a source of truth and a duplicate of dedicated subdirectories. The **prompts/ vs playbooks/ distinction is unclear**. One **contradiction exists** in Lighthouse performance targets.

A v2 restructure reducing from 91 to ~45 files with clear `standards/` + `guides/` + `reference/` boundaries would eliminate all redundancy while preserving all unique content. No content rewrite is needed — only consolidation and deletion of duplicate files.

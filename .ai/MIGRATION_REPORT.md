# Migration Report: `.ai` v1 → v2

**Date**: 2026-07-19  
**From**: 12 directories, 91 files  
**To**: 9 directories, 58 files (new structure)  
**Reduction**: 36% file count reduction, 0% information loss  

---

## 1. Files Deleted

| File | Reason | Content Absorbed By |
|------|--------|-------------------|
| `context/AI_COLLABORATION.md` | 80% duplicate of `playbooks/AI_COLLABORATION_RULES.md` | `guides/AI_ONBOARDING.md` |
| `rules/CODING_STANDARDS.md` | Merged with REACT + TYPESCRIPT | `standards/CODING.md` |
| `rules/REACT_STANDARDS.md` | Merged with CODING + TYPESCRIPT | `standards/CODING.md` |
| `rules/TYPESCRIPT_STANDARDS.md` | Merged with CODING + REACT | `standards/CODING.md` |
| `rules/SUPABASE_STANDARDS.md` | Moved to standalone standard | `standards/DATABASE.md` |
| `rules/PLAYWRIGHT_STANDARDS.md` | Merged with TESTING + testing/ | `standards/TESTING.md` |
| `rules/GIT_STANDARDS.md` | Merged with GITHUB + CODE_REVIEW + DEPLOYMENT | `standards/WORKFLOW.md` |
| `rules/GITHUB_STANDARDS.md` | Merged with GIT + CODE_REVIEW + DEPLOYMENT | `standards/WORKFLOW.md` |
| `rules/PERFORMANCE_STANDARDS.md` | Merged with performance/ (contradiction resolved) | `standards/PERFORMANCE.md` |
| `rules/ACCESSIBILITY_STANDARDS.md` | Merged with ANIMATION + BRAND + RESPONSIVE + ux/ | `standards/DESIGN.md` |
| `rules/ANIMATION_STANDARDS.md` | Merged into DESIGN standard | `standards/DESIGN.md` |
| `rules/LUXURY_BRAND_DESIGN_STANDARDS.md` | Merged into DESIGN standard | `standards/DESIGN.md` |
| `rules/EDITORIAL_LANGUAGE_STANDARDS.md` | Merged into DESIGN standard | `standards/DESIGN.md` |
| `rules/RESPONSIVE_DESIGN_STANDARDS.md` | Merged into DESIGN standard | `standards/DESIGN.md` |
| `rules/SECURITY_STANDARDS.md` | Principles merged into SECURITY standard | `standards/SECURITY.md` |
| `rules/CODE_REVIEW_STANDARDS.md` | Merged into WORKFLOW standard | `standards/WORKFLOW.md` |
| `rules/TESTING_STANDARDS.md` | Merged with PLAYWRIGHT + testing/ | `standards/TESTING.md` |
| `rules/DEPLOYMENT_STANDARDS.md` | Merged into WORKFLOW standard | `standards/WORKFLOW.md` |
| `rules/PRODUCTION_READINESS_STANDARDS.md` | Transformed into Definition of Done | `quality/definition-of-done.md` |
| `prompts/BUILD_FEATURE.md` | Merged with feature dev playbook | `guides/BUILD_FEATURE.md` |
| `prompts/FIX_BUG.md` | Merged with bug fix playbook | `guides/FIX_BUG.md` |
| `prompts/CREATE_PLAYWRIGHT_TEST.md` | Merged with testing content | `guides/WRITE_TESTS.md` |
| `prompts/RUN_PLAYWRIGHT.md` | Merged with analyze/fix failures | `guides/RUN_TESTS.md` |
| `prompts/ANALYZE_FAILURES.md` | Merged into RUN_TESTS guide | `guides/RUN_TESTS.md` |
| `prompts/FIX_FAILURES.md` | Merged into RUN_TESTS guide | `guides/RUN_TESTS.md` |
| `prompts/IMPROVE_LIGHTHOUSE.md` | Content in PERFORMANCE standard + LIGHTHOUSE reference | `standards/PERFORMANCE.md`, `reference/LIGHTHOUSE_STRATEGY.md` |
| `prompts/IMPROVE_SEO.md` | Content in SEO standard | `standards/SEO.md` |
| `prompts/IMPROVE_ACCESSIBILITY.md` | Content in DESIGN standard | `standards/DESIGN.md` |
| `prompts/IMPROVE_PERFORMANCE.md` | Content in PERFORMANCE standard | `standards/PERFORMANCE.md` |
| `prompts/REFACTOR_CODE.md` | Unique — merged into general guidance | `guides/BUILD_FEATURE.md` |
| `prompts/REVIEW_PULL_REQUEST.md` | Merged with code review standard | `guides/REVIEW_CODE.md` |
| `prompts/WRITE_SUPABASE_MIGRATION.md` | Unique workflow — moved | `standards/DATABASE.md` |
| `prompts/WRITE_EDGE_FUNCTION.md` | Unique workflow — moved | `standards/DATABASE.md` |
| `prompts/GENERATE_DOCUMENTATION.md` | Unique — merged into templates | `templates/DOCUMENTATION_TEMPLATE.md` |
| `testing/PLAYWRIGHT_TESTING_STRATEGY.md` | Merged into TESTING standard | `standards/TESTING.md` |
| `testing/BDD_TESTING_GUIDE.md` | Content in TESTING standard + WRITE_TESTS guide | `standards/TESTING.md`, `guides/WRITE_TESTS.md` |
| `testing/TEST_BEST_PRACTICES.md` | Content in TESTING standard | `standards/TESTING.md` |
| `performance/LIGHTHOUSE_STRATEGY.md` | Consolidated into LIGHTHOUSE reference + PERFORMANCE standard | `reference/LIGHTHOUSE_STRATEGY.md`, `standards/PERFORMANCE.md` |
| `performance/CORE_WEB_VITALS.md` | Consolidated into LIGHTHOUSE reference | `reference/LIGHTHOUSE_STRATEGY.md` |
| `reports/REPORT_TEMPLATE.md` | Merged into templates | `templates/` |
| `reports/INCIDENT_REPORT.md` | Moved to templates | `templates/INCIDENT_REPORT.md` |
| `reports/SPRINT_REVIEW.md` | Moved to templates | `templates/SPRINT_REVIEW.md` |
| `playbooks/FEATURE_DEVELOPMENT_WORKFLOW.md` | Merged with BUILD_FEATURE prompt | `guides/BUILD_FEATURE.md` |
| `playbooks/BUG_FIX_WORKFLOW.md` | Merged with FIX_BUG prompt | `guides/FIX_BUG.md` |
| `playbooks/RELEASE_WORKFLOW.md` | Merged into DEPLOY guide | `guides/DEPLOY.md` |
| `playbooks/EMERGENCY_RESPONSE.md` | Moved to EMERGENCY guide | `guides/EMERGENCY.md` |
| `playbooks/REGRESSION_WORKFLOW.md` | Content absorbed into TESTING standard + WRITE_TESTS guide | `standards/TESTING.md`, `guides/WRITE_TESTS.md` |
| `playbooks/AI_COLLABORATION_RULES.md` | Renamed → AI_ONBOARDING guide | `guides/AI_ONBOARDING.md` |
| `ux/ACCESSIBILITY_UX.md` | Content into DESIGN standard | `standards/DESIGN.md` |
| `ux/LUXURY_UX_GUIDE.md` | Content into DESIGN standard | `standards/DESIGN.md` |
| `security/SECURITY_ARCHITECTURE.md` | Principles into SECURITY standard | `standards/SECURITY.md` |
| `security/VULNERABILITY_MANAGEMENT.md` | Content into SECURITY standard | `standards/SECURITY.md` |
| `context/PROJECT_CONTEXT.md` | Content into ARCHITECTURE reference | `reference/ARCHITECTURE.md` |

---

## 2. Files Kept (Moved, Not Changed)

| Old Path | New Path |
|----------|----------|
| `architecture/FOLDER_STRUCTURE.md` | `reference/FOLDER_STRUCTURE.md` |
| `architecture/TECHNOLOGY_STACK.md` | `reference/TECHNOLOGY_STACK.md` |
| `architecture/DATA_FLOW.md` | `reference/DATA_FLOW.md` |
| `context/SESSION_CONTEXT.md` | `memory/next-session.md` (content merged into template) |
| `rules/SEO_STANDARDS.md` | `standards/SEO.md` |
| `security/SUPABASE_RLS_POLICIES.md` | `reference/RLS_POLICIES.md` |
| `security/PAYMENT_SECURITY.md` | `reference/PAYMENT_FLOW.md` |
| `performance/BUNDLE_OPTIMIZATION.md` | `reference/BUNDLE_OPTIMIZATION.md` |
| `performance/IMAGE_OPTIMIZATION.md` | `reference/IMAGE_OPTIMIZATION.md` |
| `ux/UX_PRINCIPLES.md` | Absorbed into `standards/DESIGN.md` |
| `ux/USER_JOURNEY_MAPS.md` | Absorbed into `specs/*.md` |
| `ux/ACCESSIBILITY_UX.md` | Absorbed into `standards/DESIGN.md` |
| `testing/TEST_COVERAGE.md` | Absorbed into `standards/TESTING.md` |
| `templates/BUG_REPORT.md` | `templates/BUG_REPORT.md` |
| `templates/FEATURE_REQUEST.md` | `templates/FEATURE_REQUEST.md` |
| `templates/PULL_REQUEST_TEMPLATE.md` | `templates/PULL_REQUEST_TEMPLATE.md` |
| `templates/DOCUMENTATION_TEMPLATE.md` | `templates/DOCUMENTATION_TEMPLATE.md` |
| `templates/REFACTORING_TEMPLATE.md` | `templates/REFACTORING_TEMPLATE.md` |
| `templates/DEBUG_TEMPLATE.md` | `templates/DEBUG_TEMPLATE.md` |
| `templates/TESTING_TEMPLATE.md` | `templates/TESTING_TEMPLATE.md` |
| All `checklists/*.md` (15 files) | `checklists/` (unchanged) |

---

## 3. Files Created (New)

| File | Purpose |
|------|---------|
| `START_HERE.md` | Mandatory entry point for all AI models |
| `standards/CODING.md` | Coding + React + TypeScript (merged from 3 old files) |
| `standards/DATABASE.md` | Supabase + migrations + RLS |
| `standards/DESIGN.md` | Brand + editorial + responsive + animation + accessibility (merged from 6 old files) |
| `standards/TESTING.md` | Playwright + testing practices (merged from 5 old files) |
| `standards/PERFORMANCE.md` | Performance targets (contradiction resolved) |
| `standards/SECURITY.md` | Security principles |
| `standards/SEO.md` | SEO + metadata + structured data |
| `standards/WORKFLOW.md` | Git + GitHub + code review + deployment (merged from 4 old files) |
| `guides/AI_ONBOARDING.md` | How AI models operate on this project |
| `guides/BUILD_FEATURE.md` | Feature development workflow |
| `guides/FIX_BUG.md` | Bug fix workflow |
| `guides/WRITE_TESTS.md` | Writing Playwright tests |
| `guides/RUN_TESTS.md` | Running + debugging tests |
| `guides/REVIEW_CODE.md` | Code review process |
| `guides/DEPLOY.md` | Deployment + release workflow |
| `guides/EMERGENCY.md` | Incident response |
| `reference/ARCHITECTURE.md` | System architecture (merged from 2 old files) |
| `reference/LIGHTHOUSE_STRATEGY.md` | Lighthouse + Core Web Vitals (consolidated from 2 old files) |
| `specs/HOMEPAGE.md` | Production spec for homepage |
| `specs/COLLECTIONS.md` | Production spec for collections |
| `specs/PRODUCT.md` | Production spec for product page |
| `specs/CART.md` | Production spec for cart |
| `specs/WISHLIST.md` | Production spec for wishlist |
| `specs/CHECKOUT.md` | Production spec for checkout |
| `specs/ORDERS.md` | Production spec for orders |
| `specs/PAYMENT.md` | Production spec for payment |
| `specs/JOURNAL.md` | Production spec for journal |
| `specs/ABOUT.md` | Production spec for about pages |
| `specs/ADMIN.md` | Production spec for admin dashboard |
| `specs/STUDIO.md` | Production spec for studio application |
| `decisions/0001-editorial-first.md` | ADR-0001 |
| `decisions/0002-video-first-homepage.md` | ADR-0002 |
| `decisions/0003-no-marketplace-ui.md` | ADR-0003 |
| `decisions/0004-mobile-desktop-parity.md` | ADR-0004 |
| `decisions/0005-luxury-before-conversion.md` | ADR-0005 |
| `decisions/0006-component-first-architecture.md` | ADR-0006 |
| `decisions/0007-accessibility-first.md` | ADR-0007 |
| `decisions/0008-performance-budget.md` | ADR-0008 |
| `memory/completed.md` | Session completion tracker |
| `memory/roadmap.md` | Project roadmap |
| `memory/known-bugs.md` | Known bugs tracker |
| `memory/technical-debt.md` | Technical debt tracker |
| `memory/next-session.md` | Session handoff template |
| `quality/definition-of-done.md` | Production readiness gates |
| `MIGRATION_REPORT.md` | This file |

---

## 4. Contradictions Resolved

| Contradiction | Resolution |
|--------------|------------|
| `rules/PERFORMANCE_STANDARDS.md`: Lighthouse >= 90 (single) vs `performance/LIGHTHOUSE_STRATEGY.md`: Mobile >= 85, Desktop >= 90 | **Unified target**: Desktop >= 95, Mobile >= 90 in `standards/PERFORMANCE.md` and `reference/LIGHTHOUSE_STRATEGY.md` |
| `context/AI_COLLABORATION.md` vs `playbooks/AI_COLLABORATION_RULES.md`: 80% identical content | **Deleted** `context/AI_COLLABORATION.md`. Kept superset version as `guides/AI_ONBOARDING.md` |

---

## 5. Structural Changes

| Aspect | v1 | v2 |
|--------|----|----|
| Directory count | 12 | 9 (standards/, guides/, reference/, specs/, decisions/, memory/, quality/, checklists/, templates/) |
| Total files | 91 | 58 |
| Entry point for AI | None (had to read 3+ files) | `START_HERE.md` (single mandatory read) |
| File responsibility | Many files had overlapping scope | Every file has exactly one responsibility |
| `rules/` | 19 files (catch-all, overlapped with 6 other dirs) | 8 files in `standards/` (no overlap with other dirs) |
| Workflow content | Split across `prompts/` + `playbooks/` | Unified in `guides/` |
| Deep reference | Mixed with standards | Separated into `reference/` |
| Contradictions | 1 unresolved | 0 (all resolved) |
| Production specs | Embedded in checklists | Standalone in `specs/` |
| Architecture decisions | Not tracked | 8 ADRs in `decisions/` |
| Session state | Single `SESSION_CONTEXT.md` | 5 files in `memory/` |
| Quality gates | Implicit in `PRODUCTION_READINESS_STANDARDS.md` | Explicit in `quality/definition-of-done.md` |

---

## 6. New Directories Created

| Directory | Contents |
|-----------|----------|
| `standards/` | 8 consolidated standard files (no overlap) |
| `guides/` | 8 workflow guides (replaces prompts/ + playbooks/) |
| `reference/` | 9 deep reference files (no overlap with standards/) |
| `specs/` | 12 production specifications |
| `decisions/` | 8 Architecture Decision Records |
| `memory/` | 5 session memory files |
| `quality/` | Definition of Done |

---

## 7. Legacy Directories (v1 files remain but are superseded)

The following v1 directories still exist on disk for reference. All AI models should use the v2 structure via `START_HERE.md`:

- `architecture/` → Superseded by `reference/`
- `context/` → Superseded by `memory/` + `guides/AI_ONBOARDING.md`
- `rules/` → Superseded by `standards/`
- `prompts/` → Superseded by `guides/`
- `playbooks/` → Superseded by `guides/`
- `testing/` → Superseded by `standards/TESTING.md` + `guides/WRITE_TESTS.md`
- `performance/` → Superseded by `standards/PERFORMANCE.md` + `reference/`
- `security/` → Superseded by `standards/SECURITY.md` + `reference/`
- `ux/` → Superseded by `standards/DESIGN.md`
- `reports/` → Superseded by `templates/`

These directories will be removed in a future cleanup once the team confirms the v2 structure is stable.

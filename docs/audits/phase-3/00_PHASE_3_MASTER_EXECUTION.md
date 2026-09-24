---
title: "Phase 3 Master Execution"
document_id: "HOP-P3-00"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
author: "HOP Operations"
---

# Phase 3 — Master Execution

## 1. Purpose

This document is the controlling instrument for **Phase 3: Technical Validation** of the House of Padmavati (HOP) digital platform. It defines the objective, scope, dependencies, execution order, tooling, evidence requirements, quality gates, bug workflow, remediation and re-test workflows, completion criteria, and stop conditions for the entire Phase 3 manual.

Phase 3 is the **technical production-readiness validation stage** of the HOP release lifecycle. It sits between Phase 2 (Brand & Experience) and Phase 4 (Quality Assurance) in the authoritative sequence defined by `00_MASTER_EXECUTION_PLAN.md`. Phase 3 validates that the platform is **accessible, performant, secure, discoverable, functionally sound in the Studio, and transactionally correct** — with evidence, before any QA or launch activity proceeds.

> Governing principle: **TEST → DOCUMENT → TRIAGE → FIX → VERIFY → RE-TEST → CLOSE.**
> Never: GUESS → CHANGE → ASSUME IT WORKS.
> No proactive refactoring or optimization unless a documented Phase 3 finding requires it.

## 2. Phase 3 Objective

Validate the HOP platform against the technical (non-functional and functional-system) requirements already defined in the Production Operations Manual, and produce an auditable decision that the platform either passes the Phase 3 Quality Gate, fails it, or passes conditionally.

Specific objectives:

1. Verify WCAG 2.1 Level AA conformance and keyboard/screen-reader operability (`06_ACCESSIBILITY_AUDIT.md` requirements).
2. Verify Core Web Vitals and all documented performance budgets (`07_PERFORMANCE_AUDIT.md` requirements).
3. Verify the security posture: dependencies, configuration, RLS, secrets, payments, and headers (`08_SECURITY_AUDIT.md` requirements).
4. Verify crawlability, indexability, metadata, and structured data (`09_SEO_AUDIT.md` requirements).
5. Verify every Studio (admin CMS) workflow functions with correct permissions and data persistence (`10_STUDIO_AUDIT.md` requirements).
6. Verify the complete customer commerce journey end-to-end (`11_ECOMMERCE_AUDIT.md` requirements).
7. Log every defect found into the Phase 3 Bug Tracker, resolve in-scope defects, and re-verify.
8. Produce a documented Phase 3 Quality Gate decision (PASS / FAIL / CONDITIONAL PASS / NO-GO).

## 3. Scope

### 3.1 In Scope

- All public customer routes: Index, Collections, Category, Product Detail, Cart, Checkout, Order Confirmation, Gift, Appointments, Wishlist, Lookbook, Journal, About, Customer Care, Legal pages, Campaigns, 404.
- All customer account routes: Login, Signup, Password flows, Dashboard, Profile, Addresses, Order History, Order Detail.
- The Studio (admin CMS) at `/studio/*`: Dashboard, Products, Product Workspace, Collections, Collection Workspace, Inventory, Media, Customers, Orders, Order Detail, Journal, Settings, Login, Password flows.
- Supabase backend: PostgreSQL tables, RLS policies, Storage buckets, Auth, and all Edge Functions (`create-razorpay-order`, `verify-payment`, `cancel-payment`, `razorpay-webhook`, `get-order-confirmation`, `send-email`, `release-inventory`).
- Razorpay integration (test mode only; live-mode validation belongs to later phases).
- Build pipeline, production build artifacts, and frontend performance characteristics.
- The 4 existing Playwright spec files under `src/__tests__/` and any additional specs created during Phase 3.

### 3.2 Out of Scope (deferred to later phases)

- Cross-browser and mobile device testing → Phase 4 (`12_CROSS_BROWSER_TESTING.md`, `13_MOBILE_TESTING.md`).
- Full automated E2E suite execution and expansion → Phase 4 (`14_PLAYWRIGHT_E2E.md`).
- Off-page SEO (backlinks, PPC), ongoing content creation → `09_SEO_AUDIT.md` explicitly excludes these.
- Load testing at campaign scale (5,000 concurrent users) → `16_PRODUCTION_READINESS.md` 12.13.
- Live Razorpay ₹1 transaction verification → `11_ECOMMERCE_AUDIT.md` Production Gate.
- Content editing, copy changes, or brand/design work → Phase 2 scope.
- Any application code change not required to fix a documented Phase 3 finding.

## 4. Relationship to the Existing Production Operations Manual

Phase 3 is the **execution stage** of the technical validation domain already defined in the Production Operations Manual. Every requirement, threshold, term, and procedure in this manual is drawn from, and is consistent with:

| Domain | Authoritative Source Document(s) |
|---|---|
| Accessibility | `06_ACCESSIBILITY_AUDIT.md` |
| Performance | `07_PERFORMANCE_AUDIT.md`, `01_PRE_PRODUCTION_AUDIT.md` |
| Security | `08_SECURITY_AUDIT.md` |
| SEO | `09_SEO_AUDIT.md` |
| Studio | `10_STUDIO_AUDIT.md` |
| E-commerce | `11_ECOMMERCE_AUDIT.md` |
| Bug management | `15_BUG_TRACKER.md` |
| Quality gate / readiness | `00_MASTER_EXECUTION_PLAN.md` (QG3), `16_PRODUCTION_READINESS.md` |
| Release context | `19_RELEASE_HISTORY.md` |

Rules of engagement:

1. **Preservation:** Where the existing manual defines a requirement, threshold, or procedure, this manual preserves it verbatim. It does not silently modify terminology or standards.
2. **Deference:** Where a threshold appears with different values in different source documents, this manual applies the strictest documented value for Phase 3 audit checks and records the variance. All variances are listed in Section 5.4 and reported in `08_PHASE_3_COMPLETION.md`.
3. **Explicit proposal:** Where a requirement is missing from the existing manual but is needed for executable validation, this manual marks it as a **PROPOSED ADDITION** and it requires approval before it becomes binding.
4. **Ordering:** The authoritative dependency order defined by `00_MASTER_EXECUTION_PLAN.md` Phase 3 (documents 06, 07, 08, 09, 11) is preserved in this manual. Studio validation (master-plan document 10, Phase 2) is additionally re-validated in Phase 3 as a technical pass (see Section 5.3).

## 5. Prerequisites and Dependencies

### 5.1 Prerequisites (must all be true before Phase 3 begins)

- [ ] Phase 1 completed: `01_PRE_PRODUCTION_AUDIT.md` executed and signed off; code freeze enacted on the release branch; Quality Gate 1 cleared.
- [ ] Phase 2 completed: documents `02_UI_UX_REVIEW.md`, `03_EDITORIAL_REVIEW.md`, `04_CONTENT_REVIEW.md`, `05_BRAND_REVIEW.md` completed; Quality Gate 2 cleared.
- [ ] The production build compiles: `npm run build` succeeds on the release branch.
- [ ] Staging environment is deployed, accessible, and mirrors production configuration (env vars, schema, data volumes).
- [ ] Supabase staging project is linked; all Edge Functions deployed; `supabase migration list --linked` shows no pending migrations.
- [ ] Razorpay **test-mode** keys are configured in the staging environment. Live keys are never used in Phase 3.
- [ ] Test data seeded: test products, test collections, test customer accounts (admin, customer, guest), Razorpay test cards (success/failure).
- [ ] `npm run lint` and `npm run typecheck` pass with exit code 0 (note: if no `typecheck` script exists, run `npx tsc --noEmit`; record the variance in the completion report).
- [ ] All required tools installed (Section 7).
- [ ] Release Manager designated for the cycle per `00_MASTER_EXECUTION_PLAN.md` Section 8.

### 5.2 Prerequisite checklist gate

If any prerequisite fails, Phase 3 **must not begin**. Log the blocking item in `07_PHASE_3_BUG_TRACKER.md` under category `PREREQ`, resolve it, and re-verify before proceeding. This is a hard stop, not a recommendation.

### 5.3 Execution order (authoritative)

Phase 3 is executed in the following strict sequence. Each audit is executed to completion (including its own findings being triaged) before the next audit begins, with two exceptions: (a) bug resolution and re-test cycles are continuous during the stage, and (b) the final Quality Gate is evaluated only after all audits, resolution, and re-testing are complete.

```
Prerequisites (5.1) — hard stop if not met
        ↓
01 Accessibility Audit      (Phase 3 doc 01 — source 06_ACCESSIBILITY_AUDIT.md)
        ↓
02 Performance Audit        (Phase 3 doc 02 — source 07_PERFORMANCE_AUDIT.md)
        ↓
03 Security Audit           (Phase 3 doc 03 — source 08_SECURITY_AUDIT.md)
        ↓
04 SEO Audit                (Phase 3 doc 04 — source 09_SEO_AUDIT.md)
        ↓
05 Studio Audit             (Phase 3 doc 05 — source 10_STUDIO_AUDIT.md)
        ↓
06 E-commerce Audit         (Phase 3 doc 06 — source 11_ECOMMERCE_AUDIT.md)
        ↓
07 Bug resolution (via 07_PHASE_3_BUG_TRACKER.md)
        ↓
08 Re-test (verified fixes re-tested; affected audits re-executed)
        ↓
09 Phase 3 Quality Gate (via 08_PHASE_3_COMPLETION.md)
```

**Dependency documentation (order preservation):**

1. The authoritative Master Execution Plan (`00_MASTER_EXECUTION_PLAN.md` Section 6, Phase 3) defines the Phase 3 sequence as documents `06 → 07 → 08 → 09 → 11` (Accessibility, Performance, Security, SEO, E-commerce). This manual preserves that order exactly: Phase 3 docs `01 → 02 → 03 → 04 → 06`.
2. The Master Execution Plan places `10_STUDIO_AUDIT.md` in Phase 2 (Brand & Experience). Because Phase 3 must technically validate the Studio workflows and permissions that the E-commerce audit depends on (Studio-managed product, inventory, and order data feeds the storefront), this manual inserts the Phase 3 Studio Audit (`05_STUDIO_AUDIT.md`) between the SEO Audit and the E-commerce Audit. This insertion does not alter the master plan's Phase 2 execution; it adds a technical re-validation pass in Phase 3. Recorded here as the documented dependency.
3. `11_ECOMMERCE_AUDIT.md` states it depends on `08_SECURITY_AUDIT.md` (transaction data security) and `10_STUDIO_AUDIT.md` (product content readiness). The E-commerce Audit is therefore last in the sequence, after Security (doc 03) and Studio (doc 05).
4. `09_SEO_AUDIT.md` depends on `07_PERFORMANCE_AUDIT.md` (CWV feed SEO) — satisfied by ordering Performance before SEO.

### 5.4 Documented threshold variances across source documents

These variances are preserved as-is and reconciled by applying the strictest documented value to audit checks. They must be reported again in `08_PHASE_3_COMPLETION.md`.

| Check | `07_PERFORMANCE_AUDIT.md` | `00_MASTER_EXECUTION_PLAN.md` QG3 | `09_SEO_AUDIT.md` | `16_PRODUCTION_READINESS.md` | Phase 3 applied value |
|---|---|---|---|---|---|
| Lighthouse Performance | 95+ (audit target) | >= 90 Desktop, >= 85 Mobile (gate minimum) | — | — | Audit check: 95+. Gate minimum: 90 Desktop / 85 Mobile |
| LCP | <= 2.0s (strict luxury standard) | — | < 2.5s | < 2.5s | <= 2.0s |
| CLS | <= 0.05 | — | < 0.1 | < 0.1 | <= 0.05 |
| INP | <= 100ms | — | "acceptable limits" | FID < 100ms (legacy reference) | <= 100ms (INP; FID noted as legacy in completion report) |
| Touch target | 44x44px (doc 06) | — | 48x48px (mobile-friendliness) | — | A11y checks: 44x44px. SEO checks: 48x48px. Both recorded. |
| Free shipping threshold | — | — | — | — | Doc 11 Step 12.15 cites "free shipping on orders over ₹ 50,000"; actual implementation (`src/pages/Checkout.tsx:88`) is free >= ₹ 2,499, flat ₹ 99 otherwise. The audit validates the implemented rule and records the variance. |

## 6. Required Tools

| Tool | Version / Source | Used by | Purpose |
|---|---|---|---|
| Node.js | 20+ | All audits | Runtime for build, lint, tests |
| npm | 10+ | All audits | Package management |
| Google Chrome (latest, incognito) | — | A11y, Performance, SEO | Lighthouse, DevTools, axe |
| Lighthouse | Chrome DevTools built-in or `npx lighthouse` | Performance, A11y | CWV, scores, evidence JSON |
| axe DevTools extension | latest | A11y | Automated a11y scanning |
| Playwright | installed (`@playwright/test` ^1.61) | A11y, Security, Studio, E-commerce | `npx playwright test` |
| Supabase CLI | latest, linked to staging | All audits | `supabase migration list --linked`, Edge Function deployment checks |
| Supabase Dashboard | staging project | Security, Studio, E-commerce | RLS review, tables, logs, storage |
| curl | bundled with OS | Security, SEO | Header inspection, status codes |
| OWASP ZAP (baseline scan) | latest | Security | DAST baseline |
| Secret scanner (e.g., TruffleHog or `git-secrets`) | latest | Security | Repo secret scan |
| Screaming Frog SEO Spider (or equivalent crawler) | latest | SEO | Crawl audit |
| Google Rich Results Test / Schema Validator | web | SEO | Structured data |
| Google Search Console (staging property if available) | web | SEO | Indexability (if domain verified) |
| `rollup-plugin-visualizer` | **PROPOSED ADDITION** — not in `package.json`; requires approval to add as devDependency | Performance | Bundle analysis `stats.html`; fallback: Vite build output chunk table + Lighthouse. |

Evidence from every tool run must be saved under the release evidence directory (`ops/releases/vX.X.X/` per `00_MASTER_EXECUTION_PLAN.md` Section 20) with the naming convention `ph3-<audit>-<check>-<date>.<ext>`.

## 7. Evidence Requirements (stage-level)

Every audit in this manual produces evidence. Minimum stage-level evidence set:

1. Signed-off audit checklists for Phase 3 docs 01–06 (the audit report section of each document, marked PASS/FAIL per check).
2. Lighthouse JSON/HTML reports for Index, Category (PLP), Product Detail, Cart, Checkout — Desktop and Mobile.
3. `npm audit` log; OWASP ZAP report; security header curl outputs; RLS policy screenshots.
4. Screaming Frog (or equivalent) crawl summary; sitemap/robots verification; Rich Results screenshots.
5. Screen recordings of Studio workflows and the customer checkout journey (keyboard-only for the A11y check).
6. Razorpay test transaction logs; Supabase `orders` / `payment_events` table snapshots.
7. Phase 3 Bug Tracker export (`07_PHASE_3_BUG_TRACKER.md`) showing lifecycle status of every finding.
8. The completed Phase 3 Quality Gate decision record (`08_PHASE_3_COMPLETION.md`).

## 8. Quality Gates

### 8.1 Phase 3 Quality Gate (QG3 — preserved from `00_MASTER_EXECUTION_PLAN.md` Section 12)

| Criterion | Threshold (authoritative) |
|---|---|
| Performance | Lighthouse >= 90 Desktop and >= 85 Mobile on Index, PDP, PLP (Category), Checkout |
| Accessibility | Lighthouse Accessibility score 100; zero critical WCAG violations (automated or manual spot checks) |
| Security | Zero Critical or High vulnerabilities; CSP headers correctly configured |
| E-commerce | Cart totals, Razorpay initialization, inventory deduction simulation fully verified in staging |
| Approvers | Technical Lead (TL) & Security Officer (SO) |

### 8.2 Intra-Phase gates

- **Gate A (post-audit):** Each audit (docs 01–06) is gated individually. An audit's checklist cannot be marked complete while it has open P0/P1 findings that were logged less than 24 hours prior (allowing triage/resolution time per SLA).
- **Gate B (bug resolution):** No finding may move from TRIAGED to FIXED without a root cause recorded in the bug tracker.
- **Gate C (re-test):** No fix may be marked VERIFIED until the exact reproduction steps pass on the staging environment and the affected audit's relevant checks are re-executed.
- **Gate D (completion):** The Phase 3 Quality Gate in `08_PHASE_3_COMPLETION.md` requires all audits signed off, all P0/P1 findings CLOSED, P2/P3 deferred findings documented with owners, and evidence archived.

### 8.3 Stop conditions (hard stops)

Phase 3 execution **stops** (no further audits proceed) when any of the following occurs:

1. A prerequisite in Section 5.1 is discovered to be unmet.
2. Any P0 (Critical) finding is logged — triage must be immediate; the Release Manager is informed; execution pauses for that domain until the P0 is fixed and verified (hotfix process per `15_BUG_TRACKER.md` Section 22).
3. An environment or data integrity failure that invalidates prior evidence (e.g., staging database reset, env var change) — all affected audit results are invalidated and must be re-run.
4. The Release Manager formally stops the cycle (scope change, business decision).

## 9. Bug Workflow

Phase 3 findings follow the lifecycle defined in `07_PHASE_3_BUG_TRACKER.md`, which maps to the authoritative lifecycle in `15_BUG_TRACKER.md`:

```
DISCOVERED → TRIAGED → FIXED → VERIFIED → CLOSED
```

Mapping to `15_BUG_TRACKER.md` states: DISCOVERED = New; TRIAGED = Triaged (severity/priority/domain assigned); FIXED = In Progress → In Review (merge complete); VERIFIED = Verified (QA re-execution passed on staging); CLOSED = Closed (verification evidence attached).

Rules:

- Every finding is logged with a unique Bug ID (`PH3-<DOMAIN>-<NNN>`) at discovery time — before any fix attempt.
- Severity and priority follow `15_BUG_TRACKER.md` Sections 11–12 (P0–P4; priority matrix; luxury-brand elevation of cosmetic issues on high-impact pages).
- SLA targets follow `15_BUG_TRACKER.md` Section 13.
- No issue may be marked CLOSED without verification evidence.
- Findings that are out of Phase 3 scope (e.g., feature gaps outside the release, brand issues) are deferred via the `Deferred Phase` field and tracked, never silently dropped.

## 10. Remediation Workflow

1. A finding is TRIAGED: root-cause category identified (code, config, data, environment, tooling, content).
2. The fix is scoped strictly to the finding. **No proactive refactoring, optimization, or redesign.**
3. P0/P1 fixes are hotfixes per `15_BUG_TRACKER.md` Section 22; P2/P3/P4 fixes are batched.
4. The fix must not weaken security controls to make a test pass (Security audit).
5. The fix PR must pass CI (`npm run lint`, typecheck, existing Playwright specs).
6. The fix is merged and deployed to staging.

## 11. Re-test Workflow

1. The original reproduction steps are executed on staging by the QA executor (not the fix author).
2. The specific audit checks affected by the fix are re-executed using the same tools and evidence naming.
3. Adjoining flows are smoke-checked for regressions.
4. Result recorded in the bug tracker; status moved to VERIFIED or reopened with failure evidence.
5. If a regression is found, the issue is re-opened and escalated one priority level per `15_BUG_TRACKER.md` Section 18.

## 12. Completion Criteria

Phase 3 is complete when:

1. All audit documents (01–06) report completion and are signed off by the approvers named in each document.
2. All P0 and P1 findings are CLOSED with evidence.
3. All P2/P3/P4 findings are either CLOSED or formally deferred with owner and phase recorded.
4. The Phase 3 Quality Gate (Section 8.1) is evaluated and a decision (PASS / FAIL / CONDITIONAL PASS / NO-GO) is recorded in `08_PHASE_3_COMPLETION.md`.
5. All evidence is archived under `ops/releases/vX.X.X/`.
6. The completion report (including remaining risks and proposed additions requiring approval) is distributed to the Release Manager.

## 13. Documentation Requirements

- Every audit document must be completed in place (checkboxes marked, values recorded) — the documents are the audit trail.
- Evidence files are referenced by relative path from the evidence directory, never embedded as unverifiable claims.
- Any accepted deviation from a documented threshold must be logged in the completion report with the approver's name.

## 14. Common Failure Scenarios

| Scenario | Mitigation |
|---|---|
| Audit proceeds with unmet prerequisite | Hard stop at Section 5.2; blocking item logged under category `PREREQ` |
| Threshold variance misinterpreted | Section 5.4 is the single reconciliation table; audit checks cite it |
| Findings fixed but not verified | Gate C prohibits FIXED → CLOSED without VERIFIED evidence |
| Scope creep disguised as "audit fixes" | Section 10.2 — fixes scoped strictly to documented findings |
| Evidence lost or unnamed | Evidence naming convention in Section 6; archive per Section 12 |

## 15. Review Process

1. The Technical Lead reviews this master document quarterly and after any Phase 3 cycle that exposed a procedural gap.
2. Amendments require version increment and Release Manager approval; threshold changes require Security Officer or Technical Lead sign-off per domain.

## 16. Sign-off Requirements

Phase 3 commencement: Release Manager.
Phase 3 completion: Technical Lead and Security Officer (per QG3), plus the approvers listed in `08_PHASE_3_COMPLETION.md`.

## 17. References

- → `01_PRE_PRODUCTION_AUDIT.md`
- → `06_ACCESSIBILITY_AUDIT.md`
- → `07_PERFORMANCE_AUDIT.md`
- → `08_SECURITY_AUDIT.md`
- → `09_SEO_AUDIT.md`
- → `10_STUDIO_AUDIT.md`
- → `11_ECOMMERCE_AUDIT.md`
- → `14_PLAYWRIGHT_E2E.md`
- → `15_BUG_TRACKER.md`
- → `16_PRODUCTION_READINESS.md`
- → `19_RELEASE_HISTORY.md`
- → `phase-3/01_ACCESSIBILITY_AUDIT.md`
- → `phase-3/02_PERFORMANCE_AUDIT.md`
- → `phase-3/03_SECURITY_AUDIT.md`
- → `phase-3/04_SEO_AUDIT.md`
- → `phase-3/05_STUDIO_AUDIT.md`
- → `phase-3/06_ECOMMERCE_AUDIT.md`
- → `phase-3/07_PHASE_3_BUG_TRACKER.md`
- → `phase-3/08_PHASE_3_COMPLETION.md`

---
*End of Document*

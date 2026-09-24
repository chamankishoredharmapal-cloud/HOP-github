---
title: "Phase 3 — Studio Audit"
document_id: "HOP-P3-05"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "QA Engineer"
reviewer: "Studio Administrator"
source_sop: "10_STUDIO_AUDIT.md"
---

# Phase 3 — Studio Audit

## 1. Purpose

This procedure validates every Studio (admin CMS) workflow for technical correctness, data persistence, permission enforcement, and error handling. It is the executable, evidence-driven Phase 3 implementation of `10_STUDIO_AUDIT.md`.

**WHAT is being tested:** authentication, product creation/editing/deletion, product images and image replacement, collections, product–collection relationships, content management, validation, error handling, save/publish behavior, data persistence, permissions, admin-only functionality.
**WHY:** Studio-managed data feeds the storefront, orders, and SEO. A Studio defect is a storefront defect (master plan Phase 3 scope; `10` Completion requires zero P1/P2 issues in the Studio bug tracker).
**WHEN:** Fifth audit of Phase 3, between SEO and E-commerce (dependency: E-commerce relies on Studio-managed product/inventory data; see `00_PHASE_3_MASTER_EXECUTION.md` Section 5.3).
**Scope note:** The Master Execution Plan assigns the Studio audit to Phase 2 for brand/content sign-off. This Phase 3 Studio Audit is the **technical validation pass** of the same workflows; it does not replace the Phase 2 sign-off.

## 2. Scope

The Studio application at `/studio/*` (`src/studio/`): Login, Reset Password, Dashboard, Products, Product Workspace (new + edit), Collections, Collection Workspace, Inventory, Media, Customers, Orders, Order Detail, Journal, Settings. Backend: Supabase tables/RLS for products, images, collections, inventory, media, orders, customers; Edge Functions consumed by Studio.

## 3. Definitions

Preserved from `10`: Studio, Content Model, Draft State, Published State, Asset Pipeline. **Additional:** Workspace (the create/edit screen for a product or collection).

## 4. Roles & Responsibilities

Per `10`: Studio Administrator (roles/permissions), Editorial Lead (workflow sign-off), Content Editor (authoring), Frontend Engineer (scripts/schema), QA Engineer (executes this audit).

## 5. Prerequisites

- Studio staging environment accessible; Studio admin + restricted-role test accounts exist.
- Supabase staging project access.
- Test assets (images in valid/invalid formats) ready.
- Completed Security audit (RLS verified on content tables per `10` Gate 4).
- `node scripts/compile-content.js` runs without errors (validated in Phase 1 pre-checks; re-verify if content schema changed).

## 6. Inputs / Outputs

**Inputs:** Studio URL, content model schema (types), roles/permissions matrix, test assets.
**Outputs:** Studio audit report, bug tracker entries, screen recordings, sign-off.

---

## 7. Critical Workflow Procedures

Each workflow is recorded as **Action → Expected Result → Evidence → Pass/Fail**. All mutations run against staging test data (test products must be deleted or marked test-only after verification).

### 7.1 Studio Authentication

**Action 1:** Navigate to `/studio` while logged out.
**Expected:** Redirect to `/studio/login` (AuthGuard behavior in `src/studio/components/AuthGuard.tsx`).
**Evidence:** screen recording; URL after redirect.
**Pass/Fail:** ____________

**Action 2:** Attempt login with invalid credentials (wrong password).
**Expected:** Error message shown; no session created; no sensitive error detail leaked.
**Evidence:** screenshot of error state.
**Pass/Fail:** ____________

**Action 3:** Login with valid Studio admin credentials.
**Expected:** Access to Studio dashboard granted.
**Evidence:** screenshot of dashboard.
**Pass/Fail:** ____________

**Action 4:** Login as a **customer** (non-admin) account and navigate to `/studio`.
**Expected:** "Studio access required" message; no Studio content rendered (isAdmin gate).
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 5:** Reset password flow (`/studio/reset-password`, ForgotPasswordDialog).
**Expected:** Request accepts valid email; reset email dispatched (staging email capture); new password works.
**Evidence:** screenshot + email log.
**Pass/Fail:** ____________

### 7.2 Product Creation

**Action 1:** `/studio/products` → "New Product". Fill all required fields (identity, pricing, technical details, editorial story, SEO section).
**Expected:** Form saves; product appears in the product list; no validation errors on valid input.
**Evidence:** screenshot of list including new product; network request logged.
**Pass/Fail:** ____________

**Action 2:** Attempt to save with required fields empty (e.g., missing price/SKU).
**Expected:** Validation blocks save; specific field errors shown (editorial checklist/progress indicator reflects incompleteness per `useProductForm`).
**Evidence:** screenshot of validation errors.
**Pass/Fail:** ____________

**Action 3:** Save as **draft**.
**Expected:** Product status = draft; **not** visible on storefront PDP.
**Evidence:** Studio list screenshot + storefront PDP 404/absence check.
**Pass/Fail:** ____________

### 7.3 Product Editing

**Action 1:** Open an existing product workspace; edit name, price, description; click Save.
**Expected:** Updated values persist; `isDirty` reset; toast "saved" (or error toast on failure).
**Evidence:** before/after screenshots; Supabase row check.
**Pass/Fail:** ____________

**Action 2:** Edit while a concurrent change exists (simulate by two browser sessions).
**Expected:** Last-write-wins with no silent data corruption (record observed behavior; if lost-update occurs, file as finding).
**Evidence:** screen recording of both sessions.
**Pass/Fail:** ____________

### 7.4 Product Deletion

**Action 1:** Delete a test product from the product list (or workspace).
**Expected:** Confirmation dialog appears; on confirm, product removed from list and storefront; related images removed from storage.
**Evidence:** screenshots + Supabase row absence check.
**Pass/Fail:** ____________

**Action 2:** Cancel the confirmation dialog.
**Expected:** No deletion occurs.
**Evidence:** screenshot.
**Pass/Fail:** ____________

### 7.5 Product Images & Image Replacement

**Action 1:** Upload a valid JPEG/PNG/WebP to a test product.
**Expected:** Image uploads; becomes primary if no primary exists (`is_primary` logic in `ProductWorkspace.tsx`); appears in gallery.
**Evidence:** screenshot + Supabase image row.
**Pass/Fail:** ____________

**Action 2:** Set a different image as primary (Set Primary Image).
**Expected:** Primary badge moves; storefront PDP hero updates.
**Evidence:** before/after storefront screenshots.
**Pass/Fail:** ____________

**Action 3:** Reorder images (Reorder Images).
**Expected:** New order persists and reflects on storefront.
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 4:** Delete an image.
**Expected:** Image removed from gallery and storage; if it was primary, hero state clears (`heroImageExists` logic).
**Evidence:** screenshots + storage check.
**Pass/Fail:** ____________

**Action 5:** Upload an invalid file type (e.g., `.exe`) and an oversized file.
**Expected:** Rejection with clear error; no partial state.
**Evidence:** screenshots of errors.
**Pass/Fail:** ____________

### 7.6 Publish / Save Behavior

**Action 1:** Publish a draft product (Publish action).
**Expected:** Status transitions to `published`; product visible on storefront PDP with correct URL `/product/<id>`.
**Evidence:** screenshots (Studio + storefront).
**Pass/Fail:** ____________

**Action 2:** Unpublish (status change to draft).
**Expected:** Product removed from storefront immediately.
**Evidence:** storefront check.
**Pass/Fail:** ____________

**Action 3:** Preview from workspace before publish.
**Expected:** "Save draft before preview" prompt if unsaved; else opens `/product/<id>` in new tab reflecting saved state.
**Evidence:** screen recording.
**Pass/Fail:** ____________

**Action 4:** Verify content compilation (`node scripts/compile-content.js`) succeeds with the new/edited content.
**Expected:** Exit 0; generated content reflects changes (journal/products/collections).
**Evidence:** terminal output.
**Pass/Fail:** ____________

### 7.7 Collections & Product–Collection Relationships

**Action 1:** Create a new collection (Collection Workspace) with title, narrative, cover, linked products.
**Expected:** Collection created; appears on storefront Collections page.
**Evidence:** screenshots (Studio + storefront).
**Pass/Fail:** ____________

**Action 2:** Edit a collection: change cover image (upload collection file), update linked products.
**Expected:** Changes persist; storefront collection reflects updated products/cover.
**Evidence:** before/after screenshots.
**Pass/Fail:** ____________

**Action 3:** Link an existing product to a collection and verify the product appears under that collection on the storefront.
**Expected:** Relationship visible on both storefront collection page and product's collection attribution.
**Evidence:** screenshots.
**Pass/Fail:** ____________

### 7.8 Inventory

**Action 1:** Adjust stock on a product (useAdjustStock).
**Expected:** Stock value updates; inventory history entry recorded (`useInventoryHistory`).
**Evidence:** screenshots + Supabase inventory_history rows.
**Pass/Fail:** ____________

**Action 2:** Set stock to 0.
**Expected:** Storefront PDP shows Out of Stock; Add to Cart disabled (cross-check with E-commerce audit).
**Evidence:** storefront screenshot.
**Pass/Fail:** ____________

### 7.9 Media Library

**Action 1:** Upload media via `/studio/media` (useUploadMedia).
**Expected:** Asset appears in library with metadata.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 2:** Update media metadata (alt text, caption, copyright).
**Expected:** Metadata persists.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 3:** Delete media.
**Expected:** Asset removed from library and storage.
**Evidence:** screenshot.
**Pass/Fail:** ____________

### 7.10 Orders (Studio)

**Action 1:** View orders list with status filter tabs (useOrdersList).
**Expected:** Orders render with customer info; filters work.
**Evidence:** screenshots.
**Pass/Fail:** ____________

**Action 2:** Update an order's status (useUpdateOrderStatus) — move a test order from `confirmed` → `processing`.
**Expected:** Status persists; confirmation dialog used; storefront order history reflects change (cross-check with E-commerce audit).
**Evidence:** screenshots (Studio + storefront).
**Pass/Fail:** ____________

**Action 3:** Update shipping details (useUpdateShipping).
**Expected:** Shipping fields persist.
**Evidence:** screenshot + Supabase check.
**Pass/Fail:** ____________

**Action 4:** Order search (useOrdersSearch).
**Expected:** Results match query.
**Evidence:** screenshot.
**Pass/Fail:** ____________

### 7.11 Customers

**Action 1:** View customers list with addresses (useCustomers).
**Expected:** Data renders correctly.
**Evidence:** screenshot.
**Pass/Fail:** ____________

**Action 2:** Update a customer record; delete a test customer.
**Expected:** Update persists; delete requires confirmation and removes record.
**Evidence:** screenshots.
**Pass/Fail:** ____________

### 7.12 Journal (Studio)

**Action 1:** Create/edit a journal entry via the Studio Journal page.
**Expected:** Save persists; compile-content generates the entry; storefront Journal page shows it.
**Evidence:** screenshots + terminal output.
**Pass/Fail:** ____________

### 7.13 Settings

**Action 1:** Open Settings, modify a setting, save (useSettings/useSaveSettings).
**Expected:** Values persist and reload.
**Evidence:** screenshots.
**Pass/Fail:** ____________

### 7.14 Permissions & Admin-Only Functionality

**Action 1:** Review the roles matrix (Admin, Editor, Reviewer, Viewer per `10` Step 13) against the implementation (`src/studio/types/permissions.ts`, `usePermissions`, `PermissionGuard`).
**Expected:** Permission model documented and enforced in components.
**Evidence:** code review notes.
**Pass/Fail:** ____________

**Action 2:** Using a restricted-role test account, attempt actions outside its permissions (e.g., editor deleting a collection, viewer editing a product).
**Expected:** Action blocked by PermissionGuard/backend; attempt logged (audit trail per `10` Step 18 if present).
**Evidence:** screenshots of blocked UI.
**Pass/Fail:** ____________

**Action 3:** Attempt direct API access with a non-admin JWT to Studio-write endpoints.
**Expected:** 403/RLS denial (cross-check Security audit results).
**Evidence:** API response screenshot.
**Pass/Fail:** ____________

### 7.15 Error Handling & Data Persistence

**Action 1:** Simulate API failure (offline network / stub) while saving a product.
**Expected:** Error toast ("Failed to save"); no data loss of the form contents; retry succeeds.
**Evidence:** screen recording.
**Pass/Fail:** ____________

**Action 2:** Refresh the browser mid-edit on a saved draft.
**Expected:** Draft state loads from Supabase (no loss of previously saved fields).
**Evidence:** screenshot after reload.
**Pass/Fail:** ____________

**Action 3:** Audit trail: verify Studio actions create/update/delete/publish are recorded (per `10` Step 18).
**Expected:** Activity log with timestamp, user ID, change diff — if no audit log exists, record as **PROPOSED ADDITION** with the observed gap.
**Evidence:** log query/screenshot.
**Pass/Fail:** ____________

---

## 8. Validation Steps

1. Execute all workflows above against the staging Studio.
2. Run the Studio schema check: fetch one record of each content type (product, collection, journal) and validate against the TypeScript/JSON schema definitions (`10` Validation Step 1).
3. Role tests via API tokens (403 on restricted endpoints) — cross-reference Security audit evidence.
4. Confirm `scripts/compile-content.js` behavior and error handling when Supabase is unreachable (`10` Step 10.4).

## 9. Evidence Required

- Screen recordings of authoring + publishing workflow (`10` Evidence).
- Screenshots per workflow table above.
- Supabase row snapshots for persistence checks.
- Terminal logs of `compile-content.js`.
- Exported JSON payload demonstrating schema compliance.

## 10. Pass / Fail Criteria (preserved from `10`)

- **Pass:** All content models validate; editors manage/schedule/publish content without errors; media processed correctly; permissions strictly enforced; all workflow tables above marked Pass.
- **Fail:** Data loss during editing; schema mismatch between Studio and frontend; unauthorized users can publish/delete; media uploads fail or degrade unacceptably.

## 11. Acceptance Criteria (preserved from `10`)

1. Zero critical/high bugs in content creation workflow.
2. Content rollout propagates to frontend within 60 seconds.
3. Successful rollback demonstration — **note:** `10` requires versioning/rollback; if no version-history feature exists in the current Studio implementation, record this as a documented gap (see Section 12) rather than assuming it exists.

## 12. Documented Gaps (state at manual creation — verify at execution)

| `10_STUDIO_AUDIT.md` capability | Current implementation evidence | Phase 3 handling |
|---|---|---|
| Version history / rollback (`10` Step 5) | No version-history UI identified in Studio pages | **Record as gap.** If confirmed absent at execution: document in completion report as PROPOSED ADDITION (future phase), not a Phase 3 fix. |
| Content scheduling (`10` Step 8) | No scheduling UI identified | **Record as gap.** Verify at execution; if absent, propose for future phase. |
| Localization fields (`10` Step 9) | No locale fields identified | **Record as gap.** Verify at execution. |
| Content backup dry-run (`10` Step 12) | Supabase PITR/backups verified in Security audit | Verify PITR enabled; manual backup test deferred to `16`/`18`. |
| Audit trail / change logging (`10` Step 18) | Not confirmed | Verify; if absent, **PROPOSED ADDITION**. |
| Editorial approval workflow (`10` Step 11) | Editor → Editorial Lead approval chain not confirmed | Verify at execution; if absent, record as gap for future phase. |

## 13. After FAIL / Remediation & Re-test

1. **Document** findings in `07_PHASE_3_BUG_TRACKER.md` (category `STUDIO`; severity per `15`; data loss and unauthorized publish = P0/P1).
2. **Fix** strictly per finding.
3. **Verify** by re-running the exact workflow; **re-test** dependent storefront behavior (PDP, collections, inventory display).
4. **Close** only with evidence attached.

## 14. Common Failure Scenarios (preserved from `10`)

Rich-text mangling from pasted content; webhook/cache-invalidation failures causing stale frontend data; asset timeouts on large uploads; race conditions on simultaneous edits.

## 15. Troubleshooting (preserved from `10`)

Content not on frontend → check status (draft vs published), run `compile-content.js`, clear data cache. Upload failure → check size limits and MIME-type checks. Schema validation failure → sync frontend types with CMS schema.

## 16. Best Practices (preserved from `10`)

Frequent draft saves; clean-paste training; mandatory alt text on upload; scheduled backups every 12 hours (Supabase PITR baseline).

## 17. Standards (preserved from `10`)

JSON schema standards; ISO 8601 timestamps; BCP 47 locale tags; WCAG 2.1 AA for the Studio interface itself (cross-check `01`).

## 18. Sign-off Requirements

QA Engineer · Editorial Lead (workflow usability) · Studio Administrator (roles/security) per `10`.

## 19. Completion Criteria

All workflow tables completed; no P1/P2 issues open in the Studio bug tracker; schema locked and documented; results fed into `08_PHASE_3_COMPLETION.md`.

## 20. References

- → `10_STUDIO_AUDIT.md` (authoritative source)
- → `08_SECURITY_AUDIT.md` (RLS/permissions cross-check)
- → `03_SECURITY_AUDIT.md` (Phase 3)
- → `06_ECOMMERCE_AUDIT.md` (storefront data dependency)
- → `07_PHASE_3_BUG_TRACKER.md`
- → `08_PHASE_3_COMPLETION.md`

---
*End of Document*

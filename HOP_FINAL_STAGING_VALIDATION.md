# HOP Final Staging Validation

**Date:** 2026-11-01  
**Branch:** `release/v1.1-launch-candidate`  
**Commit:** `199fda79cbefcd3b40d03e2ef09b39369063205c`  
**Validation target:** Supabase staging `dovnhgbisiturzbjgvei` via local `http://localhost:8080`  
**Final verdict:** **CONDITIONAL PASS — staging validation successful; deployment is NOT authorized by this report.**

---

## 1. Executive Summary

All five requested repair areas were validated end-to-end against staging:

| Area | Result |
|---|---|
| A. Hero content contract, draft/publish lifecycle, storefront refresh, cross-tab sync | **PASS** |
| B. About story configured image path and load-failure fallback | **PASS** (content replacement recommended) |
| C. Draft product preview for admins and RLS denial for anonymous/non-admin users | **PASS** |
| D. Publish success reported only after server confirmation; failure handling | **PASS** |
| E. Staging environment isolation and production-target guard | **PASS** |
| Regression: unit tests, typecheck, lint, production build, staging Studio smoke | **PASS** |

One additional defect was discovered during E2E validation and fixed: the publish confirmation dialog auto-closed on RPC failure because Radix `AlertDialogAction` closes by default. The action now prevents the default close and only closes after `publishRes.success === true`. The failure path was retested successfully.

No production writes, payments, orders, commits, pushes, merges, or deployments were performed.

---

## 2. Environment and Safety

- Dev server ran in staging mode only (`npm run dev:staging`, `--mode staging`), PID 13460, port 8080.
- `node scripts/verify-staging-environment.mjs` exited `0` with `ALL CHECKS PASSED`; no production identifiers were detected.
- Staging URL: `https://dovnhgbisiturzbjgvei.supabase.co`.
- Production project reference (`kbvjmcnaaogkbnerjcoc`) was never written to.
- `.env.local` and `.env` target production; they were not used to start the validation server. Staging credentials were loaded from `.env.staging.local`; secrets were never printed.
- The production build (`npm run build`) is read-only against its configured project; it performed only GET requests during prerendering.

### Recovery basis

No prior implementation report or prior `HOP_FINAL_STAGING_VALIDATION.md` was present. The work was recovered from the existing working tree and verified against the branch HEAD. The change set below is reconstructed from the diffs and runtime behavior; no assumptions were made about previous execution results.

---

## 3. Change Set Validated

12 tracked files modified and 3 untracked paths present, all preserved:

- `src/components/hop/CinematicHeroSlider.tsx` — hero editorial overlay, slide/section fallback copy, CTA rendering, ARIA labelling.
- `src/hooks/useSiteSections.ts` — cross-tab sync hook, shorter stale time, refetch on focus.
- `src/studio/hooks/useStudioSiteSections.ts` — broadcast publication on successful publish.
- `src/studio/pages/SiteUpdate.tsx` — correct expected version after save, success-gated dialog close, failure-path dialog retention.
- `src/lib/broadcastSync.ts` (untracked) — BroadcastChannel + localStorage publication sync.
- `src/lib/__tests__/studioSynchronization.test.ts` (untracked) — synchronization/hero/product/environment unit coverage.
- `src/pages/ProductDetail.tsx` — `studio_preview=true` handling and draft banner.
- `src/services/productService.ts` — draft preview query path and `isPreview` mapping.
- `src/studio/pages/ProductWorkspace.tsx` — preview URL includes `studio_preview=true`.
- `src/components/about/ImageTextBlock.tsx` — image error fallback to bundled hero still.
- `src/pages/about/OurStory.tsx` — configured image used directly; no forced asset path.
- `src/studio/utils/environment.ts` — local host distinguishes staging vs production DB.
- `vite.config.ts` — staging-mode startup guard against production project identifiers.
- `package.json` — `dev:staging` script.
- `tools/media-pipeline/videos/` (untracked) — preserved, not part of this validation.

---

## 4. Workflow A — Hero Content, Publish Lifecycle, Cross-Tab Sync

**Result: PASS**

### Baseline and fixture

- Published baseline before testing: `home.hero` revision 1, title `Saree. Time. You.`, no slides (storefront defaults render).
- Pre-existing revision 4 contained leftover previous-agent test content (`Woven For Permanence`) on `slide-kalyani`. This was treated as contaminated test data, not the baseline.
- Test draft was saved as DB version 5 with title suffix `[STAGING-VALIDATION-20261101145618]`.

### Evidence

| Check | Result |
|---|---|
| Admin login via `/studio/login` | PASS |
| Studio loaded current draft and section metadata | PASS |
| Published storefront initially matched published revision | PASS |
| Edit slide title + Save Draft | PASS — DB version 5 |
| Reload Studio; draft persisted | PASS |
| Storefront did not show unsaved draft before publish | PASS — storefront remained on published title |
| Publish RPC `publish_site_section` | PASS — HTTP 200, `success: true`, revision 5, `published_at 2026-11-01T14:57:32.850499+00:00` |
| Success toast only after server response | PASS — response at `14:57:32.884Z`, toast at `14:57:32.917Z` |
| Storefront updated in a second tab without reload | PASS — updated 107 ms after RPC; URL unchanged |
| Post-fix success recheck | PASS — HTTP 200, revision 6, dialog closed, success toast visible |

### Failure path (after validation-discovered fix)

Simulated transport failure by aborting `POST /rpc/publish_site_section`.

Pre-fix behavior: failure toast appeared and no success toast appeared, but the confirmation dialog closed due to Radix `AlertDialogAction` default behavior.

Fix applied in `src/studio/pages/SiteUpdate.tsx`:

```tsx
onClick={(event) => {
  event.preventDefault();
  void handlePublishConfirm();
}}
```

Post-fix evidence:

| Check | Result |
|---|---|
| Error toast visible | PASS |
| Confirmation dialog remains open | PASS |
| Confirm button remains enabled for retry | PASS |
| No false success toast | PASS |
| Success path still closes dialog and reports success | PASS |

### Restore

- Restored `home.hero` revision 1 through `restore_site_section_revision` with optimistic version check.
- Restore result: `success: true`, `new_version: 6`, `new_revision_number: 7`.
- Current published payload is byte-for-byte equal to revision 1 payload.
- Storefront after restore: `Saree. Time. You.` and no slides.

**Note:** revision history entries 5–7 are immutable audit records created by validation and cleanup. They were intentionally not deleted.

---

## 5. Workflow B — About Story Image and Fallback

**Result: PASS**

### Staging payload

- `about.story` version 1, unchanged, no unpublished changes.
- `image_url = /content/weaver-portrait/gangamma-molakalmuru/hero.jpg`
- `image_alt = House of Padmavati - The House`

### Evidence

| Check | Result |
|---|---|
| Configured valid image is requested and used | PASS — test intercept fulfilled the exact configured path; image `src` stayed configured; natural size `1920x1080` |
| Configured URL failure triggers bundled fallback | PASS — aborted request; `src` changed to `/src/assets/hop-hero.jpg`; natural size `1920x1080`; no page errors |
| Staging payload points to configured public path | PASS |
| Real public file behavior | The actual `public/content/weaver-portrait/gangamma-molakalmuru/hero.jpg` is a **326-byte placeholder**; Chromium requests it (HTTP 200) then fails to decode it and correctly falls back to the bundled hero image. |

The code fix is correct. The placeholder content is a launch-content issue, not a code regression.

---

## 6. Workflow C — Draft Product Preview and RLS

**Result: PASS**

A temporary draft product fixture was created directly in staging with a unique ID, one image, and `status = draft`. A temporary non-admin user (`app_metadata.role = customer`) was also created for authenticated denial tests.

### Evidence

| Check | Result |
|---|---|
| Admin default URL without preview (`/product/<id>`) | PASS — “Product not found.”, no banner |
| Admin direct preview (`?studio_preview=true`) | PASS — amber `DRAFT PREVIEW` banner, product name visible |
| Studio Product Workspace “Preview” button | PASS — popup opened `/product/<id>?studio_preview=true` with banner |
| Anonymous direct preview URL | PASS — “Product not found.”, no banner |
| Anonymous REST query for draft product | PASS — HTTP 200, `[]` rows |
| Non-admin authenticated REST query | PASS — HTTP 200, `[]` rows, role `customer` |
| Non-admin logged-in browser preview | PASS — “Product not found.”, no banner |
| Published product still public (control) | PASS — `Staging Validation Saree` visible, no preview banner |

### Cleanup

| Item | Result |
|---|---|
| Draft product image delete | HTTP 204 |
| Draft product delete | HTTP 204 |
| Temporary non-admin user delete | HTTP 200 |
| Product rows remaining | 0 |
| Deleted user lookup | HTTP 404 |

Final product state: **2 published, 0 drafts, no validation fixture present**.

---

## 7. Workflow D — Publish UI Success/Failure Semantics

**Result: PASS**

Covered by Workflow A evidence:

- Publish success is reported only after the server RPC returns HTTP 200 and `success: true`.
- The success toast timestamp is later than the RPC response timestamp.
- A transport failure produces an error toast and no success toast.
- After the fix, a transport failure keeps the confirmation dialog open with the confirm action enabled for retry.
- Storefront tabs update only after a successful publication broadcast.

---

## 8. Workflow E — Staging Environment Isolation

**Result: PASS**

- `npm run dev:staging` maps to `vite --mode staging`.
- `vite.config.ts` rejects staging-mode startup if `VITE_SUPABASE_URL` or `VITE_SUPABASE_PROJECT_ID` contains the production project ref `kbvjmcnaaogkbnerjcoc`.
- Local Studio environment badge distinguishes `LOCAL (STAGING DB)` from `LOCAL (PROD DB)`.
- `scripts/verify-staging-environment.mjs`: exit `0`, all checks passed, no production identifiers detected.
- Browser requests during validation were observed against `dovnhgbisiturzbjgvei.supabase.co` only.

---

## 9. Regression Results

| Check | Command | Result |
|---|---|---|
| Unit tests | `npm test` | **114 passed / 114**, 12 files |
| TypeScript | `npx tsc --noEmit -p tsconfig.json` | **PASS** (no output) |
| Lint | `npm run lint` | **PASS** (no findings) |
| Production build + prerender | `npm run build` | **PASS** — 1,975 modules; 27 routes prerendered |
| Staging Studio/storefront smoke | `npx playwright test Studio.spec.ts --project=chromium` | **9 passed / 9** |

### Build observation

The build’s prerender step reads `.env` (production project) and reported `Found 0 published products`, `5 collections`, and `6 published journal articles`. The build still completed successfully. This means the build validated the application bundle and prerender pipeline, but did not exercise staging product routes during prerender.

### Playwright scope note

The full `src/__tests__` Playwright suite was intentionally not run. `StudioRemediation.spec.ts` resolves Supabase credentials from `.env` (production) rather than the staging environment; running it could target production. Only the safe, read-only `Studio.spec.ts` suite was executed against the already-running staging server.

---

## 10. Final Staging State

| Item | Value |
|---|---|
| `home.hero` version | 6 |
| `home.hero` status | published |
| `home.hero` unpublished changes | false |
| `home.hero` payload equals revision 1 | true |
| `home.hero` title | `Saree. Time. You.` |
| `home.hero` slides | null (default rendering) |
| `about.story` version | 1 |
| `about.story` status | published |
| `about.story` image path | `/content/weaver-portrait/gangamma-molakalmuru/hero.jpg` |
| Products | 2 published, 0 drafts |
| Temporary product fixture | absent |
| Temporary non-admin users | absent |
| Test revisions 5–7 | retained as audit history |

---

## 11. Conditions Before Launch

1. **Replace the About placeholder image.** The configured 326-byte file is not decodable; the UI always falls back to the bundled hero. The fallback is correct, but the intended editorial image is not actually visible.
2. **Review staging audit revisions 5–7.** Content is restored; these revisions document the validation publish/failure/restore sequence.
3. **Run the full Playwright E2E suite against staging only.** The suite’s `.env`-based credential resolution must be fixed first to prevent accidental production targeting.
4. **Complete cross-browser testing.** This validation used Chromium only; Firefox, WebKit, and mobile projects were not run.
5. **No deployment authorization.** This report validates staging behavior; it does not approve a production release, DNS change, or payment/order go-live.

---

## 12. Limitations / Not Tested

- Payments, refunds, order creation, webhook delivery, and email notifications were not exercised.
- Production deployment and production data behavior were not tested or modified.
- Full multi-browser matrix and mobile device rendering were not tested.
- The full pre-existing E2E suite was not run due to its production-targeting `.env` configuration.
- One early harness assertion read the storefront fallback title before asynchronous slide data settled; the settled storefront matched the published revision. This was a test-timing observation, not an application failure.
- The Hero failure-path retest initially counted a prior success toast still in the DOM; the retest waited for toast expiry and correctly verified the failure behavior.

---

## 13. Authorization

**Validation status:** CONDITIONAL PASS  
**Production deployment:** NOT AUTHORIZED BY THIS REPORT.

Any deployment requires explicit human approval after the conditions above are addressed.

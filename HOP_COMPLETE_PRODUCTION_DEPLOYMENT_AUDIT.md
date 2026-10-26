# HOP Complete Production Deployment Audit

**Audit timestamp:** 2026-10-26 (Asia/Kolkata)  
**Mode:** Read-only verification. No deployments, migrations, secret changes, DNS changes, commits, or transactions were performed.  
**Targets:** Cloudflare Pages project `hop-production`; Supabase project `kbvjmcnaaogkbnerjcoc`.  
**Release-candidate reference:** `cf9aaf7529807e6f111f1b03fae903975d42f8da` (`release/v1.1-launch-candidate`).

## Verdict

**PARTIALLY DEPLOYED**

Production is live and returns HTTP 200, but it serves the 2026-10-02 frontend build, not the current release candidate. The Git-driven production deployment pipeline has no successful builds, two required database migrations are absent, one Edge Function is missing, two Edge Functions are stale, transactional email is not operational, and the nominal custom domain does not resolve.

### Deployment matrix

| Area | Production state | Release-candidate state | Result |
|---|---|---|---|
| Frontend | `5e7b529` (2026-10-02) | `cf9aaf7` (2026-10-24) | **32 commits behind** |
| 18 optimized video/poster assets | All return SPA HTML | Present in repository | **Not deployed** |
| Edge Functions | 8 match, 2 stale, 1 missing, 1 extra | 11 repository functions | **Incomplete/drifted** |
| Migrations | 42 applied, 2 required missing | 44 local files | **DB not reproducible from HEAD** |
| Cloudflare Git deployment | 32/32 production Git builds failed | Successful preview build only | **No working production Git path** |
| Custom domain | No DNS, no Pages custom domain | Canonical domain referenced | **Not configured** |
| Transactional email | `RESEND_API_KEY` absent; stale callers | Resend integration present | **Will not send** |

## 1. Source of Truth and Deployed Commit

### 1.1 No formally approved commit is recorded

- No Git tag points at `HEAD`, `main`, or deployed commit `5e7b529`.
- Existing tags are historical: `v1.0.0` points at `dab9aab` from July 2026; `rollback/v0.1.0` is the newest tag by creation date.
- No signed approval artifact was found identifying a commit for this deployment.
- This audit uses release branch HEAD `cf9aaf7` as the **release-candidate reference**, not as proof of approval.

If a different commit is the intended approval target, the delta in this report should be recalculated against that SHA.

### 1.2 Repository state

| Item | Value |
|---|---|
| Working tree | `E:\HOP` |
| HEAD | `cf9aaf7529807e6f111f1b03fae903975d42f8da` |
| HEAD branch | `release/v1.1-launch-candidate` |
| HEAD timestamp | 2026-10-24 23:41:15 +0530 |
| `main` / `origin/main` | `76ae7ac6528f51fd4221c8a6d3274d3d0041099a` |
| `main` timestamp | 2026-10-15 01:11:02 +0530 |
| Commits `5e7b529..HEAD` | 32 |
| Commits `main..HEAD` | 6 |
| Commits `5e7b529..main` | 26 |
| Tracked diff `5e7b529..HEAD` | 285 files, +31,559 / -3,167 |
| Tracked diff `main..HEAD` | 127 files, +7,157 / -940 |
| Tracked migration files at HEAD | 41 |
| Migration files in working tree | 44 |

An older production deployment report names `da6158f` (2026-08-17). That is historical and is not the current live deployment. It should not be used to conclude that the current release candidate is deployed.

## 2. Production Frontend

### 2.1 Live identity

| Item | Observed value |
|---|---|
| Cloudflare project | `hop-production` |
| Project created | 2026-09-27T18:29:06Z |
| Production branch | `main` |
| Pages hostname | `https://hop-production.pages.dev` |
| Custom domains | None attached |
| Canonical deployment | `c209b389-7502-46f4-b654-2eb96457b121` |
| Deployment trigger | `ad_hoc` (manual upload, not Git build) |
| Recorded commit | `5e7b529eebe44a7289a7e901240297d012158569` |
| Recorded commit timestamp | 2026-10-02 04:15:04 +0530 |
| Deployment created | 2026-10-02T00:17:20Z (05:47 IST) |
| Deployment age at audit | 24 days |
| Live HTTP status | 200 |
| Live HTML size | 47,086 bytes |
| Live ETag | `519c29962aa95d36f31aa4f688852809` |
| Live `<title>` | `House of Padmavati` |
| Live theme color | `#2B0E17` |
| Live JS entry | `/assets/index-D3Arhgms.js` |
| Live CSS entry | `/assets/index-GbN5LeYg.css` |
| Live canonical link | `https://houseofpadmavati.com/` |

The live document is byte-identical to the canonical deployment alias `https://c209b389.hop-production.pages.dev/` (same ETag and equal content).

### 2.2 Why `5e7b529` is credible, and its limit

- Cloudflare records commit `5e7b529`.
- The live `theme-color` is `#2B0E17`, matching `index.html` at `5e7b529`. HEAD uses `#F8F5F2`.
- Physical provenance cannot be cryptographically established because the deployment was `ad_hoc`, not built from Git. The live state is therefore verified against the deployment record and matching build evidence, not against a signed CI artifact.

### 2.3 Frontend delta

The live frontend predates the release candidate by 32 commits. Missing user-facing work includes:

- Phase 2 content/settings remediation.
- All five Phase 3 stages: secure content infrastructure, media catalog, dynamic homepage content, remaining pages/policies, and editorial management.
- Mobile-first P0-P3 remediation.
- Performance remediation.
- Simplified customer authentication and checkout.
- Security hardening in content, admin, and inventory paths.
- Mauve/off-white/blush storefront and Studio design system.
- Cinematic multi-video hero and the local media pipeline.
- Homepage video placeholder management and site-section baseline.
- Production launch checklist, operations runbook, and inventory fix.
- CI repair for worktree gitlinks and prerender fallback.
- Staging environment synchronization.

The tracked delta is 285 files, `+31,559/-3,167`.

### 2.4 New media is not deployed

- 18 optimized media files are added between `5e7b529` and HEAD: six story videos, each in 540p and 720p (12 files), plus six posters for ARYA, HERO, KALYANI, PADMA, SPANDANA, and VIARA.
- None are served by `hop-production`.
- All 18 asset URLs return HTTP 200 with `Content-Type: text/html; charset=utf-8` because the SPA fallback serves `index.html`; none returns `video/*` or `image/*`.
- This is why a bare 200 response is not valid deployment evidence.
- The live homepage still uses remote `HOP-films/HERO.mp4`; the live JS has no reference to `/optimized/videos`.
- The current production JS has one reference to `unsubscribe-newsletter`, whose production function is absent (see section 4).

### 2.5 Production host and custom domain

- `hop-production.pages.dev` resolves through Cloudflare Pages.
- `hop-production` has no custom domain attached; its only domain is `hop-production.pages.dev`.
- `houseofpadmavati.com` has no Cloudflare zone, no NS/SOA records, and no A records for the apex or `www`; DNS returns NXDOMAIN/status 3.
- Nevertheless, the live HTML and HEAD source both use `https://houseofpadmavati.com` as the canonical URL.
- Cloudflare production env `VITE_APP_URL` is `https://houseofpadmavati.pages.dev`, a different project. `VITE_APP_URL` is used by customer and Studio auth redirect services, so the auth redirect base does not match `hop-production` or the advertised custom domain.
- Result: neither the claimed custom domain nor the audited Pages project is consistently configured as the canonical public host.

### 2.6 Alternate Pages project

| Item | Observed value |
|---|---|
| Project | `houseofpadmavati` |
| Created | 2026-10-02T02:19:00Z |
| Git connected | No |
| Latest deployment | `b9533266-838a-41fb-a74f-f4f12877ce63` |
| Trigger | `ad_hoc` |
| Recorded commit | `aefb2b1aebed51c88a9316dbbb71bcfeb31bab4f` |
| Commit dirty | `true` |
| Deployed | 2026-10-12T19:28:01Z |
| Live size / asset | 48,270 bytes / `/assets/index-UI-9GrjD.js` |
| Custom domains | None |
| Distance from HEAD | 9 commits behind, plus uncommitted state |

This project is newer than `hop-production`, but it is not the audited project, is not reproducible from a clean commit, and has no custom domain. It is not evidence that production is current.

## 3. Cloudflare Pages Build and Deployment Pipeline

### 3.1 Project configuration

| Setting | Value |
|---|---|
| Repository | `chamankishoredharmapal-cloud/HOP-github` |
| Production branch | `main` |
| Build command | `pnpm run build` |
| Output directory | `dist` |
| Root directory | empty |
| Production env vars | `VITE_APP_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL` |
| Preview env vars | none |
| `VITE_SUPABASE_URL` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` |
| `VITE_APP_URL` | `https://houseofpadmavati.pages.dev` |
| Publishable key | Present, current `sb_publishable_` format; validated against production REST API with HTTP 200 |

`package.json` defines `pnpm run build` as `vite build && node scripts/prerender.js`. The Pages build command therefore depends on the prerender script.

`wrangler.toml` is staging-only (`name = "hop-staging"` and staging Supabase values). There is no production Pages configuration in the repository, so the live production build settings are not reproducible from `wrangler.toml`.

### 3.2 Deployment history

The Cloudflare account shows 48 retained deployments for `hop-production`:

| Environment | Total | GitHub push | Manual `ad_hoc` | Success | Failure |
|---|---:|---:|---:|---:|---:|
| Production | 44 | 32 | 12 | 10 | 34 |
| Preview | 4 | 4 | 0 | 2 | 2 |
| **Total** | **48** | **36** | **12** | **12** | **36** |

Key findings:

- Every one of the 32 production `github:push` deployments failed at `clone_repo`.
- All 10 successful production deployments were manual `ad_hoc` uploads.
- Two additional `ad_hoc` production attempts failed at `clone_repo` on 2026-09-28.
- There is no successful Git-integrated production deployment in the retained history.
- The canonical deployment for `5e7b529` was manual: the GitHub push `8c11008b-2939-4886-8d75-e3ca5e0e8cd3` for the same commit failed at `clone_repo`, then manual deployment `c209b389` succeeded.
- The last successful production deployment is `c209b389` on 2026-10-02.
- 22 production deployment attempts occurred after `c209b389`; all 22 failed.
- The latest production attempt was `6ab8e492-1817-4107-a977-0fead6ce8050` for `76ae7ac` on 2026-10-14T19:41:26Z (2026-10-15 01:11 IST), and it failed.
- The latest four preview deployments came from the release branch: one clone failure (`a09abf6`), one build failure (`6d3c296`), and two successful deploys (`872ca65`, `cf9aaf7`).

### 3.3 Why production Git builds fail

The production branch `main` and the deployed commit `5e7b529` both contain four `160000` gitlink entries:

- `.claude/worktrees/agent-a0d09da0664c29027`
- `.claude/worktrees/agent-a58b4382a926ad0bc`
- `.claude/worktrees/agent-a5e6dfb0014d1c8cf`
- `.claude/worktrees/agent-a7ef0ab4ae11ecb30`

Neither commit contains a `.gitmodules` file. The entries all point to `dab9aab4e27f2a6ca437dccfb19eaab07267f089`.

The observed sequence strongly implicates these entries:

- Preview `a09abf6` (4 gitlinks) failed at `clone_repo`.
- `6d3c296` removed the four gitlinks from the release branch; its preview then passed `clone_repo` and failed later at build.
- `872ca65` fixed the build step and succeeded.
- `6d3c296` exists only on `release/v1.1-launch-candidate`; it is not on `main`.
- HEAD has zero gitlinks; `main` still has four gitlinks in commit `76ae7ac`.

Consequently, the production Git path cannot work until the fix is merged to `main` or the production branch is changed after approval. The successful live artifact arrived through manual upload and bypassed this failure.

### 3.4 Branch configuration is also wrong for this release

- Cloudflare production branch is `main` (`76ae7ac`, 2026-10-15).
- Release candidate is `release/v1.1-launch-candidate` (`cf9aaf7`, 2026-10-24).
- Even if cloning worked, production would build `main`, which is 6 commits behind `cf9aaf7`.
- The last 6 commits add the design system, cinematic hero/local media, homepage video management, gitlink fix, prerender fallback, and staging environment synchronization.

### 3.5 Latest successful preview is not a deployable production artifact

The `cf9aaf7` preview deployment `d50e238a-d454-4f7f-9dcb-b9347bc7f552` returned HTTP 200 but is only 2,579 bytes with 18 characters of body text. It is an SPA shell, not the prerendered site:

- `index-DcpRIBAI.js`, theme `#F8F5F2`
- No route-specific prerendered HTML
- Preview environment has no env vars

`scripts/prerender.js` now skips prerendering when Playwright Chromium is unavailable. That keeps builds green but removes the prerender output that the current 47,086-byte production page contains. Promoting this preview directly would be a production regression, not a complete deployment.

## 4. Supabase Edge Functions

### 4.1 Inventory

Production has 11 active functions. The repository has 11 functions. They are not the same set.

| Function | Production | Updated (UTC) | Production vs HEAD | `verify_jwt` |
|---|---:|---|---|---|
| `create-razorpay-order` | v22 | 2026-09-26 09:21:21 | Identical | false |
| `verify-payment` | v23 | 2026-09-26 09:23:22 | **Stale; 226 vs 316 lines** | false |
| `razorpay-webhook` | v21 | 2026-09-26 09:22:38 | **Stale; 248 vs 339 lines** | false |
| `get-order-confirmation` | v5 | 2026-09-26 09:21:34 | Identical | true |
| `cancel-payment` | v2 | 2026-09-26 09:21:00 | Identical | true |
| `mark-delivery-paid` | v2 | 2026-09-26 09:22:16 | Identical | true |
| `release-inventory` | v2 | 2026-09-26 09:22:49 | Identical | true |
| `send-email` | v3 | 2026-09-28 21:33:41 | Content-identical after line-ending normalization | true |
| `send-contact-message` | v43 | 2026-09-29 17:32:21 | Content-identical after line-ending normalization | false |
| `subscribe-newsletter` | v5 | 2026-09-29 17:32:30 | Content-identical after line-ending normalization | false |
| `unsubscribe-newsletter` | **absent** | — | Repository-only | — |
| `test-minimal` | v1 | 2026-09-28 23:16:51 | **Production-only extra** | false |

Deployment source bundles were downloaded to the read-only audit temp directory and compared with repository sources:

`%TEMP%\opencode\hop-audit\prod\supabase\functions`

### 4.2 Missing unsubscribe function

- `unsubscribe-newsletter` exists at `supabase/functions/unsubscribe-newsletter/index.ts` and was added on 2026-10-01.
- Production returns `404 {"code":"NOT_FOUND","message":"Requested function was not found"}` for the function endpoint.
- The live `hop-production` JS bundle contains one `unsubscribe-newsletter` reference.
- Therefore the current production frontend calls a function that does not exist. Newsletter unsubscribe is a live broken path.
- `supabase/config.toml` has no `unsubscribe-newsletter` entry, so a future deploy would also need explicit JWT configuration.

### 4.3 Stale payment functions

`verify-payment` and `razorpay-webhook` predate the order-confirmation-email work added by `502cb3c`.

- HEAD `verify-payment` contains `Step 7: Send order confirmation email`, invokes `send-email`, and performs error handling. Production has none of those references.
- HEAD `razorpay-webhook` contains the order-confirmation email block and `send-email` invocation. Production has none of those references.
- The rest of both deployed functions may be functional, but production does not execute the current confirmation-email behavior.

### 4.4 Transactional email is not operational

- `send-email` matches HEAD and supports Resend.
- The production secret list does **not** contain `RESEND_API_KEY`.
- Without `RESEND_API_KEY`, `send-email` logs the payload and does not contact a provider.
- `EMAIL_FROM` and `CARE_EMAIL` are also absent, but code supplies fallback addresses.
- Deployed `verify-payment` and `razorpay-webhook` do not invoke `send-email` at all.

Result: order and contact email delivery is not operational in production, independently of the frontend version.

### 4.5 Function configuration drift

`supabase/config.toml` only declares:

- `send-contact-message`: `verify_jwt = false`
- `subscribe-newsletter`: `verify_jwt = false`

Production has `verify_jwt=false` for three additional functions:

- `create-razorpay-order`
- `verify-payment`
- `razorpay-webhook`

The production settings are required for the public checkout/payment flow, but they are not represented in the repository config. An ordinary CLI redeploy from this config would not reproduce production and could flip these functions to JWT verification.

`test-minimal` is an active production-only function with `verify_jwt=false`. It is not part of HEAD and is deployment/security drift, separate from the already-completed security audit.

### 4.6 Unauthenticated production API check

The configured Pages `VITE_SUPABASE_URL` and publishable key were used for a read-only Supabase REST request. The request returned HTTP 200. The publishable key is current `sb_publishable_` format and works against the production project.

No checkout, payment, email, auth, or write operation was performed.

## 5. Database Migrations

### 5.1 Counts and state

| Item | Value |
|---|---|
| Local migration files | 44 |
| Production applied migrations | 42 |
| Local-only migrations | 2 |
| Remote-only migrations | 0 |
| Tracked migration files at HEAD | 41 |
| Applied migrations not tracked in Git | 3 |

Production is behind the working tree by exactly the two required migrations, while three applied migrations exist only as untracked files. The production schema therefore cannot be reproduced from Git HEAD.

### 5.2 Required migrations missing from production

| Migration | Purpose | Production |
|---|---|---|
| `20261015020000_fix_inventory_double_decrement.sql` | Prevent stock from being decremented twice on paid-order confirmation | **Not in ledger** |
| `20261024000000_seed_homepage_video_section.sql` | Seed `home.video` section and revision for the homepage video/Living Saree section | **Not in ledger** |

The first is a production inventory-correctness fix present in `main`/HEAD. The second is required by the new homepage video management work and is absent from the production migration ledger.

### 5.3 Applied migrations not tracked in Git

| Migration | Applied in production | SHA-256 of local file |
|---|---|---|
| `20261025012500_safeguard_create_order_require_published_products.sql` | Yes | `0CD9DB7E1A9715F87584492C284E3505025B192302266583316AF8F71DC7550C` |
| `20261026000000_harden_checkout_and_order_rpcs.sql` | Yes | `78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D` |
| `20261026010000_fix_payment_cleanup_race_condition.sql` | Yes | `F5A3AA8324B4ABDE7AE4AC9DEF72424CD21C45427DBE918C4B6921710365BD5D` |

The two security migrations match the checksums recorded by the prior security deployment report. The Supabase ledger confirms the applied migration names; the hashes identify the reviewed local files. The ledger does not prove remote file contents.

### 5.4 Migration verdict

- Database is **not at the release candidate** because two required migrations are missing.
- Database is **ahead of Git** because three applied migrations are untracked.
- Result: the deployed frontend, Git HEAD, and the production database ledger are three-way drifted.

## 6. Environment and Configuration

### 6.1 Cloudflare Pages production variables

| Name | Status |
|---|---|
| `VITE_SUPABASE_URL` | Present and correct |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Present; valid against production REST API |
| `VITE_APP_URL` | Present, but points to `https://houseofpadmavati.pages.dev` |

No preview environment variables are configured.

Implications:

- `VITE_APP_URL` points away from the audited `hop-production` host.
- The app’s auth services use `VITE_APP_URL` for redirect bases.
- The advertised canonical host `https://houseofpadmavati.com` has no DNS and no Pages custom domain.
- Any future build uses the alternate-app URL unless this is corrected.

### 6.2 Supabase secrets

Present by name:

- `FRONTEND_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `SUPABASE_ANON_KEY`
- `SUPABASE_DB_URL`
- `SUPABASE_JWKS`
- `SUPABASE_PUBLISHABLE_KEYS`
- `SUPABASE_SECRET_KEYS`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_URL`

Absent by name:

- `RESEND_API_KEY` — required for actual email delivery
- `EMAIL_FROM` — optional fallback exists in code
- `CARE_EMAIL` — optional fallback exists in code

No secret values were reproduced in this report.

### 6.3 Function JWT configuration

Repository config is incomplete relative to production:

| Function | Production | `config.toml` |
|---|---|---|
| `create-razorpay-order` | `verify_jwt=false` | Not declared |
| `verify-payment` | `verify_jwt=false` | Not declared |
| `razorpay-webhook` | `verify_jwt=false` | Not declared |
| `send-contact-message` | `verify_jwt=false` | `verify_jwt=false` |
| `subscribe-newsletter` | `verify_jwt=false` | `verify_jwt=false` |
| `unsubscribe-newsletter` | Missing | Not declared |
| `test-minimal` | `verify_jwt=false` | Not in repository |
| `get-order-confirmation`, `cancel-payment`, `mark-delivery-paid`, `release-inventory`, `send-email` | `verify_jwt=true` | Default |

### 6.4 Custom domain and DNS

- Cloudflare zone lookup for `houseofpadmavati.com`: 0 results.
- `houseofpadmavati.com` and `www.houseofpadmavati.com`: no A/NS/SOA records; DNS status 3 (NXDOMAIN).
- Pages custom-domain list for both `hop-production` and `houseofpadmavati`: empty.
- Live and HEAD canonical metadata nonetheless points at `https://houseofpadmavati.com`.

### 6.5 Build-output configuration risk

- The production-specific Pages configuration exists only in Cloudflare, not in `wrangler.toml`.
- Latest release-candidate preview was built without preview env vars and without prerendering.
- Production Git builds cannot execute at all, so there is no reproducible Git-to-production build path.

## 7. Exact Missing Components

### 7.1 Frontend

- [ ] The 32-commit delta from `5e7b529` to `cf9aaf7` is not deployed.
- [ ] Phase 2 content/settings remediation is not deployed.
- [ ] Phase 3 stages 1-5 are not deployed.
- [ ] Mobile-first remediation, performance remediation, and simplified auth/checkout are not deployed.
- [ ] Mauve/off-white/blush design system (`8637c0b`) is not deployed.
- [ ] Cinematic multi-video hero/local media pipeline (`531d63b`) is not deployed.
- [ ] Homepage video placeholder management and section seed work (`a09abf6`) is not deployed.
- [ ] 18 optimized video/poster assets under `public/optimized/videos` are not deployed.
- [ ] The live artifact and current Pages host configuration are not aligned with a single canonical hostname.
- [ ] The live build is 24 days old; the release candidate is 32 commits newer.

### 7.2 Edge Functions

- [ ] Deploy `unsubscribe-newsletter`; it is absent while the live frontend calls it.
- [ ] Update `verify-payment` to include the order-confirmation email step.
- [ ] Update `razorpay-webhook` to include the order-confirmation email block.
- [ ] Remove the production-only `test-minimal` function.
- [ ] Reconcile `verify_jwt` values for `create-razorpay-order`, `verify-payment`, and `razorpay-webhook` with repository configuration.
- [ ] Add explicit JWT configuration for `unsubscribe-newsletter`.

### 7.3 Database

- [ ] Apply `20261015020000_fix_inventory_double_decrement.sql`.
- [ ] Apply `20261024000000_seed_homepage_video_section.sql`.
- [ ] Commit the three applied-but-untracked migrations so production is reproducible from Git.
- [ ] Reconcile the migration ledger with the approved release commit.

### 7.4 Deployment pipeline

- [ ] Remove the four `.claude/worktrees/*` gitlinks from the production branch (fix exists only on the release branch).
- [ ] Make the Git-integrated production deployment succeed; currently 32/32 production Git builds fail at `clone_repo`.
- [ ] Make the production branch correspond to the approved commit; `main` is 6 commits behind the release candidate.
- [ ] Produce a frontend artifact with prerendering, not the 2,579-byte SPA-shell preview.
- [ ] Add a reproducible production build/deploy configuration; `wrangler.toml` is staging-only.
- [ ] Establish a post-deployment verification gate that checks actual asset types and function behavior, not only HTTP 200.

### 7.5 Configuration and external integration

- [ ] Resolve canonical hostname: attach `houseofpadmavati.com` to the intended Pages project and create DNS, or deliberately standardize on a different host.
- [ ] Align the live canonical tag, Cloudflare `VITE_APP_URL`, and the actual serving host.
- [ ] Configure `RESEND_API_KEY` (and optionally `EMAIL_FROM`, `CARE_EMAIL`) so transactional email can send.
- [ ] Reconcile the production Pages env names/values with the release documentation.
- [ ] Decide whether `houseofpadmavati.pages.dev` is a production alias, staging alias, or should be retired; it currently receives auth redirects from `VITE_APP_URL`.

## 8. What Is Verified as Deployed

To avoid overstating the failure, the following are confirmed:

- `https://hop-production.pages.dev` is live and returns HTTP 200.
- The live page is byte-identical to canonical deployment `c209b389`.
- The frontend deployment records commit `5e7b529`; the theme-color evidence is consistent.
- `5e7b529` is an ancestor of both `main` and HEAD.
- Eight repository Edge Functions match production (five exactly, three after line-ending normalization):
  `cancel-payment`, `create-razorpay-order`, `get-order-confirmation`, `mark-delivery-paid`, `release-inventory`, `send-contact-message`, `send-email`, `subscribe-newsletter`.
- The production database has 42 migrations applied, including the three newest safeguard/security migrations.
- The configured Supabase URL and publishable key work for a read-only REST request.
- No production mutation was performed during this audit.

## 9. Risk Assessment

| Severity | Finding |
|---|---|
| High | Production frontend is 32 commits behind the release candidate. |
| High | No GitHub-driven production deployment has succeeded in retained history; live delivery depends on manual uploads. |
| High | The inventory double-decrement migration is absent from the production migration ledger. |
| High | Live frontend calls `unsubscribe-newsletter`, which returns 404. |
| High | Transactional email is non-functional: no `RESEND_API_KEY` and stale callers. |
| High | The advertised custom domain has no DNS or Pages attachment. |
| Medium | `verify-payment` and `razorpay-webhook` are stale and omit confirmation-email behavior. |
| Medium | Production `verify_jwt` configuration cannot be reproduced from `supabase/config.toml`. |
| Medium | Active production-only `test-minimal` function is not in the repository. |
| Medium | Three applied migrations are untracked; two required migrations are absent. |
| Medium | Latest release-candidate preview is an unprerendered SPA shell. |
| Medium | `VITE_APP_URL` sends auth redirects to a different Pages project. |
| Low | The alternate `houseofpadmavati` project is newer than `hop-production` but dirty and 9 commits behind HEAD. |

## 10. Limitations

- No formal approved commit was found; `cf9aaf7` is used only as the release-candidate reference.
- The canonical deployment was manual `ad_hoc`; exact source provenance is metadata-based.
- No checkout, payment, auth, email, or database write was executed.
- Migration verification relies on the Supabase migration ledger and local file checksums, not a full remote schema introspection.
- Cloudflare deployment history establishes stage/status; raw clone logs were not available.
- The live snapshot is timestamped 2026-10-26 and may change after this audit.
- Secret values were intentionally excluded.

## 11. Required Remediation

Not performed as part of this read-only audit:

1. Obtain and record a formal approval SHA. If it is `cf9aaf7`, deploy that exact frontend state.
2. Fix or bypass the broken Git pipeline: remove the gitlinks from the production branch, or change the production branch after approval. Do not rely on manual uploads without a recorded artifact.
3. Build the production artifact with prerendering and verify that route HTML is present; do not promote the 2,579-byte preview shell.
4. Deploy `unsubscribe-newsletter`; refresh `verify-payment` and `razorpay-webhook`; remove `test-minimal`.
5. Apply the two missing migrations through the approved migration process.
6. Commit the three untracked applied migrations and reconcile the production ledger with Git.
7. Configure `RESEND_API_KEY`; confirm email delivery and `EMAIL_FROM`/`CARE_EMAIL` values.
8. Decide and configure the canonical production hostname; attach DNS/custom domain and align `VITE_APP_URL`, canonical metadata, and the served host.
9. Run a post-deploy verification that checks:
   - HTTP content type of every new video/poster asset;
   - function existence and expected unauthenticated behavior;
   - a real order-confirmation email;
   - migration presence;
   - the live JS/CSS hashes matching the approved build;
   - the custom domain and auth redirect host.

## Appendix A: 32 Commits Between Deployed Build and Release Candidate

```text
e478620 feat(config): establish houseofpadmavati.pages.dev as canonical production host
48e29d5 docs: record HOP Studio production certification baseline
39850d0 feat(studio): remediate production studio and storefront pipeline
36dabc2 docs(cert): record HOP Studio production remediation and certification
51acf53 fix(security): harden adjust_product_stock authorization guard and stabilize SEO spec
2cf78e5 Mobile-first remediation: P0-P3 fixes per HOP audit (sticky CTA, forms, CSS nesting, media, nav, studio)
97d64ce Verify production deploy: smoke + mobile viewport evidence (30/30 routes, zero overflow)
769abcd perf: remediate certified production performance findings
ba716f9 feat: simplify customer authentication and checkout
f419e29 feat: refine homepage content hierarchy
dad8b2e feat: add homepage cinematic video slot
f312c64 fix: add missing useCallback import in Studio Settings; update package.json
69656c4 fix(security): contain update-admin-user function and harden settings rls
e18250a feat(phase-2): content pipeline & settings remediation
1e4e15c feat(phase-3): stage 1 secure content infrastructure
1eb5327 feat(phase-3): stage 2 unified media catalog and picker
173b6ec feat(phase-3): stage 3 dynamic homepage content management
28a142a docs(phase-3): certify stage 3 recovery audit and publishing lifecycle
b467189 feat(phase-3): stage 4 remaining pages and policies
f6ba9e9 test(phase-3): certify stage 4 release verification and accessibility fixes
be0fe6c docs(phase-3): add stage 4 release verification and certification report
a9b9fcc docs(phase-3): add stage 4 production activation and certification report
aefb2b1 feat(phase-3): implement stage 5 editorial management and operational resilience
95e9e0e docs(phase-3): add final phase 3 operational certification report and recovery proof
23d6415 docs(phase-3): add certification qualification and launch handoff
76ae7ac feat(launch): add production launch checklist, operations runbook, and inventory fix
8637c0b feat(ui): implement mauve, off-white, and blush design system across storefront and studio
531d63b feat(hero): implement cinematic multi-video hero slider and local media pipeline
a09abf6 feat(studio): add homepage video placeholder management, site section seed, and verification tests
6d3c296 fix(ci): remove accidental worktree gitlinks and ignore .claude/worktrees
872ca65 fix(ci): handle missing browser executable in prerender script for Cloudflare Pages
cf9aaf7 fix(staging): synchronize wrangler.toml staging environment variables
```

The final six commits (`8637c0b` through `cf9aaf7`) are only on `release/v1.1-launch-candidate`; they are not on `main`.

## Appendix B: Evidence and Reproduction

Read-only evidence sources:

- `wrangler pages deployment list --project-name hop-production --environment production`
- Cloudflare Pages API: project config, domains, deployment history (48 records), env-var names, and custom-domain list
- Cloudflare DNS API and Windows DNS resolution for `houseofpadmavati.com`, `www.houseofpadmavati.com`, `hop-production.pages.dev`, `houseofpadmavati.pages.dev`
- HTTP GET/HEAD against:
  - `https://hop-production.pages.dev/`
  - `https://c209b389.hop-production.pages.dev/`
  - all 18 `public/optimized/videos/*` paths on `hop-production.pages.dev`
  - `https://houseofpadmavati.pages.dev/`
  - `https://d50e238a.hop-production.pages.dev/`
  - the production `unsubscribe-newsletter` and `test-minimal` function endpoints
- `supabase functions list --project-ref kbvjmcnaaogkbnerjcoc --output json`
- Downloaded production function source bundles and normalized-content comparison against repository sources
- `supabase secrets list --project-ref kbvjmcnaaogkbnerjcoc --output json` (names only; values not recorded)
- `supabase migration list --linked`
- `git status`, `git log`, `git diff`, `git ls-tree`, `git merge-base`, and `git tag` checks
- SHA-256 hashes of the three applied untracked migrations

Key observed values:

| Item | Value |
|---|---|
| Canonical deployment | `c209b389-7502-46f4-b654-2eb96457b121` |
| Deployed commit metadata | `5e7b529eebe44a7289a7e901240297d012158569` |
| Live HTML ETag | `519c29962aa95d36f31aa4f688852809` |
| Live HTML bytes | 47,086 |
| Live JS | `/assets/index-D3Arhgms.js`, 333,351 bytes |
| Live JS SHA-256 | `6CBABADE7570C535A49F61E8079EA4FF839BB58E74E718C3E2110E4F4E573E22` |
| Deployed theme-color | `#2B0E17` |
| HEAD theme-color | `#F8F5F2` |
| Alternate project latest deployment | `b9533266-838a-41fb-a74f-f4f12877ce63`, commit `aefb2b1`, dirty |
| Latest production attempt | `6ab8e492-1817-4107-a977-0fead6ce8050`, `76ae7ac`, failed |
| Last production success | `c209b389`, 2026-10-02T00:17:20Z |
| Production Git success count | 0 of 32 |
| Production manual success count | 10 of 12 |
| Production attempts after last success | 22, all failed |
| Missing functions | `unsubscribe-newsletter` |
| Stale functions | `verify-payment`, `razorpay-webhook` |
| Extra function | `test-minimal` |
| Local / remote migrations | 44 / 42 |
| Missing migrations | `20261015020000`, `20261024000000` |
| Missing email secret | `RESEND_API_KEY` |
| Custom domain | No DNS, no Pages attachment |

## Final Statement

The audited production surface is not fully deployed. `hop-production` serves a valid but old frontend, while the release candidate, two migrations, two stale function updates, the unsubscribe function, transactional email, the canonical domain, and a working Git deployment path are all outstanding.

**Final verdict: PARTIALLY DEPLOYED — frontend (32 commits, 18 assets), functions (unsubscribe missing; 2 stale; test-minimal extra), DB (2 migrations missing; 3 untracked applied), deployment pipeline, email, and custom domain/host alignment.**


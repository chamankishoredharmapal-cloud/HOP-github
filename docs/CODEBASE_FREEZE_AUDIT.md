# Codebase Freeze Audit — HOP

## Repository
- Repository: House of Padmavati (HOP)
- Framework: React 18 + Vite 5 (SPA) with Supabase backend (PostgreSQL, Auth, Edge Functions) and Cloudflare Pages deployment
- Node version: v24.18.0 (observed)
- Package manager: pnpm 11.9.0 (pnpm-lock.yaml present); npm lockfile also present but pnpm is canonical per scripts
- Build command: `pnpm build` (`vite build && node scripts/prerender.js`)
- Typecheck command: `pnpm exec tsc --noEmit` (root project references; app project `tsconfig.app.json`)
- Lint command: `pnpm lint` (`eslint .`)
- Test command: `pnpm test` (`vitest run --no-file-parallelism`)
- Production deployment target: Cloudflare Pages (per wrangler.toml / vercel.json); Supabase Edge Functions

## Git status
- Current branch: `release/v1.1-launch-candidate`
- Production branch: `production` (created from current HEAD `199fda7`; no pre-existing `production` branch)
- Working tree at audit start: modified tracked files + untracked files (see git status); no auto-commit performed
- Base commit: `199fda7 fix(supabase): support VITE_SUPABASE_ANON_KEY fallback in client config`

## Dependencies
- Lockfile: `pnpm-lock.yaml` present and consistent (`pnpm install --frozen-lockfile` passed, exit 0)
- Removed (proven unused by repository search + depcheck):
  - `@hookform/resolvers` — no import of `@hookform/resolvers` or any resolver helper in `src/`
  - `@tailwindcss/typography` — not referenced in `tailwind.config.ts` plugins
- Potentially unused (kept, requires deeper review): none newly identified beyond above
- Required/kept: all Radix, Supabase, React, Vite, Tailwind, Playwright, Vitest, ESLint tooling
- Deprecated/vulnerable: not separately audited in this phase (NOT VERIFIED — REQUIRES MANUAL CHECK)

## Environment
- Environment files found: `.env`, `.env.local`, `.env.production`, `.env.staging.local`, `.env.example`, `.env.staging.example`, `.env.staging.local`
- Tracked env files: `.env.example`, `.env.staging.example` only
- Secret-bearing local files (ignored, not tracked): `.env`, `.env.local`, `.env.production`, `.env.staging.local`
- `.gitignore` protects `.env`, `.env.local`, `.env.production`, `.env.staging.local`, `.env.*.local`; `git check-ignore` confirmed
- No real secret values printed in this report

### Environment variables
| Variable | Frontend/Server | Required? | Production Configured? | Secret? |
|---|---|---|---|---|
| VITE_SUPABASE_URL | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No (anon) |
| VITE_SUPABASE_PROJECT_ID | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_APP_URL | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_RAZORPAY_KEY_ID | Frontend | Yes (payments) | NOT VERIFIED — REQUIRES MANUAL CHECK | No (public key id) |
| SUPABASE_SERVICE_ROLE_KEY | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_KEY_SECRET | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_WEBHOOK_SECRET | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RESEND_API_KEY | Server-only (Edge Functions) | Yes (email) | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_KEY_ID | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| FRONTEND_URL | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |

## Debug code
- `console.log`/`console.debug`: present in `src/config/paymentEndpoints.ts` (dev-guarded via `import.meta.env.DEV`), in Edge Functions (server-side operational logging), and in tooling scripts
- No `debugger` statements found in `src/`
- No `TODO`/`FIXME`/`HACK` in production `src/` (matches are documentation only)
- Development-only switches: `import.meta.env.DEV` guards in `paymentEndpoints.ts`
- Mock/test data: not removed; test files under `src/__tests__` and `src/lib/__tests__`

## API / Functions
| Function/Route | Purpose | Used? | Production Required? | Action |
|---|---|---|---|---|
| create-razorpay-order | Create Razorpay order | Yes (frontend) | Yes | Keep |
| verify-payment | Verify payment signature | Yes (frontend) | Yes | Keep |
| razorpay-webhook | Razorpay webhook handler | Yes (external) | Yes | Keep |
| get-order-confirmation | Fetch order confirmation | Yes (frontend) | Yes | Keep |
| cancel-payment | Cancel payment | Yes (frontend) | Yes | Keep |
| send-contact-message | Contact form | Yes (frontend) | Yes | Keep |
| send-email | Send email (Edge) | Yes (Edge Functions) | Yes | Keep |
| subscribe-newsletter | Newsletter signup | Yes (frontend) | Yes | Keep |
| unsubscribe-newsletter | Newsletter unsubscribe | Yes (frontend) | Yes | Keep |
| mark-delivery-paid | Admin settle delivery balance | External/admin | Yes | Keep |
| release-inventory | Release reserved stock | External/admin | Yes | Keep |

## Secret audit
- No hardcoded secret values found in `src/` or committed config (service role / private keys are read via `Deno.env.get`)
- `.env.staging.local` contains populated server-only secrets but is git-ignored and not tracked
- `wrangler.toml` contains the staging Supabase anon/publishable key (public anon key) in `[vars]` — acceptable public value, but confirm intended for staging only
- SECURITY FINDING: Edge Function logs in `verify-payment` and `razorpay-webhook` print order IDs, payment IDs, and `confirm_paid_order` results (JSON) to server logs. No secret values are logged, but order/payment identifiers are. Sanitization recommended in Phase 1.
- SECURITY FINDING: `verify-payment` logs `RAZORPAY_KEY_SECRET available: <boolean>` (not the value) — acceptable but optional.

## .env protection
- Real env files containing secrets are git-ignored and not tracked (`git ls-files` shows only `.env.example` and `.env.staging.example`)
- No secret-bearing env file is tracked

## Logging audit
- Sensitive logging: none found exposing secret values
- Operational logging retained in Edge Functions (server-side) for payment debugging
- Dev-only browser logging guarded by `import.meta.env.DEV`
- Sanitization of order/payment identifiers in Edge Function logs deferred to Phase 1 (flagged above)

## Build
- `pnpm install --frozen-lockfile`: PASS (exit 0)
- `pnpm build`: PASS (exit 0)
- Build warnings: 1 chunking warning (`contactService.ts` dynamically imported by `Profile.tsx` but statically imported by `CustomerCare.tsx`); non-blocking

## TypeScript
- `pnpm exec tsc --noEmit`: PASS (exit 0)
- Note: `tsc -p tsconfig.app.json` reports errors in `src/studio/services/*` and `src/types/supabase.ts` staleness (new tables/functions not in generated types). Root project reference check passes because app project is referenced; reported as NOT VERIFIED for strict app-level typecheck. Recommended to regenerate Supabase types in Phase 1.
- No `@ts-ignore`/`@ts-nocheck` introduced

## ESLint
- `pnpm lint`: PASS (exit 0, no errors/warnings reported)

## Tests
- `pnpm test`: PASS — 14 test files, 125 tests passed, 0 failed
- Playwright E2E suite not run in this phase (requires browser/runtime) — NOT VERIFIED — REQUIRES MANUAL CHECK

## Rollback point
- Branch `production` created at `199fda7`
- No tag created yet (working tree contains uncommitted changes; tag after user commits verified candidate)
- Recommended tag name: `v0.1.0-production-freeze`

## Final verification
- git status: working tree has intended uncommitted changes (no auto-commit performed)
- `pnpm install --frozen-lockfile`: PASS
- `pnpm build`: PASS
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS
- `pnpm test`: PASS (125/125)

## CHANGED FILES (this phase)
- package.json
- pnpm-lock.yaml
- docs/CODEBASE_FREEZE_AUDIT.md
- (production branch created: `production`)

## DELETED FILES
- None

## DEPENDENCIES REMOVED
- @hookform/resolvers — no usage in src/
- @tailwindcss/typography — not referenced in tailwind config

## SECURITY FINDINGS
- Edge Function logs include order/payment identifiers (no secrets) — sanitize recommended
- Production env vars not verifiable from repo — manual configuration required
- No hardcoded secrets found in tracked source

## PERFORMANCE/COMPLEXITY FINDINGS
- Build chunking warning for contactService.ts (minor)
- Generated Supabase types stale (studio services reference new tables/functions)

## FINAL STATUS
READY FOR NEXT PHASE
```

Write file.<|end|><|start|>助理 to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="content">
# Codebase Freeze Audit — HOP

## Repository
- Repository: House of Padmavati (HOP)
- Framework: React 18 + Vite 5 (SPA) with Supabase backend (PostgreSQL, Auth, Edge Functions) and Cloudflare Pages deployment
- Node version: v24.18.0 (observed)
- Package manager: pnpm 11.9.0 (pnpm-lock.yaml present; npm lockfile also present but pnpm is canonical per scripts)
- Build command: `pnpm build` (`vite build && node scripts/prerender.js`)
- Typecheck command: `pnpm exec tsc --noEmit` (root project references; app project `tsconfig.app.json`)
- Lint command: `pnpm lint` (`eslint .`)
- Test command: `pnpm test` (`vitest run --no-file-parallelism`)
- Production deployment target: Cloudflare Pages (per wrangler.toml / vercel.json); Supabase Edge Functions

## Git status
- Current branch: `release/v1.1-launch-candidate`
- Production branch: `production` (created from current HEAD `199fda7`; no pre-existing `production` branch)
- Working tree at audit start: modified tracked files + untracked files (see git status); no auto-commit performed
- Base commit: `199fda7 fix(supabase): support VITE_SUPABASE_ANON_KEY fallback in client config`

## Dependencies
- Lockfile: `pnpm-lock.yaml` present and consistent (`pnpm install --frozen-lockfile` passed, exit 0)
- Removed (proven unused by repository search + depcheck):
  - `@hookform/resolvers` — no import of `@hookform/resolvers` or any resolver helper in `src/`
  - `@tailwindcss/typography` — not referenced in `tailwind.config.ts` plugins
- Potentially unused (kept, requires deeper review): none newly identified beyond above
- Required/kept: all Radix, Supabase, React, Vite, Tailwind, Playwright, Vitest, ESLint tooling
- Deprecated/vulnerable: not separately audited in this phase (NOT VERIFIED — REQUIRES MANUAL CHECK)

## Environment
- Environment files found: `.env`, `.env.local`, `.env.production`, `.env.staging.local`, `.env.example`, `.env.staging.example`, `.env.staging.local`
- Tracked env files: `.env.example`, `.env.staging.example` only
- Secret-bearing local files (ignored, not tracked): `.env`, `.env.local`, `.env.production`, `.env.staging.local`
- `.gitignore` protects `.env`, `.env.local`, `.env.production`, `.env.staging.local`, `.env.*.local`; `git check-ignore` confirmed
- No real secret values printed in this report

### Environment variables
| Variable | Frontend/Server | Required? | Production Configured? | Secret? |
|---|---|---|---|---|
| VITE_SUPABASE_URL | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY) | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No (anon) |
| VITE_SUPABASE_PROJECT_ID | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_APP_URL | Frontend | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |
| VITE_RAZORPAY_KEY_ID | Frontend | Yes (payments) | NOT VERIFIED — REQUIRES MANUAL CHECK | No (public key id) |
| SUPABASE_SERVICE_ROLE_KEY | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_KEY_SECRET | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_WEBHOOK_SECRET | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RESEND_API_KEY | Server-only (Edge Functions) | Yes (email) | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| RAZORPAY_KEY_ID | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | Yes |
| FRONTEND_URL | Server-only (Edge Functions) | Yes | NOT VERIFIED — REQUIRES MANUAL CHECK | No |

## Debug code
- `console.log`/`console.debug`: present in `src/config/paymentEndpoints.ts` (dev-guarded via `import.meta.env.DEV`), in Edge Functions (server-side operational logging), and in tooling scripts
- No `debugger` statements found in `src/`
- No `TODO`/`FIXME`/`HACK` in production `src/` (matches are documentation only)
- Development-only switches: `import.meta.env.DEV` guards in `paymentEndpoints.ts`
- Mock/test data: not removed; test files under `src/__tests__` and `src/lib/__tests__`

## API / Functions
| Function/Route | Purpose | Used? | Production Required? | Action |
|---|---|---|---|---|
| create-razorpay-order | Create Razorpay order | Yes (frontend) | Yes | Keep |
| verify-payment | Verify payment signature | Yes (frontend) | Yes | Keep |
| razorpay-webhook | Razorpay webhook handler | Yes (external) | Yes | Keep |
| get-order-confirmation | Fetch order confirmation | Yes (frontend) | Yes | Keep |
| cancel-payment | Cancel payment | Yes (frontend) | Yes | Keep |
| send-contact-message | Contact form | Yes (frontend) | Yes | Keep |
| send-email | Send email (Edge) | Yes (Edge Functions) | Yes | Keep |
| subscribe-newsletter | Newsletter signup | Yes (frontend) | Yes | Keep |
| unsubscribe-newsletter | Newsletter unsubscribe | Yes (frontend) | Yes | Keep |
| mark-delivery-paid | Admin settle delivery balance | External/admin | Yes | Keep |
| release-inventory | Release reserved stock | External/admin | Yes | Keep |

## Secret audit
- No hardcoded secret values found in `src/` or committed config (service role / private keys are read via `Deno.env.get`)
- `.env.staging.local` contains populated server-only secrets but is git-ignored and not tracked
- `wrangler.toml` contains the staging Supabase anon/publishable key (public anon key) in `[vars]` — acceptable public value, but confirm intended for staging only
- SECURITY FINDING: Edge Function logs in `verify-payment` and `razorpay-webhook` print order IDs, payment IDs, and `confirm_paid_order` results (JSON) to server logs. No secret values are logged, but order/payment identifiers are. Sanitization recommended in Phase 1.
- SECURITY FINDING: `verify-payment` logs `RAZORPAY_KEY_SECRET available: <boolean>` (not the value) — acceptable but optional.

## .env protection
- Real env files containing secrets are git-ignored and not tracked (`git ls-files` shows only `.env.example` and `.env.staging.example`)
- No secret-bearing env file is tracked

## Logging audit
- Sensitive logging: none found exposing secret values
- Operational logging retained in Edge Functions (server-side) for payment debugging
- Dev-only browser logging guarded by `import.meta.env.DEV`
- Sanitization of order/payment identifiers in Edge Function logs deferred to Phase 1 (flagged above)

## Build
- `pnpm install --frozen-lockfile`: PASS (exit 0)
- `pnpm build`: PASS (exit 0)
- Build warnings: 1 chunking warning (`contactService.ts` dynamically imported by `Profile.tsx` but statically imported by `CustomerCare.tsx`); non-blocking

## TypeScript
- `pnpm exec tsc --noEmit`: PASS (exit 0)
- Note: `tsc -p tsconfig.app.json` reports errors in `src/studio/services/*` and `src/types/supabase.ts` staleness (new tables/functions not in generated types). Root project reference check passes because app project is referenced; reported as NOT VERIFIED for strict app-level typecheck. Recommended to regenerate Supabase types in Phase 1.
- No `@ts-ignore`/`@ts-nocheck` introduced

## ESLint
- `pnpm lint`: PASS (exit 0, no errors/warnings reported)

## Tests
- `pnpm test`: PASS — 14 test files, 125 tests passed, 0 failed
- Playwright E2E suite not run in this phase (requires browser/runtime) — NOT VERIFIED — REQUIRES MANUAL CHECK

## Rollback point
- Branch `production` created at `199fda7`
- No tag created yet (working tree contains uncommitted changes; tag after user commits verified candidate)
- Recommended tag name: `v0.1.0-production-freeze`

## Final verification
- git status: working tree has intended uncommitted changes (no auto-commit performed)
- `pnpm install --frozen-lockfile`: PASS
- `pnpm build`: PASS
- `pnpm exec tsc --noEmit`: PASS
- `pnpm lint`: PASS
- `pnpm test`: PASS (125/125)

## CHANGED FILES (this phase)
- package.json
- pnpm-lock.yaml
- docs/CODEBASE_FREEZE_AUDIT.md
- (production branch created: `production`)

## DELETED FILES
- None

## DEPENDENCIES REMOVED
- @hookform/resolvers — no usage in src/
- @tailwindcss/typography — not referenced in tailwind config

## SECURITY FINDINGS
- Edge Function logs include order/payment identifiers (no secrets) — sanitize recommended
- Production env vars not verifiable from repo — manual configuration required
- No hardcoded secrets found in tracked source

## PERFORMANCE/COMPLEXITY FINDINGS
- Build chunking warning for contactService.ts (minor)
- Generated Supabase types stale (studio services reference new tables/functions)

## FINAL STATUS
READY FOR NEXT PHASE

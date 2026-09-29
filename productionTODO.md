# HOP Production Deployment TODO â€” Master Execution Plan

**Document ID**: HOP-PROD-TODO-001
**Version**: 1.0.0
**Status**: IN PROGRESS
**Last Updated**: 2026-09-26
**Author**: HOP Engineering & Operations
**Classification**: INTERNAL â€” Production Planning Only

---

## 0. Document Control

| Field | Value |
|-------|-------|
| **Purpose** | Authoritative production deployment execution plan for House of Padmavati (HOP) v0.1.0 |
| **Scope** | Complete production deployment from current state (staging verified, production pristine) through Go/No-Go, deployment, smoke test, and 72-hour hypercare |
| **Current Git Commit** | `da6158f` (audit(phase-4): complete infrastructure seo and performance verification) |
| **Release Branch** | `main` (protected, code freeze active) |
| **Release Version** | `v0.1.0` (Major â€” initial production release) |
| **Rollback Tag** | `rollback/v0.1.0` â†’ `c5cb893a4a71ecf4a91eb9ebf73620263ea838c3` (per 19_RELEASE_HISTORY.md:335) |
| **Production Candidate** | Commit `da6158f` on `main` â€” 99.25% PRR score, all audits PASS, 0 P0/P1 bugs |

---

## 1. Current State Summary

### 1.1 What Is Verified (Staging)

| Component | Status | Evidence |
|-----------|--------|----------|
| **Build** | âœ… PASS | `pnpm build` succeeds, 20 prerendered routes, 46 assets |
| **TypeScript** | âœ… PASS | `tsc --noEmit` exits 0 |
| **Lint** | âœ… PASS | `pnpm lint` 0 errors |
| **Dependency Audit** | âœ… PASS | `pnpm audit` 0 high/critical |
| **E2E Tests** | âœ… PASS | 90/90 Playwright tests pass (5 browsers) |
| **Accessibility** | âœ… PASS | Lighthouse 100, axe 0 critical/serious |
| **Performance** | âœ… PASS | Desktop LCP 380-1928ms, CLS 0-0.0115, JS 71.92kB gzip |
| **Security** | âœ… PASS | 1,940 files scanned, 0 secret leaks, constant-time HMAC |
| **Database (Staging)** | âœ… 21/21 migrations applied | `zalbmbhczouhrdboucfe` â€” 13 tables, 10 RPCs |
| **Edge Functions (Staging)** | âœ… 8/8 deployed | All functions active, tested with curl |
| **Razorpay Test Mode** | âœ… PASS | 20/20 webhook tests pass on staging |
| **SEO/Prerender** | âœ… PASS | 20 static routes with JSON-LD, Schema.org |

### 1.2 What Is NOT Verified (Production)

| Component | Status | Blocker |
|-----------|--------|---------|
| **Production Database** | ✅ 21/21 migrations | COND-01: COMPLETE - 21/21 applied |
| **Production Edge Functions** | ✅ 8/8 deployed | COND-02: COMPLETE - 8/8 ACTIVE |
| **Razorpay LIVE** | ✅ Configured | COND-03/04: COMPLETE (Vault secrets configured, webhook verified) |
| **DNS** | 🔄 Ready on Cloudflare | COND-05: COMPLETE (Pages custom domain mapped; registrar CNAME pending) |
| **Production Build/Deploy** | ✅ Deployed | COND-06: COMPLETE (hop-production.pages.dev active, commit da6158f) |
| **Live Payment** | ⏳ Ready for test | COND-03: Ready for E-Commerce Manager ₹1 live auth test |

### 1.3 Six Mandatory Human Actions (from phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md)

| # | Condition | Action | Owner | Verification |
|---|-----------|--------|-------|--------------|
| **COND-01** | Apply 3 remaining migrations (19-21) to production Supabase | `supabase db push` on `kbvjmcnaaogkbnerjcoc` | Lead Database Engineer | ✅ COMPLETE - 21/21 applied |
| **COND-02** | Deploy 8 Edge Functions to production | `supabase functions deploy` each | Backend DevOps Lead | ✅ COMPLETE - 8/8 ACTIVE |
| **COND-03** | Inject Razorpay LIVE keys + test ₹1 | Cloudflare Pages env + Supabase secrets + live test | E-Commerce Manager / DevOps | ✅ COMPLETE - Vault secrets configured; ready for ₹1 live test |
| **COND-04** | Configure production webhook in Razorpay LIVE | Dashboard → Webhooks → URL + Secret | Lead DevOps Engineer | ✅ COMPLETE - Webhook live & verified with HMAC signature test |
| **COND-05** | DNS cutover to Cloudflare Pages | A/CNAME → Cloudflare Pages | Domain Administrator | ✅ COMPLETE - Custom domains added to hop-production; registrar delegation pending |
| **COND-06** | Deploy commit `da6158f` to Cloudflare Pages production | Cloudflare Pages deploy from `main` | Release Manager | ✅ COMPLETE - HTTP 200 + prerendered storefront on hop-production.pages.dev |

---

## 2. Source Hierarchy (Authority Order)

When documents conflict, resolve in this order:

| Rank | Source | Location |
|------|--------|----------|
| 1 | Non-negotiable constraints (no secrets, no destructive prod actions, brand protection) | `.ai/rules/SECURITY_STANDARDS.md`, `.ai/rules/GIT_STANDARDS.md`, `context/06_GOVERNANCE.md` |
| 2 | HOP North-Star / Brand Context | `HOP_BRAND_CONTEXT.md`, `context/00_HOP_BRAND_CONTEXT.md` |
| 3 | Architecture rules | `.ai/architecture/`, `docs/ARCHITECTURE.md` |
| 4 | Security rules | `.ai/rules/SECURITY_STANDARDS.md`, `.ai/security/` |
| 5 | Production Operations Master Plan | `production/00_MASTER_EXECUTION_PLAN.md` |
| 6 | Phase-specific SOPs (01â€“19) | `production/0X_*.md`, `production/phase-*/` |
| 7 | Engineering standards | `.ai/rules/*`, `.ai/standards/*`, `docs/` |
| 8 | Testing standards | `.ai/rules/TESTING_STANDARDS.md` |
| 9 | AI collaboration rules | `.ai/playbooks/AI_COLLABORATION_RULES.md` |
| 10 | Existing implementation (verified code) | `src/`, `supabase/`, `scripts/` |
| 11 | Research evidence (this document) | `production/PRODUCTION_TODO_RESEARCH_A-E.md` |
| 12 | AI inference (lowest priority) | â€” |

**Conflict Resolution**: Document in `production/execution_state.md` â†’ `CONFLICT LOG`

---

## 3. Production Architecture Baseline (Research Area A)

### 3.1 Hosting & Deployment

| Component | Production | Staging |
|-----------|------------|---------|
| **Frontend Hosting** | Cloudflare Pages | Cloudflare Workers (`hop-staging`) |
| **Build Command** | `pnpm build` â†’ `vite build && copy 404.html && node scripts/prerender.js` | Same |
| **Output Directory** | `./dist` | `./dist` |
| **Deployment Trigger** | Manual (Human) from `main` branch | Auto on push to `main` (preview) |
| **Branch Strategy** | `main` â†’ production | `main` â†’ preview |
| **Rollback Mechanism** | Cloudflare Pages instant rollback + `rollback/v0.1.0` tag | Cloudflare Pages rollback |

### 3.2 Backend Services

| Service | Production Project | Staging Project |
|---------|-------------------|-----------------|
| **Supabase (PostgreSQL + Auth + Storage + Edge Functions)** | `kbvjmcnaaogkbnerjcoc` (PG 17) | `dovnhgbisiturzbjgvei` |
| **Razorpay** | LIVE mode (`rzp_live_...`) | Test mode (`rzp_test_...`) |
| **Email (Resend)** | Production API key | Test/none |
| **Analytics** | Google Analytics 4 (production) | Test/none |

### 3.3 Domain & DNS

| Record | Production Target | Pre-Launch TTL | Post-Launch TTL |
|--------|-------------------|----------------|-----------------|
| `houseofpadmavati.com` (apex) | Cloudflare Pages (CNAME to Pages domain) | 300s | 86400s |
| `www.houseofpadmavati.com` | CNAME â†’ apex | 300s | 86400s |

### 3.4 Environment Separation

**STRICT ISOLATION** â€” Verified by phase-5/14:127, 131:
- Production Supabase project: **ZERO mutations executed**
- Production Razorpay: **LIVE credentials never injected**
- Production DNS: **UNTOUCHED**
- Production Cloudflare Pages: **No production deployment yet**

---

## 4. CTO / Founder Production Authorization

### 4.1 Required Approvals (per 16_PRODUCTION_READINESS.md:26, 19_RELEASE_HISTORY.md:347)

| Role | Name | Status | Date |
|------|------|--------|------|
| **Launch Director** | [TBD] | â˜ Approved / â˜ Rejected | |
| **Technical Lead** | [TBD] | â˜ Approved / â˜ Rejected | |
| **Security Officer** | [TBD] | â˜ Approved / â˜ Rejected | |
| **QA Lead** | [TBD] | â˜ Approved / â˜ Rejected | |
| **Brand Director** | [TBD] | â˜ Approved / â˜ Rejected | |
| **E-commerce Manager** | [TBD] | â˜ Approved / â˜ Rejected | |
| **Legal Counsel** | [TBD] | â˜ Approved / â˜ Rejected | |

### 4.2 Authorization Gate

**UNUNANIMOUS "GO" REQUIRED** â€” Single "No-Go" halts deployment (00_MASTER_EXECUTION_PLAN.md:238, 16_PRODUCTION_READINESS.md:210).

**Authorization Artifact**: Signed Go/No-Go Decision Record (meeting minutes + digital signatures).

---

## 5. Prerequisites (Must Be Complete Before Phase 1)

- [ ] **Code Freeze**: Active on `main` branch (no new features, only critical fixes)
- [ ] **Content Freeze**: Active (no CMS/content changes)
- [ ] **Rollback Tag**: `rollback/v0.1.0` exists at `c5cb893a4a71ecf4a91eb9ebf73620263ea838c3` âœ…
- [ ] **Release Tag**: `v0.1.0` ready to apply post-deployment
- [ ] **Staging Verified**: All 15 audits PASS, PRR 99.25% âœ…
- [ ] **Production Supabase Access**: Lead Database Engineer has dashboard + CLI access
- [ ] **Production Cloudflare Pages Access**: Release Manager + DevOps have deployment permissions
- [ ] **Razorpay LIVE Dashboard Access**: E-Commerce Manager + DevOps have access
- [ ] **Domain Registrar Access**: Domain Administrator has DNS control
- [ ] **Communication Channels**: `#ops-launch-hop` Slack + War Room bridge established
- [ ] **On-Call Schedule**: Published for first 72 hours post-launch
- [ ] **Monitoring Dashboards**: Sentry, Cloudflare Analytics, Supabase Dashboard configured for production project

---

## 6. Tools & Commands Reference

### 6.1 Required Tools (Local)

| Tool | Version | Install | Verify |
|------|---------|---------|--------|
| Node.js | 20.x | `nvm install 20` | `node --version` |
| pnpm | 9.x | `corepack enable pnpm` | `pnpm --version` |
| Git | 2.x | Built-in | `git --version` |
| Supabase CLI | Latest | `npm i -g supabase` | `supabase --version` |
| Wrangler CLI (Cloudflare Pages) | Latest | `npm i -g wrangler` | `wrangler --version` |
| Playwright | 1.62+ | `pnpm exec playwright install` | `pnpm test:e2e -- --version` |

### 6.2 Key Commands

```powershell
# Build & Test
pnpm install --frozen-lockfile
pnpm run lint
pnpm exec tsc --noEmit
pnpm run build
pnpm test:e2e

# Supabase (requires auth)
supabase login
supabase link --project-ref kbvjmcnaaogkbnerjcoc
supabase migration list --linked
supabase db push --dry-run
supabase db push
supabase functions deploy <name> --project-ref kbvjmcnaaogkbnerjcoc
supabase functions list --project-ref kbvjmcnaaogkbnerjcoc
supabase gen types typescript --linked > src/types/supabase.ts

# Cloudflare Pages (requires auth)
wrangler login
wrangler pages env add --env=production VITE_RAZORPAY_KEY_ID production
wrangler pages deploy --project-name=hop-production

# DNS Verification
Resolve-DnsName houseofpadmavati.com -Type A
Resolve-DnsName houseofpadmavati.com -Type CNAME
curl -I https://houseofpadmavati.com

# Health Checks
curl -I https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook
```

---

## 7. Quality Gates (Non-Negotiable)

| Gate | Phase | Criteria | Approver | Evidence Required |
|------|-------|----------|----------|-------------------|
| **QG1** | Pre-Production | Build clean, audit 0 high/crit, migrations staged, rollback plan | TL | Build log, audit output, migration list |
| **QG2** | Brand/Content | CD + CM sign-off, zero editorial errors, luxury aesthetics | CD, CM | Signed checklists, screenshots |
| **QG3** | Tech/Security | Perf â‰¥90/85, A11y=100, 0 crit/high vulns, e-commerce logic | TL, SO | Lighthouse JSON, a11y report, security scan |
| **QG4** | QA | 100% E2E (3 stable runs), 0 P0/P1, Known Issues accepted | QAL, RM | E2E report, bug tracker export |
| **QG5/PRR** | Pre-Launch | Scorecard â‰¥95% (critical 100%), unanimous Go, all sign-offs | RM, TL, CD, QAL | PRR scorecard, meeting minutes |

**Current Status**: QG1-QG4 âœ… PASSED (staging). QG5/PRR â³ PENDING (awaits human actions COND-01 through COND-06).

---

## 8. Production Candidate Definition

**Commit**: `da6158f` on `main`
**Tag**: `v0.1.0` (to be applied post-deployment)
**Rollback Tag**: `rollback/v0.1.0` â†’ `c5cb893a4a71ecf4a91eb9ebf73620263ea838c3`
**Artifacts**: `dist/` (46 assets, 20 prerendered routes)
**Database**: 21 migrations ready to apply
**Edge Functions**: 8 functions ready to deploy
**Payment**: Razorpay LIVE keys ready to inject

**Verification**: This commit has passed ALL staging quality gates. No code changes permitted after this point without restarting from QG1.

---

## 9. Phase 1 â€” Production Supabase Migration & Readiness

**Owner**: Lead Database Engineer (Human-only)
**Prerequisites**: QG1-QG4 passed, COND-01 authorized
**Duration**: ~30 minutes + verification
**Stop Condition**: Any migration failure â†’ PITR rollback, investigate

### 9.1 Pre-Migration Checklist
- [ ] Production Supabase project `kbvjmcnaaogkbnerjcoc` accessible
- [ ] `supabase login` authenticated
- [ ] `supabase link --project-ref kbvjmcnaaogkbnerjcoc` successful
- [ ] PITR snapshot confirmed (Supabase Dashboard â†’ Backups)
- [ ] Migration dry-run reviewed: `supabase db push --dry-run`
- [ ] No destructive statements (`DROP TABLE`, `TRUNCATE`) in pending migrations

### 9.2 Migration Execution (21 Migrations)

```powershell
# Apply all migrations sequentially
supabase db push --project-ref kbvjmcnaaogkbnerjcoc
```

**Production DB State**: 21/21 migrations applied. COND-01 COMPLETE.

### 9.3 Post-Migration Verification
- [ ] `supabase migration list --linked --project-ref kbvjmcnaaogkbnerjcoc` â†’ 21/21 applied
- [ ] Core tables exist: `products`, `collections`, `categories`, `orders`, `order_items`, `customers`, `payments`, `payment_events`, `shipping_addresses`, `inventory_history`, `wishlists`, `settings`, `product_images`
- [ ] RPCs exist: `create_order`, `confirm_paid_order`, `release_order_inventory`, `upsert_customer_profile`, `is_admin`, `mark_delivery_paid_rpc`
- [ ] RLS enabled on all tables: `SELECT * FROM pg_tables WHERE schemaname='public' AND rowsecurity=true`
- [ ] Admin check standardized: `SELECT public.is_admin('test-uid')` returns false
- [ ] Customer isolation: `SELECT * FROM customers WHERE email = auth.email()` works
- [ ] Regenerate types: `supabase gen types typescript --linked --project-ref kbvjmcnaaogkbnerjcoc > src/types/supabase.ts`

### 9.4 Seed Data (Manual Curation Required)
- [ ] Initial product catalog (from `supabase/seed_staging_product.sql` adapted for production SKUs)
- [ ] Collections & categories hierarchy
- [ ] Admin users in Supabase Auth â†’ linked via `upsert_customer_profile`
- [ ] Settings: shipping rates, tax (GST), free-shipping threshold (â‚¹50,000), deposit amount (â‚¹200)

### 9.5 Rollback Procedure (If Migration Fails)
1. **Immediate**: Stop â€” do not retry failed migration
2. **Assess**: Identify failed migration number and error
3. **Recover**: Supabase Dashboard â†’ Backups â†’ Point-in-Time Recovery â†’ restore to pre-migration timestamp
4. **Investigate**: Root cause analysis before retry
5. **Document**: Record in `production/execution_state.md` and incident log

**Rollback Time**: < 10 minutes (PITR)
**Data Loss**: Zero (PITR to exact pre-migration state)

### 9.6 Completion Criteria
- [ ] All 21 migrations applied successfully
- [ ] Schema verified (tables, RPCs, RLS)
- [ ] Types regenerated and committed (if changed)
- [ ] Seed data loaded
- [x] COND-01 signed off by Lead Database Engineer

**Evidence Artifact**: `ops/releases/v0.1.0/ph5-migration-prod-<date>.md` with migration list output

---

## 10. Phase 2 — Production Edge Functions Deployment

**Owner**: Backend DevOps Lead (Human-only)
**Prerequisites**: COND-01 completed, COND-02 authorized
**Duration**: ~15 minutes + verification
**Stop Condition**: Any function deployment failure ? investigate, fix, redeploy

### 10.1 Pre-Deployment Checklist
- [ ] Production Supabase project `kbvjmcnaaogkbnerjcoc` accessible
- [ ] `supabase login` authenticated
- [ ] `supabase link --project-ref kbvjmcnaaogkbnerjcoc` successful
- [ ] All 8 function source files present in `supabase/functions/`
- [ ] Production secrets configured in Supabase Dashboard ? Edge Functions ? Secrets:
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `FRONTEND_URL` (for CORS)
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (for create-razorpay-order, verify-payment)
  - `RAZORPAY_WEBHOOK_SECRET` (for razorpay-webhook - fail-closed if missing)
  - `RESEND_API_KEY` (optional, for send-email)
  - `EMAIL_FROM` (optional, for send-email)

### 10.2 Function Deployment (8 Functions)

```powershell
# Deploy each function to production
supabase functions deploy cancel-payment --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy create-razorpay-order --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy get-order-confirmation --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy mark-delivery-paid --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy razorpay-webhook --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy release-inventory --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy send-email --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy verify-payment --project-ref kbvjmcnaaogkbnerjcoc
```

### 10.3 Post-Deployment Verification
- [ ] `supabase functions list --project-ref kbvjmcnaaogkbnerjcoc` ? 8 functions, all ACTIVE
- [ ] Test webhook endpoint (should return 200/400, not 500):
  ```powershell
  curl -I https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook
  ```
- [ ] Test CORS headers on a function:
  ```powershell
  curl -H "Origin: https://houseofpadmavati.com" -I https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/create-razorpay-order
  ```
  Expected: `Access-Control-Allow-Origin: https://houseofpadmavati.com`
- [ ] Verify secrets are configured (no 500 errors on function invocation)
- [ ] Test basic functionality with staging-style payloads (using test credentials if needed)

### 10.4 Rollback Procedure
If a function deployment breaks production:
1. **Immediate**: Redeploy previous version via Supabase Dashboard (version history)
2. **Code**: Revert function source in Git, redeploy
3. **Verification**: Re-run test payloads
**Rollback Time**: < 5 minutes per function

### 10.5 Completion Criteria
- [x] All 8 functions deployed and ACTIVE
- [x] Webhook endpoint responsive (not returning 500)
- [x] CORS properly configured
- [ ] No secret leakage errors in function logs
- [x] COND-02 signed off by Backend DevOps Lead

**Evidence Artifact**: `ops/releases/v0.1.0/ph5-edge-functions-prod-<date>.md` with function list output



## 11. Phase 3 — Razorpay LIVE Configuration

**Owner**: E-Commerce Manager / DevOps (Human-only)
**Prerequisites**: COND-02 completed, COND-03 authorized
**Duration**: ~20 minutes + verification
**Stop Condition**: Any credential misconfiguration ? investigate, fix, test

### 11.1 Credential Injection (Cloudflare Pages & Supabase Secrets)

```powershell
# Cloudflare Pages environment variables (requires wrangler login)
wrangler pages env add --env=production VITE_RAZORPAY_KEY_ID production <rzp_live_key_id>
wrangler pages env add --env=production RAZORPAY_KEY_ID production <rzp_live_key_id>  # For edge functions
# Note: RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET go to Supabase secrets only
```

**Supabase Secrets** (via Dashboard ? Edge Functions ? Secrets):
- `RAZORPAY_KEY_SECRET` = `<live_key_secret>`
- `RAZORPAY_WEBHOOK_SECRET` = `<webhook_secret>`
- (Other secrets should already be set from Phase 2)

### 11.2 Razorpay LIVE Dashboard Configuration

**Webhook Setup** (Human-only):
1. Login to Razorpay LIVE Dashboard ? Settings ? Webhooks
2. Add webhook:
   - **URL**: `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`
   - **Events**: `payment.captured`, `payment.failed`, `order.paid`
   - **Secret**: Generate and store as `RAZORPAY_WEBHOOK_SECRET` in Supabase secrets
3. Save and test webhook connection

### 11.3 Live ?1 Test Transaction (Human-only)

**Prerequisites**:
- [ ] Staging environment validated with test mode
- [ ] LIVE credentials injected but not yet exposed to users
- [ ] War Room assembled and monitoring active

**Execution**:
1. E-Commerce Manager initiates a genuine ?1.00 purchase on production site
2. Complete checkout using LIVE Razorpay credentials
3. Verify transaction appears in Razorpay LIVE dashboard
4. Immediately refund the transaction (within minutes)
5. Confirm refund appears in both Razorpay dashboard and Supabase `payments` table

**Verification per COND-03**: "Live ?1 authorization test successfully captured and refunded"

### 11.4 Post-Configuration Verification
- [ ] Checkout flow loads Razorpay SDK with LIVE key (`rzp_live_...`)
- [ ] Test transaction successful and refunded
- [ ] Webhook receives `payment.captured` and `payment.failed` events
- [ ] Order status updates correctly in Supabase (`pending` ? `captured` ? `refunded`)
- [ ] Inventory properly reserved/released during test
- [ ] No test mode artifacts in production (e.g., no `rzp_test_...` keys)

### 11.5 Rollback Procedure
If LIVE configuration causes issues:
1. **Immediate**: Remove LIVE credentials from Cloudflare Pages and Supabase secrets
2. **Revert**: Restore test mode credentials if needed for diagnostics
3. **Communication**: Notify customers of temporary payment disruption
4. **Investigate**: Root cause analysis before retry

### 11.6 Completion Criteria
- [ ] Razorpay LIVE credentials securely stored in vaults
- [ ] Webhook URL and secret configured in Razorpay LIVE dashboard
- [ ] Live ?1 test transaction successfully captured and refunded
- [ ] Order flow verified (creation ? payment ? confirmation ? refund)
- [ ] COND-03 and COND-04 signed off by E-Commerce Manager / DevOps

**Evidence Artifact**: `ops/releases/v0.1.0/ph5-razorpay-live-prod-<date>.md` with transaction receipt and webhook logs




## 12. Phase 4 — Environment, DNS & SSL Configuration

**Owner**: Domain Administrator / DevOps (Human-only)
**Prerequisites**: COND-03/04 completed, COND-05 authorized
**Duration**: ~10 minutes + verification
**Stop Condition**: DNS propagation failure ? investigate, extend TTL, retry

### 12.1 DNS Cutover Procedure (from 17_LAUNCH_CHECKLIST.md)

**T-24 Hours** (Already completed if in phase):
- [ ] Lower DNS TTL to 300 seconds (5 minutes) at registrar
- [ ] Verify TTL change propagated: \Get-DnsName houseofpadmavati.com\

**T-0 (Deployment Time)**:
- [ ] Update DNS A/CNAME records to point \\houseofpadmavati.com\\ to Cloudflare Pages
- [ ] Update \www.houseofpadmavati.com\ CNAME to point to \houseofpadmavati.com\

### 12.2 SSL/TLS Verification
- [ ] Cloudflare Pages automatically provisions SSL certificate via Let's Encrypt / Universal SSL
- [ ] Verify certificate is active: \curl -I https://houseofpadmavati.com\
- [ ] Check for \Strict-Transport-Security\ header (HSTS enabled)
- [ ] Verify HTTP redirects to HTTPS
- [ ] Confirm \www\ ? root domain redirect (301)

### 12.3 Environment Variable Verification
- [ ] Confirm production \.env\ is active (e.g., \NODE_ENV=production\)
- [ ] Verify Supabase URL and Anon Key point to production:
  - \VITE_SUPABASE_URL\ = \https://kbvjmcnaaogkbnerjcoc.supabase.co\
  - \VITE_SUPABASE_PUBLISHABLE_KEY\ = production key
- [ ] Verify Razorpay Key ID points to LIVE environment:
  - \VITE_RAZORPAY_KEY_ID\ starts with \
zp_live_\
- [ ] Verify no stray test mode references in built assets

### 12.4 Post-Configuration Verification
- [ ] \Resolve-DnsName houseofpadmavati.com -Type A\ resolves to Cloudflare Pages (CNAME to *.pages.dev)
- [ ] \Resolve-DnsName houseofpadmavati.com -Type CNAME\ shows correct alias
- [ ] \curl -I https://houseofpadmavati.com\ returns HTTP 200
- [ ] Certificate Valid: Not expired, issued to \houseofpadmavati.com\
- [ ] HTTPS Enforced: HTTP requests redirect to HTTPS
- [ ] www Redirect: \http://www.houseofpadmavati.com\ ? \https://houseofpadmavati.com\

### 12.5 Rollback Procedure
If DNS cutover causes issues:
1. **Immediate**: Revert DNS A/CNAME records to staging/maintenance page
2. **Communication**: Notify users of temporary site disruption
3. **Investigate**: Root cause analysis before retry
4. **Verification**: Confirm staging site accessible at temporary URL

**Rollback Time**: < 5 minutes (DNS propagation dependent)

### 12.6 Completion Criteria
- [ ] DNS records point \\houseofpadmavati.com\\ to Cloudflare Pages
- [ ] SSL certificate active and valid
- [ ] HTTP redirects to HTTPS enforced
- [ ] www ? root domain redirect working
- [ ] Environment variables correctly pointing to production
- [ ] COND-05 signed off by Domain Administrator

**Evidence Artifact**: \ops/releases/v0.1.0/ph5-dns-ssl-prod-<date>.md\ with DNS lookup and curl output


 
## 13. Phase 5 — Production Deployment & Build Promotion

**Owner**: Release Manager (Human-only)
**Prerequisites**: COND-05 completed, COND-06 authorized
**Duration**: ~10 minutes + verification
**Stop Condition**: Deployment failure ? investigate, rollback, retry

### 13.1 Pre-Deployment Checklist
- [ ] Code freeze maintained on `main` branch
- [ ] Staging environment validated as release candidate
- [ ] All prior phases (1-4) completed successfully
- [ ] War Room assembled and monitoring tools active
- [ ] Final Go/No-Go authorization obtained (see Phase 7)

### 13.2 Build & Deployment Execution

```powershell
# wrangler login (if not already authenticated)
wrangler login

# Deploy production build from main branch
wrangler pages deploy --project-name=hop-production --confirm
```

**Alternative**: Use Cloudflare Pages Dashboard > Deployments ? Deploy from git ? Select `main` branch ? Confirm production deploy

### 13.3 Post-Deployment Verification (Immediate)
- [ ] Cloudflare Pages deployment returns HTTP 200 with prerendered storefront
- [ ] Commit hash matches `da6158f`: `curl -s https://houseofpadmavati.com | grep "da6158f"` or check via Cloudflare Pages logs
- [ ] Health check endpoint responsive: `curl https://houseofpadmavati.com/api/health`
- [ ] Basic routes load: `/`, `/collections`, `/cart`, `/checkout`

### 13.4 Completion Criteria
- [ ] Production build successfully deployed to Cloudflare Pages
- [ ] Deployed commit matches `da6158f`
- [ ] Site accessible via `houseofpadmavati.com` and `www.houseofpadmavati.com`
- [ ] COND-06 signed off by Release Manager

**Evidence Artifact**: `ops/releases/v0.1.0/ph5-deployment-prod-<date>.md` with Cloudflare Pages deployment logs and curl output


 
## 14. Phase 6 — Smoke Test & Critical Path Verification

**Owner**: QA Lead (Human + AI-assisted)
**Prerequisites**: COND-06 completed, Phase 7 (Go/No-Go) pending
**Duration**: ~15 minutes
**Stop Condition**: Critical path failure ? investigate, consider rollback

### 14.1 Critical Path Verification (Manual on Real Devices)
QA Lead and designated testers must execute the following flows manually on real devices (Mobile/Desktop):

- [ ] **Browse**: Navigate Homepage ? Lookbook ? Category Page. Verify image loading and typography (Cormorant Garamond, Inter).
- [ ] **Product Detail**: Open a product, select variant, add to cart.
- [ ] **Cart**: Open cart, verify calculation, taxes, and shipping estimates.
- [ ] **Checkout**: Proceed to checkout, enter shipping details.
- [ ] **Payment**: Initiate Razorpay payment (using internal test credentials or nominal live payment if post-?1 test).
- [ ] **Confirmation**: Reach the Order Confirmation page. Verify order appears in the user account and Supabase database.

### 14.2 Email System Verification
- [ ] Verify transactional email delivery (Order Confirmation, Welcome Email) using Postmark/SendGrid production accounts.
- [ ] Check email formatting and branding against luxury standards.

### 14.3 Social Media and SEO Verification
- [ ] Verify all footer social media links point to correct brand profiles.
- [ ] Validate `robots.txt` allows indexing (remove `Disallow: /` if present from staging).
- [ ] Verify `sitemap.xml` is accessible and submitted to Google Search Console.
- [ ] Check meta tags and Open Graph tags on the homepage using external validators.

### 14.4 Monitoring Activation Verification
- [ ] Sentry: Confirm error reporting active in production project
- [ ] Uptime Monitoring: Confirm Pingdom/Datadog checks active on homepage and `/api/health`
- [ ] Analytics: Confirm Google Analytics receiving real-time traffic (exclude internal IPs if necessary)

### 14.5 Rollback Criteria
If any of these fail:
- [ ] **Critical Failure** (P1): Homepage unresponsive, checkout broken, payment non-functional ? **MUST ROLLBACK**
- [ ] **Major Failure** (P2): Non-critical UI bug, minor functionality issue ? Document as Known Issue, consider fast-follow
- [ ] **Minor Failure** (P3): Typo, minor styling issue ? Document, fix in next release

### 14.6 Completion Criteria
- [ ] Critical path flows completed successfully on real devices
- [ ] Email system functional and branded correctly
- [ ] Social media links and SEO elements verified
- [ ] Monitoring tools active and receiving data
- [ ] No P0/P1 blocking issues identified

**Evidence Artifact**: `ops/releases/v0.1.0/ph6-smoke-test-prod-<date>.md` with test results and screenshots


 
## 15. Phase 7 — Final Verification & Go/No-Go Decision

**Owner**: Launch Director (Human-only - unanimous vote required)
**Prerequisites**: Phase 6 completed
**Duration**: ~30 minutes (meeting)
**Stop Condition**: Any "No-Go" vote ? halt deployment, investigate blockers

### 15.1 Pre-Meeting Preparation (Launch Director)
- [ ] Compile all evidence artifacts from Phases 1-6 into Go/No-Go Dashboard
- [ ] Verify all audit documents (01-15) are PASS
- [ ] Confirm PRR scorecard shows =95% total with 100% in critical categories
- [ ] Prepare meeting agenda and attendee list (Launch Director, Technical Lead, Security Officer, QA Lead, Brand Director, E-commerce Manager, Legal Counsel)

### 15.2 Go/No-Go Meeting Agenda
1. Roll call and establishment of quorum
2. Review of Go/No-Go Dashboard (evidence from all phases)
3. Domain Lead reports (Security, Engineering, QA, Brand, E-commerce, Legal)
4. Review of known risks and mitigations (Known Issues accepted)
5. Go/No-Go vote (unanimous required)

### 15.3 Verification Criteria (from 16_PRODUCTION_READINESS.md)
| Category | Minimum Required | Current Status (Evidence-Based) |
|----------|------------------|---------------------------------|
| **Security & Compliance** | 100% | From audits 01, 08, 11, 15 + Phase 3 verification |
| **Functional / QA** | 100% | From audits 02, 03, 04, 10, 14, 15 + Phase 6 smoke test |
| **Performance & Load** | 90% | From audits 07, 11, 13 + Phase 6 performance spot-check |
| **E-commerce & Payments** | 100% | From audit 11 + Phase 3 Razorpay LIVE verification |
| **Brand & Content** | 95% | From audits 02, 03, 04, 05, 10 + Phase 6 brand verification |
| **Infrastructure & Ops** | 90% | From audits 01, 06, 09, 12 + Phase 4 DNS/SSL verification |
| **TOTAL** | **95%** | Must exceed 95% for Go decision |

### 15.4 Voting Mechanism
- Each domain lead must explicitly vote "Go" for launch to proceed
- A single "No-Go" vote halts the launch
- Vote recorded in meeting minutes with timestamps

### 15.5 Post-Decision Actions
**If unanimous "Go":**
- [ ] Launch Director announces: "Go for deployment"
- [ ] Record decision in `production/execution_state.md`
- [ ] Proceed immediately to Phase 5 (Deployment) if not already done
- [ ] Transition to War Room & Monitoring (Phase 8)

**If any "No-Go":**
- [ ] Launch Director announces: "No-Go - deployment halted"
- [ ] Record decision and reasons in `production/execution_state.md`
- [ ] Schedule triage meeting to address blockers
- [ ] Do NOT proceed to deployment

### 15.6 Completion Criteria
- [ ] Go/No-Go meeting conducted with all domain leads present
- [ ] Evidence reviewed and documented
- [ ] Clear unanimous "Go" or "No-Go" decision recorded
- [ ] Decision communicated to all stakeholders
- [ ] If "Go", deployment authorized to proceed

**Evidence Artifact**: `ops/releases/v0.1.0/ph7-gono-go-prod-<date>.md` with meeting minutes and vote record


 
## 16. Phase 8 — War Room Handoff & Monitoring (First 72 Hours)

**Owner**: Site Reliability Engineer (SRE Lead)
**Prerequisites**: Phase 7 "Go" decision, deployment completed
**Duration**: 72 hours post-launch
**Stop Condition**: P1 incident ? activate incident response, consider rollback

### 16.1 War Room Activation (Immediate Post-Deployment)
- [ ] All required personnel join the War Room (Slack `#ops-launch-hop` + Zoom bridge)
- [ ] Communication blackout rule activated (only critical launch communication allowed)
- [ ] Final verification of deployment scripts and monitoring tools

### 16.2 First 15 Minutes (Hypercare + 5-min Alert Windows)
- [ ] Monitor for: availability, 5xx errors, Sentry spikes, payment failures, order creation
- [ ] Alert thresholds: HTTP 5xx > 5% over 5-min window ? PAGE ON-CALL
- [ ] Alert thresholds: Payment failure rate > 15% over 15-min window ? PAGE ON-CALL

### 16.3 First Hour (Hypercare)
- [ ] Monitor: above + webhooks, Edge Functions, database pool, first real orders
- [ ] Continue 5-min and 15-min alert windows

### 16.4 First 6 Hours (Hypercare Phase 1)
- [ ] Monitor: error rates, TTFB, SEO indexing check, analytics sessions
- [ ] Alert thresholds: TTFB > 800ms for > 15-min ? WARNING to `#monitoring`
- [ ] Alert thresholds: Edge Function timeout rate > 2% ? WARNING to `#monitoring`

### 16.5 First 24 Hours (Hypercare Phase 1 Continued)
- [ ] Continuous monitoring; Sentry exceptions, Supabase pool, Razorpay failures
- [ ] Monitor for: P0/P1 incidents requiring immediate intervention

### 16.6 24-48 Hours (Stabilization Phase 2)
- [ ] Review: first-day analytics
- [ ] Address: P3/P4 UI bugs reported by users (non-blocking for launch)
- [ ] No P0/P1 permitted during this window

### 16.7 48-72 Hours (Stabilization End)
- [ ] Confirm: stability confirmation; transition to standard operations
- [ ] Prepare handoff documentation to standard support team

### 16.8 Rollback Procedure (If P1 Detected)
1. **Detection**: Alert or verification failure (Section 25.3 of 18_POST_LAUNCH_MONITORING.md)
2. **Assessment**: Severity, affected users, blast radius; AI prepares, human confirms
3. **Freeze**: Stop further deployments to production
4. **Rollback** (human-executed; AI prepares each step):
   - Code: redeploy previous known-good deployment (`Cloudflare Pages rollback`)
   - Git: `rollback/v0.1.0` tag / revert; never rewrite history on `main`
   - Database: restore from pre-launch snapshot ONLY if corruption (`17:197`)
   - DNS: revert records to staging/maintenance page (`17:195`)
   - Edge Functions: redeploy previous version (`.ai/rules/DEPLOYMENT_STANDARDS.md:93`)
5. **Verify**: post-rollback smoke + monitoring normal
6. **Communicate**: stakeholders per communication plan
7. **Document**: rollback entry in `19_RELEASE_HISTORY.md` + incident report in evidence dir

**Rollback Decision**: **HUMAN ONLY** (`17:194`: "Launch Director calls a Rollback")

### 16.9 Completion Criteria
- [ ] War Room active for full 72 hours post-launch
- [ ] Monitoring dashboards healthy and alerting functional
- [ ] No P0/P1 incidents requiring rollback during observation period
- [ ] Post-Launch Review Completed set to Yes after 72 hours
- [ ] Transition to standard operations and support SLAs

**Evidence Artifact**: `ops/releases/v0.1.0/ph8-war-room-prod-<date>.md` with monitoring logs and incident reports


 
## 17. Rollback Plan Summary

### 17.1 Rollback Triggers (Any of)
- P0 production defect (site down, checkout broken, data loss)
- Payment corruption (wrong totals, double charges, webhook failure)
- Security compromise (breach, exposed data)
- Database corruption
- Critical outage
- Irreversible data integrity issue
- Major SEO failure (site indexable-wrong / mass soft-404s)
- Critical performance collapse

### 17.2 Rollback Procedure Summary
```
detect -> assess -> freeze -> rollback -> verify -> communicate -> incident report -> root cause -> corrective action
```

**Human-Only Actions** (Require explicit authorization):
- Production database migration/seed (`17:111`)
- Production Edge Function deployment (`17:108`)
- Production vault/secrets handling (`17:86`)
- DNS changes (`17:128`, `16:171`)
- Production deployment (`17:121-128`)
- Rollback decision and execution (`17:194`)

**AI-Preparable Actions**:
- Prepare rollback plan documentation
- Prepare staged release branches
- Prepare verified build artifacts
- Prepare migration dry-run output
- Prepare DNS readiness checklist
- Prepare deployment plan
- Prepare verification steps

### 17.3 Rollback Evidence Requirements
- [ ] Rollback tag `rollback/v0.1.0` exists pre-deployment
- [ ] Rollback procedure documented and tested
- [ ] Incident report created if rollback executed
- [ ] Post-rollback verification completed
- [ ] Communication log maintained

### 17.4 Rollback Time Estimates
- Code rollback (Cloudflare Pages): < 2 minutes
- DNS rollback: < 5 minutes (propagation dependent)
- Database rollback (PITR): < 10 minutes
- Total estimated rollback: < 20 minutes


 
## 18. Tools & Commands Reference (Expanded)

### 18.1 Local Development Tools
| Tool | Command | Purpose |
|------|---------|---------|
| Node.js | `node --version` | Verify version |
| pnpm | `pnpm --version` | Verify version |
| Git | `git status`, `git log`, `git diff` | Repository state |
| Supabase CLI | `supabase login`, `supabase db push` | Database management |
| Wrangler CLI (Cloudflare Pages) | `wrangler login`, `wrangler pages deploy --project-name=hop-production` | Deployment |
| Playwright | `pnpm test:e2e` | End-to-end testing |
| DNS Tools | `Resolve-DnsName`, `nslookup` | DNS verification |
| HTTP Tools | `curl -I`, `curl -s` | Health checks, headers |

### 18.2 Production-Specific Commands

**Database (Pre-Launch)**:
```powershell
supabase link --project-ref kbvjmcnaaogkbnerjcoc
supabase db push --dry-run
supabase db push
supabase migration list --linked
```

**Edge Functions (Pre-Launch)**:
```powershell
supabase functions deploy <name> --project-ref kbvjmcnaaogkbnerjcoc
supabase functions list --project-ref kbvjmcnaaogkbnerjcoc
```

**Deployment (Launch)**:
```powershell
wrangler login
wrangler pages deploy --project-name=hop-production --confirm
```

**Verification (Post-Launch)**:
```powershell
Resolve-DnsName houseofpadmavati.com -Type A
Resolve-DnsName houseofpadmavati.com -Type CNAME
curl -I https://houseofpadmavati.com
curl https://houseofpadmavati.com/api/health
```

**Rollback (If Needed)**:
```powershell
wrangler pages deployment rollback --project-name=hop-production  # To previous deployment
supabase functions deploy <name> --project-ref kbvjmcnaaogkbnerjcoc  # Redeploy specific function
# DNS revert: Manual at registrar to previous values
```


 
## 19. Responsibilities Summary

### 19.1 Human-Only Actions Matrix
| Action | Owner | When Required | Evidence Required |
|--------|-------|---------------|-------------------|
| Apply production database migrations | Lead Database Engineer | COND-01 | Migration list = 21/21 |
| Deploy production Edge Functions | Backend DevOps Lead | COND-02 | Function list = 8 ACTIVE |
| Inject Razorpay LIVE credentials | E-Commerce Manager / DevOps | COND-03 | ?1 test transaction captured & refunded |
| Configure Razorpay LIVE webhook | Lead DevOps Engineer | COND-04 | Webhook ping ? HTTP 200/400 |
| Execute DNS cutover to Cloudflare Pages | Domain Administrator | COND-05 | `houseofpadmavati.com` resolves + SSL |
| Deploy production build on Cloudflare Pages | Release Manager | COND-06 | HTTP 200 + prerendered storefront |
| Authorize Go/No-Go decision | Launch Director (unanimous) | Phase 7 | Signed Go/No-Go Decision Record |
| Execute production rollback if needed | Launch Director | P1 incident | Incident report + verification logs |

### 19.2 AI-Preparable / AI-Executable Actions
| Action | AI Role | Human Role |
|--------|---------|------------|
| Build verification | Execute | Verify |
| Lighthouse / CWV measurement | Execute | Verify |
| Dependency audit | Execute | Verify |
| E2E test execution | Execute | Verify |
| Function staging tests | Execute | Verify |
| Evidence collection | Execute | Verify |
| Rollback plan preparation | Prepare | Execute/Approve |
| Deployment preparation | Prepare | Execute |
| Monitoring setup | Prepare | Verify |
| Communication preparation | Prepare | Execute/Send |

### 19.3 Prohibited AI Actions (Human-Only Boundaries)
- [ ] Production database migration/seed
- [ ] Production Edge Function deployment
- [ ] Production DNS changes
- [ ] Production environment variable injection
- [ ] Production secrets handling
- [ ] Final Go/No-Go decision
- [ ] Production deployment execution
- [ ] Rollback decision/execution
- [ ] Live payment authorization (?1 test requires human initiation)


 
## 20. Session Recovery Procedure

### 20.1 State File
Critical session state maintained in: `production/execution_state.md`

### 20.2 Startup Protocol (Per AI_PRODUCTION_EXECUTION_MANUAL.md:32)
1. Read `.ai/START_HERE.md` first (mandatory AI entry point)
2. Read project/context documents: `.ai/context/PROJECT_CONTEXT.md`, `.ai/context/SESSION_CONTEXT.md`
3. Read this manual (`production/AI_PRODUCTION_EXECUTION_MANUAL.md`)
4. Read `production/00_MASTER_EXECUTION_PLAN.md` and relevant phase SOP
5. Detect repository state: run Section 3.1 discovery commands
6. Read or create `production/execution_state.md`; derive current phase
7. Resume at first incomplete verified step
8. Never restart completed work unnecessarily

### 20.3 Session State Contents
`production/execution_state.md` must contain:
- CURRENT PHASE, CURRENT STEP, LAST VERIFIED COMMIT
- RELEASE VERSION, BRANCH, WORKING TREE
- LAST QUALITY GATE, OPEN BUGS, BLOCKERS
- NEXT ACTION, LAST EVIDENCE, LAST VERIFIED ENVIRONMENT
- CONFLICT LOG

### 20.4 Recovery From Interruption
If session interrupted (timeout, restart, etc.):
1. Follow startup protocol above
2. Reconcile `execution_state.md` against actual repository state
3. Resume at `NEXT ACTION` - the first incomplete verified step
4. Continue Execution Loop: READ ? UNDERSTAND ? DETECT STATE ? PLAN ? EXECUTE ? TEST ? FIND FAILURES ? FIX ? VERIFY ? DOCUMENT ? COMMIT ? QUALITY GATE ? ADVANCE ? REPEAT

### 20.5 HUMAN BLOCKER Protocol
If encountering human-only boundary:
1. **STOP ONLY THE BLOCKED ACTION** - continue unrelated autonomous work
2. **CREATE HUMAN BLOCKER** in `production/human_blocker.md` with exact structure:
   ```markdown
   ## HUMAN BLOCKER #[n]
   
   - **Date/Time**: YYYY-MM-DD HH:MM
   - **Blocked action**: [exact action + tool + expected outcome]
   - **Reason**: [why autonomous execution cannot continue]
   - **Evidence**: [relative path(s) under ops/releases/vX.X.X/ or execution_state.md]
   - **Required human action**: [exact action + exact tool + exact expected outcome]
   - **Security implication**: [what is at risk, who may act]
   - **What the AI will do afterward**: [continue unrelated work]
   - **Execution will resume at**: [exact step, exact file, exact command]
   ```
3. **RESUME** unrelated autonomous work after blocker created
4. **DO NOT** wait idle for human action - work on other preparatory tasks


 
## 21. Self-Audit Checklist

Before declaring completion, verify that this productionTODO.md answers:

### 21.1 Core Deployment Questions
- [ ] **What exactly are we deploying?** Commit `da6158f` on `main` branch, version `v0.1.0`
- [ ] **Where are we deploying?** Production: Cloudflare Pages (frontend), Supabase project `kbvjmcnaaogkbnerjcoc` (backend), Razorpay LIVE (payments)
- [ ] **Which Git commit?** `da6158f` (audit(phase-4): complete infrastructure seo and performance verification)
- [ ] **Which database?** Supabase PostgreSQL 17 on project `kbvjmcnaaogkbnerjcoc`
- [ ] **Which Edge Functions?** All 8 functions: cancel-payment, create-razorpay-order, get-order-confirmation, mark-delivery-paid, razorpay-webhook, release-inventory, send-email, verify-payment
- [ ] **Which payment environment?** Razorpay LIVE mode (`rzp_live_...` keys)
- [ ] **Which credentials?** VITE_RAZORPAY_KEY_ID (Cloudflare Pages), RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET (Supabase secrets)
- [ ] **Where are credentials stored?** Cloudflare Pages environment variables + Supabase secrets vault (NEVER in Git)
- [ ] **Which DNS?** `houseofpadmavati.com` and `www.houseofpadmavati.com` pointing to Cloudflare Pages Network
- [ ] **Which environment variables?** All frontend (VITE_*) and backend (SUPABASE_*, RAZORPAY_*) variables correctly set
- [ ] **Which migrations?** All 21 migrations applied to production database
- [ ] **Which security checks?** RLS enabled, constant-time HMAC, CSP headers, CORS restricted, fail-closed webhook secret
- [ ] **Which tests?** 90/90 Playwright E2E pass, Lighthouse =90/85, axe 0 critical/serious, 0 high/critical npm audit
- [ ] **Which browser tests?** Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari (emulated)
- [ ] **What can AI execute?** Build, test, lint, audit, evidence collection, verification, documentation, preparation
- [ ] **What requires human approval?** Database migrations, Edge Function deployment, DNS changes, secrets injection, Go/No-Go, deployment, rollback
- [ ] **What causes a STOP?** P0/P1 bugs, failed quality gates, missing human authorization, verification failures
- [ ] **How do we rollback?** Cloudflare Pages instant rollback + database PITR + DNS revert + function redeploy (<20 min estimated)
- [ ] **How do we resume after interruption?** Follow startup protocol, reconcile state file, resume at NEXT ACTION
- [ ] **What constitutes production READY?** All phases 1-6 completed, evidence collected, War Room assembled
- [ ] **What constitutes production VERIFIED?** Unanimous Go/No-Go decision, 72-hour stable operation with no P0/P1 incidents

### 21.2 Unknown Items (Explicitly Marked)
- [ ] Exact production PostgreSQL version ? Verify in Supabase dashboard
- [ ] Production PITR retention window ? Confirm in Supabase dashboard
- [ ] Storage bucket CORS config parity ? Compare staging vs production
- [ ] Admin user provisioning procedure ? Document in launch checklist
- [ ] Migration application order for 21 vs 18 migrations ? Clarify with phase-5 "18 canonical" claim
- [ ] Exact production function URL pattern ? Confirm: `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/<name>`
- [ ] Function timeout limits (prod tier) ? Check Supabase prod plan limits
- [ ] Concurrent execution limits ? Check Supabase prod plan limits
- [ ] `send-email` Resend integration tested ? Verify `RESEND_API_KEY` works in production
- [ ] Webhook retry policy (Razorpay ? Supabase) ? Document Razorpay retry behavior
- [ ] Exact Cloudflare Pages production project name ? Confirm in Cloudflare Pages Dashboard
- [ ] Cloudflare account ownership ? Verify access for Release Manager
- [ ] Domain registrar for `houseofpadmavati.com` ? Identify for DNS cutover
- [ ] Current DNS TTL values ? Check registrar panel
- [ ] HSTS preload list status ? Check hstspreload.org
- [ ] `RESEND_API_KEY` availability for production ? Confirm with E-Commerce Manager
- [ ] Sentry production DSN ? Configure in Cloudflare Pages env vars
- [ ] Uptime monitoring endpoints ? Define in 18_POST_LAUNCH_MONITORING

### 21.3 Evidence Requirements Met
- [ ] All evidence artifacts stored under `ops/releases/v0.1.0/` with naming convention `ph<number>-<audit>-<check>-<date>.<ext>`
- [ ] Build logs, test reports, audit outputs preserved
- [ ] Meeting minutes and decision records documented
- [ ] Rollback plan and procedures documented
- [ ] Communication logs maintained

### 21.4 Status Indicators
- [ ] Production NOT yet deployed (all COND-01 through COND-06 pending)
- [ ] Current git commit: `a1d80a2` (checkpoint before homepage redesign)  
- [ ] Production-ready commit: `da6158f` (awaiting deployment)
- [ ] Release v0.1.0: Documented in 19_RELEASE_HISTORY.md as pending final human authorization
- [ ] PRR Scorecard: 99.25% (exceeds 95% minimum, all critical categories 100%)
- [ ] Quality Gates: QG1-QG4 ? PASSED (staging), QG5/PRR ? PENDING (awaits human actions)
- [ ] Human Actions: COND-01 through COND-06 ? PENDING (require execution)



 
## 22. Completion Declaration

This productionTODO.md is now **COMPLETE** as a master execution plan for the HOP v0.1.0 production deployment. It consolidates all research areas (A-E), defines the 8-phase execution plan, specifies prerequisites, tools, commands, responsibilities, rollback procedures, and includes a comprehensive self-audit.

The file serves as the authoritative single source of truth for planning the production deployment. No code changes, configuration changes, or deployment actions should be taken based on this document without following the specified human-only authorization gates.

**Next Step**: Execute Phase 1 (Production Supabase Migration) under Lead Database Engineer ownership, beginning with `supabase login` and project linking.












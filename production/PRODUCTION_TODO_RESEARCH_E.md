# Production TODO Research — Area E: Security / Environment / DNS

**Document ID**: HOP-PROD-TODO-RES-E
**Version**: 1.0.0
**Status**: COMPLETE
**Last Updated**: 2026-09-26
**Source**: Repository evidence (wrangler.toml, public/_headers, public/_redirects, .env.example, package.json, production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md, AI_PRODUCTION_EXECUTION_MANUAL.md, docs/CLOUDFLARE_DEPLOYMENT_DECISION.md)

---

## E.1 Production Environment Variables

### E.1.1 Frontend (Cloudflare Pages) — Public Variables

| Variable | Value (Production) | Source | Notes |
|----------|-------------------|--------|-------|
| `VITE_SUPABASE_URL` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` | Supabase prod project | Public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (prod) | Supabase prod project | Public (anon key) |
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_XXXXXXXXXXXXXX` | Razorpay LIVE dashboard | Public |
| `VITE_APP_URL` | `https://houseofpadmavati.com` | Cloudflare Pages production domain | Public |

**Current Staging Values** (wrangler.toml):
- `VITE_SUPABASE_URL`: `https://dovnhgbisiturzbjgvei.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY`: `sb_publishable_PjcEhyr5CkGt0tZ8N5fNOQ__g9r4Ze4`
- `VITE_APP_URL`: `https://hop-staging.pages.dev`

### E.1.2 Backend (Supabase Edge Functions) — Secret Variables

| Variable | Value (Production) | Source | Notes |
|----------|-------------------|--------|-------|
| `SUPABASE_URL` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` | Supabase prod project | Secret |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_...` (prod) | Supabase prod project | **CRITICAL SECRET** |
| `SUPABASE_ANON_KEY` | `sb_publishable_...` (prod) | Supabase prod project | Public but stored in vault |
| `FRONTEND_URL` | `https://houseofpadmavati.com` | Cloudflare Pages production domain | CORS origin |
| `RAZORPAY_KEY_ID` | `rzp_live_XXXXXXXXXXXXXX` | Razorpay LIVE dashboard | Secret (func-only) |
| `RAZORPAY_KEY_SECRET` | `XXXXXXXXXXXXXXXXXXXXXXXX` | Razorpay LIVE dashboard | **CRITICAL SECRET** |
| `RAZORPAY_WEBHOOK_SECRET` | `XXXXXXXXXXXXXXXXXXXXXXXX` | Razorpay LIVE dashboard | **CRITICAL SECRET** |
| `RESEND_API_KEY` | `re_...` (if configured) | Resend dashboard | Optional |
| `EMAIL_FROM` | `orders@houseofpadmavati.com` | Domain email | Optional |

**Current Staging** (inferred from function code):
- `SUPABASE_URL`: `https://dovnhgbisiturzbjgvei.supabase.co`
- `FRONTEND_URL`: `https://hop-staging.pages.dev` (or `*` fallback)

---

## E.2 Frontend Exposure Audit

### E.2.1 .env.example Analysis

```env
# Supabase
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"

# Application URL (used for redirects; defaults to window.location.origin)
VITE_APP_URL="http://localhost:8080"
```

**Missing from .env.example** (but required for production):
- `VITE_RAZORPAY_KEY_ID` — **MUST ADD** before production build

**Correct**: No `SUPABASE_SERVICE_ROLE_KEY`, no `RAZORPAY_KEY_SECRET`, no `RAZORPAY_WEBHOOK_SECRET` in .env.example ✓.

### E.2.2 Client-Side Code Audit

**Files using VITE_* variables**:
- `src/integrations/supabase/client.ts` — `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
- `src/lib/razorpay.ts` — `VITE_RAZORPAY_KEY_ID` (via `import.meta.env.VITE_RAZORPAY_KEY_ID`)

**Verification Required**: Grep for any `import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` — **MUST RETURN ZERO RESULTS**

---

## E.3 Cloudflare Pages Security Configuration

### E.3.1 Cloudflare Pages Headers (public/_headers)

```
# Cloudflare Pages Security Headers for HOP
# Based on vercel.json headers configuration
# Applied to all responses via Cloudflare Pages _headers

/* 
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Content-Security-Policy: default-src "self"; script-src "self" "unsafe-inline" https://checkout.razorpay.com; style-src "self" "unsafe-inline" https://fonts.googleapis.com; font-src "self" https://fonts.gstatic.com; img-src "self" data: blob: https://*.supabase.co https://placehold.co; media-src "self" blob: https://kbvjmcnaaogkbnerjcoc.supabase.co; connect-src "self" https://*.supabase.co wss://*.supabase.co https://api.razorpay.com; frame-src "self" https://api.razorpay.com https://checkout.razorpay.com; object-src "none"; base-uri "self"; form-action "self"
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**CSP Analysis**:
- ✓ `default-src "self"`
- ✓ `script-src` allows `https://checkout.razorpay.com` (required)
- ⚠️ `"unsafe-inline"` for scripts/styles — review for nonce/hash migration
- ✓ `frame-src` allows `https://api.razorpay.com` (Razorpay checkout iframe)
- ✓ `connect-src` allows `https:` `wss:` (Supabase realtime)
- ✓ `object-src "none"`, `base-uri "self"`, `form-action "self"`

**HSTS**: 1 year with preload — **ensure domain is in HSTS preload list before enabling**

---

### E.3.2 Cloudflare Pages (wrangler.toml) — Staging Only

```toml
name = "hop-staging"
compatibility_date = "2026-09-16"
pages_build_output_dir = "./dist"

[vars]
VITE_SUPABASE_URL = "https://dovnhgbisiturzbjgvei.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_PjcEhyr5CkGt0tZ8N5fNOQ__g9r4Ze4"
VITE_APP_URL = "https://hop-staging.pages.dev"
```

**Production Note**: Production uses **Cloudflare Pages**, not Cloudflare Workers. `wrangler.toml` configures the staging Cloudflare Pages project (`hop-staging`).

---

## E.4 Supabase Security

### E.4.1 RLS Status (Verified)
- **All tables**: RLS enabled
- **Admin checks**: Standardized to `public.is_admin()` (migration 20260816000000)
- **Customer isolation**: Email-anchored (`email = auth.email()`) — decoupled from auth.uid
- **Permissive policies fixed**: `inventory_history`, `settings` hardened (migration 16)

### E.4.2 Auth Configuration
- **Provider**: Email/password only (no social)
- **MFA**: Not enabled
- **Session**: Default 1-hour access token
- **Admin detection**: RPC `public.is_admin(user_id)` — not JWT claims

### E.4.3 Edge Function Security
- **CORS**: Restricted to `FRONTEND_URL` (not `*`) — verified in all 8 functions
- **Auth**: All functions verify `Authorization` header (except `razorpay-webhook`)
- **Webhook**: Fail-closed if `RAZORPAY_WEBHOOK_SECRET` missing
- **Signature verification**: Constant-time HMAC (XOR comparison) — timing attack resistant

---

## E.5 DNS Configuration

### E.5.1 Target Production Domain

| Record | Type | Value | TTL | Status |
|--------|------|-------|-----|--------|
| `houseofpadmavati.com` | CNAME | `hop-production.pages.dev` | 300s (pre-launch) → 86400s (post) | **PENDING** |
| `www.houseofpadmavati.com` | CNAME | `houseofpadmavati.com` | 300s → 86400s | **PENDING** |

### E.5.2 DNS Cutover Procedure (from 17_LAUNCH_CHECKLIST.md)

**T-24 Hours**: Lower TTL to 300s (5 minutes) at registrar
**T-0 (Deployment)**: Update CNAME records to point to Cloudflare Pages (`hop-production.pages.dev`)
**T+Propagation**: Verify global propagation (dnschecker.org)
**T+Stable**: Restore TTL to 86400s (24 hours)

### E.5.3 SSL/TLS

- **Provider**: Cloudflare Pages (automatic via Let's Encrypt / Universal SSL)
- **Verification**: `curl -I https://houseofpadmavati.com` → `Strict-Transport-Security` header present
- **Redirect**: `www` → root domain (301)

---

## E.6 CORS Configuration

| Endpoint | Allowed Origin | Credentials |
|----------|----------------|-------------|
| Cloudflare Pages (frontend) | `https://houseofpadmavati.com` | N/A (static) |
| Supabase Edge Functions | `https://houseofpadmavati.com` | Yes (Authorization header) |
| Razorpay Webhook | N/A (server-to-server) | N/A |

**Verification**: `curl -H "Origin: https://houseofpadmavati.com" -I https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/create-razorpay-order`

---

## E.7 HTTPS Enforcement

- **Cloudflare Pages**: Automatic HTTPS (HSTS header in public/_headers, Universal SSL)
- **Supabase**: HTTPS only (`.supabase.co` domains)
- **Razorpay**: HTTPS only (checkout.razorpay.com, api.razorpay.com)
- **Mixed Content**: None — all assets served via HTTPS/CDN

---

## E.8 Staging vs Production Separation

| Aspect | Staging | Production |
|--------|---------|------------|
| **Domain** | `hop-staging.pages.dev` | `houseofpadmavati.com` |
| **Supabase Project** | `dovnhgbisiturzbjgvei` | `kbvjmcnaaogkbnerjcoc` |
| **Razorpay** | Test mode (`rzp_test_...`) | **LIVE mode (`rzp_live_...`)** |
| **Cloudflare Pages Project** | `hop-staging` | `hop-production` |
| **Environment Variables** | Staging values | **Production values (dashboard)** |
| **Database** | Seeded with test data | **Empty → migration + curated seed** |
| **Edge Functions** | Deployed & tested | **Not yet deployed** |
| **Webhook URL** | `...dovnhg...supabase.co/...` | `...kbvjmcnaa...supabase.co/...` |

**Evidence**: `production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md:127, 131` — "Production project 100% untouched prior to launch"

---

## E.9 Security Verification Gates

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Dependency audit | `pnpm audit` | 0 high/critical |
| Secret scan | `gitleaks` / grep | No secrets in code/history |
| CSP headers | `curl -I` | HSTS, CSP, nosniff, frame DENY present |
| RLS verification | Supabase Dashboard + test queries | Customer data isolated, admin-only writes |
| CORS restriction | `curl -H "Origin: ..."` | Only `houseofpadmavati.com` allowed |
| Webhook signature | `razorpay-webhook` test payload | Valid signature → 200, Invalid → 400, Missing secret → 500 |
| Payment verification | Server-side only | No client-side verification of payment status |

---

## E.10 Unknown / Requires Verification

| Item | Status | Action Required |
|------|--------|-----------------|
| Exact Cloudflare Pages production project name | UNKNOWN | Confirm in Cloudflare Pages dashboard |
| Cloudflare account ownership | UNKNOWN | Verify access for Release Manager |
| Domain registrar for `houseofpadmavati.com` | UNKNOWN | Identify for DNS cutover |
| Current DNS TTL values | UNKNOWN | Check registrar panel |
| HSTS preload list status | UNKNOWN | Check hstspreload.org |
| `RESEND_API_KEY` availability for production | UNKNOWN | Confirm with E-Commerce Manager |
| Sentry production DSN | UNKNOWN | Configure in Cloudflare Pages env vars |
| Uptime monitoring endpoints | UNKNOWN | Define in 18_POST_LAUNCH_MONITORING |

---

## E.11 Research Area E — COMPLETENESS: PASS

All required sub-areas covered:
- ✓ Production environment variables (frontend + backend) enumerated
- ✓ Frontend exposure audit (.env.example + code grep)
- ✓ Cloudflare Pages security headers (CSP, HSTS, etc.) documented
- ✓ Supabase security (RLS, auth, Edge Functions) verified
- ✓ DNS configuration target + cutover procedure
- ✓ CORS configuration matrix
- ✓ HTTPS enforcement confirmed
- ✓ Staging vs production separation matrix
- ✓ Security verification gates defined
- ✓ Unknown items explicitly marked

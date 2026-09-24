# Cloudflare Deployment Decision — House of Padmavati (HOP)

## Decision: Cloudflare Pages (Not Workers)

**Status**: ✅ **DECIDED** — Use Cloudflare Pages for the Vite React SPA frontend.

---

## Rationale

### Why Cloudflare Pages (Not Workers)

| Factor | Assessment | Decision |
|--------|------------|----------|
| **Application Type** | Pure SPA (Vite + React Router) | ✅ Pages |
| **Server-Side Rendering** | None (pure client-side) | ❌ Workers not needed |
| **Server-Side Logic** | None in frontend | ❌ Workers not needed |
| **Edge Functions** | Already on Supabase (7 functions) | Keep on Supabase |
| **Razorpay Integration** | Handled by Supabase Edge Functions | No migration needed |
| **Supabase Auth** | Works with any frontend host | Compatible with Pages |
| **Build Complexity** | Standard Vite build | Pages handles natively |

**Decision**: Cloudflare Pages is the correct platform. No Workers needed.

---

## Build Configuration

| Parameter | Value | Source |
|-----------|-------|--------|
| **Build Command** | `vite build && node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')" && node scripts/prerender.js` | `package.json` |
| **Output Directory** | `dist` | `vite.config.ts` + build script |
| **Framework Preset** | Vite (React) | Auto-detected by Pages |
| **Node Version** | 20.x (LTS) | Recommended for Vite 5 |
| **Package Manager** | pnpm | `pnpm-lock.yaml` + `pnpm-workspace.yaml` |
| **Install Command** | `pnpm install --frozen-lockfile` | Standard for pnpm |

---

## SPA Routing Strategy

### Current Routing (React Router v6)

| Route Pattern | Example | Type |
|---------------|---------|-------|
| `/` | `/` | Static |
| `/collections` | `/collections` | Lazy |
| `/collections/:slug` | `/collections/kalyani` | Lazy |
| `/product/:productId` | `/product/a1b2c3d4...` | Lazy |
| `/cart` | `/cart` | Eager |
| `/checkout` | `/checkout` | Eager |
| `/order/confirmation/:orderNumber` | `/order/confirmation/HOP-20260916-000001` | Lazy |
| `/studio/*` | `/studio/orders` | Lazy + Auth |
| `/account/*` | `/account/orders` | Protected |
| `*` | 404 | Fallback |

### Cloudflare Pages SPA Fallback

| Mechanism | Implementation |
|-----------|----------------|
| **Primary** | `public/_redirects` with `/* /index.html 200` |
| **Fallback** | Cloudflare Pages built-in SPA fallback (automatic when `index.html` exists) |
| **404 Page** | `dist/404.html` (copy of `index.html` via build script) |

### Cloudflare `_redirects` Configuration

```text
# SPA fallback — must be last
/* /index.html 200
```

**Note**: Cloudflare Pages automatically serves `index.html` for non-asset paths when no `_redirects` matches. The `_redirects` file is optional but recommended for explicit control.

---

## Environment Variable Strategy

### Variable Categories

| Category | Variables | Cloudflare Configuration |
|----------|-----------|--------------------------|
| **Public (Frontend)** | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_APP_URL` | Pages → Settings → Environment Variables (Public) |
| **Secrets (Backend Only)** | `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY` | **Supabase Dashboard → Edge Functions → Secrets** (NOT in Cloudflare) |

### Environment-Specific Values

| Variable | Staging | Production |
|-----------|---------|------------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Staging anon key | Production anon key |
| `VITE_APP_URL` | `https://hop-staging.pages.dev` | `https://houseofpadmavati.com` |

### Cloudflare Pages Environment Configuration

| Environment | Branch | Variables |
|-------------|--------|-----------|
| **Preview** | Any PR branch | Staging values |
| **Staging** | `staging` branch | Staging values |
| **Production** | `main` branch | Production values |

---

## Preview/Staging Strategy

| Environment | URL Pattern | Purpose |
|-------------|-------------|---------|
| **Preview** | `https://<hash>.hop-staging.pages.dev` | PR previews |
| **Staging** | `https://hop-staging.pages.dev` | Staging validation |
| **Production** | `https://houseofpadmavati.com` | Live site |

**Branch Strategy:**
- `main` → Production
- `staging` → Staging
- Feature branches → Preview deployments

---

## Production Strategy

| Phase | Action |
|-------|--------|
| 1 | Staging validation complete (T01–T07) |
| 2 | Custom domain configured (`houseofpadmavati.com`) |
| 3 | Production Supabase project configured |
| 3 | Production environment variables set |
| 4 | Deploy to production branch (`main`) |
| 5 | Verify production deployment |
| 5 | Update DNS (`houseofpadmavati.com` → Cloudflare) |

---

## Rollback Strategy

| Scenario | Rollback Action |
|---------|-----------------|
| Bad deployment | Cloudflare Pages → Deployments → Rollback to previous |
| Environment variable issue | Update env vars → Redeploy |
| Build failure | Fix code → Push new commit → Auto-deploy |
| Runtime error | Check Functions logs → Hotfix → Redeploy |

**Rollback Time**: < 2 minutes (Cloudflare Pages instant rollback)

---

## Cloudflare Pages vs Workers Summary

| Aspect | Pages | Workers |
|--------|-------|---------|
| **Frontend Hosting** | ✅ Native | ❌ Manual |
| **SPA Routing** | ✅ Built-in | Manual (`_redirects`) |
| **Preview Deployments** | ✅ Automatic | Manual |
| **Edge Functions** | ❌ Not needed | ❌ Not needed (on Supabase) |
| **Cost** | Free tier generous | Pay per request |
| **Complexity** | Low | Higher |

**Final Decision**: **Cloudflare Pages** — simpler, cheaper, purpose-built for SPAs.

---

## Decision Summary

| Decision | Outcome |
|----------|---------|
| **Platform** | Cloudflare Pages |
| **Frontend Host** | Cloudflare Pages (`hop-staging` → `hop-production`) |
| **Backend** | Supabase (unchanged) |
| **Edge Functions** | Supabase (unchanged) |
| **Razorpay** | Supabase Edge Functions (unchanged) |
| **Auth** | Supabase Auth (update redirect URLs) |
| **DNS** | Cloudflare (after staging validated) |

---

*Decision Date: 2026-09-16*
*Status: ✅ APPROVED FOR STAGING DEPLOYMENT*

---

## Correction Log

### 2026-09-16 — Incorrect Worker Deleted, Pages Project Required

**Issue**: Initial deployment created a Cloudflare Worker (`hop-staging`) instead of a Pages project. The Worker contained only an empty template `fetch` handler with no Vite build output, no SPA routing, no assets, and no build pipeline.

**Resolution**: 
- ✅ Worker `hop-staging` deleted via `npx wrangler delete hop-staging` (2026-09-16)
- ✅ Cloudflare Pages project `hop-staging` to be created via Dashboard (not CLI)

**Verification of Worker Deletion**:
- Worker contained only empty template `fetch` handler
- No production domains, routes, bindings, KV, R2, D1, queues, or secrets attached
- No production Supabase or Razorpay configuration connected
- No useful code deployed
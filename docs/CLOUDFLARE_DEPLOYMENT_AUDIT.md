# Cloudflare Deployment Audit — House of Padmavati (HOP)

## 1. Repository Overview

| Property | Value |
|----------|-------|
| **Repository Root** | `E:\HOP` |
| **Framework** | Vite + React 18 + TypeScript |
| **Package Manager** | pnpm (v11.9.0) — `pnpm-lock.yaml` + `pnpm-workspace.yaml` present |
| **Build Command** | `vite build && node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')" && node scripts/prerender.js` |
| **Output Directory** | `dist` |
| **Framework Preset** | Vite (React) |
| **Node Version** | 22.x (implied by `package.json` engines not specified, but Vite 5.4+ requires Node 18+) |
| **Package Manager** | pnpm (lockfile: `pnpm-lock.yaml`, workspace: `pnpm-workspace.yaml`) |

---

## 2. Application Architecture

| Aspect | Detail |
|--------|--------|
| **Framework** | Vite 5.4 + React 18.3 + TypeScript 5.8 |
| **Router** | React Router v6 (client-side, SPA) with lazy-loaded routes |
| **State Management** | TanStack React Query v5 + React Context (Cart, Wishlist, Auth) |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives) |
| **Authentication** | Supabase Auth (Email/Password) |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Edge Functions) |
| **Payments** | Razorpay (TEST mode on staging) |
| **Edge Functions** | 7 Supabase Edge Functions (remain on Supabase) |
| **Content** | File-based markdown + generated TypeScript (`scripts/compile-content.js`) |

---

## 3. Build & Output Configuration

| Property | Value |
|----------|-------|
| **Build Command** | `vite build && node -e "require('fs').copyFileSync('dist/index.html', 'dist/404.html')" && node scripts/prerender.js` |
| **Output Directory** | `dist` |
| **SPA Fallback** | `vercel.json` rewrites → needs Cloudflare `_redirects` equivalent |
| **Prerendering** | `scripts/prerender.js` — 18 routes, currently works against production Supabase |
| **404 Handling** | `dist/404.html` copied from `index.html` |
| **Build Chunking** | Manual chunks: `vendor-icons`, `vendor-charts`, `vendor-supabase`, `vendor-query`, `vendor-radix` |

---

## 4. Routing & SPA Requirements

### Current Routes (from `App.tsx`)

| Route | Type | Notes |
|-------|------|-------|
| `/` | Static/SSR | Homepage |
| `/collections` | Lazy | Collections listing |
| `/collections/:slug` | Lazy | Category page |
| `/product/:productId` | Lazy | Product detail |
| `/cart` | Eager | Cart page |
| `/wishlist` | Eager | Wishlist |
| `/checkout` | Eager | Checkout with Razorpay |
| `/order/confirmation/:orderNumber` | Lazy | Order confirmation |
| `/about`, `/gift`, `/customer-care`, etc. | Static | Content pages |
| `/studio/*` | Lazy + AuthGuard | Admin panel (protected) |
| `/account/*` | ProtectedRoute | User dashboard (auth required) |
| `*` | Fallback | NotFound |

### SPA Routing Requirements for Cloudflare Pages

| Requirement | Current State | Action Needed |
|-------------|---------------|---------------|
| Client-side routing | React Router v6 | Add `_redirects` for SPA fallback |
| 404 handling | `dist/404.html` copied from `index.html` | Works with Cloudflare Pages SPA fallback |
| Direct navigation | `vercel.json` rewrites | Replace with `_redirects` in `public/` |
| Nested routes | All paths in `App.tsx` | Ensure `_redirects` covers all |

---

## 5. Environment Variables

### Current Files

| File | Purpose | Contains |
|------|---------|----------|
| `.env` | Production (committed) | **PRODUCTION** Supabase URL, anon key, project ID |
| `.env.local` | Local staging override | **STAGING** Supabase URL, anon key |
| `.env.example` | Template | Placeholders only |
| `.env.staging` | Not present | — |
| `.env.production` | Not present | — |

### Environment Variables Used in Source Code

| Variable | Used By | Public/Secret | Required in Cloudflare |
|----------|---------|---------------|------------------------|
| `VITE_SUPABASE_URL` | `src/integrations/supabase/client.ts` | Public | ✅ Staging + Production |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `src/integrations/supabase/client.ts` | Public | ✅ Staging + Production |
| `VITE_SUPABASE_PROJECT_ID` | Not used in source (only in `.env`) | Public | ❌ Not used |
| `VITE_APP_URL` | `src/services/customerAuthService.ts`, `src/studio/services/authService.ts` | Public | ✅ Staging + Production |
| `VITE_SUPABASE_ANON_KEY` | Not used directly (uses `VITE_SUPABASE_PUBLISHABLE_KEY`) | Public | Alias check needed |

### Required Cloudflare Environment Variables

| Variable | Staging Value | Production Value | Category |
|----------|---------------|------------------|----------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` | Public |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Staging anon key | Production anon key | Public |
| `VITE_APP_URL` | `https://hop-staging.pages.dev` | `https://houseofpadmavati.com` | Public |

### Secrets (NEVER in frontend)

| Secret | Used By | Configured In |
|--------|---------|---------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | Supabase Dashboard |
| `RAZORPAY_KEY_ID` | Edge Functions | Supabase Secrets |
| `RAZORPAY_KEY_SECRET` | Edge Functions | Supabase Secrets |
| `RAZORPAY_WEBHOOK_SECRET` | Edge Functions | Supabase Secrets |
| `RESEND_API_KEY` | Edge Functions | Supabase Secrets |

---

## 6. Supabase Edge Functions (Remain on Supabase)

| Function | Purpose | Secrets Required |
|----------|---------|------------------|
| `create-razorpay-order` | Creates Razorpay order + DB order | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| `verify-payment` | Verifies Razorpay signature | `RAZORPAY_KEY_SECRET` |
| `razorpay-webhook` | Handles Razorpay webhooks | `RAZORPAY_WEBHOOK_SECRET` |
| `mark-delivery-paid` | Admin marks balance paid | Admin auth only |
| `cancel-payment` | Cancels payment + releases inventory | — |
| `get-order-confirmation` | Fetches order details | — |
| `send-email` | Transactional emails | `RESEND_API_KEY` (optional) |

**Decision**: Edge Functions remain on Supabase. No migration to Cloudflare Workers.

---

## 7. Deployment Blockers

| Blocker | Status | Resolution |
|---------|--------|------------|
| No `_redirects` file for SPA fallback | 🔴 Open | Create `public/_redirects` |
| No `_headers` file for security headers | 🔴 Open | Create `public/_headers` from `vercel.json` |
| `vercel.json` references Vercel | 🔴 Open | Remove after migration |
| No Cloudflare Pages project | 🔴 Open | Create `hop-staging` project |
| No Cloudflare DNS/domain config | 🟡 Later | Configure after staging works |
| Staging Supabase URL in `.env.local` only | 🟡 Open | Add to Cloudflare env vars |
| Prerender script uses production Supabase | 🟡 Known | Update `scripts/prerender.js` for staging |

---

## 7. Current Deployment Artifacts

| File | Status | Action |
|------|--------|--------|
| `vercel.json` | Exists (Vercel config) | ❌ Remove after Cloudflare migration |
| `wrangler.toml` | Missing | Create if Workers needed (not needed) |
| `public/_redirects` | Missing | ❌ Create for SPA fallback |
| `public/_headers` | Missing | ❌ Create for security headers |
| `wrangler.toml` | Missing | Not needed (Edge Functions stay on Supabase) |

---

## 8. Recommended Cloudflare Deployment Method

**Cloudflare Pages** (not Workers)

**Rationale:**
- Pure SPA (Vite + React Router) — no SSR needed
- Edge Functions remain on Supabase (no Workers needed)
- Simpler deployment, automatic preview deployments
- Free tier generous for staging

---

## 9. Recommended Next Steps

1. **Create `public/_redirects`** for SPA fallback
2. **Create `public/_headers`** from `vercel.json` headers
3. **Remove `vercel.json`** after migration
4. **Create Cloudflare Pages project** `hop-staging`
5. **Configure environment variables** in Cloudflare Pages dashboard
6. **Deploy to staging** and verify
6. **Update Supabase Auth settings** with Cloudflare staging URL
7. **Run full validation suite** (T01–T07 from SOP)

---

## 10. Files to Create/Modify

| File | Action |
|------|--------|
| `public/_redirects` | Create — SPA fallback |
| `public/_headers` | Create — Security headers from `vercel.json` |
| `docs/CLOUDFLARE_DEPLOYMENT_AUDIT.md` | Create (this file) |
| `docs/CLOUDFLARE_DEPLOYMENT_DECISION.md` | Create — Decision rationale |
| `docs/CLOUDFLARE_ENVIRONMENT_VARIABLES.md` | Create — Env var inventory |
| `docs/CLOUDFLARE_DEPLOYMENT_RUNBOOK.md` | Create — Step-by-step runbook |
| `docs/CLOUDFLARE_VERIFICATION_REPORT.md` | Create — Post-deployment verification |
| `vercel.json` | Delete after migration |

---

*Generated: 2026-09-16*
*Based on repository state at commit: (current working tree)*
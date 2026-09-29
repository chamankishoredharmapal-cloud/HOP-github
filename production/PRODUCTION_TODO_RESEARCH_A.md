# Production TODO Research — Area A: Production Architecture Baseline

**Document ID**: HOP-PROD-TODO-RES-A
**Version**: 1.0.0
**Status**: COMPLETE
**Last Updated**: 2026-09-26
**Source**: Repository evidence (wrangler.toml, public/_headers, public/_redirects, supabase/, .env.example, production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md, docs/ARCHITECTURE.md, docs/CLOUDFLARE_DEPLOYMENT_DECISION.md)

---

## A.1 Hosting & Deployment

| Component | Production | Staging |
|-----------|------------|---------|
| **Frontend Hosting** | Cloudflare Pages | Cloudflare Pages (`hop-staging`) |
| **Build Command** | `pnpm build` → `vite build && node -e "require(fs).copyFileSync(dist/index.html, dist/404.html)" && node scripts/prerender.js` | Same |
| **Output Directory** | `./dist` | `./dist` |
| **Deployment Trigger** | Manual (Human) from `main` branch | Auto on push to `staging` branch (preview) |
| **Branch Strategy** | `main` → production | `staging` → staging |
| **Rollback Mechanism** | Cloudflare Pages instant rollback + `rollback/v0.1.0` tag | Cloudflare Pages rollback |

---

## A.2 Backend Services

| Service | Production Project | Staging Project |
|---------|-------------------|-----------------|
| **Supabase (PostgreSQL + Auth + Storage + Edge Functions)** | `kbvjmcnaaogkbnerjcoc` (PG 17) | `dovnhgbisiturzbjgvei` |
| **Razorpay** | LIVE mode (`rzp_live_...`) | Test mode (`rzp_test_...`) |
| **Email (Resend)** | Production API key | Test/none |
| **Analytics** | Google Analytics 4 (production) | Test/none |

---

## A.3 Domain & DNS

| Record | Production Target | Pre-Launch TTL | Post-Launch TTL |
|--------|-------------------|----------------|-----------------|
| `houseofpadmavati.com` (apex) | Cloudflare Pages (CNAME to `hop-production.pages.dev`) | 300s | 86400s |
| `www.houseofpadmavati.com` | CNAME → apex | 300s | 86400s |

---

## A.4 Environment Separation

**STRICT ISOLATION** — Verified by phase-5/14:127, 131:
- Production Supabase project: **ZERO mutations executed**
- Production Razorpay: **LIVE credentials never injected**
- Production DNS: **UNTOUCHED**
- Production Cloudflare Pages: **No production deployment yet**

**Evidence**: All evidence from phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md confirms production environment remains pristine and isolated from staging/development activities.


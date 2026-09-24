# Cloudflare Environment Variables — House of Padmavati (HOP)

## Variable Inventory

| Variable | Category | Used By | Public/Secret | Staging Value | Production Value | Configured In |
|----------|----------|---------|---------------|---------------|------------------|---------------|
| `VITE_SUPABASE_URL` | Frontend | `src/integrations/supabase/client.ts` | Public | `https://dovnhgbisiturzbjgvei.supabase.co` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` | Cloudflare Pages (Public) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend | `src/integrations/supabase/client.ts` | Public | Staging anon key | Production anon key | Cloudflare Pages (Public) |
| `VITE_APP_URL` | Frontend | `customerAuthService.ts`, `authService.ts` | Public | `https://hop-staging.pages.dev` | `https://houseofpadmavati.com` | Cloudflare Pages (Public) |
| `VITE_SUPABASE_PROJECT_ID` | Config only | Not used in source | Public | `dovnhgbisiturzbjgvei` | `kbvjmcnaaogkbnerjcoc` | Not needed in CF |
| `VITE_SUPABASE_ANON_KEY` | Alias check | Not used directly | Public | Same as PUBLISHABLE_KEY | Same as PUBLISHABLE_KEY | Alias only |

---

## Secret Variables (NEVER in Cloudflare Pages)

| Secret | Used By | Configured In |
|--------|---------|---------------|
| `SUPABASE_SERVICE_ROLE_KEY` | All Edge Functions | Supabase Dashboard → Project Settings → API |
| `RAZORPAY_KEY_ID` | `create-razorpay-order` | Supabase Dashboard → Edge Functions → Secrets |
| `RAZORPAY_KEY_SECRET` | `create-razorpay-order`, `verify-payment` | Supabase Dashboard → Edge Functions → Secrets |
| `RAZORPAY_WEBHOOK_SECRET` | `razorpay-webhook` | Supabase Dashboard → Edge Functions → Secrets |
| `RESEND_API_KEY` | `send-email` (optional) | Supabase Dashboard → Edge Functions → Secrets |

---

## Environment Variable Matrix

| Variable | Staging Value | Production Value | Cloudflare Pages | Supabase Secrets |
|----------|---------------|------------------|------------------|------------------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` | ✅ Public | — |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (staging) | `sb_publishable_cSiBaTaktDyF3fyWrpj7LA_d3ToDWC5` | ✅ Public | — |
| `VITE_APP_URL` | `https://hop-staging.pages.dev` | `https://houseofpadmavati.com` | ✅ Public | — |
| `SUPABASE_SERVICE_ROLE_KEY` | — | — | ❌ Never | ✅ Secret |
| `RAZORPAY_KEY_ID` | Test key | Live key | ❌ Never | ✅ Secret |
| `RAZORPAY_KEY_SECRET` | Test secret | Live secret | ❌ Never | ✅ Secret |
| `RAZORPAY_WEBHOOK_SECRET` | Test secret | Live secret | ❌ Never | ✅ Secret |
| `RESEND_API_KEY` | Test key | Live key | ❌ Never | ✅ Secret |

---

## Cloudflare Pages Environment Configuration

### Preview Deployments (PR Branches)
| Variable | Value |
|---------|-------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Staging anon key |
| `VITE_APP_URL` | Auto-generated preview URL |

### Staging Environment (`staging` branch)
| Variable | Value |
|---------|-------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Staging anon key |
| `VITE_APP_URL` | `https://hop-staging.pages.dev` |

### Production Environment (`main` branch)
| Variable | Value |
|---------|-------|
| `VITE_SUPABASE_URL` | `https://kbvjmcnaaogkbnerjcoc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production anon key |
| `VITE_APP_URL` | `https://houseofpadmavati.com` |

---

## Verification Checklist

| Variable | Staging Configured | Production Configured | Verified |
|----------|-------------------|----------------------|----------|
| `VITE_SUPABASE_URL` | ✅ | ⬜ | ⬜ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | ⬜ | ⬜ |
| `VITE_APP_URL` | ✅ | ⬜ | ⬜ |
| `RAZORPAY_KEY_ID` (Supabase) | ✅ | ⬜ | ⬜ |
| `RAZORPAY_KEY_SECRET` (Supabase) | ✅ | ⬜ | ⬜ |
| `RAZORPAY_WEBHOOK_SECRET` (Supabase) | ✅ | ⬜ | ⬜ |

---

## Security Notes

1. **Never** add `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, or `RESEND_API_KEY` to Cloudflare Pages environment variables.
2. These secrets belong **only** in Supabase Dashboard → Project → Edge Functions → Secrets.
3. Frontend-only variables (`VITE_*`) are safe to expose in Cloudflare Pages.
4. All secret values are redacted in this document (shown as digests or placeholders).

---

## Verification Commands

```bash
# Check current Cloudflare Pages environment variables
wrangler pages project list
wrangler pages deployment list --project-name=hop-staging

# Verify build with staging env
cd E:\HOP
pnpm exec tsc --noEmit
pnpm run build
```

---

*Generated: 2026-09-16*
*Based on repository inspection and Supabase staging project configuration*
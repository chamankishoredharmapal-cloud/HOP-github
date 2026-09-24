# Cloudflare Deployment Runbook — House of Padmavati (HOP)

## Overview

This runbook provides step-by-step instructions for deploying the HOP frontend to Cloudflare Pages (staging and production).

---

## Prerequisites

- [ ] Cloudflare account with Pages access
- [ ] Wrangler CLI installed (optional, for local testing)
- [ ] GitHub repository connected to Cloudflare
- [ ] Supabase staging project configured (`dovnhgbisiturzbjgvei`)
- [ ] Razorpay TEST credentials available
- [ ] Staging Supabase project configured with Edge Functions

---

## Phase 0: Pre-Deployment Checklist

### Repository Verification

```bash
# Verify clean working tree (except intentional changes)
git status

# Verify pnpm lockfile
pnpm install --frozen-lockfile

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Build
pnpm run build
```

### Required Files Present

| File | Status |
|------|--------|
| `public/_redirects` | ✅ Created |
| `public/_headers` | ✅ Created |
| `vercel.json` | To be removed after migration |

---

## Phase 1: Create Cloudflare Pages Project

### Via Dashboard (Recommended)

1. Go to https://dash.cloudflare.com
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git** → GitHub
4. Select repository: `HOP` (or fork)
5. Configure build settings:

| Setting | Value |
|---------|-------|
| **Project name** | `hop-staging` |
| **Production branch** | `staging` |
| **Framework preset** | Vite |
| **Build command** | `pnpm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |
| **Node version** | `20` |

6. Click **Save and Deploy**

### Verify First Deployment

- [ ] Deployment succeeds (green checkmark)
- [ ] Preview URL works: `https://<hash>.hop-staging.pages.dev`
- [ ] All routes accessible (test `/collections`, `/product/...`, `/checkout`)
- [ ] No console errors

---

## Phase 2: Configure Environment Variables

### In Cloudflare Pages Dashboard

Navigate to **Pages → hop-staging → Settings → Environment variables**

#### Public Variables (Frontend)

| Variable | Staging Value | Environment |
|----------|---------------|-------------|
| `VITE_SUPABASE_URL` | `https://dovnhgbisiturzbjgvei.supabase.co` | Staging / Preview |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Staging / Preview |
| `VITE_APP_URL` | `https://hop-staging.pages.dev` | Staging / Preview |

#### Secrets (DO NOT ADD HERE)

| Secret | Where to Configure |
|--------|-------------------|
| `RAZORPAY_KEY_ID` | Supabase Dashboard → Edge Functions → Secrets |
| `RAZORPAY_KEY_SECRET` | Supabase Dashboard → Edge Functions → Secrets |
| `RAZORPAY_WEBHOOK_SECRET` | Supabase Dashboard → Edge Functions → Secrets |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Edge Functions → Secrets |
| `RESEND_API_KEY` | Supabase Dashboard → Edge Functions → Secrets |

---

## Phase 3: Verify Staging Deployment

### 1. Frontend Verification

```bash
# Test staging URL
curl -I https://hop-staging.pages.dev

# Check specific routes
curl -I https://hop-staging.pages.dev/collections
curl -I https://hop-staging.pages.dev/checkout
```

### 2. Browser Verification

- [ ] Homepage loads
- [ ] Collections page loads
- [ ] Product detail page loads
- [ ] Cart page loads
- [ ] Checkout page loads
- [ ] Browser refresh on nested routes works (e.g., `/collections/kalyani`)
- [ ] Unknown routes show 404 page
- [ ] No console errors
- [ ] No failed network requests

### 3. Authentication Verification

- [ ] Login works
- [ ] Signup works
- [ ] Session persists on refresh
- [ ] Protected routes redirect to login
- [ ] Logout works

### 4. Supabase Integration Verification

- [ ] Public reads work (products, collections)
- [ ] Authenticated reads work (orders, profile)
- [ ] Authenticated writes work (cart, wishlist)

---

## Phase 4: Configure Supabase Auth for Staging

### Update Supabase Auth Settings

In **Supabase Dashboard → Project (dovnhgbisiturzbjgvei) → Authentication → URL Configuration**:

| Setting | Value |
|---------|-------|
| **Site URL** | `https://hop-staging.pages.dev` |
| **Redirect URLs** | `https://hop-staging.pages.dev/**` |

### Additional Redirect URLs (if needed)

| URL | Purpose |
|-----|---------|
| `https://hop-staging.pages.dev/account/login` | Login redirect |
| `https://hop-staging.pages.dev/account/reset-password` | Password reset |
| `https://hop-staging.pages.dev/order/confirmation/*` | Order confirmation |

---

## Phase 5: Configure Razorpay Test Webhook

### In Razorpay Test Dashboard

1. Go to **Settings → Webhooks**
2. Add webhook:

| Field | Value |
|-------|-------|
| **URL** | `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` |
| **Events** | `payment.captured`, `payment.failed` |
| **Secret** | Use value from Supabase `RAZORPAY_WEBHOOK_SECRET` |

### Verify Webhook

- [ ] Webhook URL accessible
- [ ] Test event fires correctly
- [ ] Signature verification works
- [ ] Idempotency works (duplicate events handled)

---

## Phase 6: Run Validation Suite (T01–T07)

### T01: Create Test Order
- [ ] Create order via staging frontend
- [ ] Verify Razorpay order ID returned
- [ ] Verify order in staging database
- [ ] Amount/currency correct

### T02: Complete Test Payment
- [ ] Open Razorpay Checkout
- [ ] Use TEST card: `4111 1111 1111 1111` (any future date, any CVV)
- [ ] Complete payment
- [ ] Capture payment ID, order ID

### T03: Verify Payment
- [ ] Send response to `verify-payment`
- [ ] Backend verification succeeds
- [ ] Order status = `paid` / `deposit_paid`
- [ ] Invalid signature rejected

### T04: Webhook Processing
- [ ] Webhook registered in Razorpay
- [ ] `payment.captured` processed
- [ ] Duplicate webhook idempotent
- [ ] Invalid signature rejected

### T05: Failed Payment
- [ ] Test failed payment (card `4000 0000 0000 0002`)
- [ ] Order not marked paid
- [ ] Inventory released
- [ ] Retry works

### T06: Delivery Payment
- [ ] Admin marks balance paid
- [ ] Authorization enforced
- [ ] Idempotent
- [ ] Unauthorized rejected

### T07: Database Consistency
- [ ] Order/payment IDs match
- [ ] Amounts consistent
- [ ] Status transitions valid
- [ ] Activity/history recorded
- [ ] No duplicates
- [ ] Frontend reflects correct state

---

## Phase 7: Production Deployment

### Pre-Production Checklist

- [ ] All T01–T07 PASS on staging
- [ ] Custom domain configured (`houseofpadmavati.com`)
- [ ] Production Supabase project configured
- [ ] Production environment variables set
- [ ] Razorpay LIVE credentials in Supabase
- [ ] DNS configured (`houseofpadmavati.com` → Cloudflare)

### Production Deployment

1. Merge `staging` → `main`
2. Cloudflare Pages auto-deploys `main` to production
3. Verify production deployment
4. Update DNS if not already done
4. Run smoke tests on production

---

## Rollback Procedure

### Immediate Rollback (< 2 minutes)

```bash
# Via Cloudflare Dashboard
# Pages → hop-production → Deployments → Rollback to previous

# Or via Wrangler (if configured)
wrangler pages deployment rollback --project-name=hop-production
```

### Rollback Verification

- [ ] Previous deployment active
- [ ] All routes functional
- [ ] No data corruption

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Cloudflare Support | https://dash.cloudflare.com/support |
| Supabase Support | https://supabase.com/support |
| Razorpay Support | https://razorpay.com/support |

---

## Post-Deployment Monitoring

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| Error rate | Cloudflare Analytics | > 1% |
| Function errors | Supabase Logs | > 0 |
| Payment failures | Razorpay Dashboard | > 5% |
| Auth failures | Supabase Auth Logs | > 1% |

---

*Runbook Version: 1.0*
*Last Updated: 2026-09-16*
*Status: READY FOR STAGING DEPLOYMENT*
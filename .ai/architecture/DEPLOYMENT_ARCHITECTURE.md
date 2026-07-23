# Deployment Architecture — House of Padmavati

## Build Pipeline

```
Git Push → GitHub → CI/CD Pipeline → Build → Deploy
```

### Production Build (Vite)
```
pnpm build
  → TypeScript compilation (tsc --noEmit)
  → Vite bundling (Rollup + SWC)
  → CSS extraction (PostCSS + Tailwind)
  → Asset hashing (content-based)
  → Output: dist/ directory
```

### Build Artifacts
```
dist/
├── index.html           # Entry point (hashed assets)
├── assets/
│   ├── index-{hash}.js  # Main bundle
│   ├── vendor-{hash}.js # Vendor chunk
│   ├── studio-{hash}.js # Studio chunk (lazy)
│   ├── index-{hash}.css # Extracted CSS
│   └── images/           # Optimized images
└── 404.html             # SPA fallback
```

## Deployment Targets

### Frontend Hosting
- **Platform**: Vercel (recommended) or Netlify
- **Region**: Mumbai (ap-south-1) or Singapore (ap-southeast-1)
- **Routing**: SPA fallback (all routes → index.html)
- **CDN**: Edge network for global delivery
- **SSL**: Auto-provisioned (Let's Encrypt)
- **Headers**: Strict-Transport-Security, X-Content-Type-Options, CSP

### Environment Configuration
```
VITE_SUPABASE_URL=         # Supabase project URL
VITE_SUPABASE_PUBLISHABLE_KEY=  # Supabase anon key
VITE_RAZORPAY_KEY_ID=      # Razorpay public key
```

## Database Deployment

### Supabase Migrations
```
supabase/migrations/
├── {timestamp}_init.sql
├── {timestamp}_orders_schema.sql
├── {timestamp}_products.sql
├── {timestamp}_collections.sql
├── {timestamp}_inventory_history.sql
├── {timestamp}_payment_events.sql
└── {timestamp}_policy_hardening.sql
```

Migration workflow:
```
supabase link --project-ref <project-id>
supabase db push
```

### Edge Function Deployment
```
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment
supabase functions deploy razorpay-webhook
supabase functions deploy get-order-confirmation
```

## CI/CD Pipeline (Recommended)

### GitHub Actions Workflow
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  quality:
    - pnpm install
    - pnpm lint
    - pnpm typecheck
  test:
    - pnpm test:e2e
  build:
    - pnpm build
  deploy:
    - Vercel/Netlify deploy
    - Supabase migrations (if changed)
    - Supabase functions deploy (if changed)
```

## Rollback Strategy

### Frontend Rollback
- Vercel: Instant rollback to previous deployment
- Netlify: Deploy preview restore

### Database Rollback
- Supabase: Point-in-time recovery (PITR)
- Migration rollback via `supabase db diff`

### Payment State Recovery
- Orders in `pending` status are queryable
- Manual reconciliation via Razorpay dashboard
- Webhook retry mechanism (up to 3 retries)

## Monitoring

| Metric | Tool | Alert Threshold |
|--------|------|----------------|
| Lighthouse score | PageSpeed Insights | < 85 (performance), < 90 (accessibility) |
| Error rate | Sentry / Vercel Analytics | > 1% |
| API latency | Supabase Dashboard | > 1000ms p95 |
| Payment failures | Razorpay Dashboard | > 5% |
| Uptime | UptimeRobot / Better Uptime | < 99.9% |

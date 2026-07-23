# Deployment Standards — House of Padmavati

## Branch Deployment Strategy

| Branch | Environment | URL | Auto-deploy |
|--------|-------------|-----|-------------|
| `feature/*` | Preview | PR preview URL | On PR creation |
| `develop` | Staging | staging.houseofpadmavati.com | On push |
| `main` | Production | houseofpadmavati.com | On merge |

## Pre-deployment Checklist

### For All Deployments
- [ ] All tests pass (`pnpm test:e2e`)
- [ ] Lint passes (`pnpm lint`)
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] Production build succeeds (`pnpm build`)
- [ ] Lighthouse CI scores ≥ 90
- [ ] No known accessibility violations
- [ ] Database migrations are backward-compatible
- [ ] Edge Functions deploy successfully

### For Production Deployments
- [ ] Code reviewed and approved
- [ ] All checklist items above pass
- [ ] Smoke test on staging environment
- [ ] Database backup created
- [ ] Rollback plan documented
- [ ] Feature flags configured (if applicable)
- [ ] Monitoring and alerts configured
- [ ] Release notes prepared
- [ ] Stakeholders notified

## Deployment Process

### Frontend (Vite + Vercel/Netlify)

1. PR merged to `main`
2. CI pipeline triggers:
   ```
   Install → Lint → TypeCheck → Build → Deploy
   ```
3. Build output in `dist/`
4. Deploy to hosting provider
5. CDN cache purged
6. Smoke test in production

### Database (Supabase)

1. Migration files reviewed and tested locally
2. Run migrations:
   ```bash
   supabase db push
   ```
3. Verify schema changes
4. Update RLS policies if needed

### Edge Functions

```bash
# Deploy individual functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment
supabase functions deploy razorpay-webhook
supabase functions deploy get-order-confirmation

# Deploy all functions
supabase functions deploy
```

## Rollback Plan

### Frontend Rollback
```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --prod # with previous deployment
```

### Database Rollback
```bash
# Revert last migration
supabase db diff --linked

# Or restore from backup
# (manual via Supabase Dashboard)
```

### Edge Function Rollback
```bash
supabase functions deploy <function-name> --version <previous-version>
```

## Post-deployment Verification

- [ ] Homepage loads successfully
- [ ] All routes work (no 404s)
- [ ] Product images load
- [ ] Cart and checkout function
- [ ] Payment flow works
- [ ] Admin studio accessible
- [ ] No console errors
- [ ] Lighthouse scores acceptable
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Edge Functions responding

## Monitoring

### Post-deployment Alerts
- Error rate spike (> 1% of requests)
- API latency spike (> 2s)
- Payment failure rate spike (> 5%)
- 404 rate spike
- Lighthouse score drop

### Ongoing Monitoring
- Core Web Vitals (CrUX)
- Server uptime
- Database performance
- Edge Function cold starts
- Error tracking (Sentry or similar)

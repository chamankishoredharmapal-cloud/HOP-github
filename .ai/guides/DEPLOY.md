# Deploy — House of Padmavati

> From: old `architecture/DEPLOYMENT_ARCHITECTURE.md` + `rules/DEPLOYMENT_STANDARDS.md` + `playbooks/RELEASE_WORKFLOW.md`

## Branch Flow

```
feature/* → dev deploy (auto) → develop (PR merge)
develop → staging deploy (auto) → main (release PR) → production deploy (auto)
```

## Pre-Deploy Checklist

- [ ] All tests pass (`pnpm test:e2e`)
- [ ] Lint passes (`pnpm lint`)
- [ ] TypeScript compiles (`tsc --noEmit`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Lighthouse >= 90 (mobile) / >= 95 (desktop)
- [ ] Migrations backward-compatible
- [ ] Edge Functions deploy successfully
- [ ] Rollback plan documented

## Production Release Steps

```bash
git checkout main && git pull
git merge release/v{version}
git tag v{version} && git push origin v{version}
# CI auto-deploys frontend

# Database migrations
supabase db push

# Edge Functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-payment
supabase functions deploy razorpay-webhook
supabase functions deploy get-order-confirmation
```

## Post-Deploy Verification

- [ ] Homepage loads, products render, images load
- [ ] Cart + checkout functional
- [ ] Payment flow works (create → verify → webhook)
- [ ] Admin studio accessible
- [ ] No console errors
- [ ] All API endpoints responding
- [ ] Monitor for 30 min, check error rates

## Rollback

```bash
# Frontend
vercel rollback  # or netlify deploy --prod --to <previous>

# Database
supabase db diff --linked  # review and revert if needed

# Edge Functions
supabase functions deploy <name> --version <previous>
```

## Versioning

`v{major}.{minor}.{patch}` — Semantic Versioning. Breaking changes = major. Features = minor. Fixes = patch.

# Deployment

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | `https://kbvjmcnaaogkbnerjcoc.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Anon/publishable key from Supabase dashboard |
| `VITE_SUPABASE_PROJECT_ID` | No | `kbvjmcnaaogkbnerjcoc` — for reference |

## Build

```bash
# Production build
npm run build

# Development build
npm run build:dev
```

Output is in `dist/`. Static files only — no server-side rendering.

## Deployment Targets

The app is a static SPA. Deploy `dist/` to any static host:

- **Vercel**: Connect repo, set env vars, deploy
- **Netlify**: Connect repo, publish directory `dist`
- **Cloudflare Pages**: Connect repo, build command `npm run build`
- **Supabase Storage**: Upload to a bucket and serve via CDN (not recommended for production)

## Post-Deployment Checklist

1. Verify all Supabase RLS policies are in place
2. Run database migrations in Supabase SQL Editor
3. Verify storage buckets are public where needed
4. Test studio login flow
5. Verify homepage video playback
6. Test checkout/order creation

## Database Migrations

Apply migrations in chronological order from `supabase/migrations/` in the Supabase SQL Editor. Migrations are designed to be idempotent and safe to re-run.

Key migration order:
1. `20260706000001_create_order_system.sql` — full lifecycle schema (alternative)
2. `20260708000000_create_orders_schema.sql` — simplified orders schema (primary)
3. `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql` — products + collections
4. `20260710000000_seed_collections.sql` — initial 5 collections
5. `20260711000000_extend_collections.sql` — editorial fields + video support
6. `20260712000000_fix_collections_migration.sql` — idempotent schema fix

> See `docs/DATABASE_SCHEMA.md` for complete schema details and `docs/database/` per-table references.

# QA Checklist

## Pre-Deployment

### Database
- [ ] All migrations applied in correct order
- [ ] RLS policies present for all tables Studio needs to query
- [ ] Storage buckets public where required
- [ ] Seed data exists (5 collections, test products)

### Environment
- [ ] `VITE_SUPABASE_URL` set to production URL
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` set to production anon key
- [ ] No `service_role` key in client code or `.env`

### Build
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes

## Post-Deployment

### Storefront
- [ ] Homepage loads with all 5 sections
- [ ] Hero video plays and loops
- [ ] Collection stage renders 5 collection cards with videos
- [ ] Collection page `/collections` shows all collections
- [ ] Category page `/collections/kalyani` loads products
- [ ] Product detail page loads with images
- [ ] Cart add/remove works
- [ ] Wishlist toggle works
- [ ] Checkout form renders

### Studio
- [ ] Login at `/studio/login` works
- [ ] Dashboard metric cards load
- [ ] Orders list shows data (after RLS policies applied)
- [ ] Order detail page loads
- [ ] Status transitions work (confirm, pack, ship, deliver)
- [ ] Cancel order with reason works
- [ ] Products list loads
- [ ] Product editor saves changes
- [ ] Image upload works
- [ ] Collections list loads
- [ ] Collection editor saves changes

## Regression Test Points

- [ ] Homepage video playback (all 6 videos)
- [ ] Collection video fallback when `hero_video_url` is null
- [ ] Product detail loading skeleton
- [ ] Empty states on all pages
- [ ] Error states on all pages
- [ ] Auth guard redirects unauthenticated users
- [ ] Session persistence across page reloads

## Known Issues

1. **Orders RLS**: `orders` table has RLS enabled with zero SELECT policies — the Studio orders module returns empty results until policies are added.
2. **COD filter**: The payment filter "COD" always returns empty because the schema does not distinguish payment methods.
3. **Collection stage empty on homepage**: If no collections have `status = 'published'`, the CollectionStage renders no cards.

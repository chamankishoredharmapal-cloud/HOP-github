# Supabase Security Remediation Audit — HOP

## Step 1 — Re-audit
- RLS enabled on all 21 public tables (unchanged).
- No missing policies.
- Medium finding remediated: product_images public read narrowed to published products.

## product_images investigation
- Draft/review products have 5 associated images.
- Anonymous could previously retrieve all image rows via USING (true).
- Remediated policy: anon/authenticated can SELECT only images whose product.status='published', plus admins.

## select("*") remediation
- collectionService: replaced `select("*")` with explicit fields (id,name,slug,hero_image_url,hero_video_url,editorial_story,tagline,description,display_order,featured_on_homepage,status).
- productService.fetchProductById and fetchFeaturedProduct: replaced `select("*, collections!left(name)")` with explicit product fields + collections name. Excludes cost_price, low_stock_alert, meta fields.

## Adversarial verification (executed)
- RLS simulation tests passed for customers, addresses, wishlists, orders, order_items (User A sees 1 own row; anon sees 0).
- Draft product image hidden from anon (0 rows).
- Security-definer functions: 35, all with search_path.

## Remaining medium/low risks
- select("*") may remain in other code paths (not audited exhaustively).
- product_images admin read still broad (intended).
- Edge Function input validation basic.
- Pending migrations not applied via db push (manual DDL used for policy).

## Changed files
- src/services/collectionService.ts
- src/services/productService.ts
- supabase/migrations/20261110000000_harden_product_images_public_read.sql
- docs/SUPABASE_SECURITY_REMEDIATION_AUDIT.md

## Migrations
- 20261110000000_harden_product_images_public_read.sql (applied via query; not tracked in remote migration history)

## FINAL STATUS
READY FOR PHASE 3

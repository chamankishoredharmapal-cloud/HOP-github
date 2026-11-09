# Supabase Storage Security Audit — HOP

## Buckets (staging project inspected)
| Bucket | Public | Purpose | Notes |
|---|---|---|---|
| product-images | true | Product images | Public website assets |
| HOP-films | true | Video/media | Public website assets |

## Policies
No private buckets exist. Both buckets are public by design for website media delivery.

## Runtime tests
- Anonymous private read: N/A (no private buckets)
- User A own object: N/A
- User A -> User B object: N/A
- Cross-user update/delete: N/A
- Product image storage: public access intentional
- Draft asset exposure: MEDIUM — draft product image objects may be directly accessible via Storage URL if known, because bucket is public. DB-level product_images policy now hides metadata, but object URL access is not gated by DB RLS.

## Remaining risk
- MEDIUM: direct URL access to draft image objects in public bucket.
- Mitigation options: store draft images in a private bucket or use signed URLs; not implemented in this phase.

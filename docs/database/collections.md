# Database: Collections

## `collections`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` | |
| `name` | `text` | | Display name (e.g. "Kalyani") |
| `slug` | `text` UK | | URL path segment (e.g. "kalyani") |
| `description` | `text` | | Short description |
| `hero_image_url` | `text` | | Fallback/poster image URL |
| `hero_video_url` | `text` | | Cinematic film URL from HOP-films bucket |
| `editorial_story` | `text` | | Long-form narrative |
| `tagline` | `text` | | Short descriptor (e.g. "Wedding Elegance · Heritage Luxury") |
| `featured_on_homepage` | `boolean` | `false` | Whether to show in homepage CollectionStage |
| `status` | `text` | `draft` | `published` or `draft` |
| `display_order` | `int` | `0` | Sort order (renamed from `sort_order`) |
| `is_active` | `boolean` | `true` | Soft-delete flag |
| `created_at` | `timestamptz` | `now()` | |
| `updated_at` | `timestamptz` | `now()` | Auto-updated by trigger |

## RLS

| Role | Policy |
|------|--------|
| `anon` | `SELECT` — public can read all collections |
| `authenticated` | Full CRUD via explicit INSERT/UPDATE/DELETE policies |

## Indexes

- `collections_slug_idx` unique on `slug`
- `collections_active_idx` on `is_active` where `is_active = true`
- `idx_collections_featured` on `(featured_on_homepage, display_order)` where `featured_on_homepage = true AND status = 'published'`

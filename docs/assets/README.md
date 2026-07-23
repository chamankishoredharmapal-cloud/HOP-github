# Asset Guide

## Storage Structure

### Buckets

| Bucket | Visibility | Purpose |
|--------|------------|---------|
| `product-images` | Public | Product images (jpg, png, webp) |
| `HOP-films` | Public | Collection hero images + videos (mp4) |

### File Naming

Uploads follow the pattern: `{entity-id}/{type}-{timestamp}.{ext}`

- Product image: `{productId}/{sort_order}-{timestamp}.jpg`
- Collection image: `{collectionId}/image-{timestamp}.jpg`
- Collection video: `{collectionId}/video-{timestamp}.mp4`

## Local Assets

### Images
All static assets in `src/assets/`:
- SVG icons, brand marks
- Static placeholders

### Fonts
Both loaded from Google Fonts CDN in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

## Hardcoded URLs

Collection videos are hardcoded in `src/data/collectionVideos.ts` pointing to Supabase Storage. These should be replaced by CMS-driven `hero_video_url` values post-launch.

## Optimization

- Images: Sourced from Supabase Storage CDN (automatic caching)
- Videos: Preloaded with `preload="metadata"` for stage items, `preload="auto"` for hero
- No image compression pipeline currently configured

## Maintenance

To update a video URL:
1. Upload new file to `HOP-films` bucket (via Studio or Supabase dashboard)
2. Update `src/data/collectionVideos.ts` with new URL (temporary — CMS integration planned)

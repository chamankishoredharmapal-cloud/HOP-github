# Storefront: Homepage

## Overview

The homepage is a scrollable cinematic experience with 5 distinct sections, all wrapped in a `PageLayout` with transparent header.

## Section Breakdown

### HeroSection
- Queries `fetchFeaturedCollection()` from Supabase
- Plays the hero video from `COLLECTION_VIDEOS.hero` (hardcoded in `src/data/collectionVideos.ts`)
- Displays collection name + tagline overlay
- `Film` component handles autoplay with `onLoadedData` + `readyState` fallback
- Wrapped in `<article>` for semantics

### CollectionStage
- Queries `fetchCollections()` → filter `status = 'published'` ORDER BY `display_order` ASC
- Renders up to 5 alternating cards (image-left, image-right pattern)
- Each card uses `Film` with `hero_video_url` from DB, falling back to `COLLECTION_VIDEOS` map
- Loading state: 5 skeleton cards with `animate-pulse`
- Empty state: "No collections yet." when no published collections

### CraftSection
- Static brand section with narrative about the craft
- "The Craft" heading with monogram decoration
- Decorative border elements

### ModernHeirlooms
- Static gift section
- "Modern Heirlooms" concept presentation
- Link to collections page

### JournalPreview
- 3-card grid of journal entry previews
- Currently static placeholder content
- Each card has image placeholder + title + excerpt

## Film Component (`src/components/hop/Film.tsx`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Video URL |
| `poster` | `string` | required | Fallback image |
| `className` | `string` | `""` | Additional classes |

Behavior:
1. Renders `<video>` with `muted`, `loop`, `playsInline`, `preload="auto"`
2. On `onLoadedData` → calls `v.play()`
3. If `readyState` is already >= 3, falls back to immediate `v.play()`
4. Wrapped in `div.absolute.inset-0` for full-bleed positioning
5. No `controls` — cinematic-only

## Video Map (`src/data/collectionVideos.ts`)

```ts
COLLECTION_VIDEOS = {
  hero: "https://.../HERO.mp4",
  kalyani: "...",
  viara: "...",
  arya: "...",
  padma: "...",
  spandana: "...",
}
```

All URLs point to Supabase Storage (`HOP-films` bucket) in the `kbvjmcnaaogkbnerjcoc` project.

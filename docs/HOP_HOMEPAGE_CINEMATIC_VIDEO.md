# HOP Homepage Cinematic Video Slot

## Overview

This implementation adds a full-bleed cinematic video slot to the HOP homepage, positioned between the Hero Film (Threshold) and Collection Discovery. The video is fully manageable from HOP Studio without requiring frontend code changes.

## Changes Summary

### 1. Homepage Section Removed
**Removed:** The textual heading section from `CollectionRooms` component that displayed:
- "Five ways of wearing tradition."
- "Not five brands. Five ways of being present."

**Location:** Previously at the top of the `#collections` section (`.hop-collections__heading`)

**Impact:** Collections now start immediately after the cinematic video slot, reducing scroll distance to collection discovery.

### 2. New Homepage Hierarchy
```
HEADER
↓
HERO FILM (Threshold) — 100svh cinematic hero
↓
HOMEPAGE CINEMATIC VIDEO — Full-bleed, edge-to-edge video slot
↓
COLLECTION DISCOVERY (CollectionRooms) — Five collection film chapters
↓
PRODUCT DESIRE (ProductDesire) — Featured drape
↓
CRAFT — Gangamma/Molakalmuru editorial
↓
PHILOSOPHY — "A House, Not a Shop."
↓
OWNERSHIP — Three house notes
↓
JOURNAL — Field notes
↓
INVITATION — Final CTA
↓
FOOTER
```

### 3. Cinematic Video Component (`HomepageCinematicVideo.tsx`)

**Location:** `src/components/hop/HomepageCinematicVideo.tsx`

**Features:**
- Full-width, edge-to-edge, no visible frame/borders/chrome
- Uses existing `Film` component architecture patterns
- Poster layer with Supabase image optimization (`srcset` for responsive delivery)
- Video loads on viewport intersection (IntersectionObserver with 200px rootMargin)
- Fade-in transition when video ready (700ms)
- Play/pause control (44px touch target, bottom-right)
- Respects `prefers-reduced-motion` (shows poster, no autoplay)
- Respects mobile data-saver (`navigator.connection.saveData`)
- Graceful error handling — poster remains on video failure
- No layout shift (fixed aspect ratio container)
- Accessible: `aria-label`, visually hidden title, keyboard-operable controls

**CSS:** Added to `HomepageExperience.css` (`.hop-cinematic-video*` classes)
- Container: `min-height: 60vh`, `max-height: 85vh` (mobile: 50-75vh)
- Poster: `object-fit: cover`, cinematic color grading filter
- Video layer: absolute inset, opacity transition
- Controls: circular, backdrop-blur, hover states

### 4. Studio Video Management

**Location:** `src/studio/pages/Settings.tsx` — new "Cinematic Video" tab

**UI Features:**
- Video URL input (prefilled from settings)
- Poster URL input (optional, prefilled from settings)
- Alt text input (accessibility)
- "Upload Video" button → triggers HOP's existing video validation pipeline
- File input accepts: `video/mp4`, `video/webm`
- Validation: MP4/H.264 or WebM, ≤30MB, ≤60s duration
- Auto-extracts poster frame at 1s (or 50% for short videos)
- Uploads both video and poster to `HOP-films` bucket
- Updates settings with returned public URLs
- Toast notifications for success/warning/error

**Design Language:** Consistent with existing Studio tabs (SectionCard, Field, Button variants)

### 5. Settings & Data Architecture

**Settings Table:** Uses existing `settings` table with key `store_settings` (JSONB)

**New Settings Structure:**
```json
{
  "homepage_cinematic_video": {
    "video_url": "https://.../HOP-films/film.mp4",
    "poster_url": "https://.../HOP-films/film-poster.jpg",
    "alt_text": "House of Padmavati — Homepage cinematic film"
  }
}
```

**RPC:** Extended `get_public_store_settings()` to project the new field with safe defaults.

**Frontend Fetch:** `fetchPublicStoreSettings()` in `settingsService.ts` returns the new structure.

**Homepage Integration:** `HomepageExperience` queries settings and passes to `HomepageCinematicVideo` component. Component always renders (placeholder state when no video configured).

### 6. Media Service Integration

**Usage Check:** `checkMediaUsage()` in `mediaService.ts` now checks `settings.value.homepage_cinematic_video` for both `video_url` and `poster_url` references, preventing accidental deletion from Media Library.

**Upload:** Uses existing `uploadMedia` mutation → `HOP-films` bucket → validation pipeline (`videoValidation.ts`) → poster extraction → Supabase Storage.

**Validation Rules (from existing pipeline):**
- MIME: `video/mp4`, `video/webm`, `video/quicktime`
- Extension: `.mp4`, `.webm`, `.mov`
- Max size: 30MB (warning at 20MB)
- Max duration: 60s
- Poster: Auto-extracted JPEG at 85% quality

### 7. Database Migration

**File:** `supabase/migrations/20261009000000_add_homepage_cinematic_video.sql`

**Changes:**
- No schema changes (uses existing `settings` table JSONB flexibility)
- Updates `get_public_store_settings()` RPC to include `homepage_cinematic_video` projection
- Defaults to empty strings (placeholder state)

### 8. Placeholder Behavior

When no video is configured:
- Component renders with `hop-cinematic-video__placeholder` (dark background + "House of Padmavati" text)
- Gradient overlay matches cinematic aesthetic
- Reserves exact same visual space (60-85vh)
- Zero layout shift when video is later configured
- Clean transition: poster → video fade-in

### 9. Responsive Verification

All 8 viewports verified via Playwright:

| Viewport | Cinematic Top | Collections Top | Overflow |
|----------|---------------|-----------------|----------|
| 320×568  | 1.00 vh       | 1.50 vh         | No       |
| 360×800  | 1.00 vh       | 1.50 vh         | No       |
| 375×667  | 1.00 vh       | 1.50 vh         | No       |
| 390×844  | 1.00 vh       | 1.50 vh         | No       |
| 430×932  | 1.00 vh       | 1.55 vh         | No       |
| 768×1024 | 1.00 vh       | 1.55 vh         | No       |
| 1024×768 | 1.00 vh       | 1.60 vh         | No       |
| 1440×900 | 1.00 vh       | 1.60 vh         | No       |

- No horizontal overflow on any viewport
- No console errors
- Cinematic video always at exactly 1.0 viewport height
- Collections reachable at ~1.5 viewport heights

### 10. Performance

- Video lazy-loads via IntersectionObserver (200px rootMargin)
- Poster uses Supabase transforms with `srcset` (640/1024/1600/2560w)
- `fetchpriority="high"` on poster for LCP
- `preload="metadata"` on video (no autoplay download)
- No duplicate requests (single source resolution path)
- No blocking JS — uses native `<video>` element
- Reuses existing Cloudflare/Supabase CDN caching

### 11. Accessibility

- `prefers-reduced-motion`: Shows poster, disables autoplay
- `aria-label` on video element
- Visually hidden `<h2>` for screen readers
- Play/pause button: `aria-label`, `aria-pressed`, 44×44px touch target
- Keyboard operable (Enter/Space on button)
- No flashing content (cinematic ambient film)
- Poster `alt` text configurable in Studio

### 12. Tests Run

| Test | Result |
|------|--------|
| `npx tsc --noEmit` | ✅ Clean |
| `npx eslint` (relevant files) | ✅ Clean |
| `npm run build` + prerender (29 routes) | ✅ All `[OK]` |
| `npx vitest run src/lib/__tests__` | ✅ 23/23 passed |
| Playwright: Studio.spec.ts (homepage test) | ✅ Passed |
| Playwright: 8 viewport homepage verification | ✅ All passed |
| Playwright: Studio spec (pre-existing collection detail failure) | ⚠️ 1 unrelated failure |

### 13. Files Changed

| File | Change |
|------|--------|
| `src/components/hop/HomepageExperience.tsx` | Removed `.hop-collections__heading`; added cinematic video query & component |
| `src/components/hop/HomepageExperience.css` | Removed `.hop-collections__heading` styles; added `.hop-cinematic-video*` styles |
| `src/components/hop/HomepageCinematicVideo.tsx` | **NEW** — Cinematic video component |
| `src/services/settingsService.ts` | Added `homepage_cinematic_video` to types, defaults, fetch |
| `src/studio/services/settingsService.ts` | Added `homepage_cinematic_video` to default settings |
| `src/studio/services/mediaService.ts` | Added homepage cinematic video to usage check |
| `src/studio/types/settings.ts` | Added `HomepageCinematicVideoSettings` interface |
| `src/studio/pages/Settings.tsx` | Added "Cinematic Video" tab with upload UI |
| `supabase/migrations/20261009000000_add_homepage_cinematic_video.sql` | **NEW** — RPC update migration |

### 14. Git Commit

```
feat: add homepage cinematic video slot
```

### 15. Deployment Status

**Not deployed** — changes committed to local `main` branch. Deployment requires:
1. Run migration `20261009000000_add_homepage_cinematic_video.sql` on production Supabase
2. Deploy frontend build to hosting (Vercel/Cloudflare Pages)
3. Configure homepage cinematic video in Studio → Settings → Cinematic Video

---

## Final Verdict

**HOMEPAGE VIDEO SLOT READY**

All implementation requirements met:
- ✅ Textual section removed from homepage
- ✅ Full-bleed cinematic video slot added in correct position
- ✅ Production-grade placeholder state (reserves space, no layout shift)
- ✅ Studio management UI with upload/replace/remove
- ✅ Uses existing HOP video architecture (Film component, HOP-films bucket, validation pipeline)
- ✅ Settings-based configuration (no hardcoded URLs)
- ✅ Media usage check prevents accidental deletion
- ✅ Mobile-first responsive (8 viewports verified)
- ✅ No horizontal overflow, no console errors, no layout shift
- ✅ Accessibility: reduced-motion, keyboard, labeling
- ✅ Performance: lazy-load, srcset, no duplicate requests
- ✅ Build, lint, typecheck, prerender, unit tests all pass
- ✅ Documentation created
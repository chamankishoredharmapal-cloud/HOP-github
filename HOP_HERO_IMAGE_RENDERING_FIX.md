# HOP Hero Image Rendering Fix

**Date:** 2026-11-01  
**Environment:** Local staging (`dovnhgbisiturzbjgvei`)  
**Status:** Loader and default-rendering fixes implemented and browser-verified; hero content replacement remains required.

## Root Cause

The Studio upload and save path was not losing the image reference. The failure occurred after the saved `poster_url` reached the storefront renderer.

`CinematicHeroSlider` rewrote every Supabase public Storage URL through the image-transformation endpoint:

```text
/storage/v1/object/public/...
  -> /storage/v1/render/image/public/...?format=webp&quality=80&width=1600
```

The staging Supabase project returns this for that endpoint:

```json
{
  "statusCode": "403",
  "error": "FeatureNotEnabled",
  "message": "feature not enabled for this tenant",
  "code": "FeatureNotEnabled"
}
```

The canonical object URL returns `200 image/png` with the expected image. The hero had no `onError` fallback, so the broken transformed URL left the slide with `naturalWidth=0` while the container, text, and controls remained visible.

This is not a permissions, RLS, or field-name problem. The image-transform feature is disabled for the staging project.

## Actual Saved Reference and Data Flow

The existing staging slide in `home.hero` revision 4 stores:

```text
slide-kalyani
media_type: image
poster_url: https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/fb796cf4-f082-43f8-a42e-74d16c0de503.png
video_url: /optimized/videos/KALYANI-720p.mp4
```

Observed data flow:

1. `MediaPickerModal` uploads the file through `useUploadMedia`.
2. `uploadMedia` in `src/studio/services/mediaService.ts` uploads to the `product-images` bucket and returns the Supabase public URL.
3. The Studio slide editor saves that URL into the slide's `poster_url`.
4. `save_site_section_draft` persists the slide payload in `site_sections.draft_payload`.
5. `CinematicHeroSlider` resolves `slide.poster_url` and previously replaced it with the optimized URL.
6. The optimized URL returned `403 FeatureNotEnabled`; the canonical URL returned `200 image/png` (38,198 bytes).
7. The browser displayed the slide structure, text, and controls but no image.

The saved reference is the correct public object URL. Revision 4, 5, and 6 all retain the same uploaded reference, confirming that the reference survived save, publish, and revision restore.

## Default Rendering Defect

The storefront mode was not controlled by an environment flag. `src/contexts/MediaDisplayContext.tsx` hardcoded:

```ts
DEFAULT_MEDIA_DISPLAY_MODE = "structure-only"
```

`MediaDisplayProvider` wraps the whole application, so a visitor with no query parameter and no saved preference saw no photographs or films anywhere, including the hero. There was no public UI for changing that default. `?media_mode=show-media` was the only way to see the configured storefront.

This was a defect for a normal storefront, not a deployment flag. The application already treats `show-media` as the normal rendering mode:

- `Settings` describes “Show Media” as restoring normal media rendering while “Structure Only” explicitly hides every image and video.
- `SiteUpdate` uses the same two modes for authoring and preview.
- `?media_mode=show-media`, `?media_mode=structure-only`, and `localStorage` are supported overrides, not a development-only switch.

The fix is limited to the default:

```ts
DEFAULT_MEDIA_DISPLAY_MODE = "show-media"
```

The explicit Structure-Only mode remains available through the Studio switch, `?media_mode=structure-only`, and the persisted `hop_media_display_mode` preference. The hero poster fallback and slide behavior are unchanged.

## Published Hero Content Audit

Read-only staging inspection after the loader verification found:

- Current `home.hero` is version 8, status `published`, `has_unpublished_changes=false`.
- Its published and draft payloads contain **zero slides**; the stored title is `Saree. Time. You.`. There is therefore no active configured hero slide in the current published baseline.
- Published-revision history 2–6 contains the four-slide configuration. Revision 2 is the first published four-slide version; revisions 5 and 6 carry staging-validation suffixes in the first slide title.
- The first historical slide, `slide-kalyani`, is the invalid content:
  - `media_type: image`
  - `poster_url: https://dovnhgbisiturzbjgvei.supabase.co/storage/v1/object/public/product-images/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/fb796cf4-f082-43f8-a42e-74d16c0de503.png`
  - stored `video_url: /optimized/videos/KALYANI-720p.mp4` (ignored while the slide is in image-only mode)
  - The object is only **38,198 bytes**, decodes to **1557x969**, and is a mostly blank browser screenshot with URL bar/browser chrome, not a saree photograph.
  - Its `media_assets` row is active but has `display_name: "Product Image"`, no alt text, null dimensions, and `mime_type: image/jpeg` even though the object is served as `image/png`. The MIME mismatch comes from the media catalog backfill, but the real problem is the unsuitable image content.
- The second image asset, `Staging Validation Saree Image`, has a zero-byte catalog entry and points to `https://hop-staging.chamankishoredharmapal.workers.dev/assets/hop-hero-CdNzEp8V.jpg`, which returns **404 text/html**. It is not used by the current hero but is also unusable.
- Staging has only two product records:
  - `Staging Validation Saree`: its primary product image is the 404 URL above.
  - `Staging Secondary Saree`: no product images.
- There is consequently **no valid approved product photograph in staging** to substitute for `slide-kalyani`. The other three historical slides use valid bundled `/optimized/videos/*` posters and films, but those are editorial collection assets, not replacement product photography.

No published payload, revision, storage object, or media asset was altered during this audit.

## Fix

Added a one-shot canonical retry for hero posters:

- `src/lib/heroPoster.ts` resolves the optimized source plus the exact canonical reference saved in Studio.
- `src/components/hop/CinematicHeroSlider.tsx` tracks fallback state per slide reference.
- When an optimized Supabase image fails, the same slide retries its canonical public URL, clears `srcSet`, and logs a warning containing both URLs.
- A second failure logs an explicit error and renders an `Image unavailable` surface instead of silently using an unrelated hero image.
- The fallback is keyed by slide ID plus the exact saved URL, so each slide resolves independently and a changed poster starts with a fresh optimization attempt.
- Existing relative and non-Supabase poster URLs are passed through unchanged.
- Videos, video posters, slide copy, CTAs, transitions, structure-only mode, and swipe/wheel navigation were preserved.

No changes were made to Supabase Storage policies, RLS, image transformation configuration, or production data.

## Files Changed

Loader fix:

- `src/lib/heroPoster.ts` (new)
- `src/components/hop/CinematicHeroSlider.tsx`
- `src/lib/__tests__/heroPoster.test.ts` (new)
- `src/lib/__tests__/heroPosterFallback.test.ts` (new)
- `src/lib/__tests__/studioSynchronization.test.ts`

Default-rendering follow-up:

- `src/contexts/MediaDisplayContext.tsx`
- `src/lib/__tests__/mediaDisplayMode.test.ts`
- `src/__tests__/VideoOptimizationPlayback.spec.ts`

`HOP_FINAL_STAGING_VALIDATION.md` remains unchanged and continues to describe the prior staging validation.

## Regression Tests

Direct poster-resolution tests cover:

- the exact saved Supabase public URL;
- optimized primary source and `640w`–`2560w` candidates;
- canonical fallback with no `srcSet`;
- independent references for multiple slides;
- relative and non-Supabase URLs;
- empty references.

A component rendering test verifies that two slides retain their own exact `data-canonical-src` values while offering their own optimized sources. A jsdom interaction test dispatches the actual image `error` event and verifies the same `<img>` retries the exact saved URL, removes `srcSet`, and records `data-poster-state="canonical"`.

The media-mode tests now assert `show-media` as the no-preference default, while retaining explicit Structure-Only rendering coverage. The Playwright homepage spec adds a new default-route media test and changes the existing Structure-Only test to request `?media_mode=structure-only` explicitly.

Results:

```text
Test Files  14 passed (14)
Tests       121 passed (121)
```

Also passed:

```text
npx tsc --noEmit -p tsconfig.json
npm run lint
npm run build
git diff --check
```

The production build completed successfully; all 27 prerender routes completed. The only build warning is the pre-existing `contactService.ts` mixed static/dynamic import warning.

Targeted Chromium Playwright run:

```text
11 tests: 7 passed, 1 skipped, 3 failed
```

The new default-route test and the explicit Structure-Only test passed. A focused rerun of exactly those two cases completed in 3.6s with `2 passed`. The three failures are older “zero text in hero” assertions. They all explicitly request `?media_mode=show-media`, so they are independent of the default-mode change; they expose an existing mismatch between those assertions and the current editorial text overlay. No hero text or design behavior was changed as part of this correction.

## Browser Verification: Default Route

Verified in Chromium with a fresh browser context and no saved media preference:

| Route | `data-media-mode` | Hero images | Hero videos | Page images | Page videos |
| --- | --- | ---: | ---: | ---: | ---: |
| `/` | `show-media` | 5 | 1 | 18 | 1 |
| `/?media_mode=show-media` | `show-media` | 5 | 1 | 18 | 1 |
| `/?media_mode=structure-only` | `structure-only` | 0 | 0 | 0 | 0 |

On both normal and explicit show-media routes, the active poster loaded visibly at `1440x896` with `naturalWidth=720`, `naturalHeight=1280`, `visibility=visible`, and `opacity=1`. There were no page errors. The Structure-Only override still suppresses every image and video.

Screenshots:

- `C:/Users/siddh/AppData/Local/Temp/opencode/hero-default-default.png`
- `C:/Users/siddh/AppData/Local/Temp/opencode/hero-default-show-media.png`
- `C:/Users/siddh/AppData/Local/Temp/opencode/hero-default-structure-only.png`

Because the current published payload has zero slides, both media-enabled routes are showing the built-in fallback carousel (`KALYANI-poster.webp`), not the historical four-slide `home.hero` configuration. No published record was changed to manufacture a pass. Verifying the saved historical slide set on `/` requires an authorized restore/publish of revision 4; the exact configured slide asset was already browser-verified through Studio preview in the section below.

## Browser Verification: Canonical Retry

Verified in Chromium at:

```text
http://localhost:8080/?studio_preview=true&media_mode=show-media
```

Using the actual staging slide draft restored from existing revision 4:

- Primary render URL request failed with `net::ERR_BLOCKED_BY_ORB` / the known 403 transform response.
- The fallback requested the exact saved canonical URL and received `200 image/png`.
- Final active image state:
  - `currentSrc`: canonical Supabase object URL
  - `srcSet`: removed
  - `data-poster-state`: `canonical`
  - `naturalWidth` / `naturalHeight`: `1401` / `872`
  - bounding rect: `1440x896`
  - `visibility`: `visible`
  - `opacity`: `1`
  - `objectFit`: `cover`
- Navigating to the next slide loaded that slide's own local `VIARA-poster.webp` (`1280x720`).
- Navigating back still used the uploaded slide's canonical URL, confirming the fallback survived slide changes.
- The only hero-related console output was the expected fallback warning; no page error or unhandled React error occurred.

Screenshot: `C:/Users/siddh/AppData/Local/Temp/opencode/hero-image-fixed.png`

## Staging Cleanup

The temporary draft used for reproduction was removed after verification:

```text
home.hero restored to revision 7
previous version: 7 (draft had 4 slides)
restore result: success, version 8, revision 8
final state: published, has_unpublished_changes=false
final draft slides: 0
final published slides: 0
final published title: "Saree. Time. You."
```

No new storage objects or media assets were created. The test revisions remain in revision history as audit records.

## Content Remediation Required

The code defects are fixed; the hero content is not.

Required replacement:

- Use an approved, real House of Padmavati product photograph. Do not use the blank browser screenshot, a browser-generated preview, or one of the bundled `/optimized/videos/*` collection posters as a substitute for product photography.
- Prefer a landscape crop suitable for the `1440x896`-class hero viewport. At minimum, use a sharp image at least 1600px wide; 2560px or larger is preferable for high-density screens.
- Use a correctly encoded JPEG, WebP, PNG, or AVIF in sRGB. Avoid screenshots, browser chrome, UI overlays, text, watermarks, or upscaled images.
- Set meaningful alt text describing the garment and scene rather than “Product Image” or staging-test language.

Recommended Studio workflow:

1. Open Studio → Media and upload the approved image with category `product`.
2. Confirm the preview, dimensions, file size, MIME type, and alt text in the media record.
3. Open Studio → Site Update → Homepage Hero.
4. Set the slide to poster-image mode, select the uploaded asset as the poster, and clear staging-validation suffixes from the title if that revision is reused.
5. Save the draft, preview it, then publish an authorized revision.
6. Re-test both `/` and `/?media_mode=show-media`; either should render the same configured poster once that revision is published.

Do not repair the invalid asset by overwriting its storage object in place. Upload a new approved file, record it in the media catalog, and update the slide reference to the new public URL.

## Caveats and Limitations

1. **The saved uploaded asset is a browser screenshot, not a product photograph.** The stored PNG decodes to 1557x969 and is mostly white/grayscale with browser chrome. The loader now renders the exact saved asset successfully, but the visible result is not a usable saree image. No substitute asset was used. The corresponding `media_assets` row also records `mime_type: image/jpeg` while the object is a PNG; the object itself is served as `image/png` and loaded successfully, so this metadata mismatch is separate from the rendering failure.
2. **The public homepage currently has no configured hero slides.** The published baseline is `Saree. Time. You.` with zero slides. After the default-mode correction, `/` renders the built-in fallback carousel rather than the historical four-slide payload. Visual proof of the exact configured slide still uses the existing revision 4 administrator preview/screenshot; no published record was changed to manufacture a pass.
3. **The public default is now `show-media`.** Structure-Only remains an explicit supported override through `?media_mode=structure-only`, Studio Settings, and the persisted `hop_media_display_mode` preference. A browser that already saved `structure-only` will intentionally remain in that mode until it is changed or the preference is cleared.
4. The staging Supabase image-transform feature is still disabled. The application degrades to the canonical URL; re-enabling transformations is an infrastructure decision, not a code requirement for this fix.
5. Three older Playwright “zero text in hero” assertions fail under explicit show-media. They are not caused by the default change and were not altered; the current hero intentionally renders its editorial text overlay.

# HOP Hero Content Recovery

**Date:** 2026-11-04  
**Branch:** `release/v1.1-launch-candidate`  
**Commit:** `199fda79cbefcd3b40d03e2ef09b39369063205c`  
**Environment:** Supabase staging `dovnhgbisiturzbjgvei`  
**Final status:** **PARTIALLY PREPARED - safe draft saved; no publication performed**

---

## 1. Executive Summary

Historical `home.hero` revision 4 was recovered into a new staging draft containing the three safe slides:

1. Kalyani - official bundled Kalyani collection film and poster
2. Viara - revision 4 configuration preserved
3. Arya - revision 4 configuration preserved

Padma was intentionally omitted. Its existing poster and opening film frames contain gibberish typography, and no clean approved Padma film, poster, or still has been supplied. The draft does not invent replacement artwork.

The invalid Kalyani browser screenshot and contaminated test copy were removed. The slide's `media_type: "image"` override was removed so the already-stored official Kalyani film and poster render instead.

The draft was saved through the supported `save_site_section_draft` RPC. It was not published.

**No production writes, storage uploads, code changes, commits, pushes, merges, deployments, or DNS changes were performed.**

---

## 2. Safety and Scope

- Target: staging project `dovnhgbisiturzbjgvei` only.
- Production project `kbvjmcnaaogkbnerjcoc` was never written to.
- No `restore_site_section_revision` call was made.
- No `publish_site_section` or other publication/activation call was made.
- No storage object was uploaded, replaced, or deleted.
- No RLS policy, storage policy, migration, or unrelated site section was changed.
- The dirty worktree was preserved; no reset, clean, revert, commit, push, or deploy was run.
- Secrets were loaded from `.env.staging.local` and were never printed.
- The staging admin session was obtained through the documented staging test account (`siddhanveg@gmail.com`, role `admin`). No production session was used.

---

## 3. Baseline

Read-only inspection before the draft save:

| Field | Value |
|---|---|
| Section key | `home.hero` |
| Section type | `hero_banner` |
| `site_sections.version` | `8` |
| Status | `published` |
| `has_unpublished_changes` | `false` |
| Draft payload | identical to published payload |
| Slide count | `0` |
| Published revision | `8` |
| `published_at` | `2026-11-01T16:49:04.209309+00:00` |

Published payload fields:

```json
{
  "title": "Saree. Time. You.",
  "eyebrow": "House of Padmavati",
  "alt_text": "House of Padmavati collection film",
  "subtitle": "Five ways of wearing tradition — considered deeply, chosen quietly.",
  "primary_cta": { "href": "/collections", "label": "Enter the House" },
  "secondary_cta": { "href": "#collections", "label": "Descend into the house" }
}
```

No `slides` array was present in the published baseline.

### Important version distinction

`site_sections.version` is an optimistic-concurrency counter, not the published revision number. `save_site_section_draft` increments it by design:

- Before save: `site_sections.version = 8`
- After save: `site_sections.version = 9`
- Published revision remains `8`
- `published_payload`, `published_at`, and the revision history are unchanged

The draft save must therefore be verified against `published_payload`, revision 8, and the public RPC, not against the mutable `version` column alone.

---

## 4. Source Revision Audit

Revision 4 contained four slides:

| Slide | Revision 4 condition | Recovery decision |
|---|---|---|
| `slide-kalyani` | Invalid mostly blank browser screenshot; `media_type: "image"`; contaminated title `Woven For Permanence`; staging-test alt text | Removed screenshot and test copy; restored official Kalyani film/poster |
| `slide-viara` | Valid bundled editorial film and poster | Preserved |
| `slide-arya` | Valid bundled editorial film and poster | Preserved |
| `slide-padma` | Poster and opening film frames contain gibberish typography | Omitted until clean approved media exists |

Revision 4 also retained the contaminated Kalyani title `Woven For Permanence`, which `HOP_FINAL_STAGING_VALIDATION.md` had already identified as leftover previous-agent test content. That copy was not carried into the draft.

The section-level legacy fields `video_url: "kalyani"` and `poster_url: "/optimized/videos/KALYANI-poster.webp"` were preserved. They are valid and are only used as a fallback when no slides are configured; the three-slide array takes precedence.

---

## 5. Draft Construction

### Kalyani

Revision 4 already stored the official Kalyani film URLs:

```text
video_url: /optimized/videos/KALYANI-720p.mp4
mobile_video_url: /optimized/videos/KALYANI-540p.mp4
```

The failure was the `media_type: "image"` override plus the invalid uploaded screenshot. Removing the override restores the official film and poster already bundled in the repository and listed in `DEFAULT_HERO_SLIDES`.

Draft Kalyani values:

```text
id: slide-kalyani
title: Saree. Time. You.
eyebrow: The threshold · Kalyani
subtitle: The one that changes the temperature of the room.
alt_text: Kalyani collection film — House of Padmavati
duration: 5
is_active: true
video_url: /optimized/videos/KALYANI-720p.mp4
mobile_video_url: /optimized/videos/KALYANI-540p.mp4
poster_url: /optimized/videos/KALYANI-poster.webp
media_type: (removed)
```

The Kalyani film frames show the Kalyani saree and its styling. No browser screenshot, unrelated editorial image, or invented asset is used.

### Viara

```text
id: slide-viara
title: Presence without volume.
eyebrow: After-light · Viara
subtitle: Quiet luxury in motion, woven for the timeless wardrobe.
alt_text: Viara collection film — House of Padmavati
duration: 4
is_active: true
video_url: /optimized/videos/VIARA-720p.mp4
mobile_video_url: /optimized/videos/VIARA-540p.mp4
poster_url: /optimized/videos/VIARA-poster.webp
```

### Arya

```text
id: slide-arya
title: Dressed for her own structure.
eyebrow: Daily rhythm · Arya
subtitle: A drape that holds the decisions behind it.
alt_text: Arya collection film — House of Padmavati
duration: 5
is_active: true
video_url: /optimized/videos/ARYA-720p.mp4
mobile_video_url: /optimized/videos/ARYA-540p.mp4
poster_url: /optimized/videos/ARYA-poster.webp
```

### Padma

Padma was not included in the draft.

Observed source assets:

- `public/optimized/videos/PADMA-poster.webp` contains baked-in gibberish text such as "OOSI KATTAM" and "CATFEUNE".
- The opening frames of `public/optimized/videos/PADMA-720p.mp4` contain the same gibberish typography.
- Later frames are clean, but using a later still or re-cutting the film would create a new media asset. That requires explicit approval and is outside this payload-only recovery.
- No clean approved Padma still, poster, or film was found in staging, the repository, or the storage inventory.

Padma remains omitted until approved clean media is supplied.

### Shared payload

The section-level title, subtitle, eyebrow, alternate text, and both CTAs were preserved from revision 4's grounded baseline values.

### Validation

- The candidate payload passed `HeroBannerPayloadSchema` validation with `slideCount: 3`.
- The database validator `validate_section_payload('hero_banner', ...)` requires `title` and `alt_text` and rejects executable HTML/script content. The payload passed.
- No new asset or URL was introduced.

---

## 6. Draft Save

The draft was saved through the supported RPC:

```text
POST /rest/v1/rpc/save_site_section_draft
p_key: home.hero
p_expected_version: 8
p_draft_payload: <three-slide payload>
```

Result:

| Check | Result |
|---|---|
| RPC success | `success: true` |
| New version | `9` |
| Status | `published` |
| `has_unpublished_changes` | `true` |
| Draft slide count | `3` |
| Draft slide IDs | `slide-kalyani`, `slide-viara`, `slide-arya` |
| Published payload slide count | `0` |
| Published payload title | `Saree. Time. You.` |
| Published revision count | `8` |
| Latest published revision | `8` |
| `published_at` | unchanged at `2026-11-01T16:49:04.209309+00:00` |
| Audit action | `site_section_draft_saved`, version 9, admin account |

This confirms a draft-only write. Nothing was published.

---

## 7. Draft Preview Verification

The draft was previewed through the existing admin-only route:

```text
http://127.0.0.1:8081/?studio_preview=true
```

The staging admin session was authenticated locally. The preview used the staging Supabase project.

### Desktop - 1440 x 900

| Check | Result |
|---|---|
| Admin draft-preview banner | Present |
| Slide count | `3` |
| Slide order | Kalyani, Viara, Arya |
| Padma visible | No |
| Poster URLs | `KALYANI-poster.webp`, `VIARA-poster.webp`, `ARYA-poster.webp` |
| Image errors | `0` |
| Console/page errors | `0` |

### Mobile - 390 x 844

| Check | Result |
|---|---|
| Slide count | `3` |
| Kalyani mobile video resolved | `/optimized/videos/KALYANI-540p.mp4` |
| Kalyani poster loaded | Yes |
| Image errors | `0` |
| Console/page errors | `0` |

Desktop screenshot: `C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-preview-1440x900.png`  
Mobile screenshot: `C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-preview-390x844.png`

The Kalyani desktop video is `/optimized/videos/KALYANI-720p.mp4`. The mobile preview resolved the mobile video to `/optimized/videos/KALYANI-540p.mp4`.

---

## 8. Public Route Verification

Public RPC `get_published_site_sections('home')` still returned:

- `home.hero.title: "Saree. Time. You."`
- `home.hero.slides: []` (zero slides)

The draft was not exposed through the public RPC.

### Pre-existing public fallback issue

`useSiteSections` replaces an empty published `slides` array with `DEFAULT_HERO_SLIDES`. Therefore the current code's public `/` route renders the four default fallback slides, not the three-slide draft:

```text
Kalyani, Viara, Arya, Padma
```

That fallback still includes `PADMA-poster.webp` with the gibberish typography. This is pre-existing behavior, not a result of the draft save. It means the public page is not currently a zero-slide surface even though the published database payload has zero slides.

The local public route (no admin session, no `studio_preview`) rendered four fallback slides and did not show the draft. The deployed staging page at `FRONTEND_URL` returned HTTP 200 with no rendered `.hop-threshold__slide` elements and pre-existing CSP/hydration errors; it likewise did not show the draft.

Publishing the three-slide draft would change the public page by removing the fallback Padma slide. That requires separate approval and was not done.

---

## 9. Remaining Work

| Item | Status | Action |
|---|---|---|
| Padma slide | Blocked | Supply an approved clean Padma film/poster/still, or leave Padma omitted |
| Padma public fallback | Pre-existing issue | Consider removing Padma from `DEFAULT_HERO_SLIDES` until clean media exists; requires code change and approval |
| Kalyani product photograph | Decision required | Current draft uses the official Kalyani collection film/poster. If a still product photograph is mandatory, supply an approved image |
| Studio review | Pending | Review the saved draft in Studio before any publish decision |
| Publication | Not performed | Requires separate explicit approval |
| Legacy production `home.image` migration | Unrelated blocker | Do not apply without approval |

---

## 10. Artifacts

Staging-only artifacts:

```text
C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-payload.json
C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-result.json
C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-preview-1440x900.png
C:\Users\siddh\AppData\Local\Temp\opencode\hop-hero-draft-preview-390x844.png
C:\Users\siddh\AppData\Local\Temp\opencode\hop-staging-inspect.json
```

No artifact was uploaded or committed.

---

## 11. Final Verdict

**PARTIALLY PREPARED** - a safe three-slide staging draft exists and has been previewed successfully. The draft is unpublished. Padma remains blocked pending approved clean media, and Kalyani currently uses the official collection film rather than a still product photograph.

No publication should occur until the remaining content decisions and the public fallback behavior are explicitly approved.

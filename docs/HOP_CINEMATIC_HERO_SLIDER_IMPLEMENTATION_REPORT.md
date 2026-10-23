# HOP — Cinematic Hero Video Slider | Master Implementation Report

**Verification Timestamp:** 2026-10-22T02:24:32+05:30  
**Target Environment:** House of Padmavati (`E:\HOP`)  
**Local Development:** `http://localhost:8080` (Vite 5.4.21, Node 24.18.0)  
**Test Matrix:** Vitest 1.6.0 (Unit/Schema), Playwright 1.62.1 (Chromium Desktop 1440×900, Mobile Chrome 390×844)

---

## 1. Executive Summary & Verification Matrix

The HOP homepage hero experience has been transformed from a single-video threshold into a luxury cinematic, multi-video slider fully integrated into HOP Studio.

| Objective / Verification Item | Status | Verified Evidence & Notes |
|:---|:---:|:---|
| **1. Configurable Multi-Video Slides** | **PASS** | Supports an arbitrary number of slides ($N \ge 1$) configured dynamically via Studio. Never hardcoded. Defaults to 4 curated collection films (Kalyani, Viara, Arya, Padma). |
| **2. Display Duration Window (Capped at 5s)** | **PASS** | Each slide has a configurable display window between 1 and 5 seconds (targeting 3–5 seconds). Capped strictly at 5.0 seconds both client-side and via Zod validation (`max(5)`). |
| **3. Automatic Advancement** | **PASS** | Slides automatically advance when their display window expires, regardless of whether the underlying video is longer. Verified in unit tests and real browser Playwright execution. |
| **4. Playback Resilience & Error Handling** | **PASS** | If video loading is delayed, unavailable, or errors, the slider does not freeze; the poster remains visible and the slider advances on schedule. Videos shorter than display window loop seamlessly without black frames. |
| **5. Luxury Transitions & Zero Black Frames** | **PASS** | 850ms luxury cross-fade transition using `cubic-bezier(0.25, 1, 0.5, 1)`. Poster images are continuously rendered beneath video layers. Transitioning outgoing videos remain mounted during the cross-fade so there are zero visible black flashes, flickers, or layout shifts. |
| **6. Reduced-Motion & Autoplay Fallback** | **PASS** | Respects `prefers-reduced-motion: reduce`: pauses auto-advancement, disables scale animations, and switches slides instantly. Graceful fallback on autoplay rejection with poster preserved and manual controls available. |
| **7. Responsive Landscape/Portrait Media Strategy** | **PASS** | Retains multi-resolution variants (`720p` desktop, `540p` mobile media query via `<source media="(max-width: 767px)">`, and matching WebP posters). Aspect ratios are preserved with `object-fit: cover` and proper focal centering without geometric distortion. |
| **8. HOP Studio Management** | **PASS** | Built directly into Studio Site Update workspace (`home.hero`). Administrators can add slides, remove slides, reorder slides (Move Up/Down), toggle active/disabled status, select/upload videos and posters via `MediaPickerModal`, and configure duration (1–5s). |
| **9. Draft Preview & Content Management Flow** | **PASS** | Reuses `public.site_sections` table (`draft_payload` and `published_payload`) with optimistic locking and revision history. Admin can preview drafts in storefront via `/?studio_preview=true` and atomically publish to live. |
| **10. Playback Performance & Lifecycle Safety** | **PASS** | Only the active slide plays (`play()`). Next slide is pre-buffered efficiently; non-adjacent slides do not eagerly download video streams. Viewport awareness via `IntersectionObserver` (pauses off-screen, resumes on-screen). Tab visibility awareness via `visibilitychange` (pauses when backgrounded, resumes when focused). All timers and references cleaned up on unmount. |
| **11. Homepage Section Order Preservation** | **PASS** | Sequence strictly verified: 1. Cinematic Hero Slider (`.hop-threshold`) &rarr; 2. Living Saree full-width video placeholder (`.hop-living-saree`) &rarr; 3. Kalyani collection film (`.hop-collection-film-chapter--kalyani`) &rarr; 4. Remaining homepage sections in order. Zero text, frame, controls, or artificial spacing between sections 1, 2, and 3. |
| **12. Test Suite & Build Verification** | **PASS** | Vitest: 71/71 tests passed (8 test files). Playwright playback suite: 8 passed + 1 touch-only skip on Chromium Desktop; 9/9 passed on Mobile Chrome. Studio access/dynamic-media suite: 7/7 passed. ESLint: 0 errors, 0 warnings. TypeScript: `tsc --noEmit` 0 errors. Production Build: `npm run build` completed with all 29 routes prerendered. |
| **13. Brand Mark Color Restoration** | **PASS** | Restored the original signature-crimson mark (`#8B1E2D`) and removed the gold/plum `tone` variants. Header, footer, collection-film, and invitation marks use their prior pre-gold treatments. |

---

## 2. Technical Architecture & Data Flow

### 2.1 Database & Schema Reuse (`public.site_sections`)
No database migrations were needed because the existing `site_sections` architecture already segregates `draft_payload` and `published_payload` as `JSONB`:
- **Section Key:** `home.hero`
- **Draft Storage:** `site_sections.draft_payload`
- **Published Storage:** `site_sections.published_payload`
- **Audit Ledger:** `site_section_revisions`
- **Validation Guard:** Postgres `validate_section_payload('hero_banner', payload)` verifies `p_payload ? 'title' AND p_payload ? 'alt_text'`. All additional `slides` data conforms seamlessly.

### 2.2 Zod Schemas (`src/types/siteSections.ts`)
```typescript
export const HeroSlideSchema = z.object({
  id: z.string(),
  video_url: z.string().min(1, "Video URL is required"),
  mobile_video_url: z.string().optional().or(z.literal("")),
  poster_url: z.string().optional().or(z.literal("")),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 second")
    .max(5, "Display duration is capped at 5 seconds")
    .default(5),
  is_active: z.boolean().default(true),
  title: z.string().max(120).optional().or(z.literal("")),
  subtitle: z.string().max(250).optional().or(z.literal("")),
  eyebrow: z.string().max(80).optional().or(z.literal("")),
  primary_cta: SafeLinkSchema.optional(),
  secondary_cta: SafeLinkSchema.optional(),
  alt_text: z.string().max(250).optional().or(z.literal("")),
});
```

### 2.3 Curated Default Slides (`DEFAULT_HERO_SLIDES`)
1. **Slide 1 (The threshold · Kalyani):**
   - Desktop: `/optimized/videos/KALYANI-720p.mp4`
   - Mobile: `/optimized/videos/KALYANI-540p.mp4`
   - Poster: `/optimized/videos/KALYANI-poster.webp`
   - Duration: 5.0s
2. **Slide 2 (After-light · Viara):**
   - Desktop: `/optimized/videos/VIARA-720p.mp4`
   - Mobile: `/optimized/videos/VIARA-540p.mp4`
   - Poster: `/optimized/videos/VIARA-poster.webp`
   - Duration: 4.0s
3. **Slide 3 (Daily rhythm · Arya):**
   - Desktop: `/optimized/videos/ARYA-720p.mp4`
   - Mobile: `/optimized/videos/ARYA-540p.mp4`
   - Poster: `/optimized/videos/ARYA-poster.webp`
   - Duration: 5.0s
4. **Slide 4 (The weave as architecture · Padma):**
   - Desktop: `/optimized/videos/PADMA-720p.mp4`
   - Mobile: `/optimized/videos/PADMA-540p.mp4`
   - Poster: `/optimized/videos/PADMA-poster.webp`
   - Duration: 4.0s

### 2.4 Playback Engine (`src/components/hop/CinematicHeroSlider.tsx`)
- **Active Only Playback:** Inactive video tags are not playing; only the currently displayed slide executes `.play()`.
- **Eager First Slide, On-Demand Others:** Slide 0 renders its high-resolution WebP poster eagerly with `fetchpriority="high"`. Slide videos only mount when active or during the 850ms transition. Non-adjacent slides do not download video bytes.
- **Display Window Auto-Advancement:** Driven by `setTimeout` configured to `currentSlide.duration * 1000` ms (1–5s, capped at 5s).
- **Zero Black Frames:** Each slide renders `<img className="hop-threshold__slide-poster">` at all times beneath the `<video>`. During cross-fades, the outgoing slide remains at opacity 1 &rarr; 0 while the incoming slide fades 0 &rarr; 1, ensuring the viewport never shows an empty or black frame.
- **Reduced Motion:** Verified via `window.matchMedia('(prefers-reduced-motion: reduce)')`. Disables timer advancement and scale animations.
- **Lifecycle & Observers:**
  - `IntersectionObserver`: Pauses playback when user scrolls down to Living Saree or collections; resumes when scrolled back to top.
  - `visibilitychange`: Pauses playback and timers when tab is switched or minimized; resumes on tab focus.
  - Component unmount: Safely cleans up all pending timers and pauses video elements.

### 2.5 HOP Studio Management (`src/studio/pages/SiteUpdate.tsx`)
Integrated into the `home.hero` editor:
- **Add Slide:** Adds a new slide with default 5.0s duration and active state.
- **Remove Slide:** Deletes slide by index.
- **Reorder:** Move Up / Move Down buttons with array index swapping.
- **Enable / Disable:** Toggle switch updates `is_active`.
- **Media Picker:** Integrated `MediaPickerModal` for selecting videos or posters from the library or uploading new assets.
- **Duration Configuration:** Number input clamped to 1.0–5.0s with max 5s cap.
- **Draft Preview & Publish:** Preserves the existing draft/publish workflow with `saveDraft` and `publishSection`.

### 2.6 Manual Navigation Controls & Gestures (`CinematicHeroSlider.tsx`)
- **Edge Arrows:** Discreet glass `ChevronLeft` / `ChevronRight` buttons with `aria-label="Previous slide"` / `"Next slide"`. Both wrap around and are the only interactive controls in the hero. Arrow pointer events call `stopPropagation()` so a button press cannot also register as a hero swipe.
- **Touch Swipe:** Pointer events track the start position and pointer ID; a horizontal release of at least `48px`, clearly more horizontal than vertical, advances or reverses one slide. `touch-action: pan-y pinch-zoom` keeps native vertical scrolling intact.
- **Trackpad Wheel:** Horizontal wheel gestures accumulate to a `60px` threshold before navigating. Dominant vertical wheel input is ignored so page scrolling is never hijacked; `Ctrl`+wheel (zoom) is ignored.
- **Rapid-Input Protection:** Pointer navigation has a `350ms` cooldown; wheel navigation has a `900ms` cooldown with a `180ms` gesture reset window to prevent double-steps from momentum.
- **Autoplay Integration:** Manual arrows, swipes, and wheel navigation call the existing `goToSlide()`, which resets the slide display timer through the autoplay effect. Manual movement does not pause autoplay.
- **Indicators:** Dots remain visual-only (`aria-hidden`, `pointer-events: none`) and sync with the active slide. Desktop arrows are hidden until hero hover/focus (`opacity: 0`, revealed by `:hover` / `:focus-within`); touch devices show them at rest with a larger `44px` target.
- **Accessibility & Content:** Section uses `aria-roledescription="carousel"`; each slide exposes `Slide N of M`; arrows remain keyboard-focusable. The hero still renders no headline, caption, CTA, counter, progress bar, or pause/play UI.

### 2.7 Brand Mark Restoration (`Monogram.tsx` and call sites)
- The gold/plum logo assets and `tone` prop were removed from the shared monogram path.
- `Monogram` again resolves to the original `hop-logo-signature.png` signature mark (`#8B1E2D`).
- Header and light surfaces show the signature mark directly. Footer, collection-film, and invitation marks return to their prior light-on-dark `brightness(0) invert(1)` treatments.
- The typographic HOP wordmark and unrelated gold accents were intentionally left unchanged.

---

## 3. Homepage Section Order Verification

The homepage section hierarchy in `src/components/hop/HomepageExperience.tsx` was verified in both DOM structure and computed bounding boxes:

```
<main className="hop-home">
  ├── [1] <CinematicHeroSlider section={hero} />       (class: hop-threshold)
  ├── [2] <LivingSareeSection ... />                    (class: hop-living-saree)
  └── [3] <CollectionRooms />                           (id: collections, starts with Kalyani)
      ├── [4] <ProductDesire />
      ├── [5] <Craft section={craft} />                 (id: craft)
      ├── [6] <Philosophy section={philosophy} />       (id: philosophy)
      ├── [7] <Ownership section={ownership} />         (id: ownership)
      ├── [8] <Journal />                               (id: journal)
      └── [9] <Invitation section={invitation} />
</main>
```

**Spacing Verification:**
- Distance between bottom of `.hop-threshold` and top of `.hop-living-saree`: **0px** (subpixel: $\le 1\text{px}$).
- Distance between bottom of `.hop-living-saree` and top of Kalyani collection film: **0px**.
- Living Saree section verified to contain **no text**, **no frame**, and **no controls**.

---

## 4. Verification Evidence & Test Reports

### 4.1 Vitest Unit Tests
Executed command: `npm test` (`vitest run --no-file-parallelism`)
```
 RUN  v1.6.0 E:/HOP

 ✓ src/lib/__tests__/cinematicHeroSlider.test.ts  (14 tests)
 ✓ src/lib/__tests__/siteSectionValidation.test.ts  (14 tests)
 ✓ src/lib/__tests__/editorialResilience.test.ts  (11 tests)
 ✓ src/lib/__tests__/CustomerAuthCheckout.test.ts  (12 tests)
 ✓ src/lib/__tests__/videoAspectRatioValidation.test.ts  (5 tests)
 ✓ src/lib/__tests__/supabaseImage.test.ts  (8 tests)
 ✓ src/lib/__tests__/mediaCatalog.test.ts  (4 tests)
 ✓ src/lib/__tests__/formatPrice.test.ts  (3 tests)

 Test Files  8 passed (8)
      Tests  71 passed (71)
   Duration  11.26s
```

### 4.2 Playwright Browser Tests (Desktop Chromium & Mobile Chrome)
Executed commands:
1. `npx playwright test src/__tests__/VideoOptimizationPlayback.spec.ts --project=chromium`
2. `npx playwright test src/__tests__/VideoOptimizationPlayback.spec.ts --project="Mobile Chrome"`
3. `npx playwright test src/__tests__/Studio.spec.ts --project=chromium`

**Results:**
- `VideoOptimizationPlayback.spec.ts` (Chromium Desktop): **8 passed, 1 skipped (33.1s)**
  - Desktop: Hero video loads 720p, autoplays, pauses on scroll out, resumes on scroll back
  - Mobile: Hero video includes mobile 540p media query source
  - Collection Films: Only mount and play on viewport entry
  - Cinematic Hero Slider: Arrows navigate immediately, dots sync, autoplay continues, zero text
  - Cinematic Hero Slider: Manual arrow navigation restarts the autoplay window
  - Cinematic Hero Slider: Trackpad wheel and pointer drag navigate without hijacking vertical wheel
  - Homepage Section Sequence: Hero Slider -> Living Saree Placeholder -> Kalyani Film
  - Living Saree Mobile 16:9 Landscape Ratio & Clean Visual Frame
  - Skipped by design: touch-only mobile swipe test on the non-touch desktop project
- `VideoOptimizationPlayback.spec.ts` (Mobile Chrome): **9 passed (36.6s)**
  - Includes real touch swipe, both edge arrows, dot synchronization, and natural vertical page scrolling
- `Studio.spec.ts` (Chromium): **7 passed (7.1s)**

### 4.3 TypeScript & ESLint
- `npx tsc --noEmit`: **0 errors**
- `npm run lint`: **0 errors, 0 warnings**

### 4.4 Production Build & Prerender
- `npm run build`: Vite build completed in 9.34s; all 29 dynamic routes prerendered cleanly.

---

## 5. Deployment Readiness & Limitations

1. **Automatic Production Deployment:** As instructed, automatic deployment to production has **not** been executed. Production deployment should proceed through standard operator deployment commands when ready.
2. **Media Assets Preserved:** All original master videos in `tools/media-pipeline/videos/originals/` and pre-optimized 720p/540p variants in `public/optimized/videos/` remain intact and uncorrupted.
3. **No 3D Models Introduced:** No 3D model assets or libraries were added; the Living Saree visual placeholder remains a pure, high-performance video/poster layer.

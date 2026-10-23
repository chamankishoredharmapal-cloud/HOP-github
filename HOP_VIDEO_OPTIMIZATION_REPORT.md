# HOP Video Optimization & Aspect Ratio Standardization (16:9 / 9:16) Master Report

**Verification Timestamp:** 2026-10-18T05:37:30+05:30  
**Target Environment:** House of Padmavati (`E:\HOP`)  
**Production Remote:** `https://hop-production.pages.dev`  
**Local Development:** `http://localhost:8080` (Vite 5.4.21, Node 24.18.0)  

---

## 1. Executive Summary & PASS / FAIL Checklist

All existing HOP video assets and future video upload pipelines have been audited, standardized, and verified against two industry-standard aspect ratios:
- **16:9 Landscape:** Target 1280×720 (720p) and 1920×1080 (1080p only when source genuinely supports it).
- **9:16 Portrait:** Target 720×1280 and 1080×1920 (only when source genuinely supports it).
- **Mobile 540p Strategy:** Preserved at 960×540 for 16:9 and 540×960 for 9:16, yielding ~70% mobile bandwidth savings.

| Verification Item | Status | Verified Evidence & Notes |
|:---|:---:|:---|
| **1. Source Video Inventory & Ratio Classification** | **PASS** | All 6 original collection assets inspected via FFprobe: 5 are native 1280×720 (16:9 Landscape), 1 is native 720×1280 (9:16 Portrait). Zero non-standard distortion or stretched ratios. |
| **2. Zero Footage Distortion & No-Upscaling Policy** | **PASS** | Original saree drapery, embroidery, faces, and jewelry preserved with 100% geometric fidelity. Sources are native 720p; no false upscaling to 1080p was performed. |
| **3. Automated Video Optimization Pipeline (`npm run video:optimize`)** | **PASS** | Auto-detects aspect ratio & orientation, enforces even dimensions (`trunc(iw/2)*2`), sets CRF 23/25, moves `moov` atom to front (FastStart verified), strips audio for muted ambient loops, extracts WebP posters at matching ratio, verifies clean decoding, computes SSIM > 0.987, and generates JSON summary. |
| **4. HOP Studio Upload Validation & Workflow** | **PASS** | `validateVideoFile()` and `classifyVideoAspectRatio()` detect dimensions, duration, orientation, and standard status client-side. Original files are preserved in Supabase Storage. Ratio metadata is indexed in `media_assets` tags. Pipeline status accurately reflects `completed` vs `pending ('npm run video:optimize')`. |
| **5. Frontend Container Alignment** | **PASS** | `CollectionStage.tsx` and `Collections.tsx` updated from legacy mismatched container ratios (which previously cropped 16:9 and 9:16 videos) to native container matching: `aspect-[9/16] max-w-sm sm:max-w-md mx-auto` for Kalyani and `aspect-[16/9] w-full` for landscape films. |
| **6. Living Saree Full-Bleed Section** | **PASS** | `LivingSareeSection.tsx` verified: edge-to-edge 100vh placeholder, zero controls, zero card outlines, responsive `<source media="(max-width: 767px)">` mobile support. |
| **7. Unit Test Suite** | **PASS** | 57/57 Vitest tests passing (including 5 new tests in `videoAspectRatioValidation.test.ts`). |
| **8. Playwright Playback & Lifecycle E2E** | **PASS** | 3/3 Playwright Chromium tests pass (desktop 720p autoplay, mobile 540p source selection, scroll-out pause, scroll-in resume, and lazy off-screen mounting). |
| **9. TypeScript Typecheck & ESLint** | **PASS** | `npx tsc --noEmit` and `npm run lint` pass with 0 errors and 0 warnings. |
| **10. Production Build & Prerender** | **PASS** | `npm run build` completed in 7.19s; all 29 dynamic routes prerendered cleanly. |

---

## 2. Complete Asset Inventory & Classification Table

### 2.1 Original Source Videos (`tools/media-pipeline/videos/originals/`)

All source files are preserved untouched on disk and in Supabase Storage (`HOP-films` bucket):

| Original File | Dimensions | Aspect Ratio | Orientation | Classification | Duration | Codec | File Size | Audio |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `HERO.mp4` | 1280×720 | 16:9 (1.778) | Landscape | **16:9 Landscape (HOP Standard)** | 10.00s | H.264 | 3.07 MB (3,218,879 B) | None |
| `KALYANI_1.mp4` | 720×1280 | 9:16 (0.563) | Portrait | **9:16 Portrait (HOP Standard)** | 10.00s | H.264 | 4.63 MB (4,855,126 B) | Yes (Removed in Opt) |
| `VIARA3.mp4` | 1280×720 | 16:9 (1.778) | Landscape | **16:9 Landscape (HOP Standard)** | 10.01s | H.264 | 2.67 MB (2,795,674 B) | None |
| `ARYA.mp4` | 1280×720 | 16:9 (1.778) | Landscape | **16:9 Landscape (HOP Standard)** | 10.01s | H.264 | 2.47 MB (2,586,875 B) | None |
| `PADMA.mp4` | 1280×720 | 16:9 (1.778) | Landscape | **16:9 Landscape (HOP Standard)** | 10.00s | H.264 | 2.97 MB (3,116,461 B) | None |
| `SPANDANA.mp4` | 1280×720 | 16:9 (1.778) | Landscape | **16:9 Landscape (HOP Standard)** | 10.00s | H.264 | 3.06 MB (3,203,672 B) | None |

### 2.2 Optimized Streaming Variants (`public/optimized/videos/`)

All files generated with fast-start `moov` atom at byte offset 36, no audio, and even dimensions:

| Canonical Film | Variant | Dimensions | Aspect Ratio | File Size | Bandwidth Savings | SSIM Fidelity | FastStart | Decode Verified |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **HERO** | 720p Master | 1280×720 | 16:9 | 1.97 MB | 35.9% | 0.9934 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 960×540 | 16:9 | 0.93 MB | 69.7% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 1280×720 | 16:9 | 30.1 KB | — | — | — | — |
| **KALYANI** | 720p Master | 720×1280 | 9:16 | 2.82 MB | 39.1% | 0.9871 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 540×960 | 9:16 | 1.30 MB | 72.0% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 720×1280 | 9:16 | 83.7 KB | — | — | — | — |
| **VIARA** | 720p Master | 1280×720 | 16:9 | 2.24 MB | 15.8% | 0.9919 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 960×540 | 16:9 | 1.18 MB | 55.6% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 1280×720 | 16:9 | 67.9 KB | — | — | — | — |
| **ARYA** | 720p Master | 1280×720 | 16:9 | 2.25 MB | 8.9% | 0.9915 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 960×540 | 16:9 | 1.20 MB | 51.2% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 1280×720 | 16:9 | 51.5 KB | — | — | — | — |
| **PADMA** | 720p Master | 1280×720 | 16:9 | 1.86 MB | 37.4% | 0.9934 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 960×540 | 16:9 | 0.84 MB | 71.7% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 1280×720 | 16:9 | 64.0 KB | — | — | — | — |
| **SPANDANA (YŪGEN)** | 720p Master | 1280×720 | 16:9 | 1.91 MB | 37.5% | 0.9940 | Yes (Byte 36) | Yes (0 errors) |
| | 540p Mobile | 960×540 | 16:9 | 0.86 MB | 71.9% | — | Yes (Byte 36) | Yes (0 errors) |
| | Poster WebP | 1280×720 | 16:9 | 51.5 KB | — | — | — | — |

---

## 3. Aspect Ratio Standardization Policy & Pipeline Logic

### 3.1 Strict Composition Integrity
1. **No Upscaling:** 1080p outputs (`1920×1080` or `1080×1920`) are generated **only when the source video has native width $\ge 1920$ or height $\ge 1920$**. Lower-resolution footage (such as current 720p footage) is never upscaled, preventing artificial blur or wasted bandwidth.
2. **No Arbitrary Stretching or Distortion:** Aspect ratios are detected using floating point delta thresholding ($|W/H - 16/9| < 0.02$ and $|W/H - 9/16| < 0.02$).
3. **No Automatic Destructive Cropping:** If a non-standard video (e.g. 4:3 or square) is uploaded, the pipeline preserves its native aspect ratio with even dimensions (`scale='trunc(iw/2)*2':'trunc(ih/2)*2'`) and flags it for editorial review rather than silently slicing off saree borders or faces.
4. **No Cross-Resizing:** The pipeline never creates both landscape and portrait versions by squeezing or letterboxing the same video. Composition must remain intentional.

### 3.2 Automated Pipeline Enhancements (`tools/media-pipeline/scripts/optimize-collection-videos.mjs`)
- Runs via `npm run video:optimize`.
- Detects known collection targets plus any extra `.mp4`, `.mov`, `.webm` videos in `originals/`.
- Verifies output decodability with `ffmpeg -v error -i <file> -f null -`.
- Verifies FastStart `moov` atom placement within the first 4KB.
- Calculates SSIM visual similarity scores.
- Copies output assets to `public/optimized/videos/` and writes `tools/media-pipeline/output/video-optimization-summary.json`.

---

## 4. HOP Studio Upload Workflow & Transparency

1. **Client-Side Validation & Ratio Inspection (`src/studio/utils/videoValidation.ts`):**
   - Inspects `video.videoWidth` and `video.videoHeight`.
   - Identifies orientation (`landscape`, `portrait`, `square`).
   - Flags non-standard ratios with a non-blocking editorial warning:
     > *"Non-standard aspect ratio detected (W×H). HOP standard is 16:9 Landscape or 9:16 Portrait. Preserving original footage without stretching/cropping. Review in layout before publishing."*
2. **Original Preservation & Storage (`src/studio/services/mediaService.ts`):**
   - Original file is uploaded directly to Supabase Storage with immutable caching headers.
   - Poster frame is extracted at $t = 1.0\text{s}$ and uploaded to `p_poster_url`.
   - Video metadata tags record aspect ratio, orientation, standard flag, and status:
     `["aspect:16:9 Landscape", "orientation:landscape", "standard:true", "status:pending"]`.
3. **Accurate Status Display in Studio UI (`src/studio/pages/Media.tsx`):**
   - Grid cards display video badges with aspect ratio (`16:9` / `9:16` / `Custom`).
   - Preview modal clearly distinguishes between:
     - `✓ Completed (720p / 540p active)` for collection films already transcoded.
     - `Pending ('npm run video:optimize')` for newly uploaded raw videos.
   - The UI **does not falsely claim** automatic client-side transcoding. Users receive a clear toast notification that multi-variant 720p/540p encoding runs via `npm run video:optimize`.

---

## 5. Frontend Layout Alignment & Video Container Protection

### 5.1 Eliminated Accidental Cropping in `CollectionStage.tsx` and `Collections.tsx`
- **Previous Problem:** `CollectionStage.tsx` and `Collections.tsx` had hardcoded CSS classes (`aspect-square`, `aspect-[3/4]`, `aspect-[4/5]`, `aspect-[16/10]`). Because `Film.tsx` uses `object-cover`, 16:9 landscape films and Kalyani's 9:16 portrait film were getting up to 50% of their frame cropped off.
- **Resolution:**
  - Standardized container classes:
    - For `kalyani` (9:16 Portrait): `aspect-[9/16] max-w-sm sm:max-w-md mx-auto`.
    - For `viara`, `arya`, `padma`, `yugen` (16:9 Landscape): `aspect-[16/9] w-full`.
  - When container aspect ratio matches video aspect ratio, `object-cover` fills the container with **zero cropping** and **zero black bars**.
- **Living Saree Section:**
  - `LivingSareeSection.tsx` maintains full viewport edge-to-edge frame (100% width, 100vh) with zero container borders, no cards, and responsive `<source media="(max-width: 767px)">` mobile streaming.

---

## 6. Verification Results

```bash
# 1. TypeScript Check
npx tsc --noEmit
# Result: 0 errors (Exit code: 0)

# 2. ESLint
npm run lint
# Result: 0 errors, 0 warnings (Exit code: 0)

# 3. Vitest Unit Suite
npx vitest run src/lib/__tests__
# Result: 7 test files passed, 57/57 tests passed (100%)

# 4. Playwright Video Playback E2E Suite
npx playwright test src/__tests__/VideoOptimizationPlayback.spec.ts --project=chromium
# Result: 3 passed (46.0s)

# 5. Production Build & Prerender
npm run build
# Result: Built in 7.19s, 29/29 routes prerendered successfully
```

---

## 7. Next Actions for Operator

1. **Deploy Build to Cloudflare Pages:**
   - Commit and push working changes to trigger Cloudflare Pages deployment.
   - All 18 optimized assets (`public/optimized/videos/*`) and updated routes are ready in `dist/`.
2. **Supabase Bucket Cache Header:**
   - Ensure the Supabase Storage bucket `HOP-films` is configured with `Cache-Control: public, max-age=31536000, immutable`.
3. **Future Uploads:**
   - When new collection films are uploaded in HOP Studio, run `npm run video:optimize` to produce matching 720p and 540p H.264 fast-start variants and WebP posters.

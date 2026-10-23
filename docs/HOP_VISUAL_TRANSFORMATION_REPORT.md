# House of Padmavati — Visual Transformation Report

Date: 2026-10-20
Scope: Storefront-wide visual system transformation to Soft Ivory / Mauve / Royal Violet / Deep Plum / Old Gold.
Companion documents: `HOP_PURPLE_VISUAL_SYSTEM_AUDIT.md` (baseline + plan), `HOP_VISUAL_DESIGN_SYSTEM.md` (tokens + rules).

## A. What changed

1. Single canonical token layer. `src/index.css` now defines the brand palette once (HSL triples), semantic surfaces/text/actions/focus/shadow/texture tokens, shadcn/ui variable mapping for light and `.dark`, global base styles, and every legacy name (`--rasa-*`, `--paper-*`, `--ink*`, `--hop-*`) aliases the same palette. `tailwind.config.ts` exposes `brand.*`, `gold`, `overlay`, `surface.*`, `shadow.{soft,lift,overlay}` and grain backgrounds.
2. Homepage editorial system rethemed (`HomepageExperience.css`): ownership chapter on canonical Mauve with ivory raised cards and gold hairline, journal on mauve soft, craft/product-desire/invitation on plum grounds, violet primary action, plum-tinted soft shadows, SVG grain and woven texture, light-mode/inverse header logic.
3. Shell: header (light and inverse variants with violet/gold hover split, gold inverse logo), footer (plum ground, gold hairline, violet accents), search modal, monogram. New plum signature logo asset generated with alpha preserved.
4. Commerce and content routes: checkout (white surfaces, amber warnings, selected states), cart, product detail, gallery, sticky CTA, lookbook, gift, appointments, journal index/detail, collections and collection detail, account pages (status colours, destructive hovers), policy pages, unsubscribe, order confirmation, campaign page, 404/error boundary.
5. Data and integrations: collection world accents (`collectionWorlds.ts`) mapped to the palette; listing placeholders and fallback accents; transactional email palette; Razorpay theme colour; theme-color meta.
6. Accessibility hardening discovered during verification: small gold text on plum raised now uses a dedicated `--brand-gold-light` (6.11:1); secondary text that failed AA uses solid muted or plum; lookbook captions, side-nav, sort label and POC demo text corrected; homepage collection titles promoted from h3 to h2; Suspense fallback now exposes `main` + heading landmarks.
7. POC colour lab updated from the retired palette to the four committed registers (ivory, deep plum, mauve, mauve mist) for future reference.

## B. Files modified

Canonical layer and config

- `src/index.css`, `tailwind.config.ts`, `index.html`, `src/hooks/useMetadata.ts`, `src/App.tsx`

Shell and shared components

- `src/components/hop/HopHeader.tsx`, `HopFooter.tsx`, `Monogram.tsx`, `HomepageExperience.tsx`, `HomepageExperience.css`, `HopPage.css`, `ProductGallery.tsx`, `StickyCta.tsx`, `Selvedge.tsx`
- `src/components/search/SearchModal.tsx`, `src/components/ErrorBoundary.tsx`
- `src/components/ui/{button,card,dialog,sheet,drawer,alert-dialog}.tsx`
- `src/assets/hop-logo-signature-plum.png` (new, generated with `System.Drawing`, RGB 59,23,77, alpha preserved)

Storefront pages

- `src/pages/{Checkout,Lookbook,Unsubscribe,Gift,Appointments,JournalDetail,Wishlist,Cart,ProductDetail,OrderConfirmation,Category,Collections}.tsx`
- `src/pages/account/{OrderHistory,OrderDetail,AccountSidebar,Addresses,WishlistPage,Login,Signup,ForgotPassword,ResetPassword}.tsx`
- `src/pages/campaigns/QuietWedding.tsx`, `src/pages/poc/ColorLab.tsx`
- `src/data/collectionWorlds.ts`, `src/services/emailService.ts`, `src/hooks/usePayment.ts`

Studio (token-only replacements where legacy CTA classes existed; functional status colours intentionally retained)

- `src/studio/{components/TopActionBar.tsx, pages/Activity.tsx, pages/CollectionWorkspace.tsx, pages/Collections.tsx, pages/Dashboard.tsx, pages/Inventory.tsx, pages/Journal.tsx, pages/Media.tsx, pages/OrderDetail.tsx, pages/Orders.tsx, pages/Products.tsx, pages/Settings.tsx}`

Documentation

- `docs/HOP_PURPLE_VISUAL_SYSTEM_AUDIT.md` (new), `docs/HOP_VISUAL_DESIGN_SYSTEM.md` (new), this report (new)

Pre-existing uncommitted work was preserved untouched apart from intentional class-level edits: video pipeline (`collectionVideos.ts`, `Film.tsx`, `HeroSection.tsx`, `HomepageCinematicVideo.tsx`, `LivingSareeSection.tsx`, `CollectionStage.tsx`, media service/tests/tooling), `vercel.json`, `vite.config.ts`, `package.json`, `public/_headers`.

## C. Verification (what was actually run)

| Check | Command | Result |
| --- | --- | --- |
| Production build | `npm run build` | PASS — Vite build plus prerender of 29 routes |
| Lint | `npm run lint` | PASS — no errors |
| Typecheck | `npx tsc -p tsconfig.app.json --noEmit` | FAIL — pre-existing Supabase generated-type drift only (see D) |
| Automated a11y suite (chromium) | `npx playwright test src/__tests__/Accessibility.spec.ts --project=chromium` | 19/19 PASS after fixes |
| Axe sweep, 20 storefront routes, wcag2aa + wcag21aa | custom Playwright + `@axe-core/playwright` script | 0 violations (contrast and all other rules) |
| Visual review, desktop + mobile | Chromium screenshots of home, collections, checkout, journal (1440px and 390px full page) | Grounds, type and accents render as specified; captured to `%TEMP%\opencode\shots` |

Not run: Firefox/WebKit/mobile Playwright projects, pixel-diff regression baselines, authenticated account and studio screenshots, Lighthouse performance. These remain open.

## D. Regressions and unresolved

New regressions introduced by this work: none identified. The verification loop found and fixed its own issues before completion:

- Gold small text on plum raised measured 4.47:1 (axe) -> replaced with `--brand-gold-light` (6.11:1).
- Alpha-based secondary text on ivory measured 3.23–4.45:1 on collection detail and lookbook -> replaced with solid tokens (6.09:1+).
- Homepage heading order (h1 to h3) and Suspense fallback landmarks failed axe -> h2 promotion and fallback landmark added.
- POC palette demo had two low-contrast pairs -> palettes corrected with an explicit `accentInk`.

Pre-existing, unrelated to this task (confirmed by inspecting diffs; this task changed class strings only in these files):

- `npx tsc -p tsconfig.app.json --noEmit` fails across 21 files due to generated Supabase schema drift: `site_sections`, `journal_article_revisions`, `media_assets`, several RPC signatures, `partially_refunded` enum, generated data files. Files include `src/studio/services/{journalService,mediaService,orderService,activityService,diagnosticsService}.ts`, `src/services/{siteSectionService,customerAddressService,customerProfileService}.ts`, `src/hooks/useSiteSections.ts`, `src/data/__generated__/*`, plus files touched only cosmetically by this task (`HopFooter.tsx` status union, `Checkout.tsx` address/RPC types).
- `vite build` warning about `contactService.ts` dual static/dynamic import.

Unresolved by design:

- Studio keeps functional red/green/amber semantics; it inherits the new neutral surfaces but is not a full brand restyle.
- Video/collection assets were not re-shot; photography remains as-is and the system was tuned to sit behind it.
- One ground shift per viewport is enforced by convention, not lint; future content must follow `HOP_VISUAL_DESIGN_SYSTEM.md`.

## E. Completion status

PARTIAL — PASS on the storefront transformation, with explicitly deferred items.

- Storefront tokens, shell, homepage chapters, commerce, journal, account, policies, email/payments: PASS.
- Build and lint: PASS. Accessibility (chromium, 20 routes): PASS.
- Typecheck: BLOCKED by pre-existing Supabase schema drift (unrelated).
- Cross-browser and authenticated visual verification: NOT RUN.
- Studio visual restyle: OUT OF SCOPE (functional colors retained).

## F. Addendum — Gold logo material & video tint removal (same date)

> **Superseded in part (2026-10-22):** following review, the gold logo treatment was reverted to the original signature-crimson mark. See section G. The video tint removal in this addendum remains in effect.

### F.1 What changed

1. Dimensional gold logo assets. Two derived variants were rendered from the existing signature artwork's alpha mask (1254×1254, alpha preserved per-pixel so the silhouette and dry-brush edge are untouched) using `System.Drawing` in PowerShell — no image library or 3D dependency was added. Revision note: the first-pass render (broad-blur satin shading) was rejected in review as flat/brushed bronze and re-rendered with a real bevel/extrusion pipeline (revision 2):
   - `src/assets/hop-logo-signature-gold.png` — bright polished 18k yellow-gold for dark grounds (plum, violet, footage).
   - `src/assets/hop-logo-signature-gold-deep.png` — deeper polished gold for ivory grounds (still unmistakably gold, richer midtones for contrast).
   Shading is genuine embossed-metal rendering, not stacked copies: the alpha is supersampled 2× (2508²) and converted to a chamfer distance field (ridge height ≈29px at 1× over the ~55px stroke) that drives surface normals with horizontal/vertical derivative detail; a horizon-occlusion pass (mask shifted along the light direction, two sample distances, blurred) builds the extruded sidewall falloff and the dark contact line where strokes cross, giving the visible raised-edge/recessed-surface read and a direction-aware ambient rim darkening. A directional key light with warm bounce, a Fresnel-weighted environment reflection ramp (position + normal driven) and dual-lobe speculars (tight + broad) produce champagne face highlights, saturated yellow-gold midtones and deep amber-gold returns; near-grazing normals mix toward a saturated gold rather than grey. The render is downsampled 2× with premultiplied alpha; output alpha equals the original mask exactly.
2. `Monogram.tsx` gained a `tone` prop (`plum` default, `gold`, `gold-deep`). All placed marks now use the gold variants: header (gold on footage, gold-deep on light), mobile drawer lockup, footer lockup, homepage threshold/film/invitation marks, collections index and 404. The previous `[filter:brightness(0)_invert(1)]` classes and the `.hop-invitation__mark` invert filter were removed.
3. Wordmark lockup: new `.hop-wordmark` / `.hop-wordmark--inverse` utilities (`src/index.css`) — restrained bronze-gold gradient on ivory (stops 5.38–9.65:1) and pale-gold gradient on dark grounds (stops 5.72–6.85:1), applied to the header, mobile drawer and footer brand name.
4. Video tint removal (no file touched, no re-encode, no global CSS filter):
   - Deleted the color-grade `filter: saturate()/contrast()/brightness()` from `.hop-threshold__film`, `.hop-collection-film__media` (including the hover grade and its transition), `.hop-living-saree__media`, and removed the `from-ink/15` plum gradient overlay in `Film.tsx` that sat on every film frame.
   - Purple (`--hop-lac`) veils replaced by neutral black scrims only where text sits on footage: `.hop-threshold__veil` and `.hop-collection-film__veil`; plum film-title text-shadows (title, film name, YŪGEN name) switched to neutral black.
   - `.hop-living-saree__veil` / `.hop-cinematic-video__gradient` removed entirely (no text over that footage).
   - Responsive `object-position` rules, poster-first layers, IntersectionObserver mount/play lifecycle, `prefers-reduced-motion` handling and film controls are unchanged.
5. Small fixes surfaced during verification: neutral `drop-shadow` on the film monogram (frames can contain bright gold jewelry); mobile drawer's two `text-ink/50` group labels (pre-existing 4.0:1 failure only visible when the drawer is open, which earlier audits did not cover) changed to solid `text-ink-soft`.

### F.2 Files

- Assets: `src/assets/hop-logo-signature-gold.png` (new), `src/assets/hop-logo-signature-gold-deep.png` (new; revision-2 generator `make-gold-emblem.ps1` kept in the session temp dir).
- Components: `Monogram.tsx`, `HopHeader.tsx`, `HopFooter.tsx`, `HomepageExperience.tsx`, `LivingSareeSection.tsx`, `Film.tsx`.
- Styles: `HomepageExperience.css`, `index.css`.
- Pages: `Collections.tsx`, `NotFound.tsx`.

### F.3 Verification (addendum)

| Check | Result |
| --- | --- |
| `npm run build` | PASS — 29 routes prerendered |
| `npm run lint` | PASS |
| `npx tsc -p tsconfig.app.json --noEmit` | Unchanged — same pre-existing Supabase drift (85 errors / 17 files; only touched files with pre-existing errors are `HopFooter.tsx` status union and `LivingSareeSection.tsx` `fetchpriority` typing) |
| `npx playwright test src/__tests__/Accessibility.spec.ts --project=chromium` | 19/19 PASS |
| Axe sweep, 20 storefront routes, wcag2aa + wcag21aa | 0 violations |
| Targeted DOM/style audit (home, collections, footer, film, drawer) | All marks resolve to the gold assets (`naturalWidth` 1254, no purple filters); threshold/collection media `filter: none`; veils computed as `rgba(0,0,0,…)`; living-saree veil absent; wordmark `background-clip: text` active; drawer axe 0 |
| Visual review + 3× zoom-outs | Hero, film, living saree, invitation and footer now show untinted footage; light-header deep-gold and dark-header bright-gold lockups legible over ivory and footage. Gold re-render inspected at 32/40/56/80/120px on Deep Plum and Soft Ivory plus 3× DPR zooms (header dark/light, footer, film mark): face highlights (champagne) separate from darker returns/sidewall, contact shadow under the crossing tail, satin-to-deep amber range with no grey or copper cast, dry-brush fringe intact; screenshots in `%TEMP%\opencode\shots-gold` |

### F.4 Status

PASS for both addendum tasks (gold logo material, video tint removal).

- Gold logo: revision 2 accepted after mandatory visual inspection at actual rendered sizes on both grounds (deep plum and soft ivory). Because the asset paths were unchanged, no component code changed between revision 1 and 2.
- Open: Firefox/WebKit/mobile project runs and real-device video playback were not executed; `primary` and `seal` lockups keep the original artwork because no screen in the app places them (signature is the only placed mark); the video files themselves are untouched, so any future re-grade decision belongs to the media pipeline, not CSS.

## G. Revision — Signature-crimson mark restored (2026-10-22)

The logo portion of Addendum F is superseded. After review, the placed monogram returned to the original signature artwork.

- `Monogram.tsx` no longer accepts a `tone` prop and resolves the signature variant to `hop-logo-signature.png` (`#8B1E2D`).
- Header and mobile drawer show the plain signature mark; footer, collection-film identity, and invitation marks use their prior light-on-dark `[filter:brightness(0)_invert(1)]` treatments.
- Collections index and 404 show the plain signature mark.
- The unfiltered footer logo treatment was restored; no `tone` or gold/plum asset references remain in `src`.
- The `.hop-wordmark` gradients and the neutral video tint removal described in F remain unchanged.
- Gold asset files remain on disk but are unreferenced.
- Verification: `npx tsc --noEmit`, `npm run lint`, Vitest 71/71, Playwright playback 8 passed + 1 touch-only skip (Chromium) and 9/9 (Mobile Chrome), Studio 7/7, and `npm run build` with 29 prerendered routes all pass.

F.4 is retained as historical record; section G describes the current logo state.


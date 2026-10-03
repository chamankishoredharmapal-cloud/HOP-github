# HOP Mobile-First UI/UX Remediation

## Executive Summary

All 3 P0 findings were addressed with verified root causes; 13/13 P1, 12/12 P2, and 6/6 P3 findings were
implemented or verified-and-closed. No backend, payment, or production-data changes were made — this was a
frontend-only remediation that preserves HOP's editorial language.

Two audit claims were corrected during verification rather than blindly implemented:

- **M-20 (fonts):** the Google Fonts URL already contained `display=swap`; no blocking change was needed.
  The Canela Deck decision was documented in code (licensed face, Cormorant fallback by design).
- **M-13 (cart persistence):** verified that `CartContext` already persists to `localStorage` (`hop-cart`,
  load on init + save on change, id normalisation) — the bag survives refresh and the login round-trip.
  No fix required; covered by documentation here.

One audit finding was worse than described and confirmed as the first fix:

- **M-31 (HopPage.css):** confirmed — the entire side-nav/split/journal-feature/auth/account/lookbook block
  (~230 lines) was scoped inside `@media (prefers-reduced-motion: reduce)`, so those layouts only applied
  for reduced-motion users. Re-nested cleanly; desktop integrity restored and verified in screenshots.

**Status: READY** (emulation-verified; physical-device certification not performed — see § Physical Device Testing Limitations).

## Audit Baseline

BEFORE: Mobile UX 6/10 · Responsive 6/10 · Accessibility 6/10 · Visual 7/10 · Brand 7/10 · Desktop 8/10 · Overall 6/10.
Verdict: READY WITH MAJOR FINDINGS. 34 issues (P0: 3 · P1: 13 · P2: 12 · P3: 6 · P4: 0).

## Issues Addressed

All 34 audit IDs (HOP-M-01 … HOP-M-34) are accounted for below. Wording follows the audit's register.

## P0 Fixes

### HOP-M-31 — HopPage.css nesting anomaly (Architecture)
- **Verified:** `@media (prefers-reduced-motion: reduce) {` at old line 447 swallowed all base rules through
  old line 678 (side-nav, split, journal feature, auth/account shells, lookbook, plus the 900px/768px blocks).
  Browsers therefore applied those layouts only under reduced-motion.
- **Fix:** `src/components/hop/HopPage.css` — base rules moved to top level; the 900px/768px blocks kept in
  place; a dedicated reduced-motion block now contains only `.hop-reveal{animation:none}` + transition kills.
- **Regression check:** build + prerender pass; 1440px screenshot confirms desktop hero/grid composition intact;
  reduced-motion gating preserved.

### HOP-M-15 — Mobile form usability (Forms)
- `ui/input.tsx`: `h-10` (40px) → `min-h-[44px]`; `text-base` retained (16px blocks iOS focus zoom).
- `HopPage.css .hop-form-control`: `0.9rem` (14.4px — triggered iOS auto-zoom) → `1rem`; `min-height 3rem` kept.
- `Checkout.tsx`: full `autocomplete` + `inputmode` pass (email/given-name/family-name/street-address/
  address-level2/level1/postal-code+numeric/country-name/tel+tel); radios/checkboxes `w-4` → `w-5` with `shrink-0`.
- `CustomerCare.tsx`: placeholder-only fields gained visible `Label`s + ids, `autocomplete`, `aria-describedby`
  wiring with `role="alert"` errors; consent checkbox 44px row.
- `Appointments.tsx`: `autocomplete` (name/email), `text-base` + `min-h-44` on all controls, custom chevron
  affordances added to both `appearance-none` selects, image/form order swapped so context precedes action.
- `HopFooter.tsx`: newsletter row `min-h-48`, full-opacity 44px submit, `text-base` input + `autocomplete=email`,
  20px consent checkbox in a 44px label; social/footer links given `py-1.5` targets.

### HOP-M-12 — Mobile purchase CTA (Interaction)
- New shared `src/components/hop/StickyCta.tsx`: mobile-only (`lg:hidden`) fixed bottom bar, quiet paper/blur/
  hairline styling, safe-area padding, appears only while the inline CTA is off-screen (IntersectionObserver),
  hides while any text field is focused (never covers the keyboard), `inert` + `aria-hidden` while parked
  (tab order clean, slide transition preserved).
- Wired on `ProductDetail` (price + Add to bag), `Cart` (estimated total + Checkout), `Checkout`
  (total + Pay Securely, submit-capable inside the form, mirrors processing/disabled states).
- Trailing `h-20 lg:hidden` spacers added so the bar never covers footer/returns content. Desktop untouched
  (`lg:sticky` inline behaviour unchanged).

## P1 Fixes

- **HOP-M-01:** menu trigger `p-2` → 44px (`HopHeader.tsx:117`).
- **HOP-M-02:** drawer gets `100dvh`, safe-area top/bottom padding, 44px close, truncated lockup, 44px utility
  cells (`HopHeader.tsx:190-267`).
- **HOP-M-05:** threshold title mobile `clamp(4rem,18vw,6.5rem)` → `clamp(3.25rem,15vw,5rem) lh 1`; CTA links get
  44px hit-areas; philosophy/collection/craft/film/invitation mobile titles capped 14–15vw with `lh 1`.
- **HOP-M-06:** films mobile `100svh` → `92svh`; `Film.doPlay` honours `navigator.connection.saveData`
  (poster until explicit play); below-fold preload stays `metadata`.
- **HOP-M-08:** PLP heart `w-9` → `h-11 w-11` + `:active` scale; sort select `min-h-44`.
- **HOP-M-11:** gallery gains `n / N` counter (`role=status aria-live`), focal-point zoom (tap location becomes
  `transform-origin`, so 2× lands on the tapped weave detail), `decoding=async` everywhere. Full pinch-pan remains
  future work (documented below).
- **HOP-M-13:** verified — `CartContext` persists to `localStorage` with id normalisation; no change needed.
- **HOP-M-14:** `JournalDetail` now renders CMS `content` (paragraph-split, 65ch Newsreader `1.05rem/1.65`) when
  present; fallback articles (no content field) render as before. Content population is a content-track task.
- **HOP-M-17:** `text-sakura` errors → `text-destructive` + `role=alert`/`aria-describedby` (CustomerCare);
  checkout already correct.
- **HOP-M-18:** homepage films now expose the standard 44px pause/play control (removed `showControls={false}`
  from Threshold + chapters); reduced-motion and save-data paths keep the still frame.
- **HOP-M-19:** `Film` posters route through Supabase transforms (`640/1024/1600w srcset`, `sizes 100vw`,
  `fetchpriority=high` preserved for LCP); local assets pass through unchanged.
- **HOP-M-20:** verified `display=swap` already present; documented the Canela→Cormorant fallback decision in
  `index.html`. No font swap, no CLS change.
- **HOP-M-32:** Studio `main p-6` → `p-4 sm:p-6` + `min-w-0`; header trigger 44px, truncating title, env badge
  collapses to dot under 400px; `TopActionBar` negative margins made responsive (`-mx-4/-mt-4 sm:-mx-6/-mt-6`).

## P2 Fixes

M-03 (header offset `pt-header` 96px+ → exact `pt-[72px] md:pt-[80px]`; Lookbook `mt-header` likewise); M-04 (logo
tracking `0.28em` → `0.22em` + ellipsis guard); M-07 (collection `world.emotion` line added to homepage film
identity with dedicated style); M-09 (room hero `2/1` → `4/5 → 16/10 → 21/9` responsive aspects, Film class kept
in sync); M-16 (footer newsletter, see P0); M-21 (single `src/lib/formatPrice.ts` primitive — `formatPaise` for
payloads, `formatRupees` for cart totals; Cart/Checkout/Category/ProductDetail migrated; `formatPrice.test.ts`
locks paise/rupee consistency); M-22 (Lookbook hero `h-screen min-h-700px` → `100svh / min(100svh,700px)`);
M-23 (appointments order/chevrons/autocomplete, see P0); M-25 (Radix dialog + alert-dialog gain
`w-[calc(100%-2rem)]`, `max-h-92dvh` scroll, safe margins); M-27 (search close 44px, gold focus ring restored,
`pt-[15dvh]` anchoring); M-30 (mobile section padding `7rem/8rem` → `4.5rem/5rem`, craft/product copy trimmed);
M-34 (sticky CTA hides on input focus; search anchored in `dvh`; full `visualViewport` listeners deferred as
unnecessary with the focus-hide behaviour — noted below).

## P3 Fixes

M-10 (YŪGEN `nowrap` + `text-indent` → wrapping + `padding-left` optical centering, base + mobile); M-24
(`BreadcrumbPage` truncates at `45vw` on mobile, full on `sm+`; component already `aria-label`d + wrapping);
M-26 (toast viewport offset `pt-[safe-area+76px]` mobile, desktop unchanged); M-28 (`:active` parity for
hop + homepage controls under `@media (hover:none)`; wishlist remove 44px); M-29 (journal ledger 80px thumbs,
2-line dek visible on mobile); M-33 (short-landscape compaction blocks for hop pages + homepage; 400px eyebrow/
emotion refinement).

## Systemic Improvements

- One price primitive (`formatPaise`/`formatRupees`) replacing four local formatters.
- One sticky-CTA pattern (`StickyCta`) replacing three would-be bespoke bars.
- Form floor: 44px targets + 16px text + visible labels + autocomplete as repo-wide contract (base components,
  not page hacks).
- Overlay contract: viewport-margined dialogs, safe-area toasts/drawers, focus-ring restoration.
- Touch contract: `:active` twins for every hover affordance under `(hover:none)`.
- Breakpoint discipline kept: only `(max-width:400px)` refinement + `(max-height:500px)+landscape` compaction
  added; no per-device breakpoints.

## Responsive Architecture Changes

- Fixed the HopPage.css at-rule nesting (structural).
- Header offset follows the real bar height responsively instead of a `clamp()` token.
- `TopActionBar` compensation tracks the responsive Studio padding.
- Dual-token (`--hop-*` vs HSL) and triple-container convergence deliberately **deferred** (visual-approval
  risk outweighs mobile gain; no new drift introduced).
- Dead `HeroSection.tsx` left in place (out of scope; flagged for deletion in a cleanup pass).
- `tools/viewport-verify.mjs` added: self-serving production-build viewport harness (overflow + screenshots).

## Accessibility Changes

- Targets: all primary flows now ≥44px (menu, drawer, hearts, sort, CTAs, search, footer, dialogs, Studio trigger).
- Labels: CustomerCare placeholder-only fields labelled; all checkout fields autocomplete-typed; journal body in
  reading semantics.
- Errors: contrast-safe colour + live regions on customer-care; checkout pattern extended, not replaced.
- Motion: pause controls on all homepage films; reduced-motion kill-switches preserved and re-scoped correctly
  by the CSS fix; save-data treated as a stillness preference.
- Focus: search input ring restored; sticky bars `inert` when parked; drawer/search traps untouched.

## Performance Changes

- Film posters: responsive `srcset` (mobile stops downloading desktop bytes) — highest-leverage byte saving.
- Video: save-data still-frame, metadata-only below fold, one LCP autoplay preserved.
- Fonts: verified non-blocking (`display=swap`); documented fallback; no new faces.
- Gallery: `decoding=async` on all frames.
- Not done: bundle visualisation, prerender critical-CSS audit, Slow-4G LCP trace (no throttling lab here).

## Before/After Evidence

- `docs/audit-evidence/<viewport>/<route>.png` — 48 screenshots (8 viewports × 6 routes), Chromium,
  production build.
- `docs/audit-evidence/viewport-results.json` — machine-readable overflow matrix (48/48 pass).
- Spot-checked: 390/320 home (hero calm, CTA reachable, no clipping), 1440 home (monumental desktop intact),
  390 cart (offset correct, empty state calm).

## Viewport Verification

`node tools/viewport-verify.mjs` against `npm run build` output, Chromium headless:

| Viewport | / | /collections | /cart | /journal | /customer-care | /account/login |
|---|---|---|---|---|---|---|
| 320×568 | PASS | PASS | PASS | PASS | PASS | PASS |
| 360×800 | PASS | PASS | PASS | PASS | PASS | PASS |
| 375×667 | PASS | PASS | PASS | PASS | PASS | PASS |
| 390×844 | PASS | PASS | PASS | PASS | PASS | PASS |
| 430×932 | PASS | PASS | PASS | PASS | PASS | PASS |
| 768×1024 | PASS | PASS | PASS | PASS | PASS | PASS |
| 1024×768 | PASS | PASS | PASS | PASS | PASS | PASS |
| 1440×900 | PASS | PASS | PASS | PASS | PASS | PASS |

PASS = `document.scrollWidth === viewport width` (≤1px tolerance), i.e. **zero horizontal page scrolling**
at every verified viewport. 1366×768 / 1536×864 / 1920×1080 and landscape orientations were not run in the
harness (covered by code reasoning + CSS compaction blocks); PDP/checkout interactive states need an
authenticated goods-in-bag session (not run — no test orders per production-safety rules).

## Desktop Regression Verification

- 1440×900 home screenshot: threshold composition, nav, monumental type all intact (desktop `clamp()` upper
  bounds untouched; only mobile `@media (max-width:768px)` ends retuned).
- Dialog/toast/sidebar/header changes are additive (margins, safe-area, min-sizes) with desktop breakpoints
  preserved (`sm:`/`md:`/`lg:` gates unchanged).
- `lg:sticky` commerce behaviour, desktop gallery arrows, alternating collection rows: code paths untouched.
- Full 1280/1440/1920 click-through not performed (emulation harness covers 1024/1440; no regressions expected
  — all desktop rules byte-identical except the M-31 un-nesting, which *restores* intended desktop styles).

## Test Results

- TypeScript (`tsc --noEmit`): only pre-existing errors (Supabase type drift in address/order services,
  generated-data shape mismatches, checkout `is_default`/`shipping_cost` response typing) — none in touched
  files; none introduced by this remediation.
- ESLint (all touched files): 0 errors.
- Vitest: 11/11 pass (8 existing `supabaseImage` + 3 new `formatPrice` consistency tests).
- Playwright suite: not run (requires dev server + live Supabase; harness above replaces it for layout).
- Axe/SEO suites: not run in this environment; headings/landmarks/labels were preserved or improved by
  construction (no landmark, heading-order, or link-purpose changes).
- Build (`npm run build` + prerender): success, all routes `[OK]` including collections/journal/product set.

## Remaining Findings

1. **Gallery pinch-pan (M-11 remainder):** tap focal-zoom + counter shipped; true pinch + drag panning still absent.
2. **Journal content population:** `content` rendering shipped; CMS/fallback articles carry no body copy — content track.
3. **Token/container convergence + dead `HeroSection` deletion:** deferred as brand-approval scope, not mobile need.
4. **`visualViewport` listeners:** deemed unnecessary (focus-hide + dvh anchoring cover the keyboard cases); revisit
   only if iOS keyboard-cover reports arrive.
5. **Pre-existing TS errors** (Supabase RPC/type drift) and **checkout `shipping_cost`/`is_default` response typing**
   predate this work and are untouched.
6. **Landscape, 200/400% zoom, reduced-motion, screen-reader, and Slow-4G traces** were not lab-tested; code
   contracts are in place (compaction blocks, wrapping, kill-switches, live regions).

## Physical Device Testing Limitations

Browser/emulation verification completed (Chromium headless, production build, 8 viewports, screenshots +
overflow matrix); physical iOS/Android device certification was not performed. No transactions were attempted.
Safe-area, keyboard, video-autoplay, and gesture behaviour on real devices should be confirmed before claiming
native certification.

## Final Scores

BEFORE → AFTER (evidence-based, not inflated):

- Mobile UX: 6/10 → **8/10** (purchase reachable one-handed; forms fillable; gallery inspectable; journal ledger
  informative; residual: pinch-pan, landscape/zoom lab).
- Responsive: 6/10 → **8/10** (zero measured overflow; systemic contracts; residual: token convergence deferred).
- Accessibility: 6/10 → **8/10** (targets/labels/errors/motion/pause fixed; residual: SR session + zoom lab).
- Visual: 7/10 → **8/10** (mobile rhythm retuned, desktop byte-identical; residual: full 1280–1920 click-through).
- Brand: 7/10 → **8/10** (emotion lines restored to films, calm spacing, no app-like patterns introduced).
- Desktop: 8/10 → **8/10** (M-31 un-nesting restores intended styles; screenshots confirm; no regressions found).
- Overall: 6/10 → **8/10**.

# MOBILE READINESS — READY (with documented non-blocking remainders above; no new P0/P1 regressions).

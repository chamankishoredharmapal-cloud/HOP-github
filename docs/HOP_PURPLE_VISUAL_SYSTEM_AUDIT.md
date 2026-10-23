# House of Padmavati — Palette Visual System Audit

Date opened: 2026-10-19
Date closed: 2026-10-22
Repository: `E:\HOP`
Branch: `main` (baseline commit `76ae7ac`)

> Historical filename retained for link continuity. The purple/Royal Violet proposal below was rejected during design review. The implemented and verified palette is the warm neutral / dusty mauve system documented in `HOP_VISUAL_DESIGN_SYSTEM.md`.

## 1. Final palette

| Role | Token | HSL | Hex |
| --- | --- | --- | --- |
| Page ground | `--brand-ivory` | `30 30% 96%` | `#F8F5F2` |
| Raised surface | `--brand-ivory-bright` | `30 42.8571% 97.2549%` | `#FBF8F5` |
| Quiet panel | `--brand-ivory-muted` | `21.8182 29.7297% 92.7451%` | `#F2EBE7` |
| Material | `--brand-mauve` | `5.7143 21.2121% 61.1765%` | `#B18B87` |
| Material light | `--brand-mauve-light` | `6.6667 24.3243% 70.9804%` | `#C7A7A3` |
| Material soft | `--brand-mauve-soft` | `5.625 34.0426% 81.5686%` | `#E0C3C0` |
| Action | `--brand-violet` | `6.3158 17.757% 41.9608%` | `#7E5C58` |
| Action deep | `--brand-violet-deep` | `6.6667 20.2247% 34.902%` | `#6B4B47` |
| Ink | `--brand-plum` | `17 9% 15%` | `#2A2523` |
| Ink raised | `--brand-plum-raised` | `18 9% 21%` | `#3A3431` |
| Ink deep | `--brand-plum-deep` | `20 11% 11%` | `#1F1B19` |
| Accent | `--brand-gold` | `5.625 34.0426% 81.5686%` | `#E0C3C0` |
| Accent light | `--brand-gold-light` | `6.6667 36% 90.1961%` | `#EFDFDD` |
| Accent deep | `--brand-gold-deep` | `6.3158 17.757% 41.9608%` | `#7E5C58` |
| Muted text | `--brand-muted` | `16 7% 32%` | `#574F4C` |
| Line | `--brand-line` | `23 16% 84%` | `#DDD5D0` |
| Line strong | `--brand-line-strong` | `19 12% 68%` | `#B7AAA4` |
| Error | `--brand-error` | `4.2478 53.0516% 41.7647%` | `#A33A32` |
| Error light | `--brand-error-light` | `7 59% 73%` | `#E39B92` |
| Overlay | `--overlay` | `17 16% 9%` | `#1B1513` |

The older HSL approximations were replaced because they rendered 1-2 RGB units off the approved values. Computed browser styles now return exact targets: body `rgb(248, 245, 242)`, ownership `rgb(177, 139, 135)`, journal `rgb(224, 195, 192)`, footer `rgb(42, 37, 35)`.

## 2. Original audit findings and disposition

1. **Two competing token sets.** Resolved: `src/index.css` is the single source; legacy `--rasa-*`, `--paper-*`, `--ink*` and `--hop-*` names alias the canonical tokens. `HomepageExperience.css` consumes the shared values.
2. **Hard-coded legacy colours.** Resolved for the storefront palette: legacy crimson/rose/mulberry/gold values were removed from the visual system. Collection accents now use the mauve family.
3. **Non-palette asset.** Resolved: the signature monogram renders through palette tones (`gold`, `gold-deep`) rather than a fixed crimson PNG fill.
4. **Low-contrast accent usage.** Resolved: blush is decorative on light grounds; deep mauve carries accent text. See the contrast contract in the design system document.
5. **CTA drift.** Resolved: storefront primary actions use deep mauve with warm off-white text.
6. **Raw whites and blacks.** Resolved on reviewed storefront routes: raised surfaces use `#FBF8F5`, not `#FFFFFF`; modal scrims use the charcoal overlay token.
7. **Homepage surface repetition.** Resolved: ownership is dusty mauve, journal is muted blush, cinema and footer are charcoal, pages are warm off-white.
8. **Status colours.** Storefront statuses map to the palette. Studio retains functional semantics while inheriting the neutral tokens.
9. **Duplicate shadows/effects.** Consolidated onto the charcoal-tinted shadow scale in `src/index.css`.
10. **Data-driven accents.** Collection worlds now resolve to the mauve family; no legacy accent hex remains in storefront data.

## 3. Fixes made during final verification

- Corrected the mauve/blush/charcoal HSL channels to exact approved hex values.
- Forced `color-scheme: dark` for the footer consent checkbox so it no longer renders pure white on charcoal.
- Added an `onError` fallback to both checkout order-summary image locations; the Supabase render URL was failing while the canonical object URL still loaded.
- Added an accessible `h1` to the homepage. The homepage previously had zero `h1` elements, failing the heading-hierarchy E2E check.
- Fixed the Kalyani portrait card on `/collections` collapsing to 0x0 by adding `w-full` alongside the `max-w-sm`/`sm:max-w-md` and `mx-auto` constraints.

## 4. Verification results

| Check | Command | Result |
| --- | --- | --- |
| Production build + prerender | `npm run build` | PASS — 29 routes prerendered |
| Lint | `npm run lint` | PASS |
| Unit tests | `npm test` | PASS — 8 files, 71 tests |
| Type check | `npx tsc -p tsconfig.app.json --noEmit` | FAIL — 76 pre-existing errors in 12 files; see §5 |
| Chromium E2E, targeted | `npx playwright test ... --project=chromium` | PASS after heading fix — 61/62 initially; Accessibility suite 19/19 after `h1` addition |
| Mobile Chrome E2E, targeted | auth, SEO, Studio | 28/29 passed; one Studio test uses a desktop-only nav selector (see §5) |
| Axe WCAG 2.1 A/AA | home, collections, Kalyani, checkout (empty and item) | Zero violations, desktop and mobile |
| Computed palette | browser diagnostic | Exact RGB matches; zero horizontal page overflow |

Screenshots and machine-readable diagnostics: `test-results/palette-verification/`.

## 5. Remaining issues outside the palette change

1. **Product photography data (staging blocker).** Supabase still returns terminal/browser screenshots for some products and a swatch infographic for the Padma collection card. The palette cannot be signed off as production-ready while product imagery is incorrect.
2. **Supabase generated types are stale.** 76 TypeScript errors remain across 12 files (`site_sections`, `published_sections`, `media_assets`, customer address/profile RPCs, journal revisions, order statuses, and `restoreMedia`/`purgeMedia` hooks). The same errors are present at `HEAD`; regenerate types from the live schema to clear them.
3. **Remote journal image.** The "New Arrivals" Supabase render URL is blocked by ORB in Chromium. Use the canonical object URL or re-upload the asset.
4. **Mobile E2E selector.** `Studio.spec.ts:63` looks for a visible desktop navigation link; the link is intentionally hidden inside the mobile drawer. The drawer itself was opened, screenshotted, and keyboard-focus checked.
5. **Dark mode.** No ThemeProvider/theme switch is mounted, so dark-mode appearance is unverified and unreachable.
6. **Test data.** Checkout flows were exercised with mocked auth/orders; no real payment or production customer data was used.

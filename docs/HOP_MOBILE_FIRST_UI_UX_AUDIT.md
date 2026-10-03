# HOP Mobile-First UI/UX Audit

> **Audit only — no code was modified.**
> Method: repository static inspection + production DOM fetch (`https://houseofpadmavati.pages.dev`).
> No device lab, no screenshots, no transactions were performed. Viewport findings below are
> derived from computed CSS values, class analysis, and layout reasoning — each issue lists
> the exact file/selector so an implementation agent can reproduce it in DevTools.
> Production and repository behaviour matched on homepage structure at time of audit
> (Threshold → Philosophy → Material → 5 Collection Films → Craft → Ownership → Journal → Invitation).
> A dead `HeroSection` component exists in-repo but production uses `Threshold`; documented below.

---

## 1. Executive Summary

HOP is **functionally responsive** — nothing is catastrophically broken — but it is **not yet intentionally mobile-first**.
The implementation is a desktop editorial system that collapses gracefully, not a mobile experience that expands.

What works:

- Single global header/footer system (`HopHeader`, `HopFooter`, `PageLayout`), skip link, focus-visible ring.
- `100svh` used for the most cinematic surfaces (threshold, collection films, craft) — correct modern choice.
- Touch targets are 44px in most commerce controls (cart qty, gallery zoom, film play/pause).
- Reduced-motion is respected in `Film` and homepage CSS.
- Supabase image transforms + `srcset` exist on product pipelines.
- Body scroll-lock + focus management exist for menu and search (rare for a boutique build).

What fails the "House, Not a Shop" bar on a 390px screen:

1. **Monumental type + monumental whitespace, tight horizontal room.** Display titles at 17–20vw with `line-height 0.96–0.98`
   and section padding of `7rem top + 8rem bottom` make mobile feel simultaneously shouty and empty, with long
   500vh+ scroll runs (5 × `100svh` films back-to-back).
2. **Collection films lose their story on mobile.** Homepage films show monogram + name only; the `world.emotion`
   line that gives each room meaning is only rendered on `/collections` and `/collections/:slug`.
3. **No sticky mobile commerce CTA.** Product detail buries "Add to bag" below gallery + story + accordions;
   cart buries "Checkout" below every line item. One-handed checkout is painful.
4. **Two design-token universes, three container systems, five button systems.** `src/index.css` (HSL vars) vs
   `HomepageExperience.css` (`--hop-*` hex), `container 1.5rem` vs `hop-page__room clamp()` vs ad-hoc `px-6`,
   shadcn buttons vs `hop-cta-primary` vs `hop-primary-button` vs pill CTAs vs arrow links.
5. **Form system is inconsistent and under-labelled.** `h-10` shadcn inputs next to `min-h-3rem` hop controls,
   bottom-border-only inputs, placeholder-only labels (CustomerCare, Appointments), missing `autocomplete`/`inputmode`,
   16px radios/checkboxes, `text-sakura` error colour with likely contrast failure.
6. **Breakpoint strategy is coarse.** Tailwind `sm/md/lg/xl` + two custom `@media (max-width: 768px / 1279px)` blocks + one
   `useIsMobile(768)` hook (appears unused). Nothing distinguishes 320 vs 390 vs 430; fluid `clamp()` is used for type
   but not for layout rhythm.
7. **No safe-area handling anywhere.** Zero `env(safe-area-inset-*)` usage. Fixed header, full-screen drawer,
   dialogs, toasts, and sticky elements will crowd the notch / home indicator.
8. **Studio is desktop software squeezed into a phone.** Fixed `p-6`, icon-collapsible sidebar, data tables, and
   workspace forms have no mobile transformation.

Verdict: **READY WITH MAJOR FINDINGS** (see §38). Ship-blocking P0 count is low, but P1 density is high enough
that a luxury buyer on a mid-range Android will feel friction on every core journey.

---

## 2. Audit Scope

- **Code inspected:** `package.json`, `index.html`, `vite.config.ts`, `tailwind.config.ts`, `src/index.css`,
  `src/App.css` (empty override), `src/App.tsx` (full route table), `src/components/hop/*` (Header, Footer,
  HomepageExperience + CSS, Film, CollectionStage, ProductGallery, CollectionFilms, HopPage.css),
  `src/components/layout/PageLayout.tsx`, `src/components/ui/*` (button, input, dialog, sheet, drawer, OptimizedImage),
  `src/components/search/SearchModal.tsx`, `src/pages/*` (Index, Category, Collections, ProductDetail, Cart, Checkout,
  Wishlist, Journal, JournalDetail, Lookbook, Appointments, Gift, CustomerCare, OurStory, account/Login),
  `src/studio/components/*` (StudioLayout, Sidebar, StudioHeader), `src/hooks/use-mobile.tsx`,
  `src/lib/supabaseImage.ts`.
- **Production fetched:** `/` (full DOM → markdown). Other routes inferred from code; not live-driven.
- **Not performed:** real purchases, Razorpay flows, authenticated Studio sessions, device-lab screenshots,
  network throttling, screen-reader sessions. Where dynamic behaviour matters, the report states how to reproduce.
- **Out of scope per instructions:** backend, payments architecture, production data, deployments.

---

## 3. Current Responsive Architecture

### 3.1 Stack

- Vite 5 + React 18 + React Router 6 + TanStack Query 5 + Tailwind 3.4 + Radix primitives + shadcn/ui + Embla carousel.
- Prerender script (`scripts/prerender.js`) + `usePrerenderReady` gates per page.
- Manual vendor chunking (`vendor-icons/charts/supabase/query/radix`) — sensible.

### 3.2 Token systems (duplicated)

| System | Location | Form |
|---|---|---|
| Global HSL tokens | `src/index.css :root` | `--rasa-lac`, `--paper-ivory`, `--ink-soft`, `--radius: 0.125rem`, spacing `header/section*/commerce` as `clamp()` |
| Homepage hex tokens | `src/components/hop/HomepageExperience.css :root` | `--hop-lac #2B0E17`, `--hop-cream #F5E8DC`, etc. — near-duplicates of rasa tokens, different values |
| Tailwind extension | `tailwind.config.ts` | `font-serif/editorial/reading`, `spacing.header/section*`, `maxWidth.reading 65ch`, container `padding 1.5rem`, `2xl 1440px` |
| Page CSS | `src/components/hop/HopPage.css` | `.hop-page__room/section/title/panel/form-shell/cta-*`, own breakpoints |

There is no single source of truth. A colour changed in `index.css` will not move the homepage.

### 3.3 Container systems (three)

1. Tailwind `.container` — centered, `padding 1.5rem`, `2xl 1440px` (`HopHeader`, cart/wishlist mains).
2. `.hop-page__room` — `width min(100%, 88rem); padding-inline clamp(1.25rem, 4vw, 4rem)` (most storefront pages).
3. Ad-hoc `px-6` / `px-1.25rem` / `7vw` (Threshold `clamp(1.25rem, 7vw, 8rem)`, Lookbook `px-6`, Studio `p-6`).

Result: left/right alignment drifts between header (24px), threshold (~27px at 390), and generic pages (20px at 390).

### 3.4 Breakpoint strategy

- Tailwind defaults: `sm 640, md 768, lg 1024, xl 1280, 2xl 1440`.
- Custom: `HomepageExperience.css` `@media (max-width: 1279px)` + `@media (max-width: 768px)`;
  `HopPage.css` `@media (max-width: 900px)` + `@media (max-width: 768px)`.
- JS: `useIsMobile()` = `< 768px` (no other hook; appears unused by the inspected components).
- No 320/360/390/430 differentiation; no `xs` token; layout jumps happen only at 768/1024/1280.

Assessment: **coherent enough to avoid breakage, too coarse for luxury mobile tuning.** The project relies on
fluid `clamp()` type + single-column collapse rather than intentional small-screen composition.

### 3.5 Grid / card / image conventions

- Product grids: `grid-cols-2` mobile → `lg:grid-cols-3/4`. Consistent 4/5 image ratio. Good.
- Journal: lead + notes grid → single column. Good.
- Craft / ProductDesire / Collections rows: 2-col grid → `display:block`. Good collapse, but vertical rhythm
  becomes extreme (see §10).
- Images: three pipelines — (a) Supabase transform URLs + `srcset` (products), (b) manifest `OptimizedImage`
  (editorial, only when `assetPath` resolves), (c) plain `<img>` imports (Lookbook, craft, fallbacks, all `Film` posters).
  `Film` posters — the LCP element on every cinematic surface — are pipeline (c): **no `srcset`**.

### 3.6 Navigation / overlay systems

- `HopHeader` fixed, hide-on-scroll, transparent→solid. Mobile drawer is conditional JSX (`{open && ...}`), not Radix.
- `SearchModal` custom fixed dialog with focus trap + restore + scroll-lock. Good.
- Radix `Dialog/Sheet/Drawer/AlertDialog` available for Studio/checkout-adjacent UI, shadcn-styled.
- Toasts: `Toaster` + `Sonner` both mounted; `toast` region `fixed top-0 w-full` mobile.

---

## 4. Viewport Coverage

Analysis was static (computed `clamp()` at each width + class logic), not device-lab. Table shows reasoning basis.

| Viewport | Method | Coverage |
|---|---|---|
| 320×568 | `clamp()` evaluation, flex/tracking math | Full code reasoning (§7–§11, §26) |
| 360×800 | Same | Full |
| 375×667 | Same | Full |
| 390×844 | Primary reference width | Full |
| 393×873 | Same class as 390 | Full |
| 412×915 / 430×932 | Same | Full |
| 667×375, 844×390 landscape | `svh`/`vh` + drawer/film analysis | Partial (no live rotation test) |
| 768×1024, 820×1180, 1024×768 | Breakpoint-boundary analysis (768/900/1024/1279) | Full reasoning |
| 1280×720, 1366×768 | `lg/xl` analysis | Full |
| 1440×900, 1536×864, 1920×1080 | Container `88rem/1440px` analysis | Full |

Special attention widths 320/375/390/430 all receive explicit notes in the issue register.
No viewport produced a hard breakage (blank page / unusable nav); all P0s are friction/accessibility, not crashes.

---

## 5. Route Coverage

Discovered from `src/App.tsx` (authoritative):

**Public (audited via code; `/` also via production fetch):**
`/`, `/collections`, `/collections/:slug`, `/product/:productId`, `/cart`, `/wishlist`, `/checkout` (ProtectedRoute),
`/order/confirmation/:orderNumber`, `/gift`, `/about`, `/customer-care`, `/privacy-policy`, `/terms-of-service`,
`/shipping-policy`, `/returns-policy`, `/unsubscribe`, `/campaigns/quiet-wedding`, `/lookbook`, `/appointments`,
`/journal`, `/journal/:slug`, account `/account/*` (login, signup, forgot/reset, dashboard, profile, addresses,
orders, orders/:id, wishlist), POC `/poc/media`, `/poc/colors`, catch-all 404.

**Studio:** `/studio/login`, `/studio/reset-password`, `/studio`, `/studio/orders`, `/studio/orders/:id`,
`/studio/products`, `/studio/products/new`, `/studio/products/:id`, `/studio/collections`,
`/studio/collections/new`, `/studio/collections/:id`, `/studio/inventory`, `/studio/customers`,
`/studio/journal`, `/studio/media`, `/studio/activity`, `/studio/settings`.

**Depth:** Header, homepage, PLP (`Category`), collections index, PDP, cart, checkout, wishlist, journal index/detail,
lookbook, appointments, customer-care, about, auth login, Studio shell consumed deeply. Individual Studio workspace
pages (Products/Orders/Inventory/Customers/Media/Activity/Settings internals), Gift, campaign, account sub-pages,
and policy pages were covered at shell/pattern level; per-page deep reads were not performed for every Studio
workspace — flagged as a residual risk in §36 with a generic table→cards remediation.

---

## 6. Mobile Experience Assessment

- **Can a commuter browse?** Yes. Grids collapse, images keep 4/5, sort works, wishlist hearts exist.
- **Can she inspect a drape?** Partially. Swipe works (Embla `dragFree`), thumbs exist, but no dots/counter,
  arrows hidden on touch, zoom is scale-only with no pan — inspecting zari detail is frustrating.
- **Can she read the story?** Yes on PDP/Journal, but homepage films hide the story; long-form `JournalDetail`
  renders only `dek` (no body blocks found in the component — if the CMS returns body elsewhere, wire it; as-read,
  the article ends after the standfirst).
- **Can she understand price/availability?** Yes, but price formatting is inconsistent (see HOP-M-21) and
  low-stock copy is tiny.
- **Can she add to bag and check out one-handed?** With difficulty. No sticky CTA on PDP/cart/checkout;
  checkout summary is correctly `order-first` on mobile but the Pay button sits at the bottom of a potentially
  long aside.
- **Does it feel like HOP?** At 390px it feels monumental rather than calm: enormous display type, vast vertical
  gaps, small tracked labels, back-to-back full-viewport films with identical veils. The restraint survives in
  palette and copy, not in rhythm.

---

## 7. Navigation Audit

**Header** (`src/components/hop/HopHeader.tsx`):

- Height `h-[72px] md:h-[80px]` (§97). `PageLayout` offsets non-hero pages with `pt-header`
  (`spacing.header: clamp(6rem, 8vw, 8rem)` = 96px+ — 24px taller than the bar, leaving a dead band).
- Desktop: editorial left, monogram centre, utilities right. Clean.
- Mobile: hamburger left (`p-2`, ~36px visual — under 44), monogram centre with
  `text-[0.6rem] tracking-[0.28em] whitespace-nowrap` (§133), bag right with proper 44px + badge.
  Wishlist/account/search are drawer-only on mobile — two taps to reach Saved.
- Hide-on-scroll (`-translate-y-full`, §95) is disabled while the drawer is open (correct), but on-page
  anchor navigation (`#philosophy`) and iOS rubber-banding will toggle it rapidly; scroll listener has no
  hysteresis beyond 4px.
- Drawer: `fixed inset-0 z-50 ... overflow-y-auto` inside a `fixed z-50` header (§194). Correctly scroll-locks
  (`body overflow hidden`, §86) and traps Tab + Escape, focuses close button, restores focus to the trigger
  on `closeMenu`. Gaps: no `dvh/safe-area` padding, header row `h-16` (64px vs 72px bar — jump), close button has
  no 44px minimum, bottom utility row (`Search/Account/Saved`, §241–265) is three `flex-1` columns with
  `text-xs tracking-[0.2em]` — at 320px each cell is ~90px and will feel cramped; landscape 667×375 + open
  keyboard is untested. No `aria-hidden` on background content while modal (only focus trap).
- Active state: `aria-current="page"` on editorial links — good. Collection links in drawer have no active state.

**Footer** (`HopFooter.tsx`): brand + newsletter + 4 link columns (`grid-cols-2 md:grid-cols-4`). Newsletter input
row is `flex max-w-sm border-b pb-2` with a 14px checkbox-adjacent consent block; submit button is
`text-[0.65rem] ... opacity-50 pl-4` with no guaranteed 44px height. Social links are bare text rows with no
vertical padding — small targets. Bottom legal row stacks on mobile (good).

**Search** (`SearchModal.tsx`): genuinely good — debounced, arrow-key navigation, `role=dialog aria-modal`,
focus trap + restore, scroll-lock, `max-height min(80vh,44rem)` results scroll. Risks: `pt-[15vh]` top-anchored
dialog + iOS keyboard (`visualViewport` not handled — input can be covered); close button `p-1.5` (~36px);
`Input` override removes the focus ring (`focus-visible:ring-0`) leaving only a faint container.

**Breadcrumbs:** uppercase `0.7rem tracking-[0.3em]` with no truncation (`BreadcrumbPage` renders full product /
collection names). Long names at 320px will wrap into 2–3 lines or push width. No `aria-label="Breadcrumb"` was
visible at call sites (component may provide it; verify).

---

## 8. Homepage / Hero Audit

Two heroes exist: dead `HeroSection.tsx` (16/9 film in a container) and live `Threshold` (`HomepageExperience.tsx`
§146–185 + CSS §77–194). Production uses `Threshold`.

- **Composition (mobile):** full-bleed `100svh` film, bottom-anchored content (`justify-content:flex-end`,
  `padding 7rem 1.25rem 4rem`), eyebrow + `Saree. Time. You.` + supporting line + stacked actions
  (`Enter the House` arrow-link + `Descend into the house` scroll cue). Bottom-anchoring is the right call for
  one-handed reach; the scroll cue is a secondary affordance, fine.
- **Type scale:** `clamp(4rem, 18vw, 6.5rem)` → 57px at 320, 70px at 390, with `line-height 0.96–0.98` and
  `max-width 8ch`. "Saree. Time. You." stacks to three lines and dominates the viewport. It is dramatic, but
  combined with `100svh` it pushes the supporting copy and CTA toward the bottom edge on short (568px) screens.
  At 320×568 the title (~170px) + eyebrow + supporting + actions can exceed comfortable bottom-sheet space and
  collide with the veil gradient's darkest band.
- **CTA:** `hop-arrow-link` is `0.65rem/600/0.2em` uppercase with a bottom border — elegant, but a ~20px-tall text
  link, not a 44px touch target. No button alternative. Work (`Enter the House`) and wayfinding (`Descend`)
  cues stack vertically with `1.25rem` gap — reachable but easy to mis-tap for low-vision users.
- **Media:** `object-position 62% center` mobile (good focal bias), `brightness(0.78)` + dual-gradient veil.
  Contrast of cream on darkened film should pass, but the veil's mid-band is transparent — long titles can cross
  a bright fold. Poster is a plain `<img>` (no `srcset`); video is `preload="metadata"` + `priority` (which forces
  `preload="auto"` in `Film`) — the LCP film eagerly fetches video on mobile networks with no data-saver check.
  `IntersectionObserver rootMargin 200px` is correct; five homepage films each mount their own observer.
- **Motion:** 18s `breathe` scale loop + `prefers-reduced-motion` kill-switch (good). No manual pause on homepage
  films (`showControls={false}`) — a WCAG 2.2.2 concern when five autoplaying surfaces stack (see HOP-M-18).
- **Landscape:** `100svh` in 375px-high landscape = a short, wide letterbox; bottom-anchored content with
  `7rem` top padding will feel crushed. Untested live; code suggests title + actions will overflow the fold and
  require scroll — acceptable, but the veil is tuned for portrait.
- **Dead code:** `HeroSection.tsx` (container 16/9, `width min(92vw,1680px)`, caption row with `flex justify-between`)
  is not rendered by `Index.tsx`. Its caption row (`collectionName` left, `Enter the collections` right, both
  `0.6rem/0.32em`) would collide at 320px. Either delete it or document why it is kept; dead heroes rot.

---

## 9. Typography Audit

System: `serif` Canela Deck → Cormorant fallback; `editorial` Fraunces; `reading` Newsreader; `sans` Suisse/Inter.
`Canela Deck` is referenced but never loaded in `index.html` (only Cormorant/Fraunces/Inter/Newsreader via Google
Fonts, **without `display=swap`**) — every `hop-display`/`hop-page__title` renders in fallback Cormorant on first
paint, then swaps (or never swaps if the licensed face is absent). Confirm whether Canela is intentionally
self-hosted; otherwise the primary display face is a fallback by accident.

| Location | Current | Problem | Mobile → Tablet → Desktop recommendation |
|---|---|---|---|
| Threshold / philosophy / collection titles | `clamp(4–4.5rem, 17–20vw, 6.5–11rem)`, `lh 0.96–0.98`, `ls -0.035em` | Majestic on desktop; shouty + collision-prone on 320–390; descenders tight | Cap mobile at ~3.5–4.5rem (`clamp(3.25rem, 15vw, 5rem)`), relax `lh` to 1.0–1.02 under 768px; keep desktop scale |
| Eyebrows/kickers | `0.6–0.65rem`, `tracking 0.26–0.42em`, uppercase | Exquisite but fragile; long taglines + `whitespace-nowrap` (logo) wrap badly or clip under zoom | Reduce tracking to `0.22–0.28em` under 400px, allow `text-wrap:balance`, never `nowrap` except logo with `overflow-ellipsis` guard |
| Body/reading | Newsreader `clamp(1rem,1.15vw,1.2rem) lh 1.55`, `max-w 25–30rem` | Good. Exception: `hop-philosophy__body` uses Suisse/Inter 0.88–1rem — voice break | Unify philosophy + journal + PDP story on Newsreader; keep `65ch` measure; `1.05–1.15rem/1.6` on mobile |
| Prices | `tnum` tabular, `1.25rem` PDP, `0.9rem` cards | Good; inconsistent formatting (see HOP-M-21) | Single `formatPrice` helper, tabular always, no `whitespace-nowrap` truncation on narrow cards |
| Buttons/links | `0.58–0.7rem`, `tracking 0.18–0.32em`, uppercase 600 | Below comfortable reading size; opacity-50 footer Join; hover-only gap animation has no touch equivalent | Floor interactive text at `0.7rem` mobile, remove `opacity-50`, keep letterspacing; add `:active` state matching `:hover` |
| YŪGEN | Cormorant 300, `0.14–0.16em`, `nowrap`, `text-indent` re-centering | Correct macron fix, but `nowrap` + indent hack breaks under 200% zoom / long translations | Keep face; drop `nowrap` (allow balance), centre with `text-align:center` + `padding-left:0.14em` instead of indent |

Orphans/widows: `text-balance/pretty` is applied on most headings — good. No `hyphens` handling; long collection
names are short enough to avoid it. Detached-macron risk is handled for YŪGEN only; other diacritics (if any) inherit Fraunces.

---

## 10. Spacing & Layout Audit

Measured from CSS (mobile → desktop):

- **Page margins:** header container 24px; `hop-page__room` 20px at 390 (`clamp(1.25rem,4vw,4rem)`); threshold 20px;
  Lookbook/Studio 24px. Three concurrent gutters — align to one scale (recommend `20px <640`, `32px 640–1024`,
  `64px+` desktop, matching `hop-page__room`).
- **Section spacing:** homepage mobile is uniformly `7rem top + 8rem bottom` (philosophy, material, collections,
  ownership, journal) with desktop `clamp(7rem,14vw,13rem)`. On a 390×844 phone each section is 1.5–2 viewports of
  mostly padding. It reads as luxury on desktop and as emptiness + scroll fatigue on mobile. Recommend a mobile
  scale of `4.5rem/5rem` with the same `clamp()` upper bounds.
- **Collection films:** `100svh` × 5 + `0.75rem` gaps = ~500vh of near-identical full-bleed chapters. Each is
  beautiful; together they punish mobile data and thumbs. Recommend alternating with editorial interludes on mobile
  or reducing to `92svh` with visible separation (the 12px gap currently reads as a rendering seam, not a rhythm).
- **Craft/ProductDesire:** `min-height 65–72svh` images + `6–7rem` copy padding. Image and copy never share the
  viewport on mobile — the "dialogue" composition of desktop becomes a slideshow. Acceptable, but the copy padding
  can drop to `4rem` without losing calm.
- **Grid gaps:** `gap-x-5/gap-y-12` product grids are well-judged. Ownership notes `gap 3.5rem` stacked — generous
  but consistent. Journal layout `gap 4rem` — fine.
- **Edge contact:** no content touches viewport edges except full-bleed films (intentional). Dialog `max-w-lg`
  at 320 touches edges (see HOP-M-25); toasts are full-width top (see HOP-M-26).

---

## 11. Product Experience

### Listing (`Category.tsx`, `Collections.tsx`, `FeaturedProducts.tsx`)

- Grid `grid-cols-2` (mobile) with `aspect-[4/5]`, `gap-x-5/gap-y-12` — correct density for sarees; two-up lets
  drape proportions read. Titles `text-base → lg` + price `text-sm` — legible.
- Wishlist heart `w-9 h-9` (36px) over the image corner — under target, overlaps product on small cards (HOP-M-08).
- Sort is a native `<select>` (`py-2`, ~36px) with absolute chevron — functional and zoom-safe, but small and
  desktop-styled; label `Sort` is `0.65rem/0.32em` faint.
- Collection hero `aspect-[2/1]` panoramic on mobile crops drape photography into a letterbox; `Film` play/pause
  (when video present) sits bottom-right over the image. Prefer `aspect-[4/5]` or `16/10` under 640px.
- Breadcrumb + title + count row uses `flex-col sm:flex-row`; count is `whitespace-nowrap tnum` — safe.
- Empty/error/loading states exist and are on-voice. Skeletons use `aspect-[4/5]` — no CLS. Good.

### Detail (`ProductDetail.tsx` + `ProductGallery.tsx`)

- Layout stacks gallery → info; info is `lg:sticky` only — correct (mobile sticky summary would cover content),
  but there is **no mobile sticky Add-to-Bag**, so the primary action scrolls away (HOP-M-12).
- Gallery: Embla `dragFree + trimSnaps`, `sizes 100vw/50vw/640px` + Supabase `srcset [480,800,1200]` — good.
  Thumbnails `grid-cols-4` with 44px minimums — good. Desktop arrows `hidden lg:block` — correct.
  Missing: dots/counter/swipe hint — a first-time buyer cannot tell a 5-image drape from a 1-image drape (HOP-M-11).
  Keyboard: region + ArrowLeft/Right + Escape-to-unzoom — good.
- Zoom: `scale(2)` centred with no pan. On touch, pinch does nothing, tap toggles a centred 2× crop, and the
  dismiss control relocates top-right. Inspecting a border or zari is guesswork (HOP-M-11).
- Info: collection kicker → Fraunces `text-4xl/5xl` title → `text-xl tnum` price → stock line → story → drape line →
  pill `Add to bag` (`flex-1`) + 48px wishlist circle → accordions (Weave/Care/Shipping). Hierarchy is sound;
  stock urgency ("One of a small batch") is quiet — on-brand. Accordions are Radix single-collapsible — touch
  depends on `accordion.tsx` trigger padding (not deep-read; verify 44px).
- Related: `grid-cols-2 lg:grid-cols-4`, hover scale only. Titles `text-base/sm:lg`, price present. No quick-add,
  no wishlist on related — fine for luxury (deliberate slowness), but card tap area is image + title only.

**Mobile journey answers:** browse ✓ · inspect image △ (swipe yes, inspect no) · read story ✓ ·
understand price/availability ✓ (formatting caveat) · add to bag △ (reachable only after scroll) · return △ (no
persistent collection context; back button works, breadcrumb wraps).

---

## 12. Collections Audit

- **Index (`Collections.tsx`):** alternating `lg:grid-cols-12` rows collapse to stacked film-over-copy. Chapter
  labels, emotion lines, accent underlines, `line-clamp-3` stories — the editorial layer survives. Film aspects vary
  by world (`padma square`, `yugen 3/4→4/5`, others `16/10`) — intentional differentiation, good. Entire row is one
  `<Link>` (large target, good) with the "Enter" affordance inside — nested-interactive lint aside, tap behaviour is
  correct. `aria-label="Enter the X collection"` — good.
- **Room (`Category.tsx`):** panoramic `2/1` hero (see §11), breadcrumb, title + tagline + emotion, accent selvedge,
  descriptor pull-quote, story, sort, grid. The `world.emotion` line is present here — this is the voice missing on
  the homepage. Canonical-slug redirect (`spandana → yugen`) is handled client-side — good.
- **Stage (`CollectionStage.tsx`, used elsewhere):** alternating `lg:grid-cols-12` with copy-first/media-first flip.
  Aspect differentiation per world matches index. `Explore {name}` link uses accent border — subtle, premium.
- **Film concept survival:** on desktop the films are cinema; on mobile they are five consecutive full-viewport
  autoplay surfaces with name-only identity, no controls, no copy, identical veils. The concept survives visually
  but not editorially. Controls/perf/identity issues are HOP-M-10, HOP-M-18, HOP-M-19.

---

## 13. Journal Audit

- **Index:** featured `hop-journal-feature` (16/9 image + tag + `text-3xl/5xl` title + dek + Read link) →
  `Earlier entries` ledger rows (`64px → 120px` thumbs, title + dek + arrow). Mobile hides `dek` (`hidden sm:block`)
  and arrow (`hidden sm:block`) — rows become thumbnail + tag + title only. Readable, but the ledger loses its
  reason-to-click on the smallest screens. Thumb 64px is small for a visual index; 80px would carry weave texture.
- **Detail:** `max-w-3xl` centred, back link, tag, `hop-page__title--small`, 16/9 image, `dek` as `text-lg`.
  Measure, size (`1.125rem`), and leading are comfortable for reading. **But no article body is rendered** —
  the component outputs `dek` and stops. If body content lives in a field not consumed here, mobile long-form
  cannot be evaluated further; as-read, every article ends after the standfirst (HOP-M-14). Related content,
  author, date, share, and progress affordances are absent — acceptable restraint if deliberate, but the missing
  body is not restraint, it is a gap.
- **Reading comfort:** line length capped by `max-w-3xl` (~65ch at 18px — good); headings use `text-balance`;
  images are 16/9 with `OptimizedImage` only when `assetPath` resolves, else plain `<img>` without `srcset`.
  No sticky elements interfere. Scroll fatigue is low (articles are short as-rendered).

---

## 14. Cart & Checkout Audit

**Cart (`Cart.tsx`):** empty state is exemplary (icon, voice, single CTA). Full state: header row (Bag · n drapes +
Clear) → `lg:grid-cols-3` items + summary → returns summary. Item rows (96×128 thumbs, truncate title, size,
line-total, 44px remove, 44px stepper with `aria-live` quantity) are one of the best mobile patterns in the repo.
Issues: summary sits **below** all items on mobile with no sticky checkout (HOP-M-12); `totalPrice.toLocaleString()`
is used raw while line items use `formatRupees(paise/100)` — confirm `totalPrice` units (HOP-M-21); returns summary
is long but appropriately placed post-action.

**Checkout (`Checkout.tsx`, ProtectedRoute):** summary `order-first` on mobile — correct (price visibility before
form). Then Contact → Delivery → Gift → Payment → consent → Pay. Step breadcrumb (Bag/Details/Confirm) is present.
Validation is inline with `aria-invalid` + `aria-describedby` — good. Saved-address radio cards are large targets —
good. Issues:

- Inputs are shadcn `h-10` (40px) with `rounded-none` overrides in places; hop controls are `min-h-3rem`.
  Neither guarantees 44px everywhere; `postalCode/country/phone` rows are cramped `grid-cols-2` (HOP-M-15).
- `autocomplete`/`inputmode` are missing on nearly every field (only login has `autocomplete`; checkout email has
  `type=email` but no `autocomplete=email`; phone has `type=tel` but no `autocomplete=tel`; postal has neither
  `autocomplete=postal-code` nor `inputmode=numeric`) — iOS/Android autofill and keyboards underperform (HOP-M-15).
- Country is a free-text input; saved-address and payment radios are 16px natives (whole-card click saves them,
  but the visible control is tiny).
- Payment option copy (`Pay ₹X now, remaining ₹Y at delivery`) is clear; deposit math is client-side — verify
  against server totals before capture (not a UI defect, noted for implementation).
- Pay button (`h-12` pill) sits at the bottom of the aside — under long item lists it is far below the fold with
  no sticky alternative (HOP-M-12). Error copy (`text-red-500`, amber inventory box) is present with
  `role=alert aria-live` — good; colour contrast of `red-500` on cream should be verified (likely ~4:1, borderline).
- Auth gate (`ProtectedRoute`) mid-checkout: a signed-out buyer hitting `/checkout` is redirected to login with
  `state.from` — cart contents persist via context? Verify persistence across the auth round-trip (localStorage?
  context-only would lose the bag on refresh — HOP-M-13).

No transactions were attempted. Do not add test orders to production.

---

## 15. Forms & Input Audit

| Form | Controls | Labels | Touch | Keyboard/autofill | Errors |
|---|---|---|---|---|---|
| Checkout | `Input h-10` + radios/checks `w-4` | Visible `Label`s — good | ~40px inputs, 16px radios | `type` only; no `autocomplete`/`inputmode` | Inline + `aria-describedby` — good |
| Login/Signup | `Input h-12` (48px — good) | Visible labels — good | Good | `autocomplete=email/current-password/new-password`(verify signup) — good | `Alert destructive` — good |
| CustomerCare | Mixed `hop-form-control` + bottom-border `Input`s | **Placeholder + `aria-label` only** on all fields | 48px where hop class applies; bottom-border rows ~40px | No `autocomplete` | `text-sakura` (light pink — contrast fail likely), no `aria-describedby` wiring |
| Appointments | Bottom-border inputs/selects/textarea | Visible `<label>`s — good | `py-3` rows ≈48px — OK | No `autocomplete`; `<select appearance-none>` with **no chevron** | Browser-native only (mock submit) |
| Footer newsletter | Borderless input + `Join` | `sr-only` label — acceptable | Input row <44px; `Join` tiny + `opacity-50` | `type=email`, no `autocomplete=email` | Inline `role=alert` — good |
| Gift | `hop-form-shell` + `hop-form-control` | (Pattern-level; not deep-read) | Likely 48px | Verify | Verify |

Cross-cutting: shadcn `Input` is `text-base` mobile (16px — **prevents iOS focus zoom**, keep) with `md:text-sm`.
Any custom input that drops below 16px on mobile will trigger zoom — audit `hop-form-control` (`0.9rem = 14.4px`!)
for this: 14.4px inputs **will** cause iOS auto-zoom, a P1 (HOP-M-15). Focus rings: global gold `:focus-visible`
is good, but `SearchModal` explicitly disables it on its input.

---

## 16. Touch Interaction Audit

- **Passing (44px+):** header bag, cart remove/stepper, gallery zoom in/out, film play/pause, product wishlist
  circle (48px), login inputs/buttons, wishlist `Move to Bag` (`min-h-44`), checkout Pay (`h-12`).
- **Failing:** header hamburger (`p-2`), PLP wishlist heart (`36px`), search close (`p-1.5`), sort select
  (`py-2`), footer `Join` + social rows, CustomerCare/Appointments checkboxes/radios (16px), dialog close
  affordances (`right-4 top-4` icon with no padding guarantee in Radix defaults).
- **Spacing between targets:** PLP hearts sit 12px from card edges — adjacent-card mis-taps are unlikely (cards
  are 12px+ apart) but the heart overlaps product imagery. Drawer bottom triple-row cells have no dividers;
  add `min-h-44` + separators.
- **Gestures:** Embla `dragFree` swipe is the sole mobile gallery control (no dots/counter) — discoverability is
  the gap, not the gesture. Zoom is tap-toggle, not pinch — the gap is capability. Collection films and lookbook
  have no swipe affordance (they are scroll-native — fine). Accordions/tabs/dropdowns are Radix — keyboard-safe;
  verify trigger padding.
- **Desktop-only interactions:** hover scale on cards/films (`group-hover:scale`), hover gap-widen on arrow links,
  hover image saturation. None have `:active` equivalents — touch users get no feedback. Add
  `@media (hover:none)` active states rather than removing hover.

---

## 17. Image & Video Audit

**Images:**

- Product pipeline (Supabase `render/image` + `format=webp&q80` + `srcset`): `Category` `[360,640,840]`,
  `ProductGallery` `[480,800,1200]` + `sizes`, `Cart/Wishlist` 160px thumbs. Correct. `sizes` values match layouts.
  Fallback `onError` swaps to canonical URL — resilient. Non-Supabase URLs pass through (local assets) — correct.
- Editorial pipeline (`OptimizedImage` AVIF→WebP→fallback with manifest + `width/height` for CLS): used only when
  `assetPath` resolves; otherwise plain `<img>` with no dimensions. Journal/Category fallbacks are therefore
  CLS-exposed. `Film` posters never use either pipeline — plain `<img>`, no `srcset`, no dimensions (container
  aspect + background colour mitigate CLS, but 320px phones download desktop-weight stills).
- Ratios: 4/5 products (correct for sarees), 16/9–16/10 editorial, 3/4→4/5 YŪGEN, square Padma, 1/1 thumbs.
  `object-cover` everywhere with per-world `object-position` — focal control is thoughtful. No `object-position`
  on product images (centre-crop default will decapitate drape shots with off-centre subjects — spot-check).
- `loading`: `eager + fetchpriority=high` on first gallery image / featured journal / threshold poster (correct LCP);
  `lazy + async` elsewhere (correct). `decoding="sync"` on first gallery image is unusual (blocks? — prefer `async`
  everywhere except LCP-critical).

**Video (`Film.tsx`):**

- Native `<video muted loop playsInline>` + poster underneath + fade-in on `loadeddata` + `IntersectionObserver`
  (`rootMargin 200px`, disconnect on entry) — disciplined. `preload="metadata"` default, `auto` when `priority`.
- Autoplay respects `prefers-reduced-motion` (mount-time + play-time double-check — good) and catches play
  rejections. Poster-only fallback on error — quiet and correct.
- Gaps: threshold `priority` forces `preload="auto"` on mobile networks (LCP video competes with fonts/API);
  five homepage + N collection videos each fetch independently (no shared preload budget, no data-saver check,
  no resolution switching — one MP4 per film); homepage films expose **no pause control** (`showControls=false`);
  play/pause button elsewhere is 44px and labelled — good.

**Ideal behaviours:**

- Mobile: poster `srcset` (480/800w) + `sizes 100vw`; video `preload="none"` until tap-to-play **or** keep one
  autoplay hero only; collection films `preload="metadata"` + pause controls.
- Tablet: same with `sizes 100vw` (films) / `50vw` (split imagery).
- Desktop: `preload="metadata"`, full autoplay, hover polish retained.

---

## 18. Mobile Performance Audit

Perceived-performance focus (no lab traces; reasoning from code + asset graph):

1. **Fonts block LCP.** Google Fonts URL has no `display=swap`; Canela Deck is referenced but not supplied.
   First paint waits on 4 webfonts or renders fallback serif then swaps (layout shift in display type).
2. **LCP is data-dependent.** Threshold poster/film URL comes from `fetchFeaturedCollection`; `ProductDesire`
   shows a `50rem` shimmer while `fetchFeaturedProduct` resolves. On slow 4G the most emotional surface is blank
   longest. Consider static fallback poster (bundled still) rendered immediately, then enhance.
3. **JS weight.** React + Router + Query + Radix (~25 components imported across the app, though tree-shaken per
   route) + Recharts (Studio chunk — correctly split) + Embla + Supabase. `TooltipProvider` + both toast systems
   mount on every page. Verify bundle: `dist/` exists in-repo — run `vite-bundle-visualizer` during implementation.
4. **Backdrop blur + fixed header + breathing video + gradients** composite on every scroll frame. Low-end Android
   (the core HOP buyer device class) will drop frames. `transform: scale()` animations are GPU-friendly, but five
   simultaneous films are not.
5. **Images:** product `srcset` good; hero/editorial stills full-weight. Add poster `srcset` before any other
   image work — highest leverage.
6. **API waterfall:** homepage fires `featuredCollection + collections + featuredProduct + journal(articles local?)`
   in parallel via Query — good; but each `Film` mounts video independently with no priority order. Threshold first,
   rest deferred — already the case via IO; keep.
7. **Blocking:** no `async`/`defer` concerns (Vite handles); prerender should inline critical CSS — verify
   `scripts/prerender.js` output includes `HomepageExperience.css` critical path.
8. **Test under Fast 3G / Slow 4G + 4× CPU throttle** during implementation: LCP target <2.5s on 390×844 Slow 4G
   for `/` poster paint; CLS <0.1 (currently at risk from font swap + data-driven heroes); INP <200ms (Radix +
   Embla are fine; watch the scroll listener + blur).

---

## 19. Accessibility Audit

WCAG 2.1 AA, mobile-first lens:

- **Contrast (verify with tooling; code reasoning):** cream-on-lac (body, films) — pass. Lac-on-cream — pass.
  Gold `#D3A85F` on lac — likely pass for large text, verify for 0.6rem labels. `ink-soft` on cream — likely pass.
  `text-sakura` (light dusty rose) error text on cream — **likely fail** (HOP-M-17). `red-500` checkout errors on
  cream — borderline, verify. Placeholder `ink-soft/30–50` — fails by design (placeholders are not labels; the
  failure is using them *as* labels).
- **Touch targets:** see §16. WCAG 2.5.8 (44×44 CSS px minimum, AA 2.2) failures listed per component.
- **Focus:** global gold `:focus-visible` + `offset 3px` — excellent. Search input opts out — fix. Drawer + search
  trap focus and restore — excellent. No `aria-hidden` on background while modal — add `inert` (or Radix, which
  provides it — prefer Radix for new dialogs).
- **Keyboard:** gallery arrows/Escape, menu Escape/Tab-cycle, search arrows/Enter/Escape, accordions/tabs native
  Radix. Skip link present. No keyboard access to collection-film pause (no control exists).
- **Semantics:** header/nav/main/footer present; headings ordered (footer `h2` fix documented in code);
  breadcrumbs need `aria-label` verification; `ProductGallery` is `role=region roledescription=carousel` with label —
  good; thumbs are `aria-pressed` toggles with empty `alt` (correct — decorative duplicates); zoom buttons labelled.
  `Film` video has `aria-label` (video with label but no accessible controls on homepage — labelling a control-less
  autoplay region is noise; prefer `aria-hidden` decorative + separate pause control).
- **Forms:** checkout `aria-invalid/describedby` — good. CustomerCare/Appointments rely on placeholders — fail 3.3.2.
  Error messages lack `role=alert` except footer/checkout — add.
- **Reduced motion:** honoured for films, threshold breathe, reveals. Verify toast/carousel animations also gate.
- **Zoom/text scaling:** 200% should survive (single-column collapse at effective 720px CSS? No — 200% at 1280 =
  640px effective → `sm` still applies two-col product grids; verify no clipping). 400% (=320px effective) collapses
  to mobile — should survive except `nowrap` elements (logo, YŪGEN, price, sort count) and fixed `min-h-700px`
  Lookbook hero. Large-text (iOS Dynamic Type doesn't affect web; Android font scaling does not affect px/rem web
  type) — low risk. Test 200/400% + `prefers-reduced-motion` during implementation.

---

## 20. Browser Compatibility

| Concern | Code | iOS Safari | Android Chrome | Desktop |
|---|---|---|---|---|
| Viewport units | `svh` (threshold/films/craft) mixed with `vh` (Lookbook `h-screen/min-h-700px`, Appointments `calc(100vh-80px)`, Search `pt-15vh`, QuietWedding `80vh`) | `svh` correct (stable under address-bar); `vh` jumps on scroll | `svh` supported modern; `vh` resize causes jumps | Fine |
| Safe areas | No `env()` anywhere | Notch/home-indicator crowding on fixed header/drawer/dialogs | Punch-hole less severe; gesture bar overlap on sticky CTAs | N/A |
| `100svh` films | Correct | Stable | Stable | Fine |
| Video autoplay | `muted playsInline` + promise catch | Plays (muted inline) | Plays | Plays |
| `backdrop-blur` | Header, StudioHeader, search backdrop | Expensive, occasional flicker on old devices | Jank on low-end | Fine |
| Form controls | Native selects, 16px inputs (mostly) | No zoom (good); select appearance-none needs custom chevron | Autofill needs `autocomplete` attrs | Fine |
| Sticky | `lg:sticky` only; `TopActionBar sticky top-0` | OK | OK | Fine |
| `color-mix` | Used extensively in gradients/borders | iOS 16.2+ OK; older fails → provide fallback | Modern OK | Modern OK |
| `text-wrap:balance/pretty` | Headings/body | Graceful degradation | Same | Same |

Old-browser fallback for `color-mix` (progressive enhancement with solid-colour first declaration) should be added
where borders/veils are load-bearing.

---

## 21. Visual Consistency

Consistency matrix (✓ consistent, △ drift, ✗ inconsistent):

| Token | Status | Notes |
|---|---|---|
| Display type | △ | Canela/Cormorant vs Fraunces editorial vs YŪGEN Cormorant-override; sizes all `clamp()` but unrelated scales |
| Body type | △ | Newsreader vs Suisse/Inter philosophy body |
| Buttons | ✗ | shadcn `rounded-md h-10` / `hop-cta-primary` square / `hop-primary-button` square / pill `rounded-full` / arrow-links / bare underlines |
| Radii | ✗ | `0.125rem` token vs `rounded-sm/md/full/2xl-3xl` vs square hop controls |
| Borders | ✓ | 1px `line/border` hairlines, consistent restraint — keep |
| Shadows | △ | Flat luxury + `gallery-shadow` films vs shadcn `shadow-lg` dialogs/toasts |
| Spacing | △ | Three container gutters; section padding uniform-but-excessive on mobile |
| Image treatment | ✓ | 4/5 products, 16/10 editorial, inner-frame on material — coherent |
| Hover/focus | △ | Rich hover, gold focus — good; no touch `:active` parity |
| Headers/footers | ✓ | Single systems — good |
| Page containers | △ | `hop-page__room` vs Tailwind container vs bespoke |

Nothing here demands a new design system — it demands **convergence on the existing hop tokens** (see §34).

---

## 22. HOP Brand Experience

"Does HOP still feel like HOP on a 390px screen?" — **Mostly, but monumentally rather than calmly.**

- **Calmness/rhythm:** desktop rhythm (vast whitespace, slow reveals) becomes mobile fatigue (vast whitespace +
  slow scroll + no interludes). Calm needs *proportion*, not just space — mobile sections should breathe at 4–5rem,
  not 7–8rem.
- **Restraint:** copy is restrained everywhere (exemplary microcopy: "Your bag is empty. Each drape is singular…").
  Visual restraint slips in the five identical full-viewport films and the shouty 18vw titles.
- **Editorial character:** Fraunces/Cormorant/Newsreader + tracked kickers + selvedge rules + captions ("Gangamma
  at her pit loom · 6:30 AM") survive beautifully. The craft section is the strongest mobile brand moment.
- **Hierarchy:** kicker → monumental title → quiet body is the house grammar and it holds — but at 0.6rem vs 4rem
  the dynamic range exceeds phone comfort. Narrow the range on mobile (smaller titles, slightly larger kickers).
- **Craft storytelling:** PDP accordions (Weave/Care/Shipping) and collection emotion lines carry it; homepage
  films dropping the emotion line is the single biggest brand loss on mobile.
- **Premium perception:** no sale banners, no urgency widgets, no star ratings — the house holds its nerve.
  Keep it that way; do not "optimise" with app-like sticky bars, badges, or countdowns.
- **Cheap/app-like risks to avoid in fixes:** pill-shaped everything, bottom tab bars, chat bubbles, star ratings,
  `overflow-x:hidden` band-aids, hamburger-to-tab-bar conversions. Fix with quieter type, truer spacing, and
  real touch targets — not with patterns from another genre.

---

## 23. Studio Mobile Audit

Shell (`StudioLayout` + `Sidebar` + `StudioHeader`):

- `SidebarProvider defaultOpen` + icon-collapsible `Sidebar` (shadcn: `fixed hidden md:flex`) + `SidebarTrigger`
  in a 64px header. On phones the sidebar is off-canvas; the trigger is the only entry — verify the trigger is
  44px (shadcn default is not; `StudioHeader` passes only colour classes).
- `main p-6` fixed — 48px of gutter consumed at 320px. Make `p-4 sm:p-6`.
- `TopActionBar sticky top-0 ... -mx-6 -mt-6` compensates the fixed padding — brittle; any padding change breaks it.
  Scope to desktop or re-implement with CSS variables.
- Header crowds at 320: trigger + title + env badge + Storefront link. Badge (`text-[11px] uppercase`) + email
  (`hidden md`) + separators — allow title truncation (`truncate max-w`) and hide the badge label under 400px
  (keep the dot).
- Tables (`RecentOrders` has `overflow-x-auto`; verify all list pages): horizontal scroll tables are acceptable as
  a *transitional* mobile pattern, but the recommendation is **cards under 768px** (order/product/customer rows as
  stacked ledgers, preserving sort/filter). Never shrink desktop tables into 320px.
- Workspaces (`ProductWorkspace`, `CollectionWorkspace`, `Inventory`, `Media`, `Journal`, `Settings`, `Activity`):
  not deep-read individually. Pattern-level expectation: multi-column forms → single column; image pickers →
  full-width 4/5 with 44px remove/replace; editors (`EditorialStory` textarea `min-h-180px`) are fine; JSON/schema
  surfaces and bulk tables genuinely need desktop width — gate with a calm "Best arranged on a larger screen"
  notice + read-only summary on mobile rather than a broken grid.
- Studio dialogs (`ForgotPasswordDialog` etc.): `sm:max-w-md` Radix — verify mobile margins + keyboard avoidance.

---

## 24. Responsive Architecture Findings

| # | Finding | Root cause | Effect |
|---|---|---|---|
| A1 | Dual token universes | `index.css` HSL + `HomepageExperience.css` hex coexist | Colour drift, double maintenance |
| A2 | Three container gutters | Tailwind container vs `hop-page__room` vs ad-hoc | Misaligned left edges across pages |
| A3 | Coarse breakpoints | Only 768/1024/1280 (+900/1279 one-offs) | 320–430 treated identically; jumps at 768 |
| A4 | Dead `HeroSection` | Unused component kept alongside `Threshold` | Confusion, rot risk, conflicting hero patterns |
| A5 | Unused `useIsMobile` | Single-breakpoint hook with no call sites found | JS breakpoint logic absent; all responsive is CSS-only (fine, but delete or use) |
| A6 | Mixed viewport units | `svh` + `vh` + `min-h-700px` | Address-bar jumps, landscape crush |
| A7 | Mixed image pipelines | Supabase + manifest + plain imports; posters always plain | LCP weight, CLS risk, inconsistent quality |
| A8 | Mixed button/form systems | shadcn + hop-* + bespoke | Inconsistent targets, radii, rings |
| A9 | Page-specific hacks | `order-1/order-2` image swap (Appointments), `-mx-6 -mt-6` (TopActionBar), `pt-header` vs fixed bar mismatch | Fragile under padding/viewport change |
| A10 | `prefers-reduced-motion` placed *inside* a `@media (max-width:768px)` block in `HopPage.css` (§447ff — the side-nav/split/journal/auth/account/lookbook rules appear nested after the media query with a stray reduced-motion wrapper) | Likely mis-nested CSS | Desktop may lose side-nav/split styles; reduced-motion may mis-apply — verify compiled output urgently |

A10 is the highest-risk architectural finding: if the nesting is as-read, a large block of `HopPage.css`
(side nav, splits, journal feature, auth/account shells, lookbook) sits inside the wrong at-rule. Confirm in
DevTools (check `.hop-page__split` at 1440px and with reduced-motion on/off).

---

## 25. Breakpoint Findings

- **Missing:** ≤400px refinements (tracking, title caps, drawer triple-row, dialog margins). 1024–1279 (`lg`→`xl`)
  tablet-landscape: `hop-collections__heading` collapses at 1279 but grids collapse at 1024 — intermediate widths
  get desktop copy with tablet media. Landscape phones (667–844 wide, 375–390 high) get `sm:` two-col product grids
  with `100svh` films — short + crowded; add a `(max-height:500px) and (orientation:landscape)` compaction pass.
- **Unnecessary:** the 900px breakpoint (only journal/split collapse) could merge into 768; `xl:` header gap tweaks
  are fine.
- **Abrupt changes:** 767→768 flips threshold `100svh→min(56rem,100svh)`, films `100svh→88svh`, philosophy
  grid→block, product grids 2→3col. All are defensible collapses, but title `clamp()` uses `vw` so the 768 jump
  compounds (e.g. collections title `17vw→8vw` halves instantly). Prefer `clamp()` with narrower `vw` coefficients
  over breakpoint cliffs.
- **Recommendation:** keep Tailwind breakpoints; add fluid behaviour (container queries are overkill); add two
  targeted media queries only: `(max-width:400px)` refinement and `(max-height:500px) and (orientation:landscape)`
  compaction. Do not add per-device breakpoints.

---

## 26. Horizontal Overflow Findings

No confirmed document-level `scrollWidth > innerWidth` (no live measurement). Code-level suspects, ordered by
likelihood at 320px — verify each with `document.documentElement.scrollWidth > window.innerWidth` + element walk:

1. **Logo lockup** (`HopHeader` §133): `whitespace-nowrap tracking-[0.28em] 0.6rem` inside `flex-1 min-w-0`.
   ~180px of tracked caps in ~176px of available space at 320. `min-w-0` prevents flex blowout but text may clip.
2. **Drawer utility triple-row** (§241): three `flex-1` uppercase cells with icons; "Account"/"Search"/"Saved" at
   `0.75rem/0.2em` + 16px icons ≈ 300px + gaps — fits 320 barely; with 200% text scaling it wraps and pushes height.
3. **Breadcrumbs** (Category/PDP): `tracking-[0.3em]` + full product names, no truncation — wraps (acceptable) or,
   if `BreadcrumbList` is `flex-nowrap`, overflows (verify).
4. **Radix `DialogContent`** (`dialog.tsx` §39): `w-full max-w-lg` centred with `translate(-50%,-50%)` and `p-6`,
   no viewport margin — at 320 the dialog touches edges; with borders + safe-area it can exceed width by ~2px.
   Prefer `w-[calc(100%-2rem)]` (as `hop-search-dialog` already does).
5. **Toasts** (`toast.tsx`): `w-full` top-anchored mobile — full-bleed is intentional, not overflow, but it covers
   the header with no safe-area offset.
6. **YŪGEN `nowrap`** (HomepageExperience.css §1320): fits at 100% (`clamp(1.9rem,12vw,3.2rem)` ≈ 38px at 320),
   overflows under zoom/translation. Remove `nowrap`.
7. **Lookbook `min-h-[700px]` + `h-screen`** (§26): vertical overflow by design on 568px screens (700 > 568);
   horizontal is fine (`max-w-6xl px-6`). Not a defect per se — but the 700px floor should become `min(700px, 120svh)`.
8. **`hop-page__room` vs Tailwind container**: both constrain width; pages mixing them (header container + room
   main) cannot overflow, but edges misalign — visual, not scroll.

Do **not** fix with global `overflow-x:hidden` (it would mask the dialog/drawer defects and break sticky/overscroll).
Fix each element (truncation, wrapping, margins, safe-area).

---

## 27. Issue Register

Format per §30. Viewport shorthand: **M320/M360/M375/M390/M430**, **LH** landscape, **T** tablet, **L/D** laptop/desktop.
Complexity/Regression are implementation estimates.

### [HOP-M-01] Mobile menu trigger under 44px

Priority: P1 · Type: Navigation/Accessibility · Routes: all · Viewports: M320–M430, T
Severity: P1
Observed: Hamburger is `p-2` with a 20px icon (~36px target). Adjacent bag target is 44px; the two most-tapped
mobile controls differ in size.
Evidence: `src/components/hop/HopHeader.tsx:116-125`. No `min-h/min-w-44`.
Root Cause: bespoke button outside the 44px convention used elsewhere in the same file (§177).
Why It Matters: primary nav entry; WCAG 2.5.8; mis-taps on the move.
Recommended Solution: `min-h-[44px] min-w-[44px] flex items-center justify-center` on the trigger (match bag link).
Mobile: 44px. Tablet: 44px. Desktop: hidden (no change).
Files: `HopHeader.tsx:116`. Complexity: Low. Regression: Low.

### [HOP-M-02] Drawer has no safe-area / dvh handling; close control undersized

Priority: P1 · Type: Navigation/Accessibility · Routes: all · Viewports: M320–M430 (notch devices), LH
Severity: P1
Observed: `fixed inset-0 ... overflow-y-auto` with `h-16` header row and bare `X` icon; no
`env(safe-area-inset-*)`, no `100dvh`. Content can sit under notch/home indicator; close target <44px.
Evidence: `HopHeader.tsx:190-208`.
Root Cause: fixed-fullscreen pattern without safe-area contract (repo-wide — zero `env()` usage).
Why It Matters: iPhone users obscure nav + close; landscape + keyboard untested.
Recommended Solution: `height:100dvh; padding-top:env(safe-area-inset-top); padding-bottom:env(safe-area-inset-bottom)`;
header row `min-h-16` + 44px close button; bottom utility row `min-h-44` cells with dividers.
Files: `HopHeader.tsx:190-267`. Complexity: Medium. Regression: Low.

### [HOP-M-03] Header offset mismatch (`pt-header` taller than bar)

Priority: P2 · Type: Layout · Routes: all non-hero pages · Viewports: M320–M430, T
Severity: P2
Observed: bar is 72px mobile / 80px ≥768; `spacing.header` offset is `clamp(6rem,8vw,8rem)` (96px+). ~24px dead band
above every non-hero page; hero pages (`darkHero` → no offset) are correct.
Evidence: `tailwind.config.ts:22`, `HopHeader.tsx:97`, `PageLayout.tsx:21`.
Root Cause: offset token sized for a taller historic header.
Why It Matters: pushes LCP/hero content down; wastes a full thumb-scroll on short screens.
Recommended Solution: `spacing.header: 72px mobile / 80px ≥768` (or `pt-[72px] md:pt-[80px]`), keep `clamp()` only for
hero-internal spacing.
Files: `tailwind.config.ts:22`, `PageLayout.tsx:21`. Complexity: Low. Regression: Medium (touches every page — snapshot).

### [HOP-M-04] Logo lockup risks clipping at 320px

Priority: P2 · Type: Typography/Layout · Routes: all · Viewports: M320
Severity: P2
Observed: `HOUSE OF PADMAVATI` at `0.6rem/0.28em nowrap` centred between 36px menu + 44px bag. Available ≈176px;
tracked caps ≈180px+.
Evidence: `HopHeader.tsx:127-136`.
Root Cause: `whitespace-nowrap` + wide tracking with no truncation guard.
Why It Matters: brand clipping on the smallest phones; worse under text scaling.
Recommended Solution: under 380px reduce to `tracking-[0.22em]`, allow `overflow-hidden text-ellipsis`, keep
monogram; verify at 320 + 200% zoom.
Files: `HopHeader.tsx:133`. Complexity: Low. Regression: Low.

### [HOP-M-05] Threshold title oversized for short viewports; CTA is a text link

Priority: P1 · Type: Typography/Interaction/Brand · Routes: `/` · Viewports: M320–M430 (esp. 320×568), LH
Severity: P1
Observed: `clamp(4rem,18vw,6.5rem) lh 0.96` → 57–70px stacked over 3 lines; bottom-anchored content + `7rem` top
padding; primary action is a `0.65rem` underline link (~20px tall).
Evidence: `HomepageExperience.css:1071-1085`, `HomepageExperience.tsx:175-181`.
Root Cause: desktop-monumental scale carried down via `vw` without a mobile composition pass.
Why It Matters: LCP emotion + primary CTA are the homepage; mis-taps + bottom-edge collision on short screens.
Recommended Solution: mobile `clamp(3.25rem,15vw,5rem) lh 1.0`; CTA row keeps links but each gets `min-h-44`
hit-area (`py-3`); keep desktop scale.
Files: CSS §1071ff, TSX §175ff. Complexity: Low. Regression: Low.

### [HOP-M-06] Five consecutive `100svh` autoplay films exhaust scroll, data, and attention

Priority: P1 · Type: Media/Performance/Brand · Routes: `/` · Viewports: M320–M430, Slow 4G
Severity: P1
Observed: `.hop-collection-film { min-height:100svh; height:100svh }` × 5 with `0.75rem` gaps; each mounts video
(`preload metadata`, `rootMargin 200px`); no pause controls (`showControls=false`).
Evidence: `HomepageExperience.css:1155-1158`, `HomepageExperience.tsx:239-247`, `Film.tsx:66-95,155-165`.
Root Cause: cinematic desktop rhythm applied verbatim to mobile.
Why It Matters: ~500vh same-veil scroll; 2–3 concurrent video fetches on mobile data; no user control (2.2.2).
Recommended Solution: mobile `min-height:92svh` + visible separation; `preload="none"` + tap-to-play poster for
films 2–5 on `Save-Data`/small screens; add a quiet 44px pause control per film (or one global "Still the films"
toggle); keep desktop autoplay.
Files: CSS §351ff/1155ff, `Film.tsx`. Complexity: Medium. Regression: Medium (LCP/perf retest).

### [HOP-M-07] Homepage films hide the story (no emotion line)

Priority: P2 · Type: Content/Brand · Routes: `/` · Viewports: M320–M430 (all, but mobile suffers most)
Severity: P2
Observed: film identity = monogram + name only. `world.emotion` renders on `/collections` and room pages but not
in `CollectionFilmChapter`.
Evidence: `HomepageExperience.tsx:249-253` vs `Collections.tsx:116`, `Category.tsx:211-213`.
Root Cause: identity block scoped to name/mark.
Why It Matters: the "five ways of being present" thesis is invisible at the moment of maximum attention.
Recommended Solution: add one `emotion` line under the name (Newsreader, cream 76%, `max-w 22rem`, centred),
same veil; verify contrast over bright folds.
Files: `HomepageExperience.tsx:249-253`. Complexity: Low. Regression: Low.

### [HOP-M-08] PLP wishlist heart is 36px and overlaps product

Priority: P1 · Type: Interaction/Accessibility · Routes: `/collections/:slug`, wishlist grids · Viewports: M320–M430
Severity: P1
Observed: `absolute top-3 right-3 w-9 h-9` (36px) over image corner.
Evidence: `Category.tsx:320-332`.
Root Cause: aesthetic size chosen without target audit (PDP circle is correctly 48px).
Why It Matters: most-tapped PLP control; mis-taps open the product instead of saving.
Recommended Solution: `h-11 w-11 (44px)`, `top-2.5 right-2.5`, keep `bg-jasmine/80` scrim; add `:active` scale.
Files: `Category.tsx:320`. Complexity: Low. Regression: Low.

### [HOP-M-09] Collection hero letterboxes drape photography on mobile

Priority: P2 · Type: Media/Layout · Routes: `/collections/:slug` · Viewports: M320–M430
Severity: P2
Observed: `aspect-[2/1]` panoramic hero; drape/portrait imagery centre-crops to a strip.
Evidence: `Category.tsx:161-184`.
Root Cause: one aspect for all widths.
Why It Matters: first impression of each room; crops the craft it sells.
Recommended Solution: `aspect-[4/5] <640px → 16/10 ≥640 → 21/9 ≥1280`; retune `object-position` per world for
portrait crop.
Files: `Category.tsx:161`. Complexity: Low. Regression: Low.

### [HOP-M-10] YŪGEN `nowrap` + indent-centering is zoom-fragile

Priority: P3 · Type: Typography/Accessibility · Routes: `/`, `/collections`, rooms · Viewports: M320, zoom 200%+
Severity: P3
Observed: `white-space:nowrap; text-indent:0.16em` centres tracked caps; fits at 100% (~38px at 320) but any text
scaling or translation overflows/clips.
Evidence: `HomepageExperience.css:1310-1330`.
Root Cause: indent hack instead of alignment.
Why It Matters: the renamed flagship room must survive zoom/i18n.
Recommended Solution: drop `nowrap`; `text-align:center; padding-left:0.14em` (padding, not indent); keep face/size.
Files: CSS §1310ff. Complexity: Low. Regression: Low.

### [HOP-M-11] Gallery: no position signalling; zoom cannot inspect detail

Priority: P1 · Type: Interaction/Media · Routes: `/product/:id` · Viewports: M320–M430
Severity: P1
Observed: swipe + thumbs only; arrows `hidden lg:block`; no dots/counter; tap-zoom is centred `scale(2)` with no pan.
Evidence: `ProductGallery.tsx:135-250` (arrows §232-248, zoom §92-100/143).
Root Cause: desktop lightbox gestures mapped 1:1 to touch.
Why It Matters: buyers cannot verify weave/border — the core luxury decision.
Recommended Solution: `Image n of N` counter (aria-live) + dots; keep swipe; replace tap-scale with a true
pan-able zoom (pinch + drag, double-tap toggle, `touch-action` scoping) or a fullscreen Radix dialog with pan;
Escape/dismiss already exist.
Files: `ProductGallery.tsx`. Complexity: High. Regression: Medium.

### [HOP-M-12] No sticky mobile CTA on PDP / Cart / Checkout

Priority: P0 · Type: Interaction/Navigation · Routes: `/product/:id`, `/cart`, `/checkout` · Viewports: M320–M430
Severity: P0
Observed: PDP `lg:sticky` only (§207); Add-to-Bag scrolls under gallery+story+accordions. Cart Checkout sits below
all line items. Checkout Pay sits at the bottom of the aside. All three CTAs require full scroll on the longest
journeys.
Evidence: `ProductDetail.tsx:207,242-259`; `Cart.tsx:129-175`; `Checkout.tsx:660,795-808`.
Root Cause: sticky deliberately desktop-only without a mobile alternative.
Why It Matters: blocks one-handed purchase; highest revenue-adjacent friction in the audit.
Recommended Solution: quiet mobile sticky bar (`bottom-0`, safe-area padded, `backdrop-blur`, price + single
primary action) on PDP/Cart/Checkout only; hide when the inline CTA is in view (IntersectionObserver); never on
editorial pages. Must respect keyboard (hide when input focused) and reduced-motion.
Files: above + new `StickyCta` pattern. Complexity: Medium. Regression: Medium (safe-area/keyboard/observer).

### [HOP-M-13] Cart persistence across auth round-trip unverified

Priority: P1 · Type: Architecture/Interaction · Routes: `/cart → /checkout → /account/login` · Viewports: all mobile
Severity: P1
Observed: `/checkout` is `ProtectedRoute`; `CartContext` source of persistence not confirmed in this audit
(context-only vs localStorage/Supabase merge).
Evidence: `App.tsx:109,146`, `Checkout.tsx:84`, `CartContext.tsx` (not deep-read).
Root Cause: unknown — needs verification.
Why It Matters: signed-out buyer adding a drape then hitting login may lose the bag — catastrophic if true.
Recommended Solution: verify; guarantee bag survives login/refresh (persist + merge on `signIn`); add Playwright
coverage; do not change payment logic.
Files: `contexts/CartContext.tsx`, `components/account/ProtectedRoute.tsx`. Complexity: Medium. Regression: High.

### [HOP-M-14] Journal article renders no body — reading ends at the standfirst

Priority: P1 · Type: Content/Architecture · Routes: `/journal/:slug` · Viewports: all (mobile most affected)
Severity: P1
Observed: `JournalDetail` outputs tag → title → 16/9 image → `dek` (`text-lg`) and stops. No body blocks, author,
date, related, or progress.
Evidence: `JournalDetail.tsx:62-101`; `useJournalArticle` hook not deep-read.
Root Cause: body field either absent in CMS or not consumed by the component.
Why It Matters: journal is the brand's storytelling engine; currently a headline service.
Recommended Solution: determine truth (CMS vs component); render body with `max-w 65ch`, Newsreader `1.05rem/1.65`,
`2.2rem` paragraph rhythm, images `16/10` full-measure with captions; add minimal related + back affordances.
Mobile: single column, `1.25rem` gutters. Tablet: `65ch` centred. Desktop: `65–70ch` + marginalia if designed.
Files: `JournalDetail.tsx`, `hooks/useJournal.ts`, CMS schema. Complexity: Medium. Regression: Low.

### [HOP-M-15] Checkout/customer forms: small inputs, placeholder labels, missing autofill; `0.9rem` inputs trigger iOS zoom

Priority: P0 · Type: Forms/Accessibility · Routes: `/checkout`, `/customer-care`, `/appointments`, footer ·
Viewports: M320–M430, iOS Safari
Severity: P0
Observed: shadcn `h-10` (40px) vs hop `min-h-3rem`; `hop-form-control 0.9rem (14.4px)` — **below the 16px iOS
no-zoom threshold**; CustomerCare/Appointments use placeholder-only or bottom-border inputs; `autocomplete`,
`inputmode`, `autocapitalize` missing almost everywhere (checkout email/phone lack `autocomplete`; postal lacks
`inputmode=numeric`; country is free text); radios/checkboxes 16px (14px footer).
Evidence: `ui/input.tsx:11`, `HopPage.css:254-264`, `Checkout.tsx:347-571`, `CustomerCare.tsx:94-152`,
`Appointments.tsx:60-119`, `HopFooter.tsx:89-127`.
Root Cause: two input systems + autofill never specified.
Why It Matters: P0 for a luxury form: zoom-on-focus, no autofill, tiny radios, weak labels = abandonment + a11y fail.
Recommended Solution: floor all text inputs at `min-h-44 + text-base (16px)`; visible `<label>` everywhere;
`autocomplete` (email/name/address/city/state/postal-code/country/tel), `inputmode` (numeric postal, tel),
`autocapitalize` (words for names); enlarge radios/checks to 24px visible within 44px label rows; country →
select with India default; footer `Join` to 44px.
Files: above. Complexity: Medium. Regression: Medium (form snapshot + autofill QA).

### [HOP-M-16] Footer newsletter row is cramped and faded

Priority: P2 · Type: Forms/Visual · Routes: all · Viewports: M320–M430
Severity: P2
Observed: `flex border-b pb-2` row, `Join` at `0.65rem + opacity-50`, checkbox 14px, consent copy 12px.
Evidence: `HopFooter.tsx:89-127`.
Root Cause: footer styled as ornament, not as a form.
Why It Matters: journal consent is a brand asset; current treatment signals unimportance + fails contrast/targets.
Recommended Solution: `min-h-48px` row, full-opacity 44px submit, 24px checkbox in 44px label, keep voice.
Files: `HopFooter.tsx`. Complexity: Low. Regression: Low.

### [HOP-M-17] Error colour `text-sakura` likely fails contrast; errors lack live regions

Priority: P1 · Type: Accessibility/Forms · Routes: `/customer-care`, `/appointments` · Viewports: all mobile
Severity: P1
Observed: `text-[0.7rem] text-sakura` on cream; no `role=alert`/`aria-describedby` wiring (checkout does it right).
Evidence: `CustomerCare.tsx:106,132,151,171-176`.
Root Cause: decorative error colour + missing a11y wiring.
Why It Matters: users cannot perceive form failures.
Recommended Solution: errors in `destructive`/mulberry (verify ≥4.5:1), `aria-describedby` per field (as checkout),
`role=alert` summary on submit; keep 0.7rem+ size.
Files: `CustomerCare.tsx`, `Appointments.tsx`. Complexity: Low. Regression: Low.

### [HOP-M-18] Autoplaying films have no pause control (homepage)

Priority: P1 · Type: Accessibility/Media · Routes: `/` · Viewports: all mobile
Severity: P1
Observed: `showControls={false}` on Threshold + all five chapters; video labelled but uncontrollable.
Evidence: `HomepageExperience.tsx:156-164,239-247`; `Film.tsx:155-165`.
Root Cause: cinema purity over user control.
Why It Matters: WCAG 2.2.2 (pause/stop/hide); vestibular + data-cost harm.
Recommended Solution: quiet 44px pause/play per film (or one global toggle remembered in state); `aria-pressed`;
decorative videos `aria-hidden` when paused-control exists elsewhere. Collection/category films already expose
controls — extend the pattern.
Files: `Film.tsx`, `HomepageExperience.tsx`. Complexity: Medium. Regression: Low.

### [HOP-M-19] Film posters ship full-weight to 320px phones

Priority: P1 · Type: Performance/Media · Routes: `/`, `/collections`, rooms · Viewports: M320–M430, Slow 4G
Severity: P1
Observed: `Film` poster is plain `<img>` — no `srcset/sizes`, no pipeline. LCP stills download desktop bytes.
Evidence: `Film.tsx:114-130`.
Root Cause: posters bypass both image pipelines.
Why It Matters: single highest-leverage mobile byte saving; LCP on slow networks.
Recommended Solution: route posters through Supabase transforms (`480/800/1200w` + `sizes`) or manifest
`OptimizedImage`; `fetchpriority=high` + `decoding=async` on LCP poster only; video `preload="none"` for
below-fold films on `Save-Data`.
Files: `Film.tsx:114-130`, `lib/supabaseImage.ts`. Complexity: Medium. Regression: Medium (visual QA per world).

### [HOP-M-20] Fonts block and swap: no `display=swap`, Canela unsupplied

Priority: P1 · Type: Performance/Typography · Routes: all · Viewports: all mobile
Severity: P1
Observed: Google Fonts URL without `display=swap`; `Canela Deck` first in every display stack but absent from the
URL (licensed/self-hosted? unverified).
Evidence: `index.html:15-17`, `tailwind.config.ts:15-20`, `HomepageExperience.css:21-34`.
Root Cause: font loading never tuned.
Why It Matters: FOIT/FOUT in the largest type on the slowest networks; display face may *never* be Canela.
Recommended Solution: add `display=swap`, `preload` the LCP display cut (or accept Cormorant and remove Canela
from stacks deliberately); subset to latin + needed diacritics (Ū!); verify fallback metrics (`size-adjust`) to
kill CLS.
Files: `index.html`, font pipeline. Complexity: Low. Regression: Low.

### [HOP-M-21] Price formatting is inconsistent (paise vs rupees)

Priority: P2 · Type: Content/Visual consistency · Routes: `/cart`, `/checkout`, PDP/PLP · Viewports: all
Severity: P2
Observed: line items `₹ (paise/100).toLocaleString(en-IN)`; cart/checkout totals `₹ totalPrice.toLocaleString()`
raw. If `totalPrice` is paise, totals are 100× off in display; if rupees, two code paths format one concept.
Evidence: `Cart.tsx:10-12,92,139,153`; `Checkout.tsx:74-76,702,734`; `ProductDetail.tsx:23-25`.
Root Cause: no single price primitive.
Why It Matters: money display is trust; inconsistency is a defect even when numerically right.
Recommended Solution: one `formatPrice(paise)` helper used everywhere; unit-test paise→INR incl. deposit math.
Files: above + `contexts/CartContext.tsx`. Complexity: Low. Regression: High (money — test).

### [HOP-M-22] Lookbook hero forces 700px on 568px phones; image class confusion

Priority: P2 · Type: Layout/Media · Routes: `/lookbook` · Viewports: M320×568, LH
Severity: P2
Observed: `h-screen min-h-[700px]` hero; `hop-lookbook__hero` class applied to the `<img>` instead of (or as well
as) its section; `min-height:70vh` in CSS vs 700px floor in JSX.
Evidence: `Lookbook.tsx:26-39`, `HopPage.css:617-633`.
Root Cause: `vh` + fixed floor + class misapplication.
Why It Matters: short phones scroll 130px+ before seeing anything; landscape crush.
Recommended Solution: `min-height:min(100svh,700px)` (or `92svh`), correct class targeting, `mt-header` offset
review (hero sits under fixed bar — verify).
Files: `Lookbook.tsx:26`, `HopPage.css:617`. Complexity: Low. Regression: Low.

### [HOP-M-23] Appointments order swap + bottom-border inputs + chevron-less selects

Priority: P2 · Type: Layout/Forms · Routes: `/appointments` · Viewports: M320–M430
Severity: P2
Observed: mobile shows form (`order-1`) before the 40vh atelier image (`order-2`); inputs are borderless-bottom
rows; `<select appearance-none>` with no indicator.
Evidence: `Appointments.tsx:27-35,86-107`.
Root Cause: page-specific composition without mobile pass.
Why It Matters: context-after-action; selects look broken; brand feels template-like here.
Recommended Solution: image first (`order` swap) at `32svh`, keep form second; inputs to `hop-form-control`
standard; custom chevron on selects; labels already good — keep.
Files: `Appointments.tsx`. Complexity: Low. Regression: Low.

### [HOP-M-24] Breadcrumbs wrap/overflow on long names at 320px

Priority: P3 · Type: Navigation/Typography · Routes: rooms, PDP, journal · Viewports: M320
Severity: P3
Observed: `0.7rem/0.3em` uppercase trail with full names, no truncation; `flex-col sm:flex-row` title rows nearby.
Evidence: `Category.tsx:188-203`, `ProductDetail.tsx:176-194`.
Root Cause: no overflow contract for user-length strings.
Why It Matters: 2–3 line breadcrumb stacks push heroes down; under `nowrap` list variants it would scroll-x.
Recommended Solution: `BreadcrumbPage` gets `truncate max-w-[40vw]` + `title` attr; trail allows wrap (never scroll);
verify `aria-label="Breadcrumb"`.
Files: call sites + `ui/breadcrumb.tsx`. Complexity: Low. Regression: Low.

### [HOP-M-25] Radix dialogs touch viewport edges at 320px; no safe-area

Priority: P2 · Type: Overlays/Accessibility · Routes: Studio dialogs, account, checkout-adjacent · Viewports: M320
Severity: P2
Observed: `w-full max-w-lg p-6` centred — zero viewport margin; close icon bare.
Evidence: `ui/dialog.tsx:36-51`, `ui/alert-dialog.tsx:37`, `ui/sheet.tsx:54-67`.
Root Cause: desktop-centred defaults.
Why It Matters: edge-to-edge sheets feel like bugs; notch clipping; small dismiss.
Recommended Solution: `w-[calc(100%-2rem)] max-h-[92dvh] overflow-y-auto` + safe-area padding + 44px close;
verify with keyboard open (visualViewport).
Files: dialog/sheet/drawer/alert-dialog. Complexity: Low. Regression: Medium (Studio snapshot).

### [HOP-M-26] Toasts cover the fixed header with no safe-area offset

Priority: P3 · Type: Overlays · Routes: all (add-to-bag, wishlist) · Viewports: M320–M430
Severity: P3
Observed: `fixed top-0 w-full` mobile (`sm:bottom-0 right-0` desktop flip); `z-100`.
Evidence: `ui/toast.tsx:17`, `App.tsx:96-97`.
Root Cause: top anchoring without header/safe-area awareness.
Why It Matters: confirmation hides nav context; notch overlap.
Recommended Solution: `top: calc(env(safe-area-inset-top) + 76px)` mobile, keep bottom-right desktop; cap width,
keep `aria-live` (verify).
Files: `ui/toast.tsx`, toast CSS. Complexity: Low. Regression: Low.

### [HOP-M-27] Search dialog: keyboard-cover risk + ring-less input + small close

Priority: P2 · Type: Overlays/Forms · Routes: all · Viewports: M320–M430, iOS
Severity: P2
Observed: `pt-[15vh]` top-anchored; `visualViewport` unhandled; input `focus-visible:ring-0`; close `p-1.5`.
Evidence: `SearchModal.tsx:114-156`.
Root Cause: desktop-anchored custom dialog.
Why It Matters: iOS keyboard covers results; focus invisible; close hard to hit.
Recommended Solution: anchor with `dvh` + `visualViewport` offset (or bottom-sheet under 640px); restore gold ring;
44px close; keep trap/restore/scroll-lock (already good).
Files: `SearchModal.tsx`. Complexity: Medium. Regression: Low.

### [HOP-M-28] PDP related + wishlist grids: hover-only feedback, thin tap areas

Priority: P3 · Type: Interaction · Routes: PDP, `/wishlist` · Viewports: M320–M430
Severity: P3
Observed: `group-hover:scale` with no `:active`; related tap = image + title only; wishlist remove is 36px circle.
Evidence: `ProductDetail.tsx:303-327`, `Wishlist.tsx:92-100`.
Root Cause: hover-first card language.
Why It Matters: touch feels dead; remove control mis-taps.
Recommended Solution: `:active` scale/opacity parity via `(hover:none)`; wishlist remove to 44px; keep no-quick-add
(deliberate luxury slowness).
Files: above. Complexity: Low. Regression: Low.

### [HOP-M-29] Journal ledger loses context on mobile (dek + arrow hidden, 64px thumbs)

Priority: P3 · Type: Content/Layout · Routes: `/journal` · Viewports: M320–M430
Severity: P3
Observed: `grid-cols-[64px_1fr]`, `dek hidden sm:block`, arrow `hidden sm:block`.
Evidence: `Journal.tsx:80-105`.
Root Cause: over-aggressive mobile simplification.
Why It Matters: rows become indistinguishable titles; visual index too small to carry weave.
Recommended Solution: 80px thumbs, 2-line `line-clamp-2 dek` at `0.85rem` on mobile, keep arrow as 44px chevron cell
(or drop it deliberately and enlarge row padding — decide, don't just hide).
Files: `Journal.tsx:80-105`. Complexity: Low. Regression: Low.

### [HOP-M-30] Section padding + title scale exhaust small screens (brand rhythm)

Priority: P2 · Type: Brand/Layout · Routes: `/`, `/collections`, about · Viewports: M320–M430
Severity: P2
Observed: `7rem/8rem` mobile section padding; `17vw` titles; `100svh` chapters — documented in §10.
Evidence: `HomepageExperience.css:1087-1124,1137-1149`; `HopPage.css:428-445`.
Root Cause: desktop spacing tokens applied to mobile.
Why It Matters: HOP reads monumental, not calm, on phones.
Recommended Solution: mobile section `4.5rem/5rem` (keep desktop `clamp()`), titles per HOP-M-05, films per HOP-M-06.
No new system — retune the existing tokens' mobile ends.
Files: above. Complexity: Low. Regression: Medium (visual approval).

### [HOP-M-31] `HopPage.css` nesting anomaly — large block possibly scoped to wrong at-rule

Priority: P0 · Type: Architecture · Routes: all `hop-page` consumers · Viewports: T/L/D + reduced-motion
Severity: P0
Observed: `@media (prefers-reduced-motion: reduce) {` at §447 appears to swallow side-nav/split/journal/auth/
account/lookbook rules through §678 (a second `.hop-reveal{animation:none}` + transition kills sit *inside* it).
If compiled as-read, desktop layouts + motion gating are both wrong.
Evidence: `src/components/hop/HopPage.css:447-678`.
Root Cause: mis-nested braces during edit.
Why It Matters: could silently break desktop composition and motion preferences site-wide.
Recommended Solution: verify compiled CSS in DevTools (`.hop-page__split` at 1440px; animations with
reduced-motion on/off); re-nest: `@media(max-width:768px)` block closes before side-nav base rules; separate
`@media (prefers-reduced-motion: reduce)` containing only animation/transition kills.
Files: `HopPage.css:428-678`. Complexity: Low. Regression: High (touches every page — full visual pass).

### [HOP-M-32] Studio: fixed padding, icon sidebar, tables — no mobile transformation

Priority: P1 · Type: Responsive/Architecture · Routes: `/studio/*` · Viewports: M320–M430, T
Severity: P1
Observed: `main p-6`, `Sidebar` icon-collapsible (`hidden md:flex` fixed), `TopActionBar -mx-6 -mt-6 sticky`,
header crowding, tables (some `overflow-x-auto`, most unverified), workspaces un-audited per-page.
Evidence: `StudioLayout.tsx:31`, `Sidebar.tsx:48`, `StudioHeader.tsx:16-53`, `TopActionBar.tsx:37`.
Root Cause: desktop admin patterns without a mobile contract.
Why It Matters: merchant on phone cannot triage orders/inventory reliably.
Recommended Solution: `p-4 sm:p-6`; trigger ≥44px; title truncate + badge-dot under 400px; lists → cards <768px;
forms single-column; image pickers full-width; genuinely-desktop surfaces get a calm read-only summary +
"Best arranged on a larger screen" (never a squeezed table).
Files: Studio shell + each list/workspace. Complexity: High. Regression: Medium.

### [HOP-M-33] Landscape phones unhandled (short + wide)

Priority: P3 · Type: Responsive · Routes: `/`, lookbook, drawer, dialogs · Viewports: LH 667×375, 844×390
Severity: P3
Observed: `100svh` films become short letterboxes; drawer `overflow-y-auto` full-height list; Lookbook 700px floor
exceeds 375px height; no `(orientation)` rules anywhere.
Evidence: absence in CSS + `Lookbook.tsx:26`, `HopHeader.tsx:194`.
Root Cause: portrait-only composition.
Why It Matters: video/lookbook buyers rotate; nav becomes a long scroll.
Recommended Solution: `(max-height:500px) and (orientation:landscape)` compaction: films `140svh min`? No —
`min-height:120svh` is worse; instead reduce title `vw` basis, cut section padding to `3rem`, drawer to two-column
link grid; Lookbook floor `min(100svh,700px)`.
Files: homepage + lookbook + drawer CSS. Complexity: Medium. Regression: Low.

### [HOP-M-34] No keyboard-avoidance / `visualViewport` handling for fixed CTAs and dialogs

Priority: P2 · Type: Interaction/Browser · Routes: checkout, search, future sticky CTA · Viewports: iOS Safari
Severity: P2
Observed: no `visualViewport` listeners; fixed/sticky elements + `pt-[15vh]` dialogs assume stable viewport.
Evidence: absence across `SearchModal`, `Checkout`, `StudioHeader`, toast/sheet.
Root Cause: desktop viewport assumption.
Why It Matters: iOS keyboard covers inputs, pay buttons, and results.
Recommended Solution: when adding sticky CTA (HOP-M-12), hide on `focusin` for text inputs; for search/dialogs,
re-anchor on `visualViewport.resize`; test every form with keyboard open at 390×844.
Files: new CTA + `SearchModal`. Complexity: Medium. Regression: Low.

---

## 28. P0 Findings

- **HOP-M-12** — No sticky mobile CTA on PDP/Cart/Checkout (blocks one-handed purchase).
- **HOP-M-15** — Form inputs under 44px / 16px, placeholder labels, missing autofill (abandonment + zoom + a11y).
- **HOP-M-31** — `HopPage.css` nesting anomaly (potential site-wide desktop/motion breakage — verify immediately).

P0s are few but load-bearing: one revenue, one form-trust, one structural.

---

## 29. P1 Findings

HOP-M-01, M-02, M-05, M-06, M-08, M-11, M-13, M-14, M-17, M-18, M-19, M-20, M-32.
Theme: touch targets, video control/cost, fonts/LCP, gallery inspection, cart persistence, journal body,
error contrast, Studio mobile. All affect real buyers on real phones weekly.

---

## 30. P2 Findings

HOP-M-03, M-04, M-07, M-09, M-16, M-21, M-22, M-23, M-25, M-27, M-30, M-34.
Theme: rhythm/polish, header offset, logo, story presence, hero aspects, money formatting, overlays, brand pacing.

---

## 31. P3 Findings

HOP-M-10, M-24, M-26, M-28, M-29, M-33.
Theme: zoom fragility, breadcrumbs, toasts, card feedback, journal rows, landscape.

---

## 32. P4 Findings

No pure enhancements are filed as defects. Candidate P4s for the roadmap (not counted as issues):

- P4-a: Collection-film chapter progress ("Room 2 of 5") for orientation on long scroll.
- P4-b: Lookbook captions index / jump-to-room.
- P4-c: Wishlist share / gift handoff (fits the Giving note).
- P4-d: Reduced-data mode (poster-only films) as a house preference, not just `Save-Data` sniffing.

---

## 33. Top 10 Mobile Fixes

Ranked by user impact × frequency × brand impact × a11y × leverage ÷ regression risk:

1. **Sticky mobile commerce CTA** (M-12, P0) — unblocks purchase everywhere; one pattern, three routes.
2. **Form remediation: 44px/16px + labels + autofill** (M-15, P0) — checkout/care/appointments/footer in one pass.
3. **Verify + fix `HopPage.css` nesting** (M-31, P0) — structural; do first to avoid building on broken CSS.
4. **Film posters via image pipeline + video budget** (M-19 + M-06/M-18, P1) — LCP bytes, data cost, pause control as one media sprint.
5. **Fonts: `display=swap` + Canela decision** (M-20, P1) — cheapest LCP/CLS win.
6. **Gallery counter + true zoom** (M-11, P1) — the luxury inspection decision.
7. **Menu/drawer 44px + safe-area** (M-01 + M-02, P1) — nav entry for every session.
8. **Threshold mobile composition** (M-05 + M-30, P1/P2) — title cap + CTA hit-areas + section rhythm retune.
9. **PLP heart to 44px + hero aspect per breakpoint** (M-08 + M-09, P1/P2) — browsing density + room first impressions.
10. **Cart persistence verification + price-format unification** (M-13 + M-21, P1/P2) — trust before scale.

---

## 34. Systemic Recommendations

Do not invent a new system. Converge on the existing one:

1. **Tokens:** delete the `--hop-*` hex universe; alias everything to `index.css` HSL vars. One cream, one lac,
   one gold. Verify contrast after merge.
2. **Containers:** adopt `hop-page__room` (`20px <640 / 32px 640–1024 / 64px+`) everywhere including header/footer;
   deprecate Tailwind `.container` for storefront (keep for Studio).
3. **Type:** mobile title cap (`15vw`, `lh 1.0`), kicker floor (`0.7rem`, tracking ≤0.28em under 400px),
   body unified on Newsreader, interactive-text floor `0.7rem`. Keep desktop scales untouched.
4. **Buttons:** three tiers only — Primary (square `min-h-48`, lac→mulberry), Quiet (bottom-border arrow-link,
   `min-h-44` hit-area), Ghost (text link). Pill CTAs migrate to Primary with `border-radius:999px` only where
   already shipped (PDP/Cart/Wishlist) — grandfather, don't proliferate.
5. **Touch:** 44px minimum for all interactive elements; 24px visible control inside 44px label rows for
   radios/checks; `:active` parity for every `:hover`.
6. **Forms:** `min-h-44 + text-base` inputs, visible labels, full `autocomplete`/`inputmode`, country select,
   `aria-describedby` errors in ≥4.5:1 colour. One input component (extend shadcn `Input` with hop classes;
   delete `hop-form-control` divergence).
7. **Media:** posters through Supabase/`OptimizedImage` with `srcset`; one autoplay film per viewport (threshold
   only) + tap-to-play elsewhere on mobile; pause controls everywhere video plays; `save-data` poster-only mode.
8. **Overlays:** `w-[calc(100%-2rem)]`, `max-h-92dvh`, safe-area padding, 44px dismiss, `visualViewport` anchoring,
   `inert` background. Prefer Radix for new dialogs (free focus/scroll semantics).
9. **Breakpoints:** keep Tailwind; add only `(max-width:400px)` refinement + landscape compaction. Fluid `clamp()`
   over new breakpoints.
10. **Studio:** `p-4 sm:p-6`, truncating header, lists→cards <768px, single-column workspaces, read-only +
   desktop-notice for genuinely-wide surfaces. Never squeeze tables.
11. **Motion:** keep the breathe/reveal language; gate *all* of it (including toasts/carousel) behind
   `prefers-reduced-motion`; add pause for any surface that moves for >5s.

---

## 35. Recommended Implementation Order

1. **Stabilise:** M-31 (CSS nesting verify/fix) → snapshot tests for header/hero/grids/forms/Studio shell.
2. **Trust:** M-15 (forms) + M-21 (prices) + M-13 (cart persistence verify).
3. **Transact:** M-12 (sticky CTA) with safe-area + keyboard hiding.
4. **Perceive:** M-20 (fonts) + M-19/M-06/M-18 (media budget + posters + pause).
5. **Browse:** M-11 (gallery) + M-08/M-09 (PLP) + M-05/M-30 (threshold rhythm) + M-07 (emotion line).
6. **Navigate:** M-01/M-02 (menu) + M-27 (search) + M-25/M-26 (dialogs/toasts) + M-24 (breadcrumbs).
7. **Endure:** M-32 (Studio cards), M-33 (landscape), M-22/M-23 (lookbook/appointments), M-16/M-17/M-28/M-29
   (footer/errors/cards/journal polish), M-03/M-04/M-10 (header offset/logo/YŪGEN).
8. **Verify:** Playwright viewport matrix (320/360/375/390/430 + 768/1024/1280/1440/1920, landscape, 200/400% zoom,
   reduced-motion, Slow 4G), axe mobile, LCP/CLS/INP budgets, safe-area on notch devices.

---

## 36. Risk Assessment

- **Highest:** M-31 (unknown blast radius — could already be breaking desktop) and M-13/M-21 (money/cart).
  Mitigate with pre-fix snapshots + post-fix full-matrix pass.
- **Medium:** sticky CTA (safe-area/keyboard/observer interplay), media budget (visual approval per world),
  Studio cards (scope creep — bound to lists first, workspaces second).
- **Low:** type caps, spacing retunes, target enlargements, label/contrast fixes — approve visually once, roll out.
- **Residual coverage gaps:** individual Studio workspaces, Gift/campaign/account sub-pages, and policy pages were
  pattern-audited, not deep-read. The implementation agent should timebox a second pass there using this report's
  checklists (§15–§17, §23) rather than re-deriving criteria.
- **No screenshots were captured** (no browser automation in this audit). §37's evidence is file/selector-precise;
  the implementation agent must capture before/after screenshots per issue at 320/390/768/1440 as definition of done.

---

## 37. Screenshots / Evidence

None captured during this static audit. Substitute evidence per issue:

- **File + line + selector** (every issue register entry).
- **Reproduction recipe:** DevTools device mode → stated viewport → stated route → stated interaction
  (e.g. "390×844 → `/product/<id>` → scroll past accordions → Add-to-Bag off-screen" for M-12).
- **Computed-value proofs** already in the report (e.g. `18vw at 320 = 57.6px`, `100svh × 5 ≈ 500vh`,
  `0.9rem = 14.4px < 16px iOS threshold`).
- **Required captures during implementation:** 320/390/768/1440 + landscape + keyboard-open + 200% zoom for
  every P0/P1; store under `docs/audit-evidence/<ISSUE-ID>/<viewport>-<route>.png` with viewport + route in frame.

---

## 38. Final Verdict

# MOBILE READINESS

**READY WITH MAJOR FINDINGS**

Mobile UX: **6/10** — all journeys completable; purchase, inspection, and form-filling carry real friction.
Responsive Engineering: **6/10** — collapses without breakage, but dual tokens, coarse breakpoints, mixed units,
and a suspected CSS nesting defect betray a scattered system.
Accessibility: **6/10** — strong foundations (skip link, focus ring, traps, live regions in places) undermined by
targets, labels, contrast, and uncontrollable motion.
Visual Quality: **7/10** — genuinely beautiful surfaces; rhythm and scale un-tuned for small screens.
HOP Brand Experience: **7/10** — voice, palette, and restraint survive; monumentality replaces calm on phones,
and homepage films drop the story.
Desktop Integrity: **8/10** — desktop composition is the system's home turf and shows it; the M-31 nesting
question is the only cloud.
Overall: **6/10** — a functioning responsive site that has not yet become an intentional mobile experience.
The fixes are bounded, high-leverage, and brand-safe; nothing here asks HOP to become something it is not.

Do not inflate this: a page can be functionally responsive and still fail premium mobile UX. HOP's pages are
proof — they fit, but they do not yet *belong* on a phone.

---

## 39. Final Machine-Readable Summary

| ID | Priority | Type | Route | Viewport | Issue | Root Cause | Recommended Fix | Complexity |
|----|----------|------|-------|----------|-------|------------|------------------|------------|
| HOP-M-01 | P1 | Navigation | all | M320–M430 | Menu trigger ~36px | Bespoke `p-2` button | 44px trigger | Low |
| HOP-M-02 | P1 | Navigation | all | M320–M430/LH | Drawer no safe-area, small close | No `env()` contract | dvh + safe-area + 44px close | Medium |
| HOP-M-03 | P2 | Layout | all non-hero | M320–M430 | `pt-header` 96px+ vs 72px bar | Oversized offset token | 72/80px offset | Low |
| HOP-M-04 | P2 | Typography | all | M320 | Logo tracking clips | `nowrap` + 0.28em | 0.22em + ellipsis guard | Low |
| HOP-M-05 | P1 | Typography | `/` | M320–M430 | 18vw title + text-link CTA | Desktop scale carried down | Cap 15vw/lh 1.0 + 44px CTA areas | Low |
| HOP-M-06 | P1 | Media | `/` | M320–M430 | 5×100svh autoplay films | Verbatim desktop rhythm | 92svh + budget + pause | Medium |
| HOP-M-07 | P2 | Content | `/` | M320–M430 | Films hide emotion line | Identity scoped to name | Add emotion line | Low |
| HOP-M-08 | P1 | Interaction | rooms | M320–M430 | 36px wishlist heart | Aesthetic size | 44px heart | Low |
| HOP-M-09 | P2 | Media | rooms | M320–M430 | 2/1 letterbox hero | One aspect all widths | 4/5→16/10→21/9 | Low |
| HOP-M-10 | P3 | Typography | films | M320/zoom | YŪGEN nowrap hack | text-indent centering | alignment + wrap | Low |
| HOP-M-11 | P1 | Interaction | PDP | M320–M430 | No counter; scale-only zoom | Desktop gestures 1:1 | Counter + pan-able zoom | High |
| HOP-M-12 | P0 | Interaction | PDP/cart/checkout | M320–M430 | No sticky mobile CTA | Sticky desktop-only | Quiet sticky bar + IO + safe-area | Medium |
| HOP-M-13 | P1 | Architecture | cart→auth | all mobile | Cart persistence unverified | Unknown store | Persist + merge + tests | Medium |
| HOP-M-14 | P1 | Content | journal detail | all | No article body | Field/component gap | Render body 65ch | Medium |
| HOP-M-15 | P0 | Forms | checkout/forms | M320–M430/iOS | Small/placeholder/unaffixed inputs; 14.4px zoom | Dual systems, no autofill spec | 44px/16px + labels + autocomplete | Medium |
| HOP-M-16 | P2 | Forms | all (footer) | M320–M430 | Cramped faded newsletter | Ornamental styling | 44px submit + 24px check | Low |
| HOP-M-17 | P1 | Accessibility | care/forms | all mobile | `text-sakura` errors, no live regions | Decorative colour | ≥4.5:1 + describedby/alert | Low |
| HOP-M-18 | P1 | Accessibility | `/` | all mobile | Autoplay without pause | `showControls=false` | Quiet pause per film | Medium |
| HOP-M-19 | P1 | Performance | films | M320–M430 | Full-weight posters | Posters bypass pipelines | srcset posters + video budget | Medium |
| HOP-M-20 | P1 | Performance | all | all mobile | Fonts block/swap, Canela missing | No display=swap | swap + preload + Canela decision | Low |
| HOP-M-21 | P2 | Consistency | cart/checkout | all | Paise/rupee formatting split | No price primitive | Single helper + tests | Low |
| HOP-M-22 | P2 | Layout | lookbook | M320/LH | 700px floor + class confusion | vh + misapplied class | min(100svh,700px) + fix target | Low |
| HOP-M-23 | P2 | Layout | appointments | M320–M430 | Form-before-image + select w/o chevron | Page-specific pass missing | Swap order + hop inputs + chevron | Low |
| HOP-M-24 | P3 | Navigation | rooms/PDP | M320 | Breadcrumb wrap/overflow | No truncation contract | truncate + title attr | Low |
| HOP-M-25 | P2 | Overlays | dialogs | M320 | Edge-to-edge dialogs | Desktop centering | calc margins + dvh + safe-area | Low |
| HOP-M-26 | P3 | Overlays | all (toast) | M320–M430 | Toast covers header | Top anchor, no offset | Header-aware offset | Low |
| HOP-M-27 | P2 | Overlays | search | M320–M430/iOS | Keyboard cover + ring-less + small close | Desktop anchoring | dvh/visualViewport + ring + 44px | Medium |
| HOP-M-28 | P3 | Interaction | PDP/wishlist | M320–M430 | Hover-only cards, 36px remove | Hover-first language | :active parity + 44px | Low |
| HOP-M-29 | P3 | Content | journal | M320–M430 | Ledger hides dek/arrow, 64px thumbs | Over-simplification | 80px + clamp-2 dek | Low |
| HOP-M-30 | P2 | Brand | home/pages | M320–M430 | 7–8rem padding + 17vw titles | Desktop tokens on mobile | 4.5/5rem + title caps | Low |
| HOP-M-31 | P0 | Architecture | all hop-page | T/L/D + RM | CSS nesting anomaly | Mis-nested braces | Re-nest + visual pass | Low |
| HOP-M-32 | P1 | Responsive | studio | M320–M430 | No mobile transformation | Desktop admin patterns | Cards + p-4 + truncating header | High |
| HOP-M-33 | P3 | Responsive | home/drawer | LH | No landscape handling | Portrait-only | Height-based compaction | Medium |
| HOP-M-34 | P2 | Browser | forms/dialogs | iOS | No visualViewport handling | Desktop viewport assumption | Hide-on-focus + re-anchor | Medium |

TOTAL ISSUES: 34 (P0: 3 · P1: 13 · P2: 12 · P3: 6 · P4: 0 defects + 4 roadmap candidates)

MOST AFFECTED ROUTES: `/` (threshold + 5 films), `/product/:id` (gallery + CTA), `/checkout` (forms + CTA),
`/collections/:slug` (hero + PLP targets), `/journal/:slug` (missing body), `/studio/*` (shell + tables).

MOST AFFECTED VIEWPORTS: 320×568 (logo, drawer, titles, dialogs), 390×844 (primary — CTA reach, film scroll,
form zoom), landscape 667×375/844×390 (films, drawer, lookbook), 200%+ zoom (nowrap elements).

TOP SYSTEMIC ROOT CAUSES: dual token universes; coarse breakpoints + vw-only fluidity; mixed vh/svh with zero
safe-area; three image pipelines with posters outside all of them; two button + two input systems; hover-first
interactions; desktop rhythms (100svh × 5, 7–8rem padding, monumental type) applied verbatim to mobile.

TOP 10 FIXES: (1) sticky mobile CTA · (2) form 44px/16px + labels + autofill · (3) verify/fix HopPage.css nesting ·
(4) poster srcset + video budget + pause · (5) fonts display=swap + Canela decision · (6) gallery counter + true zoom ·
(7) menu 44px + safe-area · (8) threshold mobile composition + section rhythm · (9) PLP heart + hero aspects ·
(10) cart persistence + price unification.

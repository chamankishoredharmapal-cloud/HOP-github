# HOP Homepage Hierarchy Cleanup

## What changed

`src/components/hop/HomepageExperience.tsx` + `HomepageExperience.css` only.

1. **Moved "A House, Not a Shop." (`Philosophy`) lower.** It was the 2nd
   section (directly under the hero); it is now the 5th, after collections,
   the featured drape, and craftsmanship.
2. **Removed the `Material` placeholder section entirely** (component-level
   deletion, not a CSS hide). Its dead CSS was removed too.
3. **Retargeted the hero scroll cue** `href="#philosophy"` -> `"#collections"`,
   so "Descend into the house" now leads to collection discovery instead of
   skipping past it.

No copy rewritten. No styling, colors, typography, animations, navigation, or
other sections touched.

## Why Philosophy moved

Old order forced every customer through a 75vh brand statement plus a large
material placeholder block before reaching any collection. New order follows
the intended journey: introduction -> visual experience -> collection
discovery -> craft story -> philosophy -> remaining content.

## Section order (before -> after)

Before: Threshold -> Philosophy -> Material -> CollectionRooms -> Craft ->
ProductDesire -> Ownership -> Journal -> Invitation

After: Threshold -> CollectionRooms -> ProductDesire -> Craft -> Philosophy ->
Ownership -> Journal -> Invitation

Collections now start at ~1.0 viewport height on all viewports (previously
~2.5-3 viewports down). ProductDesire keeps its relative position ahead of
Craft per the intended "other collection content before craftsmanship" slot;
Craft stays immediately before Philosophy so the weaver story still earns the
philosophy statement.

## Placeholder root cause + fix

- Source: `Material` component in `HomepageExperience.tsx` (`id="material"`,
  `aria-label="Material photography placeholder"`).
- It rendered the bundled `hop-fabric.jpg` still with the alt text "Temporary
  HOP material photography placeholder..." — an intentional temporary stand-in
  from the homepage redesign (see `HOP-HOMEPAGE-REDESIGN-REPORT.md`), i.e. dead
  placeholder content, not a failed load. It duplicated the same still already
  used as the Padma collection fallback and added a full 16/10 (mobile 4/5)
  dark block plus up to 13rem of section padding ahead of collections.
- Fix: deleted the component and its render call; removed the now-unreferenced
  `.hop-material*` CSS rules (base, mobile aspect-ratio, landscape grouping,
  reduced-motion entry). No `display:none`/opacity patch; nothing renders.
- The real craftsmanship image (`Craft`: Gangamma pit-loom portrait,
  `public/content/weaver-portrait/gangamma-molakalmuru/hero.jpg`, verified
  present, with existing `heroStill` onError fallback) is untouched.

## Responsive verification (Playwright chromium, live dev server)

320x568, 360x800, 375x667, 390x844, 430x932, 768x1024, 1024x768, 1440x900 —
8/8 passed: section order as above, `#collections` top at ~1.0vh on every
viewport, `#philosophy` exactly once and after `#craft`, zero `.hop-material`
nodes, craft image resolved, no horizontal overflow (`scrollWidth ==
innerWidth`), zero console/page errors.

## Tests run

- `npx tsc --noEmit` — clean
- `npx eslint src/components/hop/HomepageExperience.tsx` — clean
- `npm run build` (vite + prerender, 29 routes) — all `[OK]`, incl. `/`
- Prerendered `dist/index.html` — philosophy present once, material absent,
  order threshold < collections < product-desire < craft < philosophy
- `npx vitest run src/lib/__tests__` — 23/23 passed
- `npx playwright test src/__tests__/Studio.spec.ts` (chromium) — 6/7 passed;
  the 1 failure (collection-detail `.aspect-[2/1]` hero locator) also fails on
  the pristine tree without this change (verified via `git stash`), so it is
  pre-existing and unrelated. The homepage collection-film test passes.
- No test asserted the old section order, so no test updates were needed.

## Remaining observations

- `WORLD_COPY` fallbacks for Padma/Yugen still use labelled temporary material
  studies (explicit alt text, documented in the redesign report). Out of scope:
  they need approved collection photography, not hierarchy work.
- Dead `HeroSection.tsx` (unused hero) still exists in-repo; left alone as out
  of scope.

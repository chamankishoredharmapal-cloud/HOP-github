# HOP Homepage Redesign Report

## Checkpoint and safety

- Pre-redesign checkpoint commit: `a1d80a2367512b7fa366bf1cc01cbe6c0ef0b818`
- Checkpoint subject: `chore: checkpoint before HOP homepage redesign`
- No `git reset --hard`, `git clean`, destructive database command, commit, amend or push was run.
- The working tree contained unrelated modifications before this redesign. Those changes were not reverted or overwritten.
- This redesign was implemented without modifying Supabase records or business data.

## 1. What was redesigned

The homepage was rebuilt as a continuous editorial journey:

1. Threshold — The House at Dusk
2. A House, Not a Shop.
3. The Cloth, Before the Name
4. Five Rooms, One House
5. The Hands Behind the Weave
6. A Drape to Live With
7. The Ritual of Wearing
8. Letters from the House
9. Come in quietly. Choose slowly.

The previous sequence of separate hero, collection, heirloom, craft and journal modules was replaced by a single narrative experience with alternating light and dark rooms.

## 2. Major creative decisions

- The homepage now opens as a cinematic threshold rather than a centered ecommerce hero.
- RASA became the semantic visual foundation: lacquered dark, warm parchment, rose, mulberry and old gold.
- Product discovery was moved after material, philosophy and collection context.
- The homepage now presents all five intended collection worlds rather than only whatever collection records are currently published.
- The five worlds retain one house grammar while varying light, crop, pacing and collection accent.
- The homepage uses existing HOP media only. Missing Padma and Spandana photography is represented by a clearly labelled visual-study treatment rather than fabricated product imagery.
- Product desire uses a real featured product query and the existing Bag context.
- Craft content uses the existing published Gangamma/Molakalmuru editorial material and falls back to an existing HOP image if the referenced asset cannot load.
- Header and footer collection links were normalized to the canonical `/collections/arya`, `/collections/padma` and `/collections/spandana` routes.
- Advanced WebGL/3D was intentionally not used. Native video, CSS, image layering and restrained motion produced a lighter and more reliable experience.

## 3. Color system

The implemented RASA palette is centralized in `src/index.css` and exposed through Tailwind semantic keys.

- Lac: `#2B0E17`
- Lac secondary: `#4A1824`
- Parchment/cream: `#F5E8DC`
- Rose accent: `#D45B5B`
- Mulberry: `#6E253A`
- Old gold: `#D3A85F`
- Eucalyptus support: `#2F665C`
- Divider: `#7A4A50`
- CTA parchment: `#E7C99A`
- CTA dark text: `#2B0E17`

Collection-specific accents remain data-driven from the existing collection world system:

- Kalyani: `#8B1E2D`
- Viara: `#CFA9A2`
- Arya: `#5D817E`
- Padma: `#9A3B26`
- Spandana: `#D99A2B`

The palette is used as atmosphere and punctuation. The textile remains the most saturated object in the experience.

## 4. Typography

The implementation uses the approved editorial role direction with the available/licensed web font stack:

- Display: Cormorant Garamond, with Canela Deck reserved as the first preferred stack slot.
- Collection/product names: Fraunces.
- Editorial reading: Newsreader.
- Interface/body: Inter, with Suisse Int'l reserved as the first preferred UI stack slot.
- Devanagari accent typography was not loaded because the current approved homepage copy does not contain verified bilingual content; adding decorative script would weaken the brand rule against fabricated cultural styling.

Typography hierarchy is implemented through the Tailwind font roles, the homepage display/editorial classes, responsive clamps, controlled line heights and narrow editorial reading widths.

## 5. Homepage architecture

### Threshold

Full-viewport RASA hero using the existing hero film/poster, natural-light image treatment, HOP mark, “Saree. Time. You.”, supporting line, “Enter the House” and a quiet scroll cue.

### Philosophy

A dark, spacious statement section for “A House, Not a Shop.” with a large editorial lockup and supporting HOP philosophy.

### Material

Four existing textile studies presented as material distances:

- Warp
- Zari
- Hand
- Drape

The section uses the existing optimized image manifest where available.

### Collection worlds

Five connected collection rooms for Kalyani, Viara, Arya, Padma and Spandana. Each room has a controlled accent, emotional line, image treatment, film fallback and canonical collection link.

### Craft

Existing Gangamma/Molakalmuru content, a real craft quote, verified metadata already present in the repository and a human-scale image treatment.

### Product desire

A real featured-product query selects the current published featured product, then presents image, product story, available material details, price, stock state, Bag action and full product route.

If no published product is available, the section shows an honest preparation state and links to collections rather than inventing a product.

### Ownership

Three existing service/ritual territories:

- The hand
- The keeping
- The giving

### Journal

The existing journal data is reorganized into one lead story and two supporting house letters rather than three generic cards.

### Invitation

A quiet final room with three non-aggressive paths:

- Explore Collections
- House Letters
- Contact / Conversation

## 6. Motion system

- Existing native `Film` behavior is preserved.
- Video loads only when its frame enters the viewport.
- Reduced-motion visitors receive the still frame without autoplay.
- Hero imagery uses a slow, low-amplitude breathing scale.
- Material and room images use restrained hover/focus transitions.
- Product imagery uses a very small scale transition.
- Text and layout transitions are primarily CSS opacity, transform and line-draw behavior.
- No particles, cursor effects, 3D distortion, excessive parallax or animation gimmickry was added.

## 7. 3D/WebGL technology

None.

The experience uses native video, CSS layering, responsive images and the existing film controls. This was chosen because the material-led direction benefited more from restraint and image performance than from a technology demonstration.

## 8. Assets added

No new binary image, video, model or texture assets were added.

Existing assets reused:

- `src/assets/hop-hero.jpg`
- `src/assets/hop-fabric.jpg`
- `src/assets/hop-collection-pattu.jpg`
- `src/assets/hop-collection-linen.jpg`
- `src/assets/hop-collection-organza.jpg`
- Existing public collection, weaver and content media
- Existing Supabase collection films

No external assets were downloaded. No generated image is represented as a real HOP product.

## 9. Files changed

Homepage-specific implementation:

- `src/pages/Index.tsx`
- `src/components/hop/HomepageExperience.tsx`
- `src/components/hop/HomepageExperience.css`
- `src/index.css`
- `tailwind.config.ts`
- `index.html`
- `src/hooks/useMetadata.ts`
- `src/components/layout/PageLayout.tsx`
- `src/components/hop/HopHeader.tsx`
- `src/components/hop/HopFooter.tsx`
- `src/services/productService.ts`

Report:

- `HOP-HOMEPAGE-REDESIGN-REPORT.md`

Existing unrelated working-tree modifications were not included in this list and were not reset.

## 10. Verification results

### Passed

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- All 16 prerender targets completed successfully
- Targeted Chromium ProductGallery tests: 9 passed
- Direct Axe scan of the rendered homepage: 0 violations
- Production preview route smoke test:
  - `/`
  - `/collections`
  - `/collections/kalyani`
  - `/cart`
  - `/wishlist`
  - `/journal`
  - `/customer-care`
  - `/checkout`
- Production preview route smoke test returned HTTP 200, mounted a main landmark, produced no horizontal overflow and reported no browser console/page errors.
- Mobile menu opens and closes with Escape.
- Reduced-motion rendering preserves the still frame.
- Homepage Bag interaction successfully added the current published product, updated the Bag count and displayed the existing confirmation toast.
- Desktop and mobile full-page screenshots were rendered and visually inspected after scrolling through deferred media.

### Existing test-environment limitations

The broad Playwright run still reports failures in the existing test suite for reasons outside this homepage implementation:

- The Vite dev server returns an incomplete fallback document for the exact `/collections` path without a trailing slash during some test runs; `/collections/` and the production preview both mount correctly.
- The configured Firefox and WebKit browser binaries are not installed in this environment.
- Several pre-existing route/accessibility tests assume a clean dev-server network-idle state and time out against the current Supabase-backed development environment.
- The current staging data exposes a synthetic staging product, so the homepage correctly displays the existing live record rather than fabricating a replacement.

## 11. Known limitations

- The current staging product is explicitly synthetic validation inventory. It must be replaced with approved real HOP product data before launch.
- Padma and Spandana do not yet have approved collection photography in the repository. Their rooms use clearly marked visual-study placeholders and canonical routes.
- The referenced Gangamma content image falls back to the existing HOP hero image if unavailable. Final approved maker photography is still required.
- Canela Deck and Suisse Int'l are not bundled because no licensed local font assets were supplied. The implementation uses the approved role direction with the available web font stack.
- The existing newsletter form remains local-only in the footer because persistence and business ownership were outside this homepage change.
- Existing placeholder business contact data and trust/service claims elsewhere in the storefront still require human business approval.
- Full Firefox/WebKit visual verification remains pending until those Playwright browsers are installed.

## 12. Human assets/content required before launch

- Real published product records, prices, inventory and product photography
- Approved collection records and product associations for Kalyani, Viara, Arya, Padma and Spandana
- Approved Padma and Spandana collection photography
- Approved Gangamma/Molakalmuru photography and final provenance review
- Verified contact details and communication ownership
- Newsletter persistence and consent implementation
- Final review of service, shipping, insurance and returns claims
- Licensed Canela Deck/Suisse Int'l font assets if the exact approved typefaces are required
- Final human review of the homepage copy and collection emotional lines

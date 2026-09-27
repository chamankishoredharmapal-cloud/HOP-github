# HOP — Copywriting Claim Audit & Neutralization

**Date:** 2026-09-27
**Scope:** Entire repository — storefront copy, content system (`src/content`), SEO/metadata, lifecycle emails, test mocks, and content-generation prompts (`docs/editorial/prompts`, `src/content/README.md`)
**Governing principle:** HOP communicates textile character, design, colour, texture, drape, cultural reference, visual heritage and craftsmanship **without assuming or universally claiming a particular manufacturing method**. Production method belongs to verified product-level information, not generic brand mythology.

---

## 1. Executive Summary

**What was wrong.** A reasonable customer reading the site would conclude HOP exclusively sells handloom/handwoven sarees. The cause was not one page but a system-wide pattern:

- Universal brand claims: "dedicated to handwoven Indian sarees", "Every saree that carries our name is handwoven on a pit loom" (`about-hou`), "woven slowly, chosen quietly" (hero + homepage threshold), "A saree is woven by a person, not a machine" (homepage).
- Invented exact production durations presented as house facts: **21 days** (Kalyani collection, About letter, discount letter, Gangamma portrait, design tokens, POC page), **43 hours** (Viara), **14 days** (Sakura product, Rafeeq portrait, embroidery note), **40 days** (Lookbook caption), **60 hours** (homepage prompt example).
- Product SEO descriptions asserting `handwoven` with no structured verification behind them. The product database has **no production-method field** (`fabric`, `weave`, `colour`, … — no `production_method`), so per the evidence discipline every production-method claim was classified **UNKNOWN/UNVERIFIED**.
- Content-generation prompts that actively instructed future AI to reintroduce the claims ("Twenty-one days on the loom. No power-loom imitations", "handwoven on a pit loom … for twenty-one days" as the definition of earned luxury, "Sixty hours per drape" homepage example).
- Meanwhile `TermsOfService.tsx` already acknowledged a mixed catalogue ("handwoven sarees, designer sarees, and machine-assisted sarees") — direct evidence the universal handwoven positioning was inaccurate.

**What was corrected.** 30 user-facing copy locations neutralized (universal claims scoped or rewritten in HOP voice around verified material/design/drape/colour/culture); all exact weaving-time figures removed except operational dispatch timelines; 12 content-generation/review prompt files updated with a permanent production-method guardrail; content compiler, type-check (on touched files), ESLint, and the full production build with prerender all pass.

**What was intentionally retained.** Educational craft notes, weaver portraits, field notes, and glossary definitions that describe *their own subject* (a technique, a person, a place, a term) rather than the catalogue; product-specific `hand-embroidered` finishing detail on the Sakura organza (observable, portrait-linked); and the Terms taxonomy that correctly distinguishes product types.

---

## 2. Findings — Claim Inventory

| # | Location | Current copy (before) | Claim type | Risk | Evidence | Action taken |
|---|----------|----------------------|------------|------|----------|--------------|
| 1 | `src/content/house-letters/about-hou/index.md` (SEO + body) | "dedicated to handwoven Indian sarees"; "Every saree … is handwoven on a pit loom by a weaver we know"; "takes twenty-one days"; "We move at the speed of the loom"; "We name the weaver on every saree. Because her hands made it." | UNVERIFIED (universal method + duration) | No production-method field in DB; Terms admits machine-assisted products | Rewritten — universal method removed, durations removed, maker-naming scoped to "wherever a maker is part of a saree's story" |
| 2 | `src/components/hop/HeroSection.tsx`, `HomepageExperience.tsx` (Threshold) | "Five ways of wearing tradition — woven slowly, chosen quietly." | INFERRED (universal method) | Applies to whole house | "considered deeply, chosen quietly" |
| 3 | `HomepageExperience.tsx` (House notes) | "A saree is woven by a person, not a machine…" | UNVERIFIED (universal) | Same | Rewritten around decisions/tension/patience, no method claim |
| 4 | `HomepageExperience.tsx` (Philosophy) | "intelligence of the hand, the patience of the weave" | INFERRED | Same | "intelligence of considered making, the patience of cloth" |
| 5 | `HomepageExperience.tsx` (Craft) | "The hand is part of the design"; "decisions made by hand"; "Meet the hands" | INFERRED | Implies all-saree hand production | "Detail is part of the design"; "considered decisions"; "Meet the makers" |
| 6 | `HomepageExperience.tsx` (WORLD_COPY) | "Order that reveals the hand." / "Confidence, woven." | INFERRED | Collection-universal | "Order, made visible." / "Confidence, worn." |
| 7 | `HomepageExperience.tsx` + `JournalPreview.tsx` | "Field notes from the loom…" / "Dispatches from the loom…" | INFERRED | Implies all editorial is loom stories | "the cloth…" / "Dispatches on cloth and craft…" |
| 8 | `index.html` (meta description) | "sarees, woven with quiet artistry" | INFERRED | Brand-level SEO | "considered with quiet artistry" |
| 9 | `src/content/collections/kalyani/index.md` | "Each Kalyani saree is woven in pure Mulberry silk with hand-spun zari. The weave takes twenty-one days on a traditional pit loom… twice an hour…" | UNVERIFIED (method + duration + process frequency) | No verification | Rewritten around composition/rhythm/seasonal patience; system-2 `Hand-spun… / pit loom` → neutral detailing |
| 10 | `src/content/collections/arya/index.md` | "Arya silks are woven on pit looms with deliberately tighter warp tension" | UNVERIFIED (collection-wide method) | Same | "composed with a deliberately tighter weave structure" |
| 11 | `src/content/collections/viara/index.md` | "woven with exceptionally fine warp counts"; "wraps you in forty-three hours of quiet artistry" | UNVERIFIED (method + invented duration) | Same | "composed with an exceptionally fine weave structure"; duration removed |
| 12 | `src/content/campaigns/quiet-wedding/index.md` | "heirloom handlooms"; "choosing a pure handloom"; `#HandloomBridal #Handwoven`; "woven for the bride" | UNVERIFIED (edit-wide method) | Campaign implies all pieces handloom | "heirloom silks"; "considered heirloom"; `#QuietBridal #SilkSaree`; "designed for the bride" |
| 13 | Products `a1b2…` (SEO, frontmatter, body, system-2) | "handwoven with hand-spun zari"; "pit loom, hand-spun zari"; "hand of the weaver … no machine could replicate" | UNVERIFIED | No verification | Neutralized to "fine zari detailing" / "temple border"; weaver attribution to Gangamma retained (scoped, portrait-linked) |
| 14 | Product `11111111…` (Megham linen) | "pure handwoven linen"; weave `Handloom`; "handloom process leaves…" | UNVERIFIED | Same | "pure linen"; weave `Linen`; process sentence de-methoded (breathability/softening kept as product characteristics) |
| 15 | Product `66666666…` (Viara blush) | "Woven from pure silk"; "It is woven for the woman…" | OBSERVED (generic weave verb) | Low but universalizable | "Composed in…"; "designed for…" |
| 16 | Product `77777777…` (Sakura organza) | "fourteen days of continuous needlework"; "fourteen-day wait…" (+ pull-quote) | UNVERIFIED (exact duration) | No verification | Durations → "extended, unhurried needlework / timeline"; `hand-embroidered` retained as product-specific finishing detail (see §4) |
| 17 | `craft-notes/the-pit-loom` (intro + SEO) | "A saree is not woven by a machine… For our finest silks and linens, that place is a pit loom"; "humanity behind handwoven sarees" | INFERRED (universalizes to HOP's finest) | Educational note | Scoped: "Some sarees… For some of our finest…"; SEO "behind these sarees" |
| 18 | `craft-notes/hand-embroidery` | "takes fourteen days" (dek, SEO, body, system-2) | UNVERIFIED (duration) | Same | All four occurrences → unhurried-days wording |
| 19 | `craft-notes/understanding-zari` | "process is entirely by hand"; "requires generations of experience"; "hand-spun, real zari" (caption/alt/closure) | UNVERIFIED (absolute process + provenance) | Educational | "painstaking"; "deep, accumulated experience"; "fine zari" |
| 20 | `weaver-portraits/gangamma` | "A single saree takes twenty-one days… zari is hand-spun…" | UNVERIFIED (duration) | Portrait is the alleged source, still unverified in data | Duration → "many days of precise, unhurried work" |
| 21 | `weaver-portraits/rafeeq` | "will spend fourteen days…"; "testament to fourteen days…" | UNVERIFIED (duration) | Same | "many days"; "unhurried, uncompromising discipline" |
| 22 | `weaver-portraits/saraswati` | "softer and more fluid than anything a high-speed industrial machine could produce" | UNVERIFIED (absolute comparison) | Same | "softer and more fluid than many hurried, machine-made counterparts" |
| 23 | `house-letters/why-we-dont-discount` | "A handwoven saree… over a specific twenty-one days"; "folded by hand"; "chosen the way a saree is woven" | UNVERIFIED (universal + duration) | Same | "A HOP saree… over considered time"; "folded with care"; "chosen the way it deserves" |
| 24 | `journal/linen-art-doing-less` (SEO + alts + closure) | "handloom linen's tendency…"; alt "handloom linen draped" | OBSERVED (category education, product-linked) | SEO/alt imply method | SEO/alt/closure de-methoded; body category discussion retained (§4) |
| 25 | `journal/morning-light-reads-weave` | "adjusts the tension twice an hour" | UNVERIFIED (process frequency) | Literary scene, still exact | "adjusts the tension through the morning" |
| 26 | `src/pages/Lookbook.tsx` | "Hand-twisted silver zari over forty days." (caption + alt) | UNVERIFIED (invented duration; "forty days" appears nowhere else) | Same | "Fine silver zari on a temple border." |
| 27 | `src/pages/ProductDetail.tsx` | "One of a small batch from this loom" | INFERRED (every low-stock item = loom-made) | Dynamic UI string | "One of a small batch" |
| 28 | `src/pages/poc/ColorLab.tsx` | "pit loom · 21 days" | UNVERIFIED | POC label | "temple border · Molakalmuru" |
| 29 | `src/data/collectionWorlds.ts` | Kalyani material: "pit-loom tension — 21 days" | UNVERIFIED | Design token feeding content | "considered tension — Molakalmuru/Kanchipuram" |
| 30 | `src/services/emailService.ts` | "Notes from the loom" (title + subject) | INFERRED | Lifecycle-wide | "Notes from the house" |
| 31 | `src/studio/components/SeoSection.tsx` | Placeholder: "a handwoven Kanchipuram silk saree…" | UNVERIFIED (instructs future SEO) | CMS template | Neutral placeholder with temple-border detailing |
| 32 | `src/__tests__/mocks/supabase.ts` | "Handwoven pattu…"; "handwoven texture"; weave `Handloom Pattu`/`Handloom` | OBSERVED (test-only, copy-paste risk) | Mocks | Neutralized (hand-embroidered Sakura mock kept consistent with product) |
| 33 | `docs/editorial/prompts/**` (12 files) | Universal handwoven identity, 21-day/60-hour examples, earned-luxury = "handwoven on a pit loom … for twenty-one days" | UNVERIFIED (generative) | Future-AI risk | Neutralized + permanent guardrail added (see §7) |

---

## 3. Changes Made (file-by-file)

**Storefront / app copy**
- `index.html` — meta description de-methoded.
- `src/components/hop/HeroSection.tsx` — hero supporting line.
- `src/components/hop/HomepageExperience.tsx` — threshold line, philosophy line, house-note card, craft title/body/CTA, two collection taglines, journal heading.
- `src/components/hop/JournalPreview.tsx` — section description.
- `src/pages/ProductDetail.tsx` — low-stock batch note.
- `src/pages/Lookbook.tsx` — hero alt + Kalyani caption (removed invented "forty days").
- `src/pages/poc/ColorLab.tsx` — POC spec label.
- `src/data/collectionWorlds.ts` — Kalyani material token.
- `src/services/emailService.ts` — nurture email title/subject.
- `src/studio/components/SeoSection.tsx` — SEO placeholder.
- `src/__tests__/mocks/supabase.ts` — mock collection/product strings.

**Content system (`src/content`)**
- `house-letters/about-hou/index.md` — brand-story neutralization (SEO, universal pit-loom claim, 21-day passages, "speed of the loom", every-saree weaver claim, discount passage, closing).
- `house-letters/why-we-dont-discount/index.md` — universal + duration passages, caption, closing simile.
- `collections/kalyani|arya|viara/index.md` — method/duration/process passages + Kalyani system-2 specs.
- `campaigns/quiet-wedding/index.md` — edit body + social hashtags.
- `products/{a1b2…,11111111…,66666666…,77777777…}/index.md` — SEO, frontmatter weave, body, system-2, pull-quote as detailed above.
- `craft-notes/the-pit-loom|hand-embroidery|understanding-zari/index.md` — scoping + duration/absolutist removals.
- `weaver-portraits/gangamma-molakalmuru|rafeeq-lucknow|saraswati-phulia/index.md` — duration/comparison softening.
- `journal/linen-art-doing-less|morning-light-reads-weave/index.md` — SEO/alt/frequency fixes.
- `src/content/README.md` — permanent guardrail section added.

**Content-generation guardrails (`docs/editorial/prompts`)**
- `system/master-system-prompt.md` — identity, territories, promises, earned-luxury example, storytelling rule, specificity check + new permanent guardrail section.
- `system/brand-context.md` — identity line, craft pillar, promises + rule.
- `templates/session-bootstrap.md` — bootstrap instruction carries the rule.
- `writing/craft-notes.md`, `writing/product-pages.md`, `writing/collections.md`, `writing/seo-copy.md`, `writing/homepage.md`, `writing/journal.md` — acceptance criteria/examples/failure cases corrected.
- `editing/rewrite.md`, `editing/expand.md`, `editing/luxury-tone.md` — transformation tables and worked examples corrected; "never invent production method" added to mistakes.
- `review/fact-checking.md` — new production-method verification protocol; round-number guidance replaced with duration-verification rule.
- `review/hallucination-prevention.md` — new production-method hallucination rule.

No layout, component structure, routing, pricing, inventory, or unrelated functionality was changed.

---

## 4. Retained Claims (intentionally kept, with reason)

| Retained | Why it is defensible |
|----------|---------------------|
| `TermsOfService.tsx` + `docs/TERMS_AND_CONDITIONS.md`: "handwoven sarees, designer sarees, and machine-assisted sarees"; "Handwoven products may have minor variations … of handmade goods" | Correctly scoped product-type taxonomy with "may" — the compliant model; directly supports the mixed-catalogue reality |
| Glossary (`handloom.md`, `zari.md`, `pattu.md`, `index.md`) + `craft-note.yaml` schema description | Term definitions and content-category labels, not product claims |
| `craft-notes/the-pit-loom` (scoped), `handloom-linen` (category education, Megham-linked), `understanding-zari` (material education) | Educational content about its own subject; intro universals scoped ("some of our finest", conditional "when you wear a saree woven on a pit loom") |
| Weaver portraits (Gangamma, Lakshmidevamma, Saraswati, Rafeeq) incl. pit-loom biographical detail, generational lineage, tenures | Person-scoped biography, not catalogue claims; exact per-saree durations removed, tenure/lineage kept as attributed personal history |
| Field notes (`a-day-in-molakalmuru`) incl. "temple border sarees woven on pit looms" | Place-scoped travelogue describing the cluster, not HOP products |
| Journal category discussion (`linen-art-doing-less` body, `five-drapes` embroidery reference, `morning-light` scene) | Editorial/educational context, product-linked, no catalogue-wide claim |
| Sakura product + mock `hand-embroidered` | Product-specific finishing detail: observable characteristic, linked to Rafeeq portrait; dispatch "14 business days" is an operational fulfillment timeline (matches `estimated_dispatch_days`), not a production claim |
| Product/collection design language (`weave`, `woven texture`, temple-border, zari, drape, loom-wood as visual metaphor in design tokens) | Generic textile/descriptive vocabulary explicitly permitted by the brief |
| `Category.tsx` "Every saree in the house" counting strings | Inventory-count UI, not a production claim |
| Prompt failure-case examples that show handloom-phrased copy **being removed** (`about.md`, `journal.md`, `homepage.md`) | They already teach the correct behaviour |
| `proofread.md` spelling guidance for "handwoven" | Orthography guidance for legitimate scoped use, not a claim |
| Internal strategy/research docs (`02-brand-architecture/*`, research, `HOP_BRAND_CONTEXT.md`) | Institutional history, not website copy; flagged for founder decision in §9 rather than rewritten |

---

## 5. Unknown / Unverified Claims (require founder/product confirmation)

1. **Actual production methods per SKU/collection.** The database has no `production_method` (or equivalent verified) field. Until one exists, *all* method language must stay out of universal copy. If specific SKUs are genuinely handwoven/handloom, add a verified structured field and the claim may be used **for those SKUs only**.
2. **Molakalmuru / Neygi / Gangamma provenance narrative** (About letter, Kalyani, portraits, field notes). Retained as attributed, scoped editorial narrative, but no independent verification source was found in-repo. Confirm village visits, community details, names, and generational counts — or scope further.
3. **Material specifications** (12-momme silk, real silver/gold-wash zari, 450g/650g/350g weights, flax behaviour, zari identification tests). Retained as product characteristics; confirm against actual specs — do not let the audit be read as verifying them.
4. **"Twenty-one days" and other durations.** Removed everywhere as unverified. If any duration is real and intentionally part of a product story, verify per-product and reintroduce **only there**, never in brand messaging.
5. **Internal brand-bible positioning** (`docs/editorial/02-brand-architecture/*`: "digital fashion house dedicated to handwoven Indian sarees", "Twenty-one days on the loom. No power-loom imitations", "Handwoven, not mass-produced"). Left untouched as strategy history; founder to decide whether the house identity itself is being redefined or the catalogue is handwoven-only (in which case Terms' "machine-assisted" line needs the opposite fix).

---

## 6. Brand Positioning Result

**Before:** YES — a reasonable customer would incorrectly conclude HOP exclusively sells handloom/handwoven sarees. Responsible copy: About letter universals (§2 #1), hero/homepage "woven slowly" + "woven by a person, not a machine" (#2–#7), campaign "heirloom handlooms / pure handloom" (#12), collection-wide pit-loom + duration claims (#9–#11), and handwoven product SEO (#13–#14).

**After:** NO — universal brand messaging (homepage, hero, house letters, campaigns, index/OG SEO, lifecycle email, collection narratives, product SEO/bodies) no longer states or implies a single catalogue-wide production method. Remaining method language is scoped to its subject (a technique note, a person's portrait, a place visit, a term definition, one product's finishing detail, or the correctly-qualified Terms taxonomy). The site now reads as a house of considered Indian sarees — colour, drape, border, motif, texture, occasion, and cultural reference carry the luxury, which is precisely the brief: more precise, not more boring.

---

## 7. Future AI Guardrails (permanent rules added)

Core rule installed verbatim-in-spirit in `master-system-prompt.md` (new "Production-Method Claim Guardrail" section), `brand-context.md`, `session-bootstrap.md`, `src/content/README.md`, `review/fact-checking.md` (verification protocol), `review/hallucination-prevention.md` (detection rule), `writing/seo-copy.md` (SEO rule), plus acceptance-criteria lines in `product-pages.md` / `collections.md` / `craft-notes.md` and corrected examples in `homepage.md`, `journal.md`, `rewrite.md`, `expand.md`, `luxury-tone.md`:

> Never describe HOP or a HOP product as handwoven, handloom, handmade, artisan-made, or manually produced unless that exact claim is explicitly verified for the relevant product or collection. Never invent weaving times, production durations, artisan stories, provenance, or manufacturing processes. When production method is unknown, describe the verified material, design, texture, drape, colour, detailing, cultural reference, and customer experience instead.

Supporting mechanics: educational content must be framed as education about that technique (never catalogue-wide); universal brand messaging must never imply one production method; specificity checks and luxury refinement must never introduce a method claim; SEO must never trade accuracy for keyword value.

---

## 8. Verification

- **Content compiler** (`npm run content:build`): 25 units, 0 errors, 0 warnings — regenerated `src/data/__generated__` (gitignored build artifacts) picks up all content edits.
- **TypeScript** (`tsc --noEmit -p tsconfig.app.json`): zero errors in any touched file. The repo has pre-existing errors in untouched studio files (`Orders.tsx`, `activityService.ts`, `orderService.ts`) unrelated to this audit; left alone per focused-change rule.
- **ESLint** on all touched source files: 0 errors.
- **Production build** (`npm run build`, incl. prerender of `/`, collections, products, journal, campaigns, policies): completed successfully.
- **Repository re-search** (`src`): zero remaining matches for `twenty-one|21 days|forty-three hours|43 hours|fourteen days|14 days|forty days|Sixty hours|woven slowly`. Remaining `handwoven|handloom|handmade` hits reviewed one by one — all in retained categories (§4): glossary/schema definitions, the new guardrail text itself, scoped educational/portrait/biographical passages, the Terms taxonomy, one non-saree POC alt, one non-saree studio default string.
- **SEO/content audit**: all product/collection/house-letter SEO titles+descriptions, index.html meta/OG, alt texts, campaign hashtags, CMS placeholder, and JSON-LD-adjacent product strings checked; method claims removed or scoped; no replacement keyword (e.g. "heritage", "temple") used as a stealth method claim.
- **Tests**: no test files assert on the changed copy (mocks updated consistently); no new tests required for a copy audit. Playwright suite not run (browser-dependent, unrelated to copy).

---

## 9. Remaining Actions (genuinely requiring human/product-owner confirmation)

1. Confirm actual production method per SKU/collection and decide whether to add a verified `production_method` field to the product schema — the only durable basis for any future method claim.
2. Verify the Molakalmuru/Neygi/Gangamma provenance narrative against real visits and records (names, villages, generational counts, looms).
3. Verify material specs (silk momme, zari composition, weights) against suppliers.
4. Decide the fate of the internal brand-bible handwoven identity (§5.5): redefine the house, or confirm handwoven-only catalogue (and then fix the Terms "machine-assisted" line instead).
5. If any weaving duration is real and strategically wanted, verify per-product and reintroduce only at that product level.

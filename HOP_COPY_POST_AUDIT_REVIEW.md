# HOP — Post-Audit Integrity Review

**Date:** 2026-09-27
**Authority:** `HOP_COPY_CLAIM_AUDIT.md` (2026-09-27) — treated as the authoritative record. This document verifies, it does not redo.
**Constraint honored:** No website, database, product-record, brand-bible, migration, commit, push, or deploy changes were made. Read-only review + this report only. All audit corrections were left frozen.

---

## Executive Summary

The audit's corrections are **intact and structurally effective**: a re-search of `src` returns zero exact-duration claims and zero universal handwoven claims, and every corrected string spot-checked is present. The live content system is now production-method-neutral at all universal touchpoints.

However, the review finds the system is **safe by discipline, not yet safe by structure**. Four structural gaps remain, all requiring founder decisions rather than more copy editing:

1. **No data field exists** for production method anywhere (DB, content schema, studio forms, TypeScript types). Method language is currently governed only by prompt text, which a future writer can ignore.
2. **Provenance is half-evidenced**: cluster-level Molakalmuru/Neygi facts are partially supported by research docs citing 2024–2025 field work (no raw records attached); every person-level claim (Gangamma's biography, all portrait biographies, product→weaver linkages) is **UNVERIFIED**.
3. **Material specs are self-asserted**: all fibre/zari/weight claims trace back to editorial frontmatter and free-text DB columns, with no supplier, lab, or structured verification behind them.
4. **The brand bible directly contradicts the live site** (universal handwoven house vs. method-neutral storefront), and generative-risk examples survive in research docs, editorial page-strategy docs, and one Supabase seed migration — all outside the guardrailed prompts system and all reachable by future AI sessions.

---

## Audit Status

| Dimension | Status | Basis |
|-----------|--------|-------|
| Claim safety | **PASS** — no unsupported universal production claims in live copy | Re-search: zero hits for `woven slowly`, `twenty-one`, `21 days`, `forty-three hours`, `43 hours`, `fourteen days`, `14 days`, `forty days`, `Sixty hours`, `speed of the loom`, `handwoven on a pit loom`, `dedicated to handwoven`, `heirloom handlooms`, `pure handloom`, `Notes from the loom`, `Meet the hands`, `Hand-twisted`, `from this loom` across `src`; sole remaining similar hit is the explicitly retained linen-journal educational passage |
| Production-method neutrality | **PASS at universal level; CONDITIONAL below** | Homepage, hero, house letters, campaigns, product SEO/bodies, collection narratives, lifecycle email, metadata: neutral. Residual method language is scoped (technique notes, portraits, glossary, Terms) — except DB-seeded collection stories (see below) |
| Product-level specificity | **PASS in copy; ABSENT in data** | Copy no longer claims per-product methods it cannot prove, but nothing in the data model *could* prove one either (§ Production Method) |
| Future AI protection | **PASS inside prompts system; GAP outside it** | 12+ prompt files carry the rule with brand/collection/product separation; research docs, editorial page-strategy docs, and migration seeds still model the old claims (§ Guardrail Review) |

### Residual live-copy items noted (frozen, reported only)

- **Supabase seed** `20260711000000_extend_collections.sql:111-112` writes `editorial_story` text containing "what happens when the **weaver** shifts the thread count" (padma) and "It is **confidence, woven**" (spandana). These columns render live on `Collections.tsx:106-108`, `CollectionStage.tsx:72`, and `Category.tsx:66,91`. Mild, but they are the only live-rendered strings the audit did not touch, and the spandana line duplicates a tagline the audit deliberately neutralized in `collectionWorlds.ts`. Founder to decide: reword in a future data patch or accept as color.
- `Category.tsx:66,92` fallback strings "Every saree currently in the house" / "Every saree in the house" are inventory-count UI, not production claims — no action.

---

## Production Method Data Review

**Current schema situation.** There is no production-method field anywhere in the product data path:

| Layer | Location | Method representation? |
|-------|----------|------------------------|
| Database | `products` table (`20260706000001`, `20260709000000`, `20260710000001`; documented in `docs/database/products.md`) | **No.** Columns: `fabric text`, `weave text` (both free text), `colour`, `occasion`, `length`, `weight`, `care_instructions`, `country_of_origin`, `estimated_dispatch_days`. No enum, no method column, no verification flag |
| Content schema | `src/content/_schemas/product.yaml` → `system2.weave` / `system2.fabric` | **No.** Free-text strings ("Temple border with fine zari detailing", "Linen weave", "Contemporary Silk", "Hand-embroidered pure organza") — design descriptors mixed with one finishing-method term |
| Studio CMS | `src/studio/types/product.ts`, `useProductForm.ts`, `studio/services/productService.ts` | **No.** `fabric: string`, `weave: string` free-text inputs |
| Storefront types | `src/services/productService.ts` (`StorefrontProduct`), `src/types/supabase.ts`, `src/integrations/supabase/types.ts` | **No.** `fabric/weave: string \| null` passthrough |
| Test mocks | `src/__tests__/mocks/supabase.ts` | **No.** Same free-text shape |

**Where product data currently lives.** Three parallel sources with no single owner of truth for method: (1) Supabase `products`/`collections` rows (live storefront reads these); (2) Markdown frontmatter in `src/content/products/*` (editorial layer, compiled to gitignored `__generated__`); (3) free-text `fabric`/`weave` columns duplicated across all three. No migration seeds rows for the four editorial product UUIDs, so live-DB values for the actual catalogue could not be inspected from the repo.

**Whether production method can be reliably represented today.** No. Free-text `weave` currently conflates design ("Temple border", "Contemporary Silk"), fibre ("Linen weave"), and process ("Hand-embroidered"). Any method claim rendered from these fields is unqueryable, unvalidatable, and unenforceable.

**Recommended enum/value structure (recommendation only — NOT implemented).** A nullable structured column, e.g. `production_method`, with a closed value set covering the audit's own categories: `handloom_handwoven | powerloom | machine_made | jacquard | printed | embroidered_hand | embroidered_machine | blended | unknown` (default `unknown`), plus a companion `production_method_verified boolean default false` (or `verified_source text`) so copy may only assert method where `verified = true`. Keep `weave` as the design descriptor; never parse method out of it. The same closed set should appear as the Studio dropdown, the content-schema enum, and the generated TypeScript union.

**Migration implications.** New nullable column + check constraint (or Postgres enum) on `products`; backfill `unknown`; RLS unchanged (read alongside existing columns); regenerate `src/types/supabase.ts` / `integrations/supabase/types.ts`; extend studio form + content schema + compiler validation; decide whether `embellishment` (hand-embroidery on Sakura) is a method or a separate `finishing` attribute. Estimated small, but it is a cross-layer change (DB → types → studio → schema → compiler → storefront conditional rendering).

**Founder/product-team verification required.** Yes — engineering must not invent the values. Some human must attest, per SKU, what the true method is before any row carries anything other than `unknown`.

---

## Provenance Review

Scope: every remaining Molakalmuru / Gangamma / Neygi / linked-person provenance statement in live copy. Copy left unchanged per the stop condition; each item classified on in-repo evidence only (no external verification, no assumptions).

| # | Location | What the copy claims | Framing | Scope | Evidence in repo | Classification |
|---|----------|---------------------|---------|-------|------------------|----------------|
| P1 | `about-hou:47` — "The sarees begin in Molakalmuru, a small town in Chitradurga district… road unpaved for last 3 km… looms running since five" | Origin town, district, road, loom schedule | Story (narrative scene) | House origin (universal-adjacent) | `loom-geography.md:54` confirms Molakalmuru/Chitradurga; road/5 AM details have no source | **UNVERIFIED** (details beyond place) |
| P2 | `about-hou:49` — Neygi community, pit-loom temple borders for generations, <200 families, youth moved to Bengaluru, weavers in 40s/50s | Community + demography + practice | Fact-asserted | Community (scoped) | `loom-geography.md:54-57` (Neygi, <200 families) + `regional-weaves.md:62` (<200 families); cites 2024–2025 field surveys, no raw records attached | **PARTIALLY SUPPORTED** (community facts); **UNVERIFIED** (ages, migration specifics) |
| P3 | `about-hou:51`, `gangamma:37,43`, `field-notes:38` — Gangamma: 31 yrs at loom since age 12; mother 10; grandmother 8; border unchanged 4 generations | Named personal biography | Fact-asserted (quotes + specifics) | Person | No interview transcript, visit log, or supplier record naming Gangamma anywhere in repo | **UNVERIFIED** |
| P4 | `products/a1b2:12,24,31,64-65` — Origin Molakalmuru; "weaver's home"; "Weaver: Gangamma, fourth generation" | Product→person linkage | Fact (spec table + SEO) | Single SKU | No lot/batch/supplier linkage in DB or content; portrait link is editorial cross-reference only | **UNVERIFIED** |
| P5 | `kalyani:11,40` — weaverNote quote; "border … Gangamma learned from her grandmother … three generations"; Origin Molakalmuru | Collection→person linkage | Story + spec | Collection | Same gap as P4; note "three generations" vs portrait's "four" — internal inconsistency, both unsourced | **UNVERIFIED** (+ inconsistent) |
| P6 | `field-notes` full — road, 300 looms down from 1,000, "loom over a hundred years old", warp-prep routine, dusk scene | Visit reportage | Story (first-person travelogue) | Place visit | Cluster facts partially backed (P2 sources); counts, loom age, routines unsourced | **UNVERIFIED** as reportage; cluster backdrop partially supported |
| P7 | `saraswati-phulia` full + `11111111` linkage — third-generation Phulia linen weaver; Megham "result of Saraswati's deliberate pacing" | Person + product linkage | Story + product attribution | Person + SKU | No Phulia field record; `trust-signals.md:42` mentions "Saraswati… 30 years in Kanchipuram" — contradicts Phulia/West Bengal, suggesting placeholder drift | **UNVERIFIED** (+ cross-doc inconsistency) |
| P8 | `rafeeq-lucknow` full + `77777777` linkage — fourth-generation Lucknow embroiderer; Sakura "unpinned from Rafeeq's frame" | Person + product linkage | Story + product attribution | Person + SKU | No Lucknow record; technique detail plausible but unattributed | **UNVERIFIED** |
| P9 | `lakshmidevamma-ilkal` full — 43 years at same pit loom; Tope Teni specialty; calluses/spine detail | Person biography | Story | Person | Ilkal/Tope Teni tradition backed by `regional-weaves.md`, `weaving-techniques.md:72`; the personal tenure/body details unsourced | **UNVERIFIED** (person); tradition **SUPPORTED** |
| P10 | `HomepageExperience:311,319,324-325` — Gangamma photo caption, quote, "Fourth generation" fact line | Portrait caption | Editorial framing | Person | Same gap as P3 | **UNVERIFIED** (inherits P3) |
| P11 | `morning-light:39`, `understanding-zari:27`, `handloom-linen` product link, `ColorLab:159,162`, `collectionWorlds:34` — Molakalmuru/Kanchipuram/Phulia mentions | Regional association | Editorial context | Scoped | Regions-as-textile-places backed by `loom-geography.md` / `regional-weaves.md` | **SUPPORTED** as regional association; no product-lot claim made |

**What must NOT be assumed:** that field-work citations in research docs ("conducted 2024–2025") constitute evidence for any named individual, number, or product linkage — they support cluster-level background only. That a portrait or quote existing in the repo proves the person, visit, or quote is real. That "four generations" / "three generations" / "thirty-one years" / "forty-three years" / "300 looms" / "hundred-year-old loom" figures are interchangeable or mutually corroborating — several are mutually inconsistent (P5, P7).

---

## Material Specification Review

Method: every fibre/fabric/zari/weight claim in the four product stories + linked craft notes, checked against the only in-repo backing available (editorial frontmatter itself, free-text DB columns, research docs). Visual appearance was not treated as evidence.

| Claim | Location(s) | Backing found | Classification |
|-------|-------------|---------------|----------------|
| Pure Mulberry silk, 12-momme (Kalyani product) | `products/a1b2:11,44,60`; `ColorLab:162` | Self-asserted frontmatter only; `products.fabric/weave` free text can hold but not verify it; no supplier/lab/DB-seed row for this UUID | **UNVERIFIED** |
| Fine metal-thread zari w/ gold wash (was "hand-spun real silver") | `products/a1b2:10,44,61`; `kalyani:64`; `understanding-zari` | Self-asserted; zari composition education in `zari-history.md` is generic history, not lot verification | **UNVERIFIED** (composition); **AMBIGUOUS** (whether "real silver" was ever literally true — audit softening correctly removed the literal claim) |
| Pure Linen; 450g; breathability/softening behavior | `products/11111111:10-11,39-41,54-58` | Self-asserted; flax-behavior science in `handloom-linen:29-35` is educational prose, not test data | **UNVERIFIED** (composition/weight); behavior claims **AMBIGUOUS** (plausible category traits, unmeasured for this SKU) |
| Pure Silk; 650g; minimalist gold motifs; wrinkle resistance | `products/66666666:10-11,39-41,54-59` | Self-asserted only | **UNVERIFIED** |
| Pure Organza; 350g; silk-thread hand embroidery | `products/77777777:6,10-11,25,39-41,54` + Rafeeq portrait | Self-asserted + portrait cross-link (story, not verification); `weave: Hand-embroidered` mixes finishing-method into design field | **UNVERIFIED** (composition/weight); embroidery presence **AMBIGUOUS** (observable in imagery per alt text, but no structured attestation) |
| Zari identification tests (flex/weight/edge/age) | `understanding-zari:71-74` | Presented as generic education; no metallurgical source attached in-repo | **AMBIGUOUS** (educational, plausibly standard, unsourced) |
| "Cottons that feel like a second skin", "linens that breathe" (arya seed); silk/cotton-silk mentions in research examples | DB seed `extend_collections:110`; research docs | Marketing/research prose, no product linkage | **AMBIGUOUS** — and the arya seed line is live-rendered copy asserting fibres for a collection with no fibre data |
| Staging seed "Silk / Zari / Crimson" | `seed_staging_product.sql` | Explicitly synthetic staging fixture | Out of scope (test data, correctly labeled) |

**Do not alter product specifications without evidence** — honored: nothing above was changed. Note the structural point: because `fabric`/`weave` are free text with no verification flag, even true specs are indistinguishable from invented ones to any future reader, writer, or AI.

---

## Brand-Bible Conflict Review

### Current brand position (internal docs, unchanged by audit)

The internal documentation defines HOP universally as handwoven/handloom:

- `02-brand-architecture/brand-bible.md:5` — "dedicated to **handwoven Indian sarees**"; `:15` — "**Twenty-one days on the loom**. No shortcuts. **No power-loom imitations**"; `:34` — "preserve and evolve the **handwoven saree**"; `:38` — "fashion house for **Indian handloom**"; `:44` — "We move at the **speed of the loom**"; `:117,119` — "Each saree is **woven** in limited numbers… **weaver's hands**… Every saree carries the name of the woman who **wove it**."
- `messaging-pillars.md:22-29` — Craft core message "**Handwoven, not mass-produced**"; "Every saree is the work of human hands"; "**Sixty hours** per drape"; forbidden dilution: never say "handmade" — say "**handwoven on a pit loom for twenty-one days**" (i.e., the pillar *mandates* the exact claims the audit removed).
- Supporting docs echo throughout: `voice-bible.md:95`, `editorial-principles.md:16,29,35`, `09-HOP-About.md:24,29,78,83,90`, `08-HOP-Product-Pages.md:129` ("fourteen days on a traditional pit loom"), `07-HOP-Collections.md`, `06-HOP-Homepage.md`, `10-HOP-Journal.md`, `05-Editorial-Style-Guide.md:39` ("sixty hours of weaving," "twenty-one days" as preferred style), `01-Voice-Bible.md:74` ("handwoven reality"), `HOP_BRAND_CONTEXT.md` (handcrafted-sarees objective).

### Live website position (after audit)

Method-neutral house of considered Indian sarees: no universal handwoven/handloom claim in homepage, hero, brand story, collections, products, campaigns, SEO, or lifecycle copy. Method language survives only scoped (technique education, named portraits, glossary, Terms taxonomy). The Terms taxonomy ("handwoven sarees, designer sarees, and machine-assisted sarees") affirmatively describes a mixed catalogue.

### Conflict

**Yes — direct and load-bearing.** The brand bible (plus messaging pillars and page-strategy docs) prescribes as mandatory identity the exact positioning the audit removed from the website as unverified, while the live Terms page asserts a mixed catalogue the bible forbids ("No power-loom imitations"). Both cannot be true. Every future brand-vs-website disagreement will resolve toward whichever document the writer loads — and the bible is referenced as authoritative by the prompt system (`brand-context.md` cross-references it; `session-bootstrap.md` loads voice-bible + vocabulary derived from it).

### Decision required

The founder must decide which of these is true (details in § Founder Decisions Required): **(A)** HOP is a handwoven-only house — then the website neutralization was wrong in direction and the Terms "machine-assisted" line, Viara/organza products, and mixed-catalogue evidence must be reconciled instead; or **(B)** HOP celebrates Indian textile tradition and craftsmanship without defining every product as handwoven — then the bible, pillars, and page-strategy docs must be revised to the neutral position. The likely sustainable distinction is (B): *heritage/craft as cultural and design truth, production method as verified per-product fact* — but that redefinition belongs to the founder, not to this review.

---

## Future AI Guardrail Review

**Coverage inside the prompts system: PASS.** Verified present and correctly worded: `master-system-prompt.md:80` (permanent section) + `:203` (specificity check); `brand-context.md:43`; `session-bootstrap.md:14`; `src/content/README.md:120`; `review/fact-checking.md:92,124`; `review/hallucination-prevention.md:94`; `writing/seo-copy.md:99`; `writing/product-pages.md:112`; `writing/collections.md:100`; `writing/craft-notes.md:17`; `writing/homepage.md:45,96`; `writing/journal.md:138-139`; `editing/rewrite.md:37,41,47`; `editing/expand.md:40-41,46-50`; `editing/luxury-tone.md:72,86`.

**Brand/collection/product separation: PRESENT.** The three levels are distinguished with distinct quantifiers: universal ("never imply that all HOP sarees share one production method" — master, fact-checking, collections); collection ("only when verified for that collection" — collections); product ("that exact product" — product-pages, rewrite, expand, luxury-tone, fact-checking durations, hallucination-prevention). A future AI must actively contradict at least two scoped rules to reintroduce a universal claim.

**Gaps (outside the guardrailed system) — the smallest structural improvements, recommended only:**

1. **Research-docs examples still model the old claims** and are loadable as session context (`session-bootstrap.md` invites "any research documents"): `research/brand-strategy/positioning.md:76` (handwoven + 21 days as good writing), `research/psychology/system-1-system-2.md:63` and `loss-aversion.md:56` (pit-loom/hand-spun spec blocks as exemplars), `research/psychology/choice-architecture.md:47`, `costly-signaling.md:47`, `research/brand-strategy/brand-territories.md:61`, `research/competitors/raw-mango.md:54`, `research/prompts/examples/*-example-v1.md` (full handwoven/21-day worked examples), `research/seo/structured-data.md:65-67` (handwoven schema example). Smallest fix: a dated deprecation header on the examples directory + corrected System-2 exemplars, not a rewrite of the research.
2. **Editorial page-strategy docs contradict the guardrails** (`06-Homepage`, `07-Collections`, `08-Product-Pages`, `09-About`, `10-Journal`, style guide, voice bible, editorial principles, content architecture, implementation plan). Smallest fix: point their claim-related sections at the new guardrail rather than editing each.
3. **DB seed copy bypasses all prompt guardrails** (padma/spandana `editorial_story`). Smallest fix: treat migration seeds as copy subject to the same rule at authoring time; flag the two lines for the founder's data patch.
4. **No machine-readable enforcement.** All rules are prose. The single structural upgrade that makes the system safe-by-default is the `production_method` enum + `verified` flag (§ Production Method), letting the compiler/studio/storefront *reject* unverified method claims rather than asking writers not to write them.

**What must NOT be assumed:** that guardrail prose equals enforcement; that future sessions will load the guardrailed prompts instead of the bible/research examples; that "framed as education" scoping will survive summarization by an AI that only read the research docs.

---

## Founder Decisions Required

### D1. What is HOP's catalogue truth: handwoven-only or mixed methods?
- **What needs deciding:** Whether every HOP saree is handwoven/handloom (option A) or the catalogue spans methods (option B).
- **Why it matters:** The website is now neutral and the Terms assert mixed; the bible asserts handwoven-only. One of them is wrong, and all future copy, SEO, schema, and the `production_method` design depend on the answer.
- **Missing information:** Actual manufacturing reality per SKU/collection (supplier records, loom records, or founder attestation).
- **Do NOT assume:** That the old copy was true because it was specific; that the Terms line was boilerplate; that a mixed catalogue dilutes the brand (the audit shows luxury can be carried by design/culture language).

### D2. Should a structured `production_method` field be introduced?
- **What needs deciding:** Approve (or reject) the nullable enum + verified-flag design in § Production Method, and who attests values per SKU.
- **Why it matters:** Without it, method claims remain governed by prose discipline alone; with it, the compiler and storefront can enforce scoping mechanically.
- **Missing information:** D1's answer; the closed value set (handloom/powerloom/jacquard/printed/embroidered/blended/unknown); who the verifying authority is.
- **Do NOT assume:** That free-text `weave` can serve this purpose; that backfilling anything but `unknown` is safe; that engineering should populate values without product-team attestation.

### D3. Is the Molakalmuru/Gangamma provenance record real, and at what granularity?
- **What needs deciding:** Which provenance statements the house will stand behind: cluster background only, or named biographies and product→weaver linkages too — and at what evidence bar (visit logs, interview records, supplier linkage).
- **Why it matters:** P3–P5, P7–P8 are currently UNVERIFIED personal/product claims presented as fact; P5 and P7 contain internal inconsistencies. These carry the highest reputational risk in the system.
- **Missing information:** Visit/interview records; supplier/lot linkage; resolution of three-vs-four generations and Kanchipuram-vs-Phulia inconsistencies.
- **Do NOT assume:** That research-doc field-work citations verify any named person; that removing exact durations (done) was the same as verifying the remaining biography (it was not).

### D4. Are the material specifications verified?
- **What needs deciding:** Whether fibre/zari/weight figures (12-momme, real-silver gold-wash, 450/650/350g, flax-behavior and zari-test prose) are supplier-confirmed or must be re-specified/softened.
- **Why it matters:** They are currently self-asserted frontmatter rendered as spec tables and SEO — precise numbers read as tested facts.
- **Missing information:** Supplier spec sheets or lab confirmation per SKU.
- **Do NOT assume:** That softening "hand-spun/real-silver" wording verified the remaining numbers; that "Pure" prefixes are compositional facts.

### D5. What happens to the brand bible and its dependent docs?
- **What needs deciding:** Under D1-option B, revise the bible, messaging pillars (especially the Craft pillar's mandatory 21-day/handwoven formulations), and page-strategy docs to the neutral position; under option A, reverse course on the website + Terms instead. Either way, deprecate or correct the research/prompt example docs that still model the old claims.
- **Why it matters:** As long as the bible mandates what the guardrails forbid, every future session loads a contradiction, and the contradiction will eventually leak back into copy.
- **Missing information:** D1's answer; owner and timeline for the docs revision.
- **Do NOT assume:** That leaving strategy docs "as history" is harmless while the prompt system references them as authority; that example docs are "just examples" to an AI.

---

## Recommended Next Step

**Founder answers D1 (catalogue truth) first** — one decision, in writing, before any engineering or content action. Everything else (D2's field design, D3/D4 verification scope, D5's docs revision direction, and the two-line DB seed question) branches on it, and any implementation started beforehand risks building toward the wrong position.

---

*End of review. No files were modified except the creation of this report. Audit corrections remain frozen as recorded in `HOP_COPY_CLAIM_AUDIT.md`.*

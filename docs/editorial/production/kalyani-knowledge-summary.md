# Knowledge Summary: Kalyani Collection Detail Page

## Source Documents Consulted
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Collection Detail pages
- `docs/editorial/07-emotional-architecture/page-emotion-map.md` — Emotional map for /collections/:slug (Focus, Confidence)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` — Stage 3: Wonder and craft specifics
- `docs/editorial/04-vocabulary-system/approved-words.md` — Vocabulary boundaries and brand colours
- `src/content/weaver-portraits/gangamma-molakalmuru/index.md` — Weaver facts
- `docs/research/craft/loom-geography.md` — Molakalmuru geographic facts
- `docs/research/culture/saree-rituals.md` — Wedding saree rituals and generational transfer
- `docs/research/design-language/coastal-blossom-philosophy.md` — 60-25-10-5 ratio

## Key Facts

| Domain | Fact | Source | Confidence |
|--------|------|--------|------------|
| Weaver | Gangamma, 43 years old, weaving since age 12 (31 years). Taught by grandmother. 4th generation. | `gangamma-molakalmuru/index.md` | Verified |
| Craft | Temple border weaving (gopuram motif). Interlocking korvai technique on pit loom. | `gangamma-molakalmuru/index.md` | Verified |
| Material | Pure 12-momme Mulberry Silk with hand-spun zari (real silver with gold wash). | `kalyani/index.md`, `gangamma-molakalmuru` | Verified |
| Process | Takes 21 days per drape. Thread tension adjusted twice an hour due to weather. | `gangamma-molakalmuru/index.md` | Verified |
| Location | Molakalmuru, Chitradurga district, Central Karnataka. Neygi weaver community in decline (~800 active looms left). | `loom-geography.md` | Verified |
| Palette | Warm gold, deep teal, soft blush (Jasmine, Coastal Teal, Sakura Blush, Golden Sand). | `approved-words.md`, `kalyani/index.md` | Verified |
| Ritual | Saree lifecycle spans generations. Stored in muslin with neem. Folded along the weave. | `saree-rituals.md` | Verified |
| Voice | Formality 3, Warmth 4, Sensory 4, Tech 2, Urgency 0. | `voice-bible.md` | Verified |
| Emotion | Primary: Focus, Secondary: Confidence. Curiosity → Confidence. | `page-emotion-map.md` | Verified |

## Knowledge Gaps
| Gap | Impact | Action |
|-----|--------|--------|
| Original tagline contains forbidden word "Luxury" ("Heritage Luxury"). | High | Tagline rewritten to "Wedding Silk · Heritage Weave" during landing page phase. |
| Original SEO description contains forbidden word "Luxury". | High | Must rewrite SEO description to match updated tagline. |

## Verification Notes
- The collection detail component (`Category.tsx`) handles product cards natively. The editorial content in `index.md` provides the narrative framing (hero, intro, body, closure) above the product grid.
- Craft claims (21 days, hand-spun zari) are verifiable against weaver portrait facts.
- Gangamma's quotes provide the 10% "Golden Sand" human warmth element.

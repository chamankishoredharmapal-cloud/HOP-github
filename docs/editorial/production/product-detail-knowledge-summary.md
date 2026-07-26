# Knowledge Summary: Product Detail (First 3-5)

## Source Documents Consulted
- `src/__tests__/mocks/supabase.ts` — Mock database containing product data (Padmini, Megham, Viara Silk).
- `src/content/_schemas/product.yaml` — Schema definition for product frontmatter and body structure.
- `docs/editorial/production/PHASE_7_CONTENT_PRODUCTION_MANUAL.md` — Section 4.5 Product Detail specification.
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix for Product Detail pages (Formality 3, Warmth 4, Sensory 5, Tech 2, Urgency 0).
- `docs/editorial/07-emotional-architecture/emotional-journey.md` — Product Detail creates desire through specificity (Revelation Arc).
- `docs/editorial/04-vocabulary-system/forbidden-words.md` — Forbidden words list.

## Product Roster

### 1. Padmini · Coastal Pattu
- **ID:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890` (Existing UUID mapping)
- **Collection:** Kalyani
- **Fabric:** Pure Mulberry Silk, 12-momme
- **Colour:** Deep Teal (reads as teal in shadow, jade in sunlight)
- **Weave:** Handloom Pattu, Temple border, pit loom, hand-spun zari
- **Origin:** Molakalmuru, Karnataka
- **Status:** Existing content unit found in repository. Already aligns closely with schema.

### 2. Megham · Twilight Linen
- **ID:** `11111111-2222-3333-4444-555555555555`
- **Collection:** Kalyani (Wait, mock says Kalyani, but linen fits Arya better. I will assign to Arya per brand-bible.md which states Arya is "linens that breathe").
- **Fabric:** Pure Linen
- **Colour:** Grey (Twilight Grey)
- **Weave:** Handwoven Linen
- **Occasion:** Casual / Daywear
- **Specs:** 5.5m, 450g, no blouse piece, gentle hand wash.

### 3. Viara · Reception Silk
- **ID:** `66666666-7777-8888-9999-000000000000`
- **Collection:** Viara
- **Fabric:** Pure Silk
- **Colour:** Blush Pink
- **Weave:** Contemporary Silk
- **Occasion:** Reception
- **Specs:** 5.5m, 650g, includes blouse piece, dry clean only.

## Knowledge Gaps
| Gap | Impact | Action |
|-----|--------|--------|
| Missing weaver names for Megham and Viara Silk | Medium | Do not fabricate weaver names. Rely on fabric, weight, drape, and occasion to build the sensory story. |
| Missing hero images for Megham and Viara Silk | Low | Use placeholder paths or copy the existing `hero.jpg` for compilation purposes. |
| Mock data incorrectly assigns Megham to Kalyani collection (which is silk wedding) | Low | In editorial frontmatter, assign Megham to `arya` and Viara Silk to `viara`. |

## Verification Notes
- The compiler enforces UUID format for product directories (`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`).
- The existing Padmini product serves as a template.
- Content structure: hero, intro, body (2-3 blocks), pull-quote, system-2, closure.

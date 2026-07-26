# Knowledge Summary: Collection Landing Page

## Source Documents Consulted
- `docs/editorial/02-brand-architecture/brand-bible.md` — Collection naming philosophy, five-collection universe, brand territories
- `docs/editorial/02-brand-architecture/voice-bible.md` — Tone parameters for collection pages (Formality 3, Warmth 3, Sensory 4, Technical 2, Urgency 0)
- `docs/editorial/02-brand-architecture/messaging-pillars.md` — Heritage (primary), Craft (secondary) for collection pages
- `docs/editorial/07-emotional-architecture/emotional-journey.md` — Curiosity stage triggers
- `docs/editorial/07-emotional-architecture/page-emotion-map.md` — Collections: Primary Wonder, Secondary Desire, Curiosity → Wonder
- `docs/research/customers/persona-primary.md` — Primary persona browsing behaviour
- `docs/research/customers/decision-journey.md` — Non-linear decision journey, multi-session evaluation
- `docs/research/brand-strategy/positioning.md` — White space positioning between mass-market and designer brands
- `src/components/hop/HopHeader.tsx` — Canonical collection list (Kalyani, Viara, Arya, Padma, Spandana)
- `src/data/collectionVideos.ts` — Collection video mapping
- `src/content/collections/kalyani/index.md` — Existing Kalyani collection narrative (reference for voice and format)
- `src/__tests__/mocks/supabase.ts` — Mock collection data (taglines, editorial_story fields)

## Key Facts
| Domain | Fact | Source | Confidence |
|--------|------|--------|------------|
| Architecture | The Collections page (/collections) pulls data from Supabase. Editorial fields consumed: `name`, `tagline`, `editorial_story`, `description`, `hero_image_url` | `src/services/collectionService.ts`, `src/pages/Collections.tsx` | Verified |
| Architecture | The page is NOT a single markdown content unit. It is a React page that renders Supabase data. Editorial deliverables = landing page intro copy + per-collection editorial descriptions | `PHASE_7_CONTENT_PRODUCTION_MANUAL.md` §4.3, `src/pages/Collections.tsx` | Verified |
| Architecture | The page currently has hardcoded intro copy: "Five collections, one quiet house." and "Every Padmavati saree belongs to one of five families — each woven with a different rhythm, but the same Coastal Blossom calibration." | `src/pages/Collections.tsx` lines 27-33 | Verified |
| Collections | 5 collections exist: Kalyani, Viara, Arya, Padma, Spandana | `src/components/hop/HopHeader.tsx` lines 9-15, `src/data/collectionVideos.ts` | Verified |
| Collections | Collections are named after women, not categories. Names spark curiosity without immediate explanation | `brand-bible.md` | Verified |
| Kalyani | Wedding Elegance · Heritage Luxury. Named for the feeling of a winter wedding. Temple border weaving by Gangamma in Molakalmuru. Pure Mulberry silk with hand-spun zari. 21 days on pit loom | `src/content/collections/kalyani/index.md` | Verified |
| Viara | Reception/flagship collection. Grand evenings, quiet attention. Winter receptions, gallery openings, milestone birthdays | `brand-bible.md`, `src/__tests__/mocks/supabase.ts` | Verified |
| Arya | Modern working woman. Light drapes, linens, cottons. Boardroom to dinner. Rhythm, not category | `brand-bible.md` | Verified |
| Padma | Geometry, structure, craft. Weave laboratory. Architectural, composed, deliberate | `brand-bible.md` | Verified |
| Spandana | Contemporary. Unconventional drapes, experimental textures. Where saree steps out of tradition into the contemporary frame | `brand-bible.md` | Verified |
| Emotion | Collections page: Primary = Wonder, Secondary = Desire. Journey stage: Curiosity → Wonder | `page-emotion-map.md` | Verified |
| Persona | Primary reader spends 30–60 minutes reading collection narratives across multiple sessions before purchasing. Non-linear journey. Rejects urgency, discounts, and vague luxury language | `persona-primary.md`, `decision-journey.md` | Verified |

## Knowledge Gaps
| Gap | Impact | Action |
|-----|--------|--------|
| Viara, Arya, Padma, Spandana lack detailed weaver/technique attribution | Medium — specific weaver names and craft details for these collections are not yet documented | Use collection character/mood descriptions from brand-bible.md; do not fabricate weaver names or craft claims |
| No existing editorial content units for Viara, Arya, Padma, Spandana | Expected — these will be produced in later production cycles (Collection Detail pages) | Write collection card descriptions that are self-contained; avoid referencing details not yet written |
| Slug mismatch: Arya uses slug "megham", Padma uses slug "oosi-kattam", Spandana uses slug "designer-wear" | Low — slugs are database-level; editorial copy uses display names only | Use display names in editorial copy |

## Verification Notes
- Confirmed all 5 collection names appear consistently across header, footer, video mapping, and brand documentation
- Confirmed the Collections.tsx component consumes `editorial_story` field from Supabase — this is the primary field for collection card descriptions
- Confirmed existing Kalyani content unit sets the voice and structural template for collection narratives
- Confirmed the page emotion map entry: Wonder / Desire, Curiosity → Wonder transition

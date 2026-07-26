# Approval Sheet: Collection Landing Page

## Production Unit
- **Page:** Collection Landing (/collections)
- **Production Order:** #2 of 20 (Phase 1, 2/4)
- **Content Type:** Landing page copy (structured, not markdown content unit)

## Deliverables Produced
| # | Artifact | Path | Status |
|---|----------|------|--------|
| 1 | Knowledge Summary | `docs/editorial/production/collection-landing-knowledge-summary.md` | ✅ Complete |
| 2 | Editorial Brief | `docs/editorial/production/collection-landing-editorial-brief.md` | ✅ Complete |
| 3 | Narrative Plan | `docs/editorial/production/collection-landing-narrative-plan.md` | ✅ Complete |
| 4 | Editorial Copy | `docs/editorial/production/collection-landing-copy.md` | ✅ Complete |
| 5 | Revision Report (12-pass) | `docs/editorial/production/collection-landing-revision-report.md` | ✅ Complete |
| 6 | Quality Score Card | `docs/editorial/production/collection-landing-quality-score-card.md` | ✅ Complete |
| 7 | Approval Sheet | `docs/editorial/production/collection-landing-approval-sheet.md` | ✅ Complete |

## Code Changes
| File | Change |
|------|--------|
| `src/pages/Collections.tsx` | Updated intro paragraph with Phase 7 editorial copy |

## Quality Gate Status
| Gate | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Knowledge Complete | ✅ Passed | 12 verified facts across 5 domains |
| 2 | Spec Approved | ✅ Passed | Editorial brief produced and validated |
| 3 | Brief Approved | ✅ Passed | Narrative plan produced and validated |
| 4 | Draft Complete | ✅ Passed | 12-pass AI review completed; all passes clean |
| 5 | Human Review | ⏳ Pending | Awaiting Editorial Lead review |
| 6 | SME Verified | ✅ N/A | Not required for landing page |
| 7 | Quality Threshold | ✅ Passed | OQI = 0.91 (threshold: 0.85) |
| 8 | Final Approval | ⏳ Pending | Awaiting Editorial Lead sign-off |

## OQI Summary
- **Overall Quality Index:** 0.91
- **Vocabulary Compliance:** 1.00 (zero forbidden words)
- **Luxury Restraint:** 1.00 (zero self-praise, zero superlatives)
- **Cultural Authenticity:** 0.92
- **Truth & Accuracy:** 0.95

## Editorial Notes for Reviewer
1. **Taglines were rewritten** from original seed data to remove forbidden words:
   - Kalyani: "Wedding Elegance · Heritage Luxury" → "Wedding Silk · Heritage Weave"
   - Viara: "Luxury Reception · The Flagship" → "Reception Silk · Quiet Presence"
   - Spandana: "Contemporary Luxury · Fashion Forward" → "Contemporary Weave · Self-Expression"
   - Arya: "Modern Working Woman · Social" → "Working Silk · Daily Rhythm"
   - Padma: "Geometry · Structure · Craft" → "Geometric Weave · Structure" (minor refinement)
2. **Collection descriptions** draw from Supabase seed editorial stories (verified against brand-bible.md) and are adjusted for landing-page brevity
3. **The intro paragraph** in `Collections.tsx` was updated to replace internal vocabulary ("Coastal Blossom calibration") with reader-facing language
4. **Per-collection editorial_story and tagline fields** are documented in `collection-landing-copy.md` and must be applied to the Supabase `collections` table by the database administrator

## Approval Signatures

### Gate 5 — Editorial Review
- **Reviewer:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to drafting
- **Notes:** 

### Gate 8 — Final Approval
- **Editorial Lead:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to review
- **Notes:** 

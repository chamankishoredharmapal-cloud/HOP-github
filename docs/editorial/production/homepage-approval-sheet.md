# Approval Sheet: Homepage

## Production Unit
- **Page:** Homepage (`/`)
- **Production Order:** #7 of 20 (Phase 2, 7/8)
- **Content Type:** React components copy (`.tsx` files)

## Deliverables Produced
| # | Artifact | Path | Status |
|---|----------|------|--------|
| 1 | Knowledge Summary | `docs/editorial/production/homepage-knowledge-summary.md` | ✅ Complete |
| 2 | Editorial Brief | `docs/editorial/production/homepage-editorial-brief.md` | ✅ Complete |
| 3 | Narrative Plan | `docs/editorial/production/homepage-narrative-plan.md` | ✅ Complete |
| 4 | Structured Copy Doc | `docs/editorial/production/homepage-copy.md` | ✅ Complete |
| 5 | React Copy Integration| `src/pages/Index.tsx` & components | ✅ Complete |
| 6 | Revision Report (12-pass) | `docs/editorial/production/homepage-revision-report.md` | ✅ Complete |
| 7 | Quality Score Card | `docs/editorial/production/homepage-quality-score-card.md` | ✅ Complete |
| 8 | Approval Sheet | `docs/editorial/production/homepage-approval-sheet.md` | ✅ Complete |

## Code Changes
| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Removed forbidden word "luxury" from `useMetadata` and `addJsonLd` calls. |
| `src/components/hop/HeroSection.tsx` | Updated Tagline to "The Weaver is Named" and Headline to "Sarees · Time · You". |
| `src/components/hop/CraftSection.tsx` | Replaced false "CAD loom" claims with pit loom realities. Updated headline and body to match the new Craft positioning. |
| `src/components/hop/ModernHeirlooms.tsx` | Updated to frame the purchase as an inheritance ("Woven for tomorrow"). |
| `src/components/hop/JournalPreview.tsx` | Updated headline to "Field Notes & Reflections" and added body text to introduce the journal content. |

## Quality Gate Status
| Gate | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Knowledge Complete | ✅ Passed | Data aligned with brand strategy. |
| 2 | Spec Approved | ✅ Passed | Editorial brief produced. |
| 3 | Brief Approved | ✅ Passed | Narrative plan produced. |
| 4 | Draft Complete | ✅ Passed | TSX components successfully updated. |
| 5 | Human Review | ⏳ Pending | Awaiting Editorial Lead review. |
| 6 | SME Verified | ⏳ Pending | Awaiting Brand Lead review. |
| 7 | Quality Threshold | ✅ Passed | OQI = 0.98 (threshold: 0.85). |
| 8 | Final Approval | ⏳ Pending | Awaiting Editorial Lead + EIC sign-off. |

## Editorial Notes for Reviewer
1. The Homepage was not a single markdown file, but required component-level copy integration.
2. Inaccurate placeholder text (e.g., "Pointcarre CAD looms") was removed and replaced with authentic HOP craft positioning (e.g., "pit looms", "Molakalmuru").
3. The forbidden word "luxury" was removed from SEO metadata.

## Approval Signatures

### Gate 5 — Editorial Review
- **Reviewer:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to drafting
- **Notes:** 

### Gate 6 — SME Review (Brand Lead)
- **Reviewer:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to drafting
- **Notes:** 

### Gate 8 — Final Approval
- **Editorial Lead / EIC:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to review
- **Notes:** 

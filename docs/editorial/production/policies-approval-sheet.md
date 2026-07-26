# Approval Sheet: Policies

## Production Unit
- **Page:** Policies (`src/pages/*Policy.tsx`, `TermsOfService.tsx`)
- **Production Order:** #14 of 20 (Phase 4, 14/16)
- **Content Type:** React Page Components
- **Targets:** Privacy Policy, Terms of Service, Shipping Policy, Returns Policy

## Deliverables Produced
| # | Artifact | Path | Status |
|---|----------|------|--------|
| 1 | Knowledge Summary | `docs/editorial/production/policies-knowledge-summary.md` | ✅ Complete |
| 2 | Editorial Brief | `docs/editorial/production/policies-editorial-brief.md` | ✅ Complete |
| 3 | Narrative Plan | `docs/editorial/production/policies-narrative-plan.md` | ✅ Complete |
| 4 | Shipping Policy | `src/pages/ShippingPolicy.tsx` | ✅ Complete |
| 5 | Returns Policy | `src/pages/ReturnsPolicy.tsx` | ✅ Complete |
| 6 | Terms Update | `src/pages/TermsOfService.tsx` | ✅ Complete |
| 7 | Revision Report | `docs/editorial/production/policies-revision-report.md` | ✅ Complete |
| 8 | Quality Score Card | `docs/editorial/production/policies-quality-score-card.md` | ✅ Complete |
| 9 | Approval Sheet | `docs/editorial/production/policies-approval-sheet.md` | ✅ Complete |

## Code Changes
| File | Change |
|------|--------|
| `src/pages/ShippingPolicy.tsx` | Created a dedicated Shipping policy outlining packaging, transit, and customs. |
| `src/pages/ReturnsPolicy.tsx` | Created a dedicated Returns policy outlining the 14-day window and final sale exceptions. |
| `src/pages/TermsOfService.tsx` | Removed overlapping Returns content and directed users to the dedicated pages. |
| `src/App.tsx` | Added routes for the two new policy pages. |
| `src/components/hop/HopFooter.tsx` | Added footer links to Shipping and Returns. |

## Quality Gate Status
| Gate | Name | Status | Notes |
|------|------|--------|-------|
| 1 | Knowledge Complete | ✅ Passed | Coverage confirmed. |
| 2 | Spec Approved | ✅ Passed | Editorial brief produced. |
| 3 | Brief Approved | ✅ Passed | Narrative plan produced. |
| 4 | Draft Complete | ✅ Passed | Pages integrated and routed. |
| 5 | Human Review | ⏳ Pending | Awaiting Editorial Lead review. |
| 6 | SME Verified | ⏳ Pending | Awaiting Legal review of terms and conditions. |
| 7 | Quality Threshold | ✅ Passed | OQI = 0.99 (threshold: 0.70). |
| 8 | Final Approval | ⏳ Pending | Awaiting Editorial Lead sign-off. |

## Editorial Notes for Reviewer
1. The Returns policy explicitly justifies the final sale nature of custom tailoring and bridal pieces by emphasizing the highly personalized labor involved. This softens the blow of a strict policy.
2. The Terms of Service was slimmed down to act as a hub, directing specific logistical queries to the Shipping and Returns pages.

## Approval Signatures

### Gate 5 — Editorial Review
- **Reviewer:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to drafting
- **Notes:** 

### Gate 6 — SME Review (Legal/Operations)
- **Reviewer:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to drafting
- **Notes:** 

### Gate 8 — Final Approval
- **Editorial Lead:** ___________________________
- **Date:** ___________________________
- **Decision:** ☐ Approved  ☐ Approved with changes  ☐ Return to review
- **Notes:** 

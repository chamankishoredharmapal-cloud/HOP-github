# ADR-0008: Performance Budget

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
Performance is a brand value for luxury e-commerce. Slow pages feel cheap regardless of visual design. Enforceable budgets prevent performance regression as the codebase grows.

## Decision
Adopt a strict performance budget enforced in CI and monitored in production:

| Metric | Desktop | Mobile |
|--------|---------|--------|
| Lighthouse Performance | >= 95 | >= 90 |
| Lighthouse Accessibility | >= 95 | >= 95 |
| Lighthouse Best Practices | >= 95 | >= 95 |
| Lighthouse SEO | >= 95 | >= 95 |
| LCP | < 2.5s | < 3.0s |
| INP | < 100ms | < 200ms |
| CLS | < 0.1 | < 0.1 |
| Initial JS (gzipped) | < 200 KB | < 200 KB |
| Lazy chunks | < 50 KB | < 50 KB |
| Total page weight | < 1 MB | < 800 KB |

## Enforcement
- Lighthouse CI runs on every PR (blocks merge if budget exceeded)
- Bundle size checked via `vite-bundle-visualizer` in CI
- Weekly performance report generated
- Alert on production regression > 5% for any metric
- New features must include performance impact assessment in PR

## Consequences
### Positive
- Consistently fast experience for all users
- Prevents accumulation of performance debt
- Clear target for optimization efforts
- CI enforcement catches regressions before deployment

### Negative
- May block features that require heavy assets (video hero needs careful management)
- Requires performance expertise in the team
- Budget may need adjustment as feature set grows

## Compliance
- `LIGHTHOUSE_STRATEGY.md` in reference/ contains detailed optimization guidance
- All PRs include Lighthouse CI results
- Bundle size tracked over time
- Performance regression = blocking issue in code review

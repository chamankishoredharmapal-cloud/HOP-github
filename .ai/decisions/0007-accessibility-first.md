# ADR-0007: Accessibility First

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
Luxury and inclusivity are not mutually exclusive. House of Padmavati commits to WCAG 2.1 Level AA compliance as a baseline. Accessibility is not an afterthought or a testing phase — it is integrated from the first line of code.

## Decision
Accessibility is a non-negotiable requirement for every feature:
- WCAG 2.1 AA minimum (target AAA where practical)
- All new features must pass axe-core audit before merging
- Keyboard navigation must work end-to-end for every flow
- Screen reader testing (NVDA, VoiceOver) for all critical journeys
- Accessibility review is part of the code review checklist
- `prefers-reduced-motion` must be respected
- Color contrast checked in design phase, not after implementation

## Consequences
### Positive
- Inclusive experience for all users (true luxury)
- Legal compliance (ADA, GDPR accessibility requirements)
- Better SEO (screen reader friendly = search engine friendly)
- Better UX for all users (keyboard shortcuts, clear labels, high contrast)
- Higher Lighthouse accessibility score (target >= 95)

### Negative
- More development time per feature
- Design constraints (color palette limited by contrast ratios)
- Some animation effects must be disabled for reduced motion
- Testing complexity increases (automated + screen reader + keyboard)

## Compliance
- axe-core integration in Playwright (CI blocks violations)
- All images require meaningful alt text
- All form fields require labels
- All interactive elements require keyboard support
- Heading hierarchy is validated in code review
- Focus indicators visible on all interactive elements
- Color is never the only differentiator
- `prefers-reduced-motion` disables all non-essential animations

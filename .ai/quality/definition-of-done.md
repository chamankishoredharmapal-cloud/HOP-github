# Definition of Done — House of Padmavati

> A feature is complete only when ALL criteria below are met.

## Build & Code Quality
- [ ] Production build succeeds (`pnpm build`)
- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] ESLint passes with zero errors (`pnpm lint`)
- [ ] No console.log, debugger, or TODO comments in production code
- [ ] No secrets or credentials in code or git history

## Testing
- [ ] All existing Playwright tests pass (`pnpm test:e2e`)
- [ ] New tests written for the feature (covering happy path, error states, empty states, edge cases)
- [ ] Tests use accessibility selectors (no CSS selectors)
- [ ] Tests are independent (can run alone)
- [ ] Tests pass 3 consecutive runs (not flaky)

## Performance
- [ ] Lighthouse Performance >= 90 (mobile) / >= 95 (desktop)
- [ ] Lighthouse Accessibility >= 95
- [ ] Lighthouse Best Practices >= 95
- [ ] Lighthouse SEO >= 95
- [ ] All images optimized (WebP/AVIF, responsive, lazy-loaded)
- [ ] Route-level code splitting applied (React.lazy)
- [ ] No render-blocking resources

## Accessibility
- [ ] Keyboard navigation works end-to-end
- [ ] Focus indicators visible on all interactive elements
- [ ] All images have meaningful alt text
- [ ] All form fields have associated labels
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Dynamic content announced via aria-live
- [ ] axe-core scan: 0 violations

## User Experience
- [ ] All UI elements render correctly at all breakpoints (375px → 1920px)
- [ ] No horizontal scrolling
- [ ] Touch targets >= 44x44px
- [ ] Loading states shown while data fetches
- [ ] Empty states shown when no data
- [ ] Error states shown with recovery option
- [ ] Form validation works with inline error messages
- [ ] Success/confirmation feedback after actions
- [ ] No broken links (all navigation works)
- [ ] No console errors in any state

## Responsive Design
- [ ] Tested on mobile (375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1440px)
- [ ] Tested on large desktop (1920px)
- [ ] Navigation usable on all breakpoints

## Security
- [ ] All user input validated (Zod schemas)
- [ ] No XSS vectors (no innerHTML without sanitization)
- [ ] RLS policies correct for new tables/queries
- [ ] No sensitive data in logs or error messages
- [ ] Payment data handled server-side only
- [ ] Environment variables not hardcoded

## Code Review
- [ ] PR description complete (what, why, how to test)
- [ ] Screenshots attached (if visual change)
- [ ] Code reviewed and approved
- [ ] No merge conflicts
- [ ] Branch up-to-date with target

## Documentation
- [ ] New environment variables documented
- [ ] API changes documented (if public)
- [ ] Database migrations documented
- [ ] README updated if project setup changed

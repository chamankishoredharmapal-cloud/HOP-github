# Design Standards — House of Padmavati

> Consolidates: old `ACCESSIBILITY_STANDARDS.md` + `ANIMATION_STANDARDS.md` + `LUXURY_BRAND_DESIGN_STANDARDS.md` + `EDITORIAL_LANGUAGE_STANDARDS.md` + `RESPONSIVE_DESIGN_STANDARDS.md` + `ux/ACCESSIBILITY_UX.md` + `ux/LUXURY_UX_GUIDE.md`

## Accessibility (WCAG 2.1 AA)

- All images need meaningful alt text (decorative: `alt="" role="presentation"`). Icon buttons need `aria-label`.
- Color is never the only differentiator — add icons/text/patterns.
- Text contrast >= 4.5:1 (normal) / 3:1 (large). Non-text UI contrast >= 3:1.
- All functionality keyboard-operable. Visible focus indicators (2px solid, 3:1 contrast). No keyboard traps.
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`.
- Labels on all form fields. Error messages in `role="alert"`. `aria-live` for dynamic content.
- Language on `<html lang="en">`. Skip-to-content link at top of every page.
- `<html lang="en">`. Heading hierarchy: one h1, sequential h2→h3.
- **Testing**: axe-core in Playwright CI. Keyboard-only walkthrough pre-release. Screen reader (NVDA/VoiceOver) periodically.
- `prefers-reduced-motion` respected — disable transforms, keep opacity fades.

## Luxury Brand

- **Colors**: Jasmine (off-white bg), Teal (#5B8C84 CTAs), Sand (#D4B896 secondary), Sakura (#C98A7A accents), Ink (#262626 text).
- **Typography**: Cormorant Garamond (serif, headings) + Inter (sans, body). `font-display: swap`. Loose tracking for headings.
- **Principles**: Minimalism with soul. Generous whitespace. Editorial magazine aesthetic. Tactile hover states. Heritage meets modern.
- **Imagery**: Editorial, natural light, warm tone. 4:5 aspect ratio for products. Minimum 1200px longest side.
- **Voice**: Refined, knowledgeable, warm. British English spelling (colour, centre). "saree" not "sari". "handwoven" one word.

### Prohibited
Neon colors, aggressive gradients, heavy shadows, Comic Sans, stock photography, countdown timers, urgency tactics, pop-ups (except cart), chatbots.

## Editorial Language

- Product descriptions: Opening hook → Fabric/weave details → Styling → Care.
- Collection names: Evocative ("Heirloom", "Monsoon Wedding"). URLs: kebab-case.
- Avoid "buy now" → "Add to your collection". Avoid "cheap" → "investment piece". Avoid "sale" → "curated selection".

## Animation

| Duration | Use | Easing |
|----------|-----|--------|
| 200ms | Micro-interactions (hover, click) | ease-out |
| 400ms | Standard transitions | ease-in-out |
| 600ms | Page/section entrance | ease-out |

- Available keyframes: `fade-in`, `fade-up`, `drift`, `kenburns`. Only animate `opacity` + `transform` (GPU-composited, 60fps).
- Never animate layout properties (width, height, top, left). Use Intersection Observer for scroll-triggered entrances.

## Responsive

| Breakpoint | Width | Layout |
|------------|-------|--------|
| sm | 640px | 1 column, hamburger nav, 16px padding |
| md | 768px | 2 columns, collapsible sidebar, 24px padding |
| lg | 1024px | 3 columns, full nav, 32px padding |
| xl | 1280px | 3-4 columns, max-width 1440px centered |

- Mobile-first. Touch targets >= 44x44px. No horizontal scroll. No hover-dependent functionality on touch.
- Test on: 375px, 390px, 820px, 1024px, 1440px, 1920px.

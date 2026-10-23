# House of Padmavati â€” Visual Design System

Date: 2026-10-22
Status: Implemented and verified on the storefront. Studio inherits the neutral surfaces; functional status colours are unchanged.
Companion documents: `HOP_PURPLE_VISUAL_SYSTEM_AUDIT.md` (historical filename, superseded palette), `HOP_VISUAL_TRANSFORMATION_REPORT.md`.

## 1. Foundation

Four families, one disciplined system. Warm off-white is the page. Dusty mauve and muted blush are the material grounds. Charcoal is ink, cinematic ground and footer. Deep dusty mauve is the only action colour on light. Blush replaces the former gold accent and is decorative on light, readable on charcoal.

| Role | Token | HSL | Hex (screen) | Use |
| --- | --- | --- | --- | --- |
| Ground | `--brand-ivory` | `30 30% 96%` | `#F8F5F2` | Page background |
| Ground bright | `--brand-ivory-bright` | `30 42.8571% 97.2549%` | `#FBF8F5` | Cards, forms, dialogs; never pure white |
| Ground alternate | `--brand-ivory-muted` | `21.8182 29.7297% 92.7451%` | `#F2EBE7` | Quiet panels |
| Material | `--brand-mauve` | `5.7143 21.2121% 61.1765%` | `#B18B87` | Ownership chapter, full ground |
| Material light | `--brand-mauve-light` | `6.6667 24.3243% 70.9804%` | `#C7A7A3` | Supporting panels, illustrations |
| Material soft | `--brand-mauve-soft` | `5.625 34.0426% 81.5686%` | `#E0C3C0` | Journal chapter, hover fills, selected rows |
| Ink | `--brand-plum` | `17 9% 15%` | `#2A2523` | Primary text, dark grounds, footer |
| Ink raised | `--brand-plum-raised` | `18 9% 21%` | `#3A3431` | Dark cards, craft/invitation panels |
| Ink deep | `--brand-plum-deep` | `20 11% 11%` | `#1F1B19` | Deepest ground |
| Action | `--brand-violet` | `6.3158 17.757% 41.9608%` | `#7E5C58` | Primary buttons, links, focus ring |
| Action deep | `--brand-violet-deep` | `6.6667 20.2247% 34.902%` | `#6B4B47` | Hover/active states |
| Accent | `--brand-gold` | `5.625 34.0426% 81.5686%` | `#E0C3C0` | Hairlines, eyebrows, focus on dark |
| Accent light | `--brand-gold-light` | `6.6667 36% 90.1961%` | `#EFDFDD` | Small text on raised charcoal |
| Accent deep | `--brand-gold-deep` | `6.3158 17.757% 41.9608%` | `#7E5C58` | Small accent text on light |
| Muted text | `--brand-muted` | `16 7% 32%` | `#574F4C` | Secondary text, captions |
| Line | `--brand-line` | `23 16% 84%` | `#DDD5D0` | Borders, dividers |
| Line strong | `--brand-line-strong` | `19 12% 68%` | `#B7AAA4` | Emphasised borders, inputs |
| Error | `--brand-error` | `4.2478 53.0516% 41.7647%` | `#A33A32` | Destructive actions and states on light |
| Error light | `--brand-error-light` | `7 59% 73%` | `#E39B92` | Error text on charcoal |
| Overlay | `--overlay` | `17 16% 9%` | `#1B1513` | Modal scrims (80% + blur) |

All tokens are defined once in `src/index.css` as HSL channel triples and exposed to Tailwind in `tailwind.config.ts` (`brand.*`, `gold`, `overlay`, `surface.*`, `shadow.*`). Legacy `--rasa-*`, `--paper-*`, `--ink*`, `--hop-*` names alias the same values so existing components compile without churn. The `--brand-violet*` names are also historical: they now resolve to deep dusty mauve, not purple.

The canonical hex values above are the source of truth. Common shorthand names used in review: Dusty Mauve `#B18B87`, Warm Off-White `#F8F5F2`, Muted Blush `#E0C3C0`, Deep Mauve `#7E5C58`, Charcoal `#2A2523`.

### Semantic tokens

- Surfaces: `--surface`, `--surface-raised` (warm off-white), `--surface-mauve`, `--surface-mauve-soft`, `--surface-dark`, `--surface-dark-raised`.
- Text: `--text-primary` (charcoal), `--text-muted`, `--text-inverse` (warm off-white), `--text-gold` / `--text-gold-accessible` (blush / deep mauve on light).
- Actions: `--primary` (deep mauve), `--primary-hover` (deeper mauve), `--primary-foreground` (warm off-white), `--ring` (deep mauve on light, blush on dark).
- shadcn/ui maps onto the same tokens: `--background`, `--foreground`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent` (muted blush), `--destructive`, `--border`, `--input`.

## 2. Contrast contract

Measured with WCAG 2.1 relative-luminance ratios against the canonical hex values.

| Pair | Ratio | Verdict |
| --- | --- | --- |
| Charcoal on Warm Off-White | 13.94 | AA/AAA body |
| Charcoal on Muted Blush | 9.18 | AA body |
| Charcoal on Dusty Mauve | 4.98 | AA body, large text preferred |
| Deep Mauve on Warm Off-White | 5.43 | AA body |
| Deeper Mauve on Warm Off-White | 7.10 | AA body |
| Muted text on Warm Off-White | 7.36 | AA body |
| Deep Mauve accent on Warm Off-White | 5.43 | AA body (small text) |
| Error on Warm Off-White | 6.03 | AA body |
| Warm Off-White on Deep Mauve | 5.43 | AA buttons |
| Warm Off-White on Charcoal | 13.94 | AA dark sections |
| Warm Off-White on Raised Charcoal | 11.27 | AA dark panels |
| Blush Light on Raised Charcoal | 9.48 | AA small text on dark |
| Blush on Raised Charcoal | 7.42 | AA small text on dark |
| Blush on Deep Charcoal | 10.36 | AA small text on deepest ground |
| Warm Off-White on Dusty Mauve | 2.80 | Large display text only |
| Blush on Dusty Mauve | 1.84 | Decorative rules only |
| Blush on Warm Off-White | 1.52 | Decorative rules only |

Rules that follow from this table:

1. Blush can never carry small text on warm off-white or dusty mauve. Use `--brand-gold-deep` (deep mauve) for small accent text on light, `--brand-gold-light` for small text on raised charcoal, and plain blush only for hairlines, rings and large display on dark.
2. Mauve backgrounds carry charcoal body text (4.98+). Warm off-white text on mauve is reserved for display sizes (>= 24px or 18.66px bold) and should be avoided in body copy.
3. Deep mauve is the only action colour on light grounds. Blush buttons do not exist on the storefront.
4. Warm off-white on deep mauve or charcoal is the button pairing; hover deepens the ground, never lightens the text.
5. Pure white (`#FFFFFF`) and pure black (`#000000`) are not palette values. The brightest surface is `#FBF8F5`.

## 3. Typography

| Face | Token/class | Role |
| --- | --- | --- |
| Fraunces | `font-serif`, `.hop-display`, `.hop-editorial-name` | Display headings, collection names |
| Cormorant Garamond | fallback display | Accents where Fraunces unavailable |
| Newsreader | `.hop-reading`, `.font-reading` | Editorial body, long-form journal |
| Inter | `font-sans`, `.eyebrow`, form UI | UI labels, eyebrows, controls |

Conventions:

- Eyebrows: 0.6-0.65rem, uppercase, letter-spacing 0.2-0.42em, deep mauve on light / blush light on dark, or deep mauve for interactive kickers.
- Display line-height 0.98-1.1, weight 300-400. Body line-height 1.6-1.75, weight 300-400.
- Numbers in commerce contexts use `tabular-nums` (`.tnum`).
- Balance utilities: `.text-balance` on headings, `.text-pretty` on paragraphs.

## 4. Surfaces, shadow and texture

- Shadows are charcoal-tinted, never neutral grey:
  - `--shadow-soft` â€” resting cards, `0 1px 2px hsl(plum/0.04), 0 16px 40px -32px hsl(plum/0.26)`.
  - `--shadow-lift` â€” hover on notes/cards.
  - `--shadow-overlay` â€” dialogs, search, drawers.
- Texture: `.texture-grain` (SVG noise, 5% charcoal), `.texture-weave` (crosshatch). Apply to mauve/charcoal grounds and the footer top edge; do not stack under small text without a solid ground.
- `.surface-raised` on warm off-white; `.surface-mauve`, `.surface-mauve-soft`, `.surface-dark` for chapter grounds.

## 5. Component rules

- Buttons: primary `bg-brand-violet text-brand-ivory`, hover/active `bg-brand-violet-deep`; outline `border-brand-violet text-brand-violet` filling deep mauve on hover; ghost/text buttons use deep mauve text and blush underline on dark. Minimum touch target 44x44.
- Cards: warm off-white bright ground, 1px `--brand-line`, no hard corners beyond 2px radius unless the component specifies round. Blush top hairline only on ownership notes.
- Forms: 1px line border, bright ground, deep mauve focus border and 22% deep mauve ring; placeholders at muted 60% minimum; labels muted/charcoal. Errors use `--brand-error` on light and `--brand-error-light` on charcoal.
- Navigation: light header uses charcoal ink, deep mauve hover; inverse header (over hero) uses warm off-white ink and blush hover. Icon buttons always have `aria-label`. Mobile drawer uses the same surfaces and traps focus; Escape closes it.
- Brand lockup: the brush mark renders through `Monogram tone` â€” `gold` (blush, dark grounds) or `gold-deep` (deep mauve, light grounds); both derive from the signature artwork's alpha so the dry-brush edge is preserved. The wordmark uses restrained metal gradients (`.hop-wordmark` on light, `.hop-wordmark--inverse` on dark grounds).
- Dialogs/sheets/drawers: `bg-overlay/80 backdrop-blur-sm` scrim, `shadow-overlay`, warm off-white panel, deep mauve focus.
- Status: functional states map to palette â€” pending deep mauve, confirmed/processing deep mauve, shipped deeper mauve, delivered charcoal on blush/20, cancelled/returned error shade or muted text. No raw Tailwind red/green remain on storefront.
- Email and payments: `emailService.ts` uses warm off-white/charcoal/deep mauve; Razorpay checkout theme is Deep Mauve `#7E5C58`.
- Native controls on dark grounds must set `color-scheme: dark`, including the footer consent checkbox, so checkboxes and pickers do not render pure white.

## 6. Focus and motion

- Focus visible: 2px ring, deep mauve on light, blush on dark (`.hop-home`, `.hop-header--inverse`, `.hop-page__section--dark`, `footer`, `.bg-ink`, `.bg-plum`, `.hop-ownership`, `.hop-invitation`, `.hop-craft`).
- `prefers-reduced-motion: reduce` disables animations/transitions globally in `index.css`; `Film` already declines autoplay under the same preference.
- Selection: deep mauve ground, warm off-white text.

## 7. Chapter map (where each ground is used)

| Ground | Chapter |
| --- | --- |
| Charcoal | Hero threshold, collection films, product desire, dark panels, footer, invitations |
| Warm off-white | Default page, cards, checkout, account, policies, product detail |
| Dusty mauve | Ownership chapter, one per journey |
| Muted blush | Journal chapter, journal pages, selected/hover states |
| Blush accent | Hairlines, eyebrows, focus on dark, one rule per light chapter |

## 8. Rules of restraint

1. One ground shift per viewport; no more than one mauve chapter and one dark chapter per page.
2. Blush never becomes a background for small text on light grounds.
3. Deep mauve is the only interactive colour on light; blush is never a light-mode button.
4. No gradients other than the invitation radial glow, neutral film scrims, the brand wordmark metal gradients, and texture overlays.
5. Imagery is untouched (warm silk, zari, skin); the system is built to sit behind it.
6. Content photography is part of the visual system. Broken or placeholder imagery blocks visual sign-off even when the palette is correct.

## 9. Verification record

| Check | Result |
| --- | --- |
| `npm run build` | PASS â€” 29 routes prerendered |
| `npm run lint` | PASS |
| `npm test` | PASS â€” 8 files, 71 tests |
| Chromium E2E (targeted) | PASS after accessibility heading fix; Accessibility suite 19/19 |
| Mobile Chrome E2E (targeted) | 28/29; one desktop-only nav selector in `Studio.spec.ts`, not a mobile UI failure |
| Axe WCAG 2.1 A/AA | Zero violations on home, collections, Kalyani and checkout (empty and item), desktop and mobile |
| `npx tsc -p tsconfig.app.json --noEmit` | FAIL â€” 76 pre-existing Supabase schema/type errors in 12 files, unrelated to palette work |

- Desktop (1440x900) and mobile (390x844) visual review: home, collections, Kalyani, Viara, cart, checkout, account login/signup, 404, footer and mobile drawer.
- Mobile drawer keyboard check: focus moves to Close on open, Tab enters the navigation links, Escape closes the drawer and returns focus to Open menu.
- Computed styles: body `rgb(248, 245, 242)`, ownership `rgb(177, 139, 135)`, journal `rgb(224, 195, 192)`, footer `rgb(42, 37, 35)`; no horizontal page overflow.
- Screenshots and machine-readable results: `test-results/palette-verification/`.
- Known content blocker: several Supabase product images are terminal/browser screenshots or swatch infographics rather than product photography. This is a data issue, not a token issue.


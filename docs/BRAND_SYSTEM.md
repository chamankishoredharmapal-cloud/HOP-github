# Brand System

## Brand Name

House of Padmavati — abbreviated **HOP** in order numbers and code.

## Color Palette

### Primary Palette

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--jasmine` | `40 33% 95%` | `#F7F4EE` | Page background, cards |
| `--jasmine-deep` | `40 25% 91%` | slightly darker | Muted backgrounds, hover states |
| `--teal` | `174 16% 44%` | `#5D817E` | Primary hover, accent |
| `--teal-deep` | `174 22% 28%` | darker teal | Primary buttons, links |
| `--sand` | `36 45% 81%` | `#E4D3BA` | Accent, status badges |
| `--sakura` | `8 31% 73%` | `#CFA9A2` | Pending status, warm accent |
| `--ink` | `0 0% 15%` | `#262626` | Body text |
| `--ink-soft` | `0 0% 30%` | lighter ink | Secondary text |

### Semantic Mappings

```css
--background: var(--jasmine)
--foreground: var(--ink)
--primary: var(--teal-deep)
--primary-foreground: var(--jasmine)
--secondary: var(--jasmine-deep)
--muted: var(--jasmine-deep)
--muted-foreground: var(--ink-soft)
--accent: var(--sand)
--border: 36 20% 86%
--card: 0 0% 100% (white)
--destructive: 0 60% 50%
--radius: 0.75rem
```

### Dark Mode

```css
.dark {
  --background: var(--teal-deep)
  --foreground: var(--jasmine)
  --card: var(--ink)
  --border: 174 15% 32%
}
```

## Typography

| Family | CSS Variable | Weight | Usage |
|--------|-------------|--------|-------|
| **Cormorant Garamond** | `--font-serif` | 300, 400, 500 | Headlines, editorial text, collection names |
| **Inter** | `--font-sans` | 300, 400, 500, 600 | Body text, navigation, UI labels |

### Type Scale

- Headlines (h1): `text-5xl` to `text-7xl` (`font-serif`)
- Section titles: `text-xl` to `text-3xl` (`font-serif font-light`)
- Body: `text-sm` to `text-base` (`font-sans font-light`)
- Labels: `text-[0.6rem]` to `text-xs`, uppercase, tracking-wider
- Studio headings: `font-serif text-xl font-light`

## Voice

- Editorial, poetic, warm
- First-person plural ("our", "the house")
- Collection descriptions are narrative, not technical
- Studio uses precise, functional language

## Monogram

The brand mark is the **Monogram** component at `src/components/hop/Monogram.tsx` — an SVG letterform used as a decorative element above section headings on the storefront and in the studio sidebar label.

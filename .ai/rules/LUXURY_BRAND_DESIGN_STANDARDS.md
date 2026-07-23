# Luxury Brand Design Standards — House of Padmavati

## Brand Identity

House of Padmavati is a digital sanctuary for heritage and contemporary luxury sarees. Every pixel must reflect craftsmanship, elegance, and timeless beauty.

## Core Design Principles

### 1. Minimalism with Soul
- Generous whitespace (padding/margins feel spacious, not cramped)
- Content breathes; don't crowd the page
- Every element earns its place — nothing is decorative without purpose
- Maximum content width: 1440px (centered)

### 2. Editorial Aesthetic
- Layouts feel like a luxury magazine spread
- Full-bleed hero images with typographic overlay
- Asymmetric grids for visual interest (where appropriate)
- Pull quotes, large typography, and negative space used editorially

### 3. Tactile & Sensory
- Visual texture through gradients, shadows, and overlays
- Subtle grain or noise textures on hero sections (optional)
- Hover states feel physical (elevation, scale, shadow depth)
- Product images are immersive (zoom on hover, full-screen gallery)

### 4. Heritage Meets Modern
- Traditional Indian craftsmanship motifs (modern interpretation)
- Warm, earthy color palette with deep jewel tones
- Serif typography for headings (tradition), sans-serif for body (modern)
- Craft details highlighted (weave, fabric, technique, region)

## Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| `jasmine` | Warm off-white | Backgrounds, cards, light mode |
| `jasmine-deep` | Slightly darker off-white | Hover states, subtle backgrounds |
| `teal` | Muted teal (#5B8C84) | Primary CTAs, accents, interactive elements |
| `teal-deep` | Deep teal (#3A5E56) | Hover on teal, primary text on light |
| `sand` | Warm beige (#D4B896) | Secondary backgrounds, borders |
| `sakura` | Dusty rose (#C98A7A) | Accent color, highlights, sale badges |
| `ink` | Near-black (#262626) | Primary text |
| `ink-soft` | Dark gray (#4D4D4D) | Secondary text |

## Typography

### Headings
- Font: `Cormorant Garamond` (serif)
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)
- Sizes: `text-4xl` (h1), `text-3xl` (h2), `text-2xl` (h3), `text-xl` (h4)
- Letter-spacing: slightly loose for headings (`tracking-wide`)
- Style: Italic for emphasis on hero sections (Cormorant Garamond italic is exquisite)

### Body
- Font: `Inter` (sans-serif)
- Weights: 300 (Light), 400 (Regular), 500 (Medium)
- Sizes: `text-base` (16px) body, `text-sm` (14px) secondary
- Line-height: `leading-relaxed` (1.625) for body text
- Color: `ink-soft` for body, `ink` for headings and emphasis

### Editorial
- Pull quotes: Cormorant Garamond italic, 2-3x body size
- Article body: Inter, 18px (`text-lg`) for readability
- Captions: Inter, 12px (`text-xs`), uppercase with tracking

## Spacing System

- Base unit: 4px
- Consistent padding/margin using Tailwind spacing scale
- Section spacing: `py-16` (64px) to `py-24` (96px)
- Content padding: `px-4` mobile, `px-6` tablet, `px-8` desktop
- Generous padding around product images

## Imagery

- Photography style: Editorial, moody, natural light
- Products shot on models (lifestyle) and flat lay (detail)
- Consistent image treatment (warm tone, subtle grain)
- Minimum image resolution: 1200px on the longest side
- Aspect ratio: 4:5 (portrait) for product images
- Background: Clean, neutral, or contextual (never busy)

## UI Components

### Buttons
- Primary: Teal fill, white text, rounded-sm
- Secondary: Outlined, ink border, no fill
- Tertiary: Text only, no border
- All: 12px horizontal padding, 10px vertical, uppercase tracking
- No extreme border-radius (max `rounded-sm` to `rounded-md`)

### Cards
- Clean background (jasmine)
- No border or subtle border (sand)
- Hover: slight elevation (`shadow-md` → `shadow-lg`)
- Image top, content below
- Consistent padding within cards

### Forms
- Minimal styling — clean lines, no heavy borders
- Labels above inputs (not inside)
- Focus state: teal border, subtle ring
- Error state: red border with icon
- Success state: green check (subtle)

## Voice & Tone

- **Voice**: Refined, knowledgeable, warm
- **Tone**: Respectful, aspirational, never pushy
- **Language**: Editorial, descriptive, sensory
- **Motto**: "Every thread tells a story"

## What NOT to Do

- No neon or highly saturated colors
- No aggressive gradients
- No heavy shadows or extreme depth
- No gaudy animations or transitions
- No Comic Sans or decorative display fonts
- No stock photography (curated or custom only)
- No chevrons or "click here" calls to action
- No pop-ups or intrusive modals (except cart)
- No countdown timers or urgency tricks (tacky for luxury)

# Luxury UX Guide — House of Padmavati

## What Luxury UX Means

Luxury UX is about creating a feeling of exclusivity, personal attention, and uncompromising quality in every interaction. It's not about flashy effects — it's about thoughtfulness, refinement, and removing anything that feels ordinary.

## Interaction Design

### Touch and Feel

| Interaction | Luxury Approach | Standard Approach |
|-------------|----------------|-------------------|
| Button hover | Subtle elevation, color shift | Bright color change |
| Image zoom | Smooth, high-resolution | Clunky, pixelated |
| Page transition | Fade (elegant) | Slide (functional) |
| Loading | Skeleton with brand pulse | Spinner |
| Error | Apologetic, helpful, branded | Technical error message |
| Empty state | Curated suggestion | "No items found" |
| Confirmation | Warm, personal message | Generic "Success" |

### Micro-interactions

Every micro-interaction should feel considered:

```typescript
// Cart animation — subtle and satisfying
function AddToCartButton() {
  const [isAdding, setIsAdding] = useState(false);

  const handleClick = async () => {
    setIsAdding(true);
    await addToCart(product);
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "transition-all duration-300",
        isAdding && "scale-105 opacity-90"
      )}
    >
      {isAdding ? "Added to your collection" : "Add to your collection"}
    </button>
  );
}
```

## Visual Hierarchy for Luxury

### Above the Fold
- Hero image (full-bleed, editorial quality)
- Brand name/logo (subtle, elegant)
- Collection name or tagline (serif, refined)
- Subtle navigation (thin, understated)
- No CTAs competing with the hero image

### Product Discovery
- Start with editorial curation (not filters)
- Large product images (minimum 3 columns on desktop)
- Minimal text per card (name, price)
- Hover reveals quick-add option (non-intrusive)
- Filters are secondary, not primary

### Checkout
- Begin with a warm message, not a form
- One column layout (focused, calm)
- Progress is visual (steps, not just numbers)
- Payment section feels secure (lock icon, brand trust signals)
- Confirmation is celebratory but elegant

## Typography for Luxury

- Large, light serif headings (editorial feel)
- Generous letter-spacing for headings
- Thin, light body text (inter at 300 weight)
- Limited type scale (3-4 sizes max)
- Kerning optimized for readability

## Color Psychology

| Color | Association | Usage |
|-------|-------------|-------|
| Off-white (Jasmine) | Clean, premium, spacious | Backgrounds |
| Teal | Trust, sophistication | CTAs, accents |
| Sand | Warmth, natural, organic | Secondary elements |
| Dusty Rose (Sakura) | Romance, femininity, heritage | Accents |
| Near-black (Ink) | Authority, elegance, depth | Text, headers |

## Photography

- Editorial style (not product catalog)
- Models in natural, elegant poses
- Soft, natural lighting
- Consistent color grading (warm, slightly desaturated)
- Details shots (weave, texture, embroidery close-ups)
- Lifestyle context (weddings, celebrations, daily elegance)

## Copywriting for Luxury

- "Add to your collection" (not "Add to Cart")
- "Your pieces" (not "Your items")
- "Curated for you" (not "Recommended")
- "Complete your look" (not "Buy more")
- "Inquire within" for sold-out items (not "Out of stock")

## What Luxury UX Avoids

- Pop-ups and modal overlays (except cart)
- Countdown timers ("Sale ends in...")
- Fake social proof ("23 people are viewing this")
- Aggressive upsells ("Customers also bought...")
- Banner ads and promotions
- Auto-playing videos
- Notification permission requests
- Cookie consent that blocks content
- Chatbots (use concierge-style contact instead)

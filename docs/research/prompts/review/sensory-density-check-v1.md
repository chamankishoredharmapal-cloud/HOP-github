# PROMPT: Sensory Density Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Counts sensory words per 100 words and compares against the target threshold for the given content type. Categorises words into sight, touch, sound, smell, and movement. Provides a per-category breakdown and specific recommendations for increasing density where the content falls short.

## Input

Full content unit to check. Content type (homepage, product-detail, journal-article, craft-note, collection, or other).

## Methodology

1. Tokenise the content into words. Exclude frontmatter YAML.
2. Scan each word against each sensory category dictionary:
   - **Sight:** light, colour, shadow, glow, shimmer, matte, lustre, translucent, opaque, pale, deep, warm, cool, bright, dull, clear, hazy, silhouette, gleam, sparkle, iridescent, saturated, muted, tinted, faded, radiant
   - **Touch:** weight, texture, soft, smooth, coarse, fine, crisp, fluid, stiff, pliant, warm, cool, dry, damp, slippery, rough, delicate, sturdy, thick, thin, supple, taut, loose, brushed, ribbed, nubby, silky, woolly, linen, cottony
   - **Sound:** silence, rhythm, hum, whisper, rustle, murmur, quiet, soft, loud, crackle, swish, patter, echo, resonance, harmonic, tone, beat, pulse, drone, ringing, settling, breathing
   - **Smell:** jasmine, earth, must, dust, wood, rain, air, cedar, sandal, vetiver, tuberose, musk, smoke, incense, petrichor, sun-warmed, dried, fresh, green, floral, spicy, woody, powdery
   - **Movement:** drape, fall, settle, flow, cascade, fold, sway, shift, lift, drop, hang, wrap, twist, turn, bend, curve, stretch, gather, ripple, wave, glide, slide, spin, float, drift, billow, pool, spill, cascade
3. Compute per-category count, total sensory words, and sensory density per 100 words.
4. Compare density against target threshold:
   - Homepage: 5/5 (≥12 per 100 words)
   - Product Detail: 5/5 (≥12 per 100 words)
   - Journal Article: 5/5 (≥12 per 100 words)
   - Craft Note: 4/5 (≥8 per 100 words)
   - Collection: 4/5 (≥8 per 100 words)
   - Other types: 3/5 (≥6 per 100 words)
5. Flag underperforming categories.

## Output Format

```yaml
word_count: {total words}
sensory_word_count: {total sensory words}
sensory_density: "{count} per 100 words"

per_category:
  sight: {count}
  touch: {count}
  sound: {count}
  smell: {count}
  movement: {count}

target_density: "{count} per 100 words"
target_score: "{score}/5"
pass_fail: {pass|fail}

recommendations:
  - category: {category}
    note: "This category is underrepresented. Add {n} more sensory words."
    examples:
      - "{suggested word or phrase in context}"
```

## Quality Criteria for the Reviewer

- Only count sensory words in content body — exclude frontmatter, alt text, meta fields
- Do not count the same word twice if it appears in a repeated phrase (e.g. list items repeating the same sensory descriptor)
- Context matters: "light" as a noun (sight) vs "light" as an adjective (weight) — disambiguate
- Proper names, brand terms, and place names are never sensory words
- If density is above target but a specific category is empty (e.g. zero smell words), flag as a quality gap even though the count passes
- For product detail and journal article, the 5/5 target is a minimum — the best HOP writing exceeds this

## Severity Levels

- **Critical:** Score is 2 or more points below target. Must fix before publish.
- **Important:** Score is 1 point below target. Should fix.
- **Nice-to-fix:** Score meets target but one category is entirely absent. Optional but recommended.

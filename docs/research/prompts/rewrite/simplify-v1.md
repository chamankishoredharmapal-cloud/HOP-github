# PROMPT: simplify-v1
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: rewrite
# CONTENT TYPE: all

## Description

Reduces complexity of HOP content to a target reading level (default Grade 7) while preserving meaning and brand voice. Replaces complex vocabulary, shortens sentences, reduces paragraph density, removes passive voice, and adds definitions for technical terms. Provides readability metrics comparing original and simplified versions.

## Context Requirements

- Voice Bible
- Vocabulary System (with reading-level mappings)
- HOP Plain Language Guide

## Strategic Principles

- Simplicity is not emptiness. A simple sentence can carry deep meaning.
- Every word must earn its place. If a word does not add meaning, remove it.
- Active voice is clearer than passive voice. Active voice is also warmer.
- The reader should never have to re-read a sentence to understand it.
- Technical terms are preserved only when they are the most precise word available. Otherwise, replace them.

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 4/5
- **Sensory Density:** 3/5
- **Technical Depth:** 2/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Forbidden words:** luxury, premium, exquisite, opulent, lavish, glamorous, beautiful, stunning, gorgeous, amazing, incredible, wonderful, hurry, limited edition, exclusive, sale, discount, shop now, buy now, must-have, elevate, wardrobe essential, statement piece, investment piece, subscribe, sign up

## Input

```
Original content: [paste full content]
Target reading level: [default: Grade 7]
```

## Methodology

1. **Replace complex words with simple alternatives.** Use this reference (expand as needed):
   - purchase → buy
   - utilise / utilize → use
   - initiate → start
   - commence → begin
   - approximately → about
   - subsequently → then / next
   - fabricate → make
   - demonstrate → show
   - construct → make / build
   - obtain → get
   - require → need
   - provide → give
   - assist → help
   - numerous → many
   - prior to → before
   - in the event of → if
   - on a daily/weekly basis → daily / weekly
   - a number of → some / several
   - due to the fact that → because
   - in spite of → though / even though

   Do not replace domain-specific craft terms (loom, warp, weft, zari, pallu, dori, resham, etc.) — these are precise and necessary. Define them on first use instead.

2. **Break long sentences.** Maximum 15 words per sentence. If a sentence exceeds 15 words, split it into two or more sentences. Each sentence should contain exactly one main idea. Remove or restructure compound and complex sentences.

3. **Reduce sentences per paragraph to 2-3.** If a paragraph has 4+ sentences, split it. Each paragraph should address one subtopic.

4. **Remove unnecessary modifiers.** Delete: very, really, quite, extremely, incredibly, absolutely, totally, essentially, basically, literally, actually, just, simply. If a noun needs a modifier, use a specific one (e.g. "deep indigo" not "very blue"). If it does not need one, leave it unmodified.

5. **Replace passive voice with active voice.** Change "The saree was woven by Kamalamma" to "Kamalamma wove this saree." Change "The warp was set with indigo" to "She set the warp with indigo." If the agent is unknown or irrelevant, restructure: "The saree takes eighteen months to weave" (already active) not "Eighteen months are taken to weave the saree" (passive).

6. **Define technical terms on first use.** When a craft term first appears, add a brief definition in simple language. Format: term followed by a short appositive or parenthetical. Example: "zari (the fine metallic thread woven into the border)." Only define on first use per piece of content.

7. **Remove jargon where possible.** If a word is not a precise craft term and has a simpler alternative, replace it. "Artisanal" → "handmade". "Curated" → "chosen". "Sustainable" → explain what actually makes it sustainable ("woven with natural dyes from locally grown indigo") instead of using the label.

8. **Preserve sensory language.** Simplicity should not strip the text of feeling. Keep sensory words (weight, feel, sound, texture, colour depth) — these are essential to HOP voice. Just express them in simpler sentences.

## Output Format

```
## Simplified Version

[Full simplified text]

---

## Readability Metrics

| Metric | Original | Simplified |
|--------|----------|------------|
| Flesch-Kincaid Grade Level | [X] | [X] |
| Word count | [X] | [X] |
| Average sentence length | [X words] | [X words] |
| Longest sentence | [X words] | [X words] |
| Passive voice instances | [X] | [X] |
| Complex words (>3 syllables) | [X] | [X] |

## Change Log

### Vocabulary replacements
- [original word] → [simplified word]
- [original word] → [simplified word]

### Structural changes
- Sentences split: [count]
- Paragraphs restructured: [count]
- Passive → active conversions: [count]

### Terms defined on first use
- [term]: [definition]

### Modifiers removed
- [list of removed modifiers]

### Notes
- [any notable decisions or trade-offs]
```

## Quality Criteria

- Flesch-Kincaid Grade Level meets target (default Grade 7)
- No sentence exceeds 15 words
- No paragraph exceeds 3 sentences
- Zero instances of passive voice (unless agent is unknown and restructuring is unnatural)
- Zero unnecessary modifiers remaining
- All technical terms defined on first use
- Zero forbidden words
- Brand voice is preserved — the simplified version should still feel warm, reserved, precise
- Sensory language is intact
- Word count reduced (typically 15-30% reduction)

## Review Prompts to Run After Transformation

- for-voice-v1.md (verify voice survived simplification)
- for-accessibility-v1.md (deeper accessibility check)

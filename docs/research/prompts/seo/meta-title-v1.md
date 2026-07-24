# PROMPT: Meta Title Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: seo
# CONTENT TYPE: all

## Description

Generates a single SEO title for a content unit. Every title must include the primary keyword naturally, stay within 70 characters, and end with the " — House of Padmavati" suffix. No clickbait, no all-caps, no punctuation tricks.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (sentence rules, prohibited patterns)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

A meta title is a promise. It must tell the reader exactly what the content contains, in the fewest possible words, without exaggeration or marketing language. Trust through transparency applies at the metadata level.

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 3/5
- **Sensory Density:** 2/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Maximum length:** 70 characters (including " — House of Padmavati")
- **Forbidden words:** luxury, premium, beautiful, stunning, amazing, incredible, best, top, ultimate, must-have, exclusive
- **Format suffix:** " — House of Padmavati" (always appended)

## Input

- Content type (journal, collection, product, craft-note, weaver-portrait, house-letter, ritual-guide, field-note, glossary)
- Primary keyword (the search term this content should rank for)
- Main title (the editorial title of the content unit)
- Key context (1-2 words of additional context if needed)

## Output Format

A single string — the complete SEO title including the suffix. No alternatives, no explanation.

```
{Title} — House of Padmavati
```

## Quality Criteria

- Length must not exceed 70 characters
- Primary keyword must appear naturally (not stuffed)
- Must not start with a question
- Must not contain forbidden words
- Must not use all-caps or excessive punctuation
- Must accurately represent the content (no clickbait)
- Pipe separator `|` may be used instead of em-dash only if the title itself contains an em-dash

## Examples

| Content Type | Main Title | Primary Keyword | Output |
|---|---|---|---|
| Journal | Organza in the Rain | organza saree | "Organza in the rain — House of Padmavati" |
| Collection | Kalyani | wedding saree collection | "Kalyani — House of Padmavati" |
| Craft Note | Understanding Zari | what is zari | "Understanding zari — House of Padmavati" |
| Product | (product name) | kanjivaram silk saree | "{Product Name} — House of Padmavati" |

## Review Prompts to Run After Generation

- `seo-check-v1` — validates title length and format
- `forbidden-words-check-v1` — ensures no forbidden words in the title

# PROMPT: Meta Description Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: seo
# CONTENT TYPE: all

## Description

Generates a single SEO meta description for a content unit. The description must be 120-160 characters, include the primary keyword naturally, and make the reader want to click without being promotional. One description, no options.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (prohibited patterns)
- docs/editorial/04-vocabulary-system/forbidden-words.md
- docs/editorial/02-brand-architecture/editorial-principles.md (show don't tell, specific over generic)

## Strategic Principles

A meta description is the second thing a searcher reads (after the title). It must create curiosity without manipulation, inform without summarizing, and invite without pleading. It is a System 1 hook for the search result.

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 3/5
- **Sensory Density:** 2/5 (can be higher for journal/craft content)
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Minimum length:** 120 characters
- **Maximum length:** 160 characters
- **Forbidden words:** luxury, premium, beautiful, stunning, amazing, incredible, best, top, ultimate, must-have, exclusive, click here, learn more, read more

## Input

- Content type
- Primary keyword
- Content summary or the first 2-3 sentences of the body
- The dek (if available)

## Output Format

A single string — the complete meta description. No alternatives.

```
{Description sentence. Ends with a period.}
```

## Quality Criteria

- Length must be between 120 and 160 characters
- Primary keyword appears once naturally
- Must be a complete sentence (not a fragment)
- Must not start with a question
- Must not contain quotation marks or exclamation marks
- Must not be promotional ("discover," "explore," "learn" are acceptable once; "don't miss" is forbidden)
- Must make the reader curious without being manipulative
- No more than one instance of "House of Padmavati" in the description
- Must accurately represent the content

## Examples

| Content Type | Primary Keyword | Summary | Output |
|---|---|---|---|
| Journal | organza saree | Article about wearing organza in monsoon weather | "An organza saree in the rain — how the weave breathes, how the pallu moves, and why monsoon is the season for transparent cloth." |
| Craft Note | what is zari | Explainer on zari thread, types, history | "What zari is, how it is made, and why real zari behaves differently from imitation — a weaver's guide to the thread that defines a saree." |
| Collection | wedding saree | Kalyani collection description | "The Kalyani collection belongs to winter weddings where the light fades by five — handwoven silks for ceremonies that gather generations." |

## Review Prompts to Run After Generation

- `seo-check-v1` — validates description length and format
- `forbidden-words-check-v1` — ensures no forbidden words

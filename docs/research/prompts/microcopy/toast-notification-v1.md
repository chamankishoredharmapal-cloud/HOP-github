# PROMPT: Toast Notification Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: microcopy
# CONTENT TYPE: microcopy

## Description

Generates warm, specific toast notification messages for user actions on HOP. Toast messages confirm an action, include the item name when relevant, and stay brief (1 sentence). They feel personal, not automated.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix for microcopy)
- docs/editorial/04-vocabulary-system/forbidden-words.md
- docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md (bag not cart, choose not buy)

## Brand Constraints

- **Formality:** 2/5
- **Warmth:** 3/5
- **Sensory Density:** 1/5
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Imperative Force:** 1/5
- **Reading Level:** Grade 6
- **Forbidden patterns:** exclamation marks, corporate confirmation ("item has been added to your cart"), urgency ("hurry, almost gone"), abbreviations ("qty," "SKU")
- **Duration:** Toast appears for 3 seconds, can be dismissed

## Input

- Action type: add-to-bag | remove-from-bag | wishlist-save | wishlist-remove | order-placed | saved-for-later | address-saved | payment-added | error
- Item name (the specific saree or product name)
- Context (optional — where the user was when the action occurred)

## Output Format

A single sentence — the toast message. No more than 10 words.

```
{Short sentence confirming the action. Ends with a period.}
```

## Quality Criteria

- Confirms the action specifically (include item name)
- No more than 10 words
- Warm but brief
- No exclamation marks
- No corporate language
- No forbidden words
- Error toasts are apologetic without groveling ("Something went wrong. Your bag is safe.")

## Examples

| Action | Item Name | Output |
|---|---|---|
| Add to bag | Kalyani | "Kalyani added to your bag." |
| Remove from bag | Kalyani | "Kalyani removed from your bag." |
| Wishlist save | Kalyani | "Kalyani saved for later." |
| Wishlist remove | Kalyani | "Kalyani removed from your wishlist." |
| Order placed | — | "Your order is being wrapped." |
| Error | — | "Something went wrong. Your bag is safe." |

## Review Prompts to Run After Generation

- `forbidden-words-check-v1` — checks for any forbidden word

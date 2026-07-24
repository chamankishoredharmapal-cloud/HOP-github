# Editing: Proofread

**Purpose:** Proofread HOP content for grammar, punctuation, spelling, and mechanical correctness against HOP's specific style guide.

**When to use:** Before publication of any content. After writing or editing, run a proofread pass.

**When NOT to use:** For voice or style issues (use `editing/rewrite.md` or `editing/luxury-tone.md`). Proofreading is mechanical correctness only.

---

## Purpose

Catch and correct mechanical errors: spelling, punctuation, grammar, formatting. This is the final quality gate before publication.

## Required Inputs

- The content to proofread
- The content type (applies content-type-specific formatting rules)

## Expected Outputs

- List of corrections with location, original text, corrected text, and rule reference
- If no errors: confirmation that the content passes proofread

## Constraints

- Do not change voice, tone, or style. Proofreading is mechanical only.
- Do not change word choice unless it is a spelling error.
- Do not restructure sentences. Correct errors within the existing structure.

## Rules to Enforce

### Punctuation
- Oxford comma in all lists of 3+
- Em dashes (—) with spaces, not hyphens or double hyphens
- Curly quotes, not straight quotes
- No double spaces after periods
- No exclamation marks
- Periods at the end of all complete sentences

### Spelling (Indian English)
- colour, centre, metre, litre, jewellery, grey, honour, favour, practice/practise
- saree (not sari)
- handwoven (one word, hyphenate only before noun: "hand-woven saree")
- zari (not jari)
- pallu (not pallav)
- "keepsake" not "keepsake card" (redundant)

### Capitalization
- Sentence case for headlines
- Title case for proper names: "House of Padmavati," "Kalyani Collection"
- Lowercase for job titles: "the weaver," "the founder"

### Numbers and Dates
- Spell out one through nine. Numerals for 10+.
- Dates: "12 July 2026" (no comma, no ordinal)
- Times: "5:47 a.m." (lowercase with periods)
- Currency: "₹ 24,000" (space after symbol)

### Formatting
- No ALL CAPS for emphasis
- No ampersands in body copy (allowed in navigation and taglines)
- No URLs written out in body copy — use descriptive link text
- No TM, (R), or (C) symbols

## Examples

| Error | Correction | Rule |
|-------|------------|------|
| "The saree is hand-woven." | "The saree is handwoven." | handwoven is one word |
| "It was 5:30 PM." | "It was 5:30 p.m." | Time uses lowercase with periods |
| "A beautiful, stunning saree." | "A beautiful saree." | But "beautiful" is forbidden — this would actually be flagged by brand review, not proofread |
| "The colour is blue-green." | "The colour is Coastal Teal." | But colour names use brand palette — this is a vocabulary issue, not mechanical |
| "It was published on July 12, 2026." | "Published 12 July 2026." | Date format |
| "The saree's border -- woven by hand" | "The saree's border — woven by hand" | Em dash with spaces |

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Proofreading for voice | Proofreading is mechanical only. Voice issues go to `editing/rewrite.md`. |
| Changing acceptable variations | Contractions are allowed. Indian English is correct. Do not "correct" them. |
| Adding missing content | If a sentence lacks a subject or verb, flag it — do not add content to complete it. |

---

**Cross-reference:** `docs/editorial/04-vocabulary-system/grammar-and-usage.md` (full grammar rules), `editing/consistency.md` (broader consistency check)
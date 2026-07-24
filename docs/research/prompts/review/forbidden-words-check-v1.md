# PROMPT: Forbidden Words Check
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: review
# CONTENT TYPE: all

## Description

Scans content against the complete HOP forbidden words list. Flags each violation with its line number and severity category. HOP uses zero forbidden words — any match is a failure.

## Input

Full content unit to check. No additional parameters needed.

## Methodology

1. Scan the entire content — body, frontmatter, alt text, meta fields — against the following forbidden list:
   - **Generic luxury descriptors:** luxury, premium, exquisite, opulent, lavish, glamorous, extravagant, plush, sumptuous
   - **Generic positive adjectives:** beautiful, stunning, gorgeous, lovely, amazing, incredible, wonderful, fabulous
   - **Urgency/scarcity:** hurry, limited edition, "only X left", "last chance", "while stocks last", "don't miss out"
   - **Exclusivity:** exclusive, "one-time", "limited time"
   - **Transactional imperatives:** "shop now", "buy now"
   - **Pricing/discount language:** sale, discount, offer, deal, "free shipping"
   - **Checkout verbs:** checkout (as verb), "add to cart"
   - **Subscription:** subscribe, "sign up"
   - **Cliché fashion phrases:** "wardrobe essential", "statement piece", "must-have", "elevate your style", "investment piece"
   - **Brand voice violations:** "artisanal craftsmanship" (as a phrase)
2. For multi-word phrases, use regex that allows flexible whitespace but not word-boundary breaks (e.g. "last chance" matches "last chance" but not "last-minute chance").
3. For single words, use word-boundary matching to avoid false positives (e.g. "premium" in "premium" but not "premiumisation" — though such coinages are also discouraged).
4. Record the exact line number and surrounding context for each match.
5. Classify severity based on the word category.

## Output Format

```yaml
total_violations: {count}
pass_fail: {pass|fail}

violations:
  - word: "{forbidden word or phrase}"
    line: {line_number}
    context: "{surrounding 50 characters}"
    severity: "{critical|important|nice-to-fix}"
    recommendation: "{suggested replacement or rewrite}"
```

## Quality Criteria for the Reviewer

- Check every field — forbidden words in frontmatter or meta fields are still violations
- Multi-word phrases must be matched as whole units; partial matches are not violations
- Case-insensitive matching — "Luxury" and "luxury" are both violations
- Plural forms of forbidden singular nouns (e.g. "luxuries") are also violations
- Verbs derived from forbidden nouns (e.g. "sale" → "selling") are violations
- Do not flag words that appear in quoted external material (e.g. a weaver quote using "beautiful") — but flag these as important notes for editorial review
- If the same word appears multiple times, list each occurrence separately with its line number

## Severity Levels

- **Critical:** Generic luxury descriptors, generic positive adjectives, urgency/scarcity phrases, transactional imperatives, pricing/discount language, checkout verbs. Must fix before publish.
- **Important:** Exclusivity language, subscription language. Should fix.
- **Nice-to-fix:** Cliché fashion phrases, brand voice violations. Should fix but lower priority.

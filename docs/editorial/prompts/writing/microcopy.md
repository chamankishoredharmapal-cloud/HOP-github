# Writing: Microcopy

**Purpose:** Generate UI microcopy — the small pieces of text that guide the user through the interface: labels, errors, empty states, tooltips, form help text.

**When to use:** Creating or updating any UI text on the HOP storefront, checkout, account pages, or studio.

**When NOT to use:** For long-form editorial content. For CTA text (use `writing/CTAs.md`). For email copy (use `writing/emails.md`).

---

## Objective

Write interface copy that is clear, warm, and consistent with HOP's voice. Microcopy is where brand personality meets functional clarity. Every label, error message, and helper text must be helpful first and on-brand second.

## Audience

A woman performing a specific task on the HOP site. She is not here to read — she is here to do. The microcopy must help her do it efficiently while maintaining the HOP feeling of quiet warmth.

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 2/5 |
| Warmth | 3/5 |
| Sensory Density | 1/5 |
| Technical Depth | 1/5 |
| Urgency | 0/5 |

**Reading level:** Grade 6

## Structure

Microcopy has no standard body structure. Each piece is a single line or short phrase. But every piece must include:

### Component Context

Identify the UI component and its state:
- Component: {name}
- State: {default | error | empty | success}
- User intent: {what is the user trying to do}

### Copy

One or two lines maximum. Short, clear, warm.

## Required Context

- The UI component's function
- The state (default, error, empty, loading, success)
- What the user is trying to do at this point

## Required References

- `docs/editorial/04-vocabulary-system/forbidden-words.md` (never use marketing language in UI)
- `docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md` (preferred commerce vocabulary)

## Formatting

- No exclamation marks
- No ALL CAPS
- No quotation marks around labels
- Periods at the end of complete sentences only
- Sentence case for labels and headings
- Direct, not deferential: "Email address" not "Please enter your email address"

## Preference Substitutions

| Instead of | Use |
|------------|-----|
| "Add to cart" | "Add to bag" |
| "Checkout" | "Complete your order" |
| "Shop now" | "Browse the collection" |
| "Subscribe" | "Follow the journal" |
| "Sign up" | (avoid) |
| "Free shipping" | "Included shipping" |
| "Customer" | "You" or (omit) |

## Acceptance Criteria

- [ ] Copy is clear — the user knows what to do
- [ ] Copy is short — no unnecessary words
- [ ] Copy is warm — never cold or corporate
- [ ] Copy uses preferred HOP vocabulary
- [ ] Error messages explain what happened and what to do next
- [ ] Empty states are helpful, not salesy
- [ ] Labels use sentence case
- [ ] Zero forbidden words

## Example Output

| Component | State | Copy |
|-----------|-------|------|
| Email input | Default | "Email address" |
| Email input | Error | "Please enter a valid email address." |
| Cart | Empty | "Your bag is quiet. Browse the collection when you are ready." |
| Search | Empty | "Search the journal, collections, and glossary." |
| Loading | Processing | "Your order is being prepared." |
| Success | Confirmation | "Your saree has been added to your bag." |

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Corporate tone | "Please provide your email address to proceed with checkout." | Simplify: "Email address" |
| Marketing in microcopy | "Sign up to get exclusive access!" | Remove. Microcopy is functional, not promotional. |
| Jargon | "SKU: HD-12345" on storefront | Use only functional labels: "Item #" or omit. |
| Pressure language | "Hurry, only 2 left!" on product page | Never use scarcity in microcopy. |

---

**Cross-reference:** `writing/CTAs.md` (for button and link copy), `writing/emails.md` (for email copy), `docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md` (vocabulary preferences)
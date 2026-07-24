# Writing: CTAs

**Purpose:** Generate call-to-action copy for buttons, links, and interactive elements across the HOP storefront.

**When to use:** Creating or updating any CTA — primary buttons, secondary links, navigation items, form submissions.

**When NOT to use:** For general microcopy (use `writing/microcopy.md`). For email CTAs (use `writing/emails.md` — CTAs within emails should follow email-specific guidelines).

---

## Objective

Write CTA copy that invites action without demanding it. HOP CTAs are gentle, specific, and warm. They never use urgency, scarcity, or aggressive marketing language.

## Audience

A woman at a specific point in her journey. The CTA must match her emotional stage:

| Stage | CTA Feeling | Example |
|-------|-------------|---------|
| Arrival/Curiosity | Invitation to explore | "Browse the collection" |
| Wonder/Trust | Invitation to learn | "Read the journal" |
| Desire | Invitation to consider | "Add to your collection" |
| Confidence | Clear next step | "Complete your order" |
| Ownership | Ceremony completion | "Confirm your order" |
| Belonging | Continue the relationship | "Read the journal" or (none) |

## Tone

| Dimension | Target |
|-----------|--------|
| Formality | 2/5 |
| Warmth | 3/5 |
| Imperative Force | 2/5 (CTAs are inherently imperative, but HOP uses gentle imperatives) |
| Urgency | 0/5 |

## Structure

Each CTA is a short phrase (2-5 words). No complete sentences. No punctuation at the end (except in form submit buttons where context may require it).

### Patterns

| Pattern | Example | When to Use |
|---------|---------|-------------|
| Verb + object | "Browse the collection" | Primary action, exploratory |
| Prepositional | "Add to your collection" | Adding items |
| Gerund | "Continue reading" | Editorial CTAs |
| Selective omit | "Your bag" | Cart/account navigation |
| Gentle imperative | "Complete your order" | Checkout flow |

## Required Context

- The page and its emotional stage
- The user's current state (browsing, considering, purchasing)
- The action the CTA triggers

## Required References

- `docs/editorial/07-emotional-architecture/page-emotion-map.md` (emotional stage for the page)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (stage-specific guidance)
- `docs/editorial/04-vocabulary-system/preferred-verbs-nouns.md` (preferred commerce vocabulary)

## Formatting

- Sentence case (not Title Case)
- No exclamation marks
- No ALL CAPS
- No quotation marks
- No punctuation at the end (except where part of a sentence)
- One CTA per page — primary only. No competing secondary CTAs.

## Preference Substitutions

| Instead of | Use |
|------------|-----|
| "Shop now" | "Browse the collection" |
| "Buy now" | "Add to your collection" |
| "Add to cart" | "Add to bag" |
| "Checkout" | "Complete your order" |
| "Subscribe" | "Follow the journal" |
| "Learn more" | "Read the story" |
| "Get started" | "Begin your visit" |
| "Shop the sale" | (never use — HOP has no sales) |
| "Donate" | (avoid — not applicable) |
| "Sign up" | (avoid — use specific action instead) |

## Acceptance Criteria

- [ ] CTA matches the page's emotional stage
- [ ] CTA uses preferred HOP vocabulary
- [ ] CTA is specific about what the user will get
- [ ] No urgency or scarcity language
- [ ] No exclamation marks
- [ ] No ALL CAPS
- [ ] Zero forbidden words
- [ ] Only one primary CTA per page

## Example Output

| Page | Emotional Stage | Primary CTA |
|------|----------------|-------------|
| Homepage | Arrival | (none — only scrolling) |
| Collection | Curiosity | "Explore Kalyani" |
| Product Detail | Desire | "Add to your collection" |
| Cart | Confidence | "Complete your order" |
| Checkout | Ownership | "Confirm your order" |
| Journal | Belonging | "Continue reading" |
| Gift | Intention | "Choose your note" |

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Aggressive CTA | "Buy now!" | Replace with: "Add to your collection" |
| Urgency | "Shop the sale — ends tonight!" | Never use. HOP does not run sales. |
| Generic CTA | "Click here" | Be specific: "Read the story" |
| Marketing cliché | "Elevate your wardrobe" | Replace with specific action: "Browse the Kalyani collection" |
| Too many CTAs | Three buttons on one page | Reduce to one primary CTA. Remove competing actions. |

---

**Cross-reference:** `writing/microcopy.md` (for non-CTA UI text), `writing/emails.md` (for CTAs within emails), `docs/editorial/06-page-strategy/README.md` (page strategy — CTA is part of the page strategy template)
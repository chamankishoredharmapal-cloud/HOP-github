# Editing: Rewrite

**Purpose:** Rewrite existing text in HOP voice. Transform generic, marketing, or off-brand copy into HOP-standard content without changing factual meaning.

**When to use:** Migrating existing copy (from previous brand iterations, competitor drafts, or non-HOP sources) into HOP voice. Also used when an AI generation misses the voice target.

**When NOT to use:** For proofreading (use `editing/proofread.md`). For luxury refinement of already-HOP copy (use `editing/luxury-tone.md`). For factual corrections (use `review/fact-checking.md` first).

---

## Purpose

Take any text — product description from a supplier, a draft from a new writer, legacy copy — and rewrite it so it sounds like HOP wrote it.

## Required Inputs

- The source text to rewrite
- The target content type (journal, product, collection, etc.)
- Any factual claims in the source that must be preserved

## Expected Outputs

- Rewritten text in HOP voice
- An edit summary listing what changed and why

## Constraints

- Preserve all factual claims. Do not change facts while changing voice.
- Preserve the source's structural logic (order of information) unless it violates HOP editorial principles.
- Do not add facts not present in the source. If the source does not name a weaver, do not invent one.
- Remove any forbidden words from the source. Replace with HOP-approved alternatives.

## Targeted Transformations

| Source Problem | HOP Edit |
|----------------|----------|
| "Our premium silk saree" | "A Mulberry silk saree, handwoven in Molakalmuru" |
| "Beautiful wedding collection" | (Remove "beautiful." Describe what makes it for weddings.) |
| "Limited edition — only a few left" | (Remove urgency entirely. If the batch is small, state the batch size factually.) |
| "Elevate your style with this statement piece" | "This drape belongs to winter ceremonies where the light fades by five." |
| "Expertly crafted by skilled artisans" | "Woven by Gangamma, on a loom her grandmother used." |

## Examples

**Source:** "This stunning saree is crafted from premium quality silk and features exquisite zari work. It's perfect for weddings and special occasions. Limited stock available — order now!"

**Rewrite:** "This saree is woven from pure Mulberry silk with hand-spun zari. The temple border carries a pattern that Gangamma learned from her grandmother. It belongs to weddings — the ones where the whole family gathers after years."

**Edit summary:**
- Removed "stunning," "premium quality," "exquisite" (forbidden generic praise)
- Removed "Limited stock available — order now!" (urgency never used)
- Replaced "crafted from" with "woven from" (preferred active verb)
- Replaced "perfect for" with "belongs to" (preferred framing)
- Added weaver name and generational detail (specificity principle)
- Added specific occasion context (human-scale principle)

## Common Mistakes

| Mistake | Correction |
|---------|------------|
| Preserving generic language | Every generic word must be replaced or the sentence rewritten. |
| Adding facts not in source | Do not fabricate. If the source lacks specificity, note it as a gap rather than inventing. |
| Changing sentence rhythm | HOP voice has a specific rhythm (short → medium → long → short). Restructure sentences to match. |
| Keeping forbidden words | Scan the rewrite for any remaining forbidden words. Zero tolerance. |

---

**Cross-reference:** `system/master-system-prompt.md` (voice reference), `system/writing-principles.md` (sentence construction), `editing/luxury-tone.md` (related refinement)
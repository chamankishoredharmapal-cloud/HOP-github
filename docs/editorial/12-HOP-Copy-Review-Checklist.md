---
status: Production
last_updated: July 2026
---

# 12-HOP-Copy-Review-Checklist

This is the final editorial QA system for House of Padmavati. Every page, component, and piece of content must pass this checklist before publication. 

*Cross-reference:* [01-HOP-Voice-Bible](01-HOP-Voice-Bible.md), [03-HOP-Language-Audit](03-HOP-Language-Audit.md), [05-HOP-Editorial-Style-Guide](05-HOP-Editorial-Style-Guide.md), [page-emotion-map.md](../07-emotional-architecture/page-emotion-map.md).

## 1. Clarity
- [ ] Every sentence communicates one idea.
- [ ] No sentence requires re-reading to understand.
- [ ] No jargon without explanation (e.g., "jamdani" explained on first use).
- [ ] Reading level matches page type (Grade 7-9 per Voice Bible).
- [ ] All CTAs have clear, unambiguous outcomes.
- [ ] Nouns and verbs are concrete, not abstract.
- [ ] Transitions between ideas are logical and smooth.
- [ ] Ambiguous pronouns (it, this, they) have clear antecedents.
- [ ] No double negatives.

## 2. Consistency
- [ ] Voice matches [01-HOP-Voice-Bible.md](01-HOP-Voice-Bible.md) for this page type.
- [ ] Tone dimensions match the Tone Matrix (formality, warmth, sensory density).
- [ ] Indian English spelling used throughout (e.g., colour, centre).
- [ ] Capitalisation follows [05-HOP-Editorial-Style-Guide.md](05-HOP-Editorial-Style-Guide.md).
- [ ] Brand name is "House of Padmavati" (never HOP on storefront).
- [ ] The names of the weavers, collections, and techniques are spelt consistently.
- [ ] Formatting of prices (e.g., ₹25,000) is consistent with the style guide.
- [ ] Date and time formats adhere to standard House style.
- [ ] Hyphenation of compound adjectives is applied uniformly.

## 3. Accessibility
- [ ] All images have descriptive alt text (or empty `alt=""` for purely decorative images).
- [ ] ARIA labels are clear, functional, and accurately describe the interactive element.
- [ ] Text meets minimum contrast requirements (WCAG 2.1 AA).
- [ ] Reading order is logical for screen readers.
- [ ] No information conveyed solely through colour or spatial placement.
- [ ] Link text makes sense out of context (no "click here").
- [ ] Form fields have explicitly associated `<label>` elements.
- [ ] Abbreviations are expanded upon first use.

## 4. SEO
- [ ] Title tag is present, unique, and within 50-60 characters.
- [ ] Meta description is present, compelling, and within 150-160 characters.
- [ ] Single `H1` per page containing the primary keyword.
- [ ] Heading hierarchy is logical and sequential (`H1` → `H2` → `H3`).
- [ ] Images have SEO-relevant, descriptive file names (lowercase, hyphen-separated).
- [ ] Internal links use descriptive anchor text relevant to the destination.
- [ ] URL slugs are clean, readable, and hyphen-separated.
- [ ] Schema markup (where applicable) aligns with on-page content.

## 5. Grammar
- [ ] Oxford comma used in all lists (three or more items).
- [ ] Em dashes are spaced ( — ).
- [ ] Curly quotes and apostrophes used (never straight).
- [ ] No exclamation marks anywhere.
- [ ] Active voice preferred throughout (unless passive deliberately serves the narrative).
- [ ] Subject-verb agreement is correct, especially with collective nouns.
- [ ] Modifiers are placed next to the words they modify.
- [ ] Parallel structure maintained in bulleted lists and series.

## 6. Tone
- [ ] No urgency language (hurry, limited, last chance).
- [ ] No self-praise (luxury, premium, exquisite).
- [ ] No commanding imperatives (buy now, shop now).
- [ ] Warmth level appropriate for page type (e.g., higher warmth on 'Our Story').
- [ ] Sensory density appropriate for page type (e.g., higher on product pages).
- [ ] Avoids clinical or transactional vocabulary (e.g., use "acquire" or "choose", not "purchase").
- [ ] The tone feels quiet and unhurried.
- [ ] Never asks direct questions of the reader.

## 7. Redundancy
- [ ] No idea is repeated within the same page.
- [ ] No word is used more than twice in a paragraph.
- [ ] No section duplicates content from another section.
- [ ] Empty intensifiers removed (very, really, truly, absolutely).
- [ ] Tautologies removed (e.g., "added bonus", "future plans").
- [ ] "That" removed where the sentence works without it.
- [ ] Adverbs that duplicate the verb's meaning removed.

## 8. Reading Flow
- [ ] Opening sentence is short and declarative.
- [ ] Sentence rhythm varies (short-medium-long pattern).
- [ ] Paragraphs are 2-4 sentences.
- [ ] Transitions between sections are smooth and intentional.
- [ ] Closing sentence resolves (not a fade or a question).
- [ ] No paragraph starts with the same word as the previous one.
- [ ] Information flows from familiar/given context to new information.
- [ ] Avoids stacking multiple prepositional phrases.

## 9. Brand Alignment
- [ ] Content serves at least one messaging pillar (Heritage, Craft, Quietness, Continuance, Intention).
- [ ] Content aligns with the emotional outcome for this page (per [page-emotion-map.md](../07-emotional-architecture/page-emotion-map.md)).
- [ ] No forbidden words or phrases (per [03-HOP-Language-Audit.md](03-HOP-Language-Audit.md)).
- [ ] Pronouns follow convention (we/our for house, you/your for reader, she/her for the wearer).
- [ ] Content passes the 'would HOP say this?' test (reserved, warm, knowledgeable, discerning, gentle).
- [ ] The weaver is named and honoured where their work is showcased.
- [ ] Focus remains on the cloth, the craft, or the woman—not on marketing.
- [ ] Discounts, sales, or trend-focused concepts are completely absent.

## 10. Scannability
- [ ] Headlines are meaningful without reading body text.
- [ ] Key information is front-loaded in paragraphs.
- [ ] Lists are used where appropriate (for materials, dimensions, care).
- [ ] White space is sufficient (Jasmine Mist philosophy).
- [ ] Bullet points start with parallel grammatical structures.
- [ ] Bold text is used sparingly and only for vital information.
- [ ] Paragraphs are visibly distinct with appropriate spacing.

## 11. Information Hierarchy
- [ ] Most important information appears first.
- [ ] System 1 (emotional) content precedes System 2 (rational) details.
- [ ] Technical details are in accordion/on-demand, not inline.
- [ ] One primary CTA per page section.
- [ ] Secondary actions are visually subordinated to the primary CTA.
- [ ] The progression of information maps to the Emotional Arc (Arrival → Curiosity → Wonder → Trust, etc.).
- [ ] Navigation elements do not compete with primary content.

## 12. Microcopy
- [ ] Button text is action-oriented, specific, and warm ("Add to bag", "View collection").
- [ ] Form labels are clear and descriptive.
- [ ] Error messages are helpful, specific, and take the blame ("We couldn't find a postal code matching...").
- [ ] Empty states provide gentle guidance and a next step.
- [ ] Success messages confirm, reassure, and tell the user what happens next.
- [ ] Placeholder text is helpful but not essential for completing the form.
- [ ] Loading states explain what is happening (e.g., "Preparing your order").
- [ ] Tooltips are brief and provide necessary context, not vital information.

## 13. UX
- [ ] Labels match their destinations exactly.
- [ ] Information needed for decisions is present (dimensions, care, origin).
- [ ] No dead ends (every page has a clear next step).
- [ ] Mobile text is appropriately sized and readable without zooming.
- [ ] Tap targets on mobile are appropriately sized and spaced.
- [ ] Content layout supports the natural eye path (F-pattern or Z-pattern).
- [ ] Loading times are not exacerbated by heavy, unoptimised copy.

## 14. Trust
- [ ] Claims are specific and verifiable (e.g., "Woven by Master Weaver Srinivas").
- [ ] Pricing is transparent (no hidden costs, no surprise shipping fees).
- [ ] Policies (Returns, Shipping, Care) are linked and accessible.
- [ ] Contact information is readily available.
- [ ] No manipulative patterns (dark patterns, urgency, FOMO).
- [ ] Guarantees or promises are stated plainly without fine-print caveats.
- [ ] Imagery aligns honestly with the text describing it.
- [ ] Testimonials (if used) are authentic, specific, and attributable.

## 15. Final Approval Gates
- **Gate 1: Writer self-review** (all checks above completed).
- **Gate 2: Peer review** (editorial team member verifies clarity, flow, and grammar).
- **Gate 3: Brand review** (editorial lead confirms brand alignment and messaging pillars).
- **Gate 4: Technical review** (developer confirms implementation accuracy, accessibility, SEO).
- **Gate 5: Accessibility review** (meets WCAG 2.1 AA standards).

**Pass/Fail Criteria:**
- **Pass:** 100% of applicable checks are marked "Yes". No forbidden words. No urgency.
- **Fail:** Any check marked "No", or any presence of forbidden words. Must be sent back to Gate 1.

**Escalation Process:**
- Disputes regarding Brand Alignment (Gate 3) are escalated to the Brand Director.
- Disputes regarding Technical or Accessibility (Gates 4/5) are escalated to the Lead Developer.

**Review Timeline:**
- Allow 48 hours for Gates 1-3.
- Allow 24 hours for Gates 4-5.
- Total QA SLA: 3 working days from submission to publication.

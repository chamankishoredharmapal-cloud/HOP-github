# Writing: Emails

**Purpose:** Generate email copy for all HOP email touchpoints — welcome, order confirmation, dispatch, delivery, journal notification.

**When to use:** Creating or updating any HOP email copy.

**When NOT to use:** For in-site microcopy (use `writing/microcopy.md`). For CTA copy that appears in emails (use `writing/CTAs.md` for those specific elements).

---

## Objective

Write email copy that feels personal, warm, and intentional. Every email must read like a letter from the house, not a marketing automation. Emails serve the Ownership, Belonging, and Trust stages of the emotional journey.

## Audience

A woman who has a relationship with HOP — she has visited, subscribed, or purchased. The relationship determines the warmth and content depth.

## Tone

| Email Type | Formality | Warmth | Sensory Density | Technical Depth | Urgency |
|------------|-----------|--------|-----------------|-----------------|---------|
| Welcome | 2/5 | 5/5 | 3/5 | 1/5 | 0/5 |
| Order Confirmation | 2/5 | 5/5 | 3/5 | 1/5 | 0/5 |
| Dispatch Notification | 2/5 | 4/5 | 1/5 | 2/5 | 1/5 |
| Delivery Confirmation | 2/5 | 5/5 | 3/5 | 1/5 | 0/5 |
| Journal Notification | 3/5 | 4/5 | 4/5 | 1/5 | 0/5 |

**Reading level:** Grade 7 (except Journal Notification: Grade 8)

## Structure

### Frontmatter (in the email system, not markdown frontmatter)

```
Subject: {≤60 characters, HOP voice}
Preview: {≤90 characters, HOP voice}
```

### Welcome Email

- Thank the reader for choosing to follow the journal
- Set expectations: no spam, no pressure, only the journal and new collections
- No incentive (no discount code, no free shipping)
- Warm, welcoming, brief

### Order Confirmation

- Confirm the order as a ceremony, not a transaction
- Describe the wrapping process (jasmine paper, cotton ribbon, keepsake card)
- Provide clear order details (order number, items, dispatch estimate)
- Warm, celebratory, specific

### Dispatch Notification

- The saree is on its way
- Tracking information (functional, clearly presented)
- Brief, warm, efficient

### Delivery Confirmation

- She has received it. Welcome to the quiet house.
- Invite her to share her experience (personal invitation, not a review request)
- Care reminder (brief, gentle)
- Warmest email in the sequence

### Journal Notification

- New article notification
- Article title, dek, and a brief personal note from the house
- No CTA to buy. Only the invitation to read.

## Required Context

- Recipient name and relationship with HOP
- Order details (for order-related emails)
- Article details (for journal notification)
- Any personalisation available

## Required References

- `docs/editorial/07-emotional-architecture/page-emotion-map.md` (email rows)
- `docs/editorial/07-emotional-architecture/emotional-journey.md` (relevant emotional stages)
- `system/writing-principles.md` (sentence construction, restraint)

## Formatting

- No exclamation marks in any email
- Subject lines are not clickbait
- No urgency language ("limited time," "don't miss out")
- No upsells or cross-sells in transactional emails
- HTML formatting is clean, minimal, text-heavy
- Signature: "— House of Padmavati" (with em dash)

## Acceptance Criteria

- [ ] Each email serves its specific emotional stage
- [ ] No two emails in the sequence use the same opening line
- [ ] Subject lines are descriptive, not promotional
- [ ] Transactional emails include all necessary functional information
- [ ] Welcome email sets expectations without making promises
- [ ] Delivery confirmation invites sharing without demanding it
- [ ] Journal notification is an invitation to read, not to buy
- [ ] Zero forbidden words

## Failure Cases

| Failure | Symptom | Correction |
|---------|---------|------------|
| Transactional tone | "Your order #12345 has been confirmed." | Lead with warmth: "Your saree is being wrapped. A note is being written." |
| Pressure in welcome | "Shop now and get 10% off your first order." | Remove. HOP never offers discounts. Welcome is a relationship, not a conversion. |
| Upsells in confirmation | "You might also like..." | Remove. This is a moment of ceremony, not commerce. |
| Generic subject line | "Your order update" | Be specific and warm: "Your Kalyani saree is on its way." |

---

**Cross-reference:** `writing/CTAs.md` (for email CTA copy), `writing/seo-copy.md` (not applicable — emails are not SEO content), `docs/editorial/07-emotional-architecture/page-emotion-map.md` (email emotion map)
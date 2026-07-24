# Page Emotion Map

Every page on House of Padmavati serves a specific emotional purpose. This document maps each page to its primary emotion, secondary emotion, and the emotional role it plays in the customer journey.

## Public Storefront Pages

| # | Page | Route | Primary Emotion | Secondary Emotion | Emotional Purpose | Emotional Stage |
|---|------|-------|-----------------|-------------------|-------------------|-----------------|
| 1 | Homepage | `/` | Calm | Curiosity | Welcome the visitor into a quiet space. Signal that this is not an ecommerce store. | Arrival → Curiosity |
| 2 | Collections | `/collections` | Wonder | Desire | Present the five collections as a curated universe. Each collection is an invitation to explore. | Curiosity → Wonder |
| 3 | Collection Detail | `/collections/:slug` | Focus | Confidence | Guide the woman through a specific collection. Help her understand its character and find her saree. | Curiosity → Confidence |
| 4 | Product Detail | `/product/:productId` | Desire | Trust | Create virtual possession through sensory language. Provide System 2 information to remove friction. | Desire → Confidence |
| 5 | Cart | `/cart` | Anticipation | Satisfaction | Confirm the woman's choices. Create anticipation for what is to come. No urgency, no doubt. | Confidence → Ownership |
| 6 | Checkout | `/checkout` | Confidence | Safety | Make the transaction feel secure and intentional. Remove every point of friction. | Confidence → Ownership |
| 7 | Order Confirmation | `/order/confirmation/:orderNumber` | Joy | Belonging | Celebrate the purchase as a ceremony, not a transaction. Warm, personal, grateful. | Ownership → Belonging |
| 8 | Journal | `/journal` | Contemplation | Curiosity | Offer a space for slow reading. Each article is an invitation to think, not to buy. | Trust → Belonging |
| 9 | Journal Article | `/journal/:slug` | Insight | Connection | Deepen the reader's understanding of craft, culture, and the house philosophy. | Trust → Belonging |
| 10 | About (Our Story) | `/about` | Reverence | Belonging | Tell the origin story. Establish why HOP exists. Invite the reader to share the values. | Trust → Belonging |
| 11 | Customer Care | `/customer-care` | Safety | Gratitude | Demonstrate that the house is run by real people who respond personally. | Trust |
| 12 | Gift | `/gift` | Intention | Generosity | Frame gifting as a ceremony of intention. Every detail matters — the note, the wrap, the card. | Legacy |
| 13 | Wishlist | `/wishlist` | Aspiration | Patience | A holding space for future choices. Not urgency — anticipation of a future self. | Legacy |
| 14 | Privacy Policy | `/privacy-policy` | Trust | Safety | Demonstrate that customer data is handled with respect. Plain language, no legalese. | Trust |
| 15 | Terms of Service | `/terms-of-service` | Trust | Safety | Fair, transparent terms. Written to be read and understood, not to hide behind. | Trust |

## Static Pages

| # | Page | Route | Primary Emotion | Secondary Emotion | Emotional Purpose | Emotional Stage |
|---|------|-------|-----------------|-------------------|-------------------|-----------------|
| 16 | NotFound | `*` | Calm | Curiosity | A 404 page that does not frustrate. Gently guides the woman back to where she belongs. | Arrival |

## Account Pages (Authenticated)

| # | Page | Route | Primary Emotion | Secondary Emotion | Emotional Purpose | Emotional Stage |
|---|------|-------|-----------------|-------------------|-------------------|-----------------|
| 17 | Account Dashboard | `/account` | Belonging | Confidence | A personal space that reflects her relationship with the house. | Belonging |
| 18 | Account Profile | `/account/profile` | Trust | Satisfaction | Manage her information with transparency. No hidden data use. | Trust |
| 19 | Account Addresses | `/account/addresses` | Trust | Satisfaction | Same. |
| 20 | Account Orders | `/account/orders` | Pride | Anticipation | Her history with the house. Each order is a memory. | Ownership → Legacy |
| 21 | Account Order Detail | `/account/orders/:id` | Pride | Trust | Her saree's journey. Tracking is truth. | Ownership → Trust |
| 22 | Account Wishlist | `/account/wishlist` | Aspiration | Patience | Her future self's sarees. No urgency, only possibility. | Legacy |

## Email Touchpoints

| # | Email | Primary Emotion | Secondary Emotion | Emotional Purpose | Emotional Stage |
|---|-------|-----------------|-------------------|-------------------|-----------------|
| 23 | Welcome Email | Belonging | Calm | Welcome her to the quiet house. Set expectations: no spam, no pressure, only the journal and new collections. | Belonging |
| 24 | Order Confirmation | Joy | Anticipation | Confirm the order as a ceremony. Describe the wrapping, the note, the care that will go into her package. | Ownership |
| 25 | Dispatch Notification | Anticipation | Trust | The saree is on its way. Tracking is transparency. | Ownership → Trust |
| 26 | Delivery Confirmation | Joy | Belonging | She has received it. Welcome to the quiet house. Invite her to share her experience (not a review request — a personal invitation). | Belonging |
| 27 | Journal Notification | Curiosity | Contemplation | A new article. An invitation to read, not to buy. | Trust → Belonging |

## Emotional Profile by Page Type

### Transactional Pages (Cart, Checkout, Confirmation)

```
Emotional goal: Move from desire to confidence to joy with zero friction.
Tone: Warm but clear. Personal but efficient.
Risk: Too cold (feels like a machine) or too warm (feels insincere in a transactional moment).
```

### Informational Pages (Journal, About, Customer Care)

```
Emotional goal: Build trust through knowledge and transparency.
Tone: Warm, reflective, educational.
Risk: Too dense (overwhelms the reader) or too shallow (feels like marketing).
```

### Product Pages (Collections, Category, Product Detail)

```
Emotional goal: Create virtual possession through sensory immersion.
Tone: Sensory, specific, aspirational.
Risk: Too salesy (breaks the spell) or too vague (does not create enough desire).
```

### Utility Pages (Policies, NotFound)

```
Emotional goal: Demonstrate respect for the reader through clarity and honesty.
Tone: Direct, clear, warm-but-functional.
Risk: Too legal (alienates) or too casual (undermines trust).
```

## Emotional Journey by User Type

### First-Time Visitor

```
Arrival → Curiosity → Wonder
Stops at: Trust or Desire (may not buy on first visit — this is expected)
```

### Returning Browser

```
Arrival → Curiosity → Desire → Confidence
May proceed to Ownership or save for later (Wishlist)
```

### Intentional Buyer

```
Desire → Confidence → Ownership → Belonging
Moves through checkout efficiently. Post-purchase: Legacy.
```

### Gift Giver

```
Intention → Generosity → Trust → Ownership
More focused on the presentation and meaning than the product specifications.
```

### Journal Reader

```
Curiosity → Contemplation → Trust → Belonging
May never buy. The journal is a gift to the reader regardless of purchase intent.
```

## Usage Notes

1. **Use this map before writing.** Identify the primary emotion for the page you are writing. Every sentence should serve that emotion.

2. **Use this map during review.** When reviewing a page, check: does this page create the intended primary emotion? If a sentence creates the wrong emotion, remove it.

3. **The secondary emotion is a support, not a competitor.** The secondary emotion should reinforce the primary, not distract from it. For example, on Product Detail, Trust supports Desire — it does not replace it.

4. **Emotional stage determines content depth.** Pages in the Arrival and Curiosity stages should be lighter, more visual, less text-heavy. Pages in the Trust and Desire stages can carry more content.

5. **Transactional pages should minimize emotion.** Cart and Checkout serve Confidence and Safety. Extraneous emotional language at these stages creates friction, not connection.

6. **Post-purchase pages should maximize warmth.** Order Confirmation and follow-up emails are the peak warmth moments. The reader is most open to connection immediately after purchase.

---

**Cross-reference:** `emotional-journey.md` (detailed description of each emotional stage), `emotional-principles.md` (principles that govern emotional design), `messaging-pillars.md` (which pillars support which emotions)

**Last updated:** July 2026

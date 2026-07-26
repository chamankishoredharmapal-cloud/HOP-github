# 04. Content Architecture

**Status:** Production  
**Last Updated:** July 2026

## Document Purpose
This document defines the structural architecture of the House of Padmavati digital experience. It maps every page, content type, block type, and their interrelationships, ensuring the editorial vision scales across the entire platform.

---

## 1. Page Architectures

Every page in the HOP experience is designed with a specific emotional outcome and reading flow. 

### 1.1 Homepage (`/`)
- **Purpose:** To welcome the visitor into the world of House of Padmavati with quietness and space.
- **Primary user goal:** Understand who we are and what we make.
- **Secondary user goal:** Discover a specific collection or story.
- **Required sections:** 
  1. Hero (Silent, atmospheric video setting the mood)
  2. Collection Stage (Alternating films introducing collections)
  3. Craft Section (Grounded in technique and making)
  4. Heirlooms/Testimonials (Stories of the cloth outliving its maker)
  5. Journal Preview (Recent editorial dispatches)
  6. Footer (Quiet utility)
- **Section hierarchy:** Hero > Collection Stage > Craft > Journal > Heirlooms > Footer
- **Content hierarchy:** Visual atmosphere first, contextual narrative second, specific offerings third.
- **Reading flow:** Breathe (Hero) → Observe (Stage) → Understand (Craft) → Reflect (Heirlooms) → Explore (Journal).
- **Emotional outcome:** Calm. A slowing of the pulse.
- **Success criteria:** Dwell time > 90 seconds, low immediate bounce rate, navigation to deeper pages.

### 1.2 Collections Index (`/collections`)
- **Purpose:** To present the five permanent collections of the House.
- **Primary user goal:** Understand the breadth of our work.
- **Secondary user goal:** Select a collection to explore.
- **Required sections:**
  1. Hero Statement (Philosophy of our collections)
  2. The Five Pillars (Kalyani, Viara, Arya, Padma, Spandana) - Large imagery, brief evocative copy.
- **Section hierarchy:** Hero > Kalyani > Viara > Arya > Padma > Spandana
- **Content hierarchy:** Collection name, one-sentence philosophy, atmospheric visual, gentle invitation to explore.
- **Reading flow:** Linear scrolling through distinct emotional territories.
- **Emotional outcome:** Wonder.
- **Success criteria:** High click-through rate to specific collections.

### 1.3 Collection Detail (`/collections/:slug`)
- **Purpose:** To immerse the visitor in the specific emotional and material landscape of one collection.
- **Primary user goal:** Browse the sarees within a specific narrative context.
- **Secondary user goal:** Learn the story behind this specific body of work.
- **Required sections:**
  1. Hero (Atmospheric visual, collection name, establishing thought)
  2. Editorial Narrative (2-3 paragraphs defining the collection's soul)
  3. Product Grid (The sarees themselves, presented quietly)
- **Optional sections:** Weaver spotlight, technique deep-dive.
- **Section hierarchy:** Hero > Narrative > Product Grid > Weaver Spotlight
- **Content hierarchy:** Mood, meaning, manifestation (products).
- **Reading flow:** Immerse (Hero) → Absorb (Narrative) → Evaluate (Grid).
- **Emotional outcome:** Focus.
- **Success criteria:** Product page views, add to bag events.

### 1.4 Product Detail (`/product/:productId`)
- **Purpose:** To present a single saree with reverence, transparency, and specific detail.
- **Primary user goal:** Evaluate the saree for purchase.
- **Secondary user goal:** Understand its origin and care requirements.
- **Required sections:**
  1. Gallery (Uncluttered, high-resolution imagery)
  2. Product Info (Name, material, dimensions, price - no urgency)
  3. Editorial Story (The specific narrative of this piece)
  4. The Weave Accordion (Technical details, weaver name, origin)
  5. Care Accordion (How to tend to the cloth)
  6. Related Products (Subtle suggestions)
- **Section hierarchy:** Gallery + Info (Above fold) > Story > Accordions > Related
- **Content hierarchy:** Visuals > Essential Specs > Narrative > Technical Details.
- **Reading flow:** See (Gallery) → Know (Info) → Feel (Story) → Trust (Accordions).
- **Emotional outcome:** Desire.
- **Success criteria:** Add to bag, Wishlist adds, low return rate due to accurate expectations.

### 1.5 About / Our Story (`/about`)
- **Purpose:** To articulate the philosophy, origin, and intentions of the House.
- **Primary user goal:** Understand the brand's values and history.
- **Secondary user goal:** Connect with the people behind the craft.
- **Required sections:**
  1. Page Header (Simple, grounded title)
  2. Image/Text Block (The origin of the name Padmavati)
  3. The Coastal Blossom (Our design philosophy)
  4. What We Hold To (Our core tenets/promises)
- **Section hierarchy:** Header > Origin > Philosophy > Tenets
- **Content hierarchy:** The Woman (Padmavati) > The Approach (Philosophy) > The Rules (Tenets).
- **Reading flow:** Story → Concept → Commitment.
- **Emotional outcome:** Reverence.
- **Success criteria:** High completion rate (scrolling to bottom), increased conversion rate for users who visit this page.

### 1.6 Journal Index (`/journal`)
- **Purpose:** To house the editorial voice and long-form explorations of the House.
- **Primary user goal:** Browse articles, dispatches, and field notes.
- **Secondary user goal:** Find specific topics (craft, culture, care).
- **Required sections:**
  1. Header (The purpose of the Journal)
  2. Featured Story (Large format)
  3. Chronological Feed or Categorized Grid (The archive)
- **Section hierarchy:** Header > Featured > Feed
- **Content hierarchy:** Image, Title, Excerpt, Date.
- **Reading flow:** Scan → Select.
- **Emotional outcome:** Contemplation.
- **Success criteria:** Article views, newsletter signups.

### 1.7 Journal Article (`/journal/:slug`)
- **Purpose:** To tell a specific, focused story with depth and restraint.
- **Primary user goal:** Read and absorb the content.
- **Secondary user goal:** Discover related products or stories.
- **Required sections:**
  1. Header (Title, subtitle, date, author/category)
  2. Body Content (Text, inline images, pull quotes)
  3. Closure (Author bio or gentle sign-off)
  4. Related Reading/Products
- **Section hierarchy:** Header > Body > Closure > Related
- **Content hierarchy:** Narrative > Media > Context > Extensions.
- **Reading flow:** Linear, immersive reading.
- **Emotional outcome:** Insight.
- **Success criteria:** Time on page, scroll depth, social sharing (if enabled).

### 1.8 Customer Care (`/customer-care`)
- **Purpose:** To provide support with the same warmth and dignity as the rest of the House.
- **Primary user goal:** Find an answer to a question or resolve an issue.
- **Secondary user goal:** Contact the House.
- **Required sections:**
  1. Page Header ("How may we assist you?")
  2. Quiet Correspondence (FAQs grouped logically)
  3. Saree Care (Dedicated section on preservation)
  4. Write to the House (Contact form)
- **Section hierarchy:** Header > FAQs > Care > Contact
- **Content hierarchy:** Most common queries > specialized knowledge > direct communication.
- **Reading flow:** Scan categories → Read specific answer → Contact if needed.
- **Emotional outcome:** Safety.
- **Success criteria:** Low contact rate for basic queries, positive resolution feedback.

### 1.9 Cart (`/cart`)
- **Purpose:** To review selections before commitment, without pressure.
- **Primary user goal:** Review items, quantities, and total.
- **Secondary user goal:** Proceed to checkout or return to browsing.
- **Required sections:** Line items, subtotal, gentle 'proceed' action.
- **Reading flow:** Review → Confirm.
- **Emotional outcome:** Anticipation.
- **Success criteria:** High progression to checkout.

### 1.10 Checkout (`/checkout`)
- **Purpose:** To facilitate a calm, secure, and clear transaction.
- **Primary user goal:** Complete the purchase smoothly.
- **Required sections:** Contact, Shipping, Payment, Order Review.
- **Reading flow:** Linear, step-by-step progression.
- **Emotional outcome:** Confidence.
- **Success criteria:** Low cart abandonment rate at this stage.

### 1.11 Order Confirmation (`/order/confirmation/:orderNumber`)
- **Purpose:** To affirm the wearer's choice and set expectations for arrival.
- **Primary user goal:** Verify the order was successful.
- **Required sections:** Gratitude message, order number, summary, next steps (what happens now).
- **Reading flow:** Reassurance → Details.
- **Emotional outcome:** Joy.
- **Success criteria:** Low immediate customer service inquiries regarding order status.

### 1.12 Authentication (Login/Register)
- **Purpose:** To welcome a returning patron or invite a new one.
- **Primary user goal:** Access their account.
- **Required sections:** Clean forms, clear error states, gentle copy ("Welcome back").
- **Reading flow:** Input → Submit.
- **Emotional outcome:** Welcome.
- **Success criteria:** Successful authentication.

### 1.13 Account Pages (Dashboard, Profile, Orders, Wishlist, Addresses)
- **Purpose:** To provide a private, organized space for the patron's history with the House.
- **Primary user goal:** Manage their relationship with HOP.
- **Required sections:** Navigation, specific contextual data (order history, etc.).
- **Reading flow:** Tabular/list scanning.
- **Emotional outcome:** Belonging.
- **Success criteria:** Successful self-service management.

### 1.14 Gift (`/gift`)
- **Purpose:** To facilitate the thoughtful gifting of a saree.
- **Primary user goal:** Purchase a gift card or gift-wrapped item with a note.
- **Required sections:** Explanation of the gifting experience, selection tools, personal note field.
- **Reading flow:** Concept → Selection → Personalization.
- **Emotional outcome:** Intention.
- **Success criteria:** Gift card sales, use of the gift note feature.

### 1.15 Wishlist (`/wishlist`)
- **Purpose:** To hold items the patron is considering for the future.
- **Primary user goal:** Save and review desired pieces.
- **Required sections:** Grid of saved items, ability to move to cart.
- **Reading flow:** Review → Decide.
- **Emotional outcome:** Aspiration.
- **Success criteria:** Conversion from wishlist over time.

### 1.16 Policy Pages (Privacy, Terms, Shipping, Returns)
- **Purpose:** To state the legal and operational boundaries clearly and respectfully.
- **Primary user goal:** Understand their rights and our obligations.
- **Required sections:** Clear, structured text.
- **Reading flow:** Scanning for specific clauses.
- **Emotional outcome:** Trust.
- **Success criteria:** Clarity, reduced legal/policy inquiries.

### 1.17 404 Not Found
- **Purpose:** To gently guide a lost visitor back to the path.
- **Primary user goal:** Find their way to relevant content.
- **Required sections:** Apology/explanation, links to Home, Collections, Journal.
- **Reading flow:** Acknowledgment → Redirection.
- **Emotional outcome:** Calm (diffusing frustration).

---

## 2. Content Types Registry

This defines the structured data models for the CMS to ensure editorial consistency.

| Content Type | Schema Summary | Purpose |
| :--- | :--- | :--- |
| **Collection** | Title, Subtitle, Description, Hero Media, Featured Products, Mood Images | Defines a permanent body of work. |
| **Product** | Name, Price, Collection Ref, Materials, Origin, Weaver Name, Narrative, Tech Specs, Care Info, Gallery | A specific, purchasable artifact. |
| **Journal Article** | Title, Date, Author, Category, Cover Image, Body (Rich Text), Related Items | Standard editorial piece. |
| **Craft Note** | Technique Name, Origin Region, Historical Context, Process Steps, Video/Images | Educational content on weaving methods. |
| **Weaver Portrait** | Name, Location, Years Weaving, Speciality, Quote, Portrait Image | Humanizing the makers. |
| **Field Note** | Location, Date, Observations, Raw Imagery | Short, sensory dispatches from the looms. |
| **House Letter** | Date, Subject, Body | Direct communication from the founders. |
| **Ritual Guide** | Title, Steps, Required Items, Outcome | E.g., "How to fold a Kanjeevaram." |
| **Glossary Entry** | Term, Pronunciation, Definition, Contextual Usage | Defining our vocabulary (e.g., *Pallu*, *Zari*). |

---

## 3. Content Block Types

These are the modular pieces used to build pages (especially Journal and About pages).

- **Hero:** Full-bleed or large image/video with minimal text overlay. Sets the tone.
- **Intro:** Larger typographic block for opening thoughts. Max 3 sentences.
- **Body:** Standard paragraph text. Governed by Voice Bible rules (12-18 word sentences).
- **Pull Quote:** Large, evocative text extracted from the body. Used for pacing and visual breaks.
- **Image (Single):** Standard inline image with optional caption.
- **Image (Diptych):** Two images side-by-side. Useful for showing contrast or detail next to wide shots.
- **System 2 (Technical Details):** Structured, rational presentation of facts (measurements, materials).
- **Closure:** A quiet end to a page. A gentle sign-off or a subtle directional link. No aggressive CTAs.

---

## 4. Content Relationships

The CMS must support these relational links to weave the digital experience together seamlessly:

- **Collection → Product:** 1:Many (A collection holds many sarees).
- **Collection → Craft Note:** 1:Many (A collection utilizes specific techniques).
- **Journal → Collection:** Many:Many (An article may reference multiple collections, a collection may be discussed in many articles).
- **Product → Weaver Portrait:** Many:1 (Many products may be made by one named weaver).
- **Product → Glossary:** Automatic linking of defined terms within product descriptions.

---

## 5. Metadata Standards

To ensure our quiet voice extends to search engines and social sharing.

- **SEO Titles:** Specific, clean. Format: `Page Name — House of Padmavati`. Never use keyword stuffing.
  - *Example:* `Kalyani Collection — House of Padmavati`
- **Meta Descriptions:** 150 characters max. Complete sentences. Descriptive, not promotional.
  - *Example:* `Explore the Kalyani collection. Handwoven silks from Kanchipuram, characterized by deep jewel tones and traditional korvai borders.`
- **OG Tags (Social):**
  - Image: High-resolution, uncropped, no text overlays.
  - Title: Same as SEO Title.
  - Description: Same as Meta Description.

---

## 6. Cross-Reference Rules

When creating content, authors must refer to:
- **Tone & Style:** [Voice Bible](../02-brand-architecture/voice-bible.md)
- **Vocabulary:** [Approved Words](../04-vocabulary-system/approved-words.md) & [Forbidden Words](../04-vocabulary-system/forbidden-words.md)
- **Grammar:** [Grammar and Usage](../04-vocabulary-system/grammar-and-usage.md)
- **Emotional Targeting:** [Page Emotion Map](../07-emotional-architecture/page-emotion-map.md)
- **Detailed Specs:** [Homepage (06)](06-HOP-Homepage.md) to [Customer Care (11)](11-HOP-Customer-Care.md)

---

## 7. Content Lifecycle

1. **Draft:** Content is written, focusing on sensory details and specificity. Placeholders used for missing facts (which must be resolved before moving forward).
2. **Review:** Checked against the Voice Bible and Forbidden Words list. Fact-checked (weaver names, techniques).
3. **Published:** Live on the site.
4. **Archived:** Removed from index but accessible via direct link (for sold-out products or old journal entries, maintaining the historical record). We do not delete history.

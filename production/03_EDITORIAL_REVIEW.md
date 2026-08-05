---
title: "03_EDITORIAL_REVIEW"
project: "House of Padmavati"
version: "1.0.0"
status: "Active"
category: "Production Operations"
severity: "HIGH"
---

# 03 Editorial Review

## 1. Purpose
The purpose of this Standard Operating Procedure (SOP) is to establish the definitive guidelines and systematic audit process for all written content across the House of Padmavati (HOP) digital platform. This document ensures that every word reflects the brand's quiet authority, restraint, and timeless elegance, while maintaining rigorous standards for clarity, grammatical precision, and cultural reverence.

## 2. Scope
This procedure applies to all textual elements present within the House of Padmavati digital experience, including but not limited to:
- Static page copy (Home, About, Heritage, Collections)
- Dynamic product descriptions and metadata
- Microcopy (Navigation, Buttons, CTAs, Form labels, Placeholders)
- System messaging (Error states, Toast notifications, Validation messages)
- Editorial content (Journal entries, Lookbooks, Campaigns)
- Technical SEO elements (Title tags, Meta descriptions, Alt text)
- Legal and policy documentation (Terms, Privacy, Shipping, Returns)
- Transactional flows (Cart, Checkout, Account creation, Order confirmation)

## 3. Objectives
- Establish and enforce a unified Brand Voice characterized by quiet authority and emotional intelligence.
- Standardize grammar, spelling, and punctuation using British English conventions.
- Prevent the publication of culturally insensitive or historically inaccurate content regarding Indian craftsmanship.
- Ensure consistent use of brand-specific terminology (e.g., "saree" over "sari", "house" over "brand").
- Verify that readability aligns with a highly discerning luxury audience—sophisticated but never pretentious.
- Eliminate all instances of prohibited, sales-driven, or hyperbolic language.

## 4. Definitions
- **Voice**: The underlying personality of House of Padmavati (timeless, authoritative, elegant).
- **Tone**: The modulation of the Voice depending on context (e.g., reassuring in checkout, evocative in Journal).
- **Microcopy**: Small pieces of text that guide users through the interface (buttons, hints, errors).
- **Alt Text**: Descriptive text applied to images for accessibility and context.
- **House**: The preferred term for the House of Padmavati entity; never referred to as a "brand" or "company".
- **Patron**: The preferred term for customers or clients.
- **Artisan**: The preferred term for the creators of our pieces; avoiding "worker" or "manufacturer".

## 5. Roles & Responsibilities

| Role | Responsibilities |
| :--- | :--- |
| **Lead Copywriter** | Authors primary content, ensures adherence to voice guidelines. |
| **Editorial Director** | Conducts final review of narrative content, oversees cultural sensitivity. |
| **UX Writer** | Crafts and audits microcopy, error messages, and transactional flows. |
| **Localization Expert** | Verifies British English spelling and regional nuances. |
| **Cultural Consultant** | Reviews references to traditional weaves, motifs, and historical context. |
| **QA Engineer** | Verifies implementation of approved copy in the staging and production environments. |

## 6. Prerequisites
- Final, approved wireframes and UI designs in Figma.
- Complete content matrices or Content Management System (CMS) access (Supabase).
- Access to the staging environment (e.g., `https://staging.houseofpadmavati.com`).
- A comprehensive list of all system-generated messages.
- Understanding of the Brand Philosophy: "Excellence will never be sacrificed for growth."

## 7. Inputs
- Draft copy documents (Word/Google Docs).
- Extracted JSON files containing UI strings.
- Supabase database dumps of product catalog text.
- Proposed meta data spreadsheets.
- Translated/Localized text assets.

## 8. Outputs
- Fully audited and approved copy ready for production deployment.
- Editorial Audit Report detailing corrections and refinements.
- Updated Brand Lexicon / Terminology Guide.
- Logged Jira tickets for any text bugs found in the UI.

## 9. Dependencies
- Must follow the completion of `02_UI_UX_REVIEW.md`.
- Required prior to executing `04_CONTENT_REVIEW.md` (which focuses on asset integration) and `06_ACCESSIBILITY_AUDIT.md`.

## 10. Execution Order
1. Foundational Standards Review (Voice, Tone, Grammar, Terminology).
2. Global Navigation and Taxonomy Audit.
3. Macro Copy Review (Pages, Journal, Legal).
4. Product Catalog Copy Review.
5. Microcopy and System Messaging Audit.
6. Technical and SEO Copy Review.
7. Final Sign-off.

---

## 11. Core Editorial Standards

### 11.1 Brand Voice and Tone Guidelines
House of Padmavati speaks with quiet authority, restraint, and timelessness. 
- **Quiet Authority**: We do not shout. We do not use exclamation marks to generate artificial excitement. We state facts about our craftsmanship with profound confidence.
- **Restraint**: Less is always more. If a sentence can be cut without losing meaning or emotion, it must be cut. We allow the work to speak for itself.
- **Timelessness**: Avoid trendy vernacular, internet slang, or time-bound phrases (e.g., "Hottest new drop", "This season's must-have"). Speak as though the text will be read a century from now.
- **Emotional Intelligence**: Acknowledge the patron's discernment. Do not talk down, but do not obfuscate with overly complex vocabulary.

### 11.2 Grammar, Punctuation, and Spelling Standards
House of Padmavati strictly adheres to **British English** spelling and grammar conventions.
- **Spelling**: Use -ise instead of -ize (e.g., *realise*, *organise*). Use -our instead of -or (e.g., *colour*, *honour*). Use -re instead of -er (e.g., *centre*, *theatre*).
- **Oxford Comma**: The Oxford comma is mandatory in all lists of three or more items to ensure clarity. (e.g., "Silk, zari, and cotton.")
- **Capitalisation**: Use Sentence case for headings and titles unless specifically dictated otherwise by the UI design system. Never use ALL CAPS for emphasis within body text.
- **Em Dashes**: Use the em dash (—) without spaces for parenthetical thoughts. (e.g., "The warp—spun by hand—requires immense patience.")
- **Numbers**: Spell out numbers one through ten. Use numerals for 11 and above. Always use numerals for measurements (e.g., 6 yards).

### 11.3 Terminology and Consistency
To maintain the illusion and reality of luxury, specific terms must be used uniformly.
- **Saree**: Never *Sari*.
- **The House**: Never *the brand*, *the company*, or *the business*.
- **Patron**: Never *customer*, *consumer*, *shopper*, or *user* (except in internal UX documentation).
- **Creation / Piece**: Never *product*, *item*, or *merchandise* (except in technical schemas).
- **Artisan**: Never *worker*, *employee*, or *maker*.
- **Atelier**: Never *factory* or *workshop*.
- **Bespoke / Commission**: Never *custom order*.

### 11.4 Prohibited Words and Phrases
The following words indicate a mass-market approach and are strictly forbidden:
- "Sale", "Discount", "Clearance", "Promo", "Deal"
- "Must-have", "Trendy", "Fashionable", "Stylish"
- "Buy now", "Hurry", "Limited time only"
- "Affordable", "Cheap", "Value"
- "Innovative" (unless specifically referring to a technical weaving advancement)
- "Disruptive", "Game-changer"

### 11.5 Cultural Sensitivity Review
As a house rooted in Indian heritage, absolute reverence for cultural origins is non-negotiable.
- Ensure accurate naming of traditional motifs (e.g., *kalka*, *rudraksha*, *yali*).
- Verify historical origins of weaving techniques (e.g., Kanjeevaram, Banarasi, Jamdani). Do not appropriate or misattribute regional crafts.
- Avoid treating sacred motifs purely as aesthetic design elements without acknowledging their significance.
- The Cultural Consultant must sign off on any text describing temple borders, religious iconography, or ceremonial usage.

### 11.6 Readability Standards
- Target a reading level of early university (Grade 12 to 14).
- The audience is sophisticated but not pretentious. Use precise vocabulary, not obscure jargon for the sake of it.
- Keep paragraphs short (maximum 4-5 sentences) to accommodate digital reading habits, especially on mobile devices.

---

## 12. Detailed Step-by-Step Procedures

### Phase 1: Global Navigation and Taxonomy
1. **Review Main Navigation**: Verify that all top-level links (Collections, Heritage, Journal, Appointments) adhere to the agreed nomenclature.
2. **Review Footer Links**: Ensure all utilitarian links (Legal, Care, Contact) are clearly labeled and concise.
3. **Verify Category Names**: Confirm that product categories use the correct terminology (e.g., "Bridal Trousseau", "Everyday Silk").
4. **Breadcrumbs**: Check that breadcrumb trails are logical, properly capitalized, and accurately reflect the site hierarchy.

### Phase 2: Page-by-Page Editorial Audit
For every core page (Index, Collections, Category, ProductDetail, Cart, Checkout, OrderConfirmation, Wishlist, Gift, Lookbook, Journal, Appointments, About, Account, Campaigns), execute the following:
1. **Read Aloud**: The auditor shall read the page copy aloud to detect clunky phrasing, poor rhythm, or unnatural tone.
2. **Check Headlines**: Verify that H1s and H2s are compelling, clear, and in Sentence case.
3. **Body Copy Scan**: Review for adherence to British English spelling and grammar rules.
4. **Remove Fluff**: Identify and remove any hyperbolic adjectives or unnecessary intensifiers (e.g., "very", "extremely", "absolutely").
5. **Verify Formatting**: Ensure bolding and italics are used sparingly and intentionally.

### Phase 3: Product Description Standards
Luxury product descriptions must balance romance with technical precision.
1. **Title**: Must be concise and descriptive (e.g., "The Midnight Zari Kanjeevaram").
2. **The Narrative**: A short, evocative paragraph detailing the inspiration or the feeling of the piece. (e.g., "Woven under the monsoon sky, this piece reflects...")
3. **The Craft**: A precise explanation of the technique, origin, and hours required.
4. **The Details**: Bulleted list of factual information (fabric, length, blouse piece inclusion, care instructions).
5. **Audit Action**: The auditor shall review a random sample of 20% of product descriptions to ensure this structure is strictly followed.

### Phase 4: Microcopy and System Messaging
1. **Button and CTA Text**:
    - Must be actionable but polite.
    - Acceptable: "Add to Bag", "Reserve Appointment", "Discover More", "Complete Commission".
    - Unacceptable: "Buy Now", "Click Here", "Submit".
2. **Form Labels and Placeholders**:
    - Labels must be clear (e.g., "Email Address").
    - Placeholders should demonstrate format without being condescending (e.g., "name@domain.com").
3. **Error Messages**:
    - Must not blame the user. Must provide a clear path to resolution.
    - Unacceptable: "Invalid email! You typed it wrong."
    - Acceptable: "Please enter a valid email address to continue."
    - 404 Page (NotFound): Must be gracious. (e.g., "We cannot find the page you are seeking. Please return to the homepage or contact our concierges for assistance.")
4. **Toast/Notification Messages**:
    - Keep brief and reassuring. (e.g., "Added to your wishlist.", "Your appointment has been reserved.")

### Phase 5: Legal Page Review
1. **Review Documents**: Read the Privacy Policy, Terms of Service, Returns Policy, and Shipping Policy.
2. **Tone Check**: While these are legal documents, they must still reflect the House's respect for the patron. Avoid overly aggressive legalese where plain, polite English suffices.
3. **Formatting**: Ensure excellent readability with clear headings, bullet points, and sufficient spacing. No impenetrable walls of text.
4. **Accuracy**: Verify that the Returns and Shipping policies accurately reflect current operational capabilities (e.g., timelines, bespoke exclusions).

### Phase 6: Technical and SEO Copy
1. **Meta Descriptions**:
    - Must be between 120-155 characters.
    - Must accurately describe the page content in the brand voice.
    - Cannot sound like a keyword-stuffed robot.
2. **Title Tags**:
    - Format: `[Page Name] | House of Padmavati` (e.g., `Bridal Collections | House of Padmavati`).
3. **Alt Text for Accessibility**:
    - Must describe the image factually for screen readers.
    - Example: "A close-up of a teal silk saree showing intricate gold zari floral motifs on the border."
    - Avoid: "Picture of a saree" or keyword stuffing.

### Phase 7: Journal and Editorial Content
1. **Narrative Arc**: Ensure long-form content has a clear structure and purpose.
2. **Fact-Checking**: All historical, cultural, or technical claims regarding weaving must be verified by the Cultural Consultant.
3. **Authoritative Tone**: The journal is the voice of the House's expertise. It should read like a high-end editorial magazine (e.g., *Kinfolk*, *Cereal*).

---

## 13. Validation Steps
1. **Automated Spell Check**: Run the entire codebase / CMS export through a British English spell-checker.
2. **Manual Peer Review**: A secondary editor must read through the primary editor's approved copy.
3. **In-Situ Review**: Review the copy as it appears in the staging environment (browser), not just in a text document, to ensure context and line-breaking are appropriate.
4. **Screen Reader Test**: Listen to Alt Text using VoiceOver or NVDA to ensure descriptions make sense auditorily.

---

## 14. Checklists

### Pre-Audit Checklist
- [ ] Brand Voice and Terminology Guide distributed to all reviewers.
- [ ] CMS access granted to the editorial team.
- [ ] Staging environment is stable and mirrors production content.
- [ ] List of all system states and error messages compiled.

### Page Audit Checklist
- [ ] Index (Home) reviewed.
- [ ] Collections & Category pages reviewed.
- [ ] ProductDetail (Sample set) reviewed.
- [ ] Cart & Checkout flows reviewed.
- [ ] OrderConfirmation reviewed.
- [ ] Wishlist & Gift pages reviewed.
- [ ] Lookbook & Journal reviewed.
- [ ] Appointments reviewed.
- [ ] About & Heritage reviewed.
- [ ] Account management pages reviewed.
- [ ] Campaigns reviewed.
- [ ] Privacy/Terms/Shipping/Returns policies reviewed.
- [ ] NotFound (404) page reviewed.

### Microcopy Checklist
- [ ] All CTAs are polite and actionable.
- [ ] Form placeholders are helpful and correctly formatted.
- [ ] Error messages do not blame the patron.
- [ ] Success toasts are understated.
- [ ] No prohibited words found across the site.

---

## 15. Pass / Fail Criteria
- **Pass**: Zero spelling errors. 100% adherence to British English. Zero instances of prohibited words. All cultural references verified and accurate. Tone is consistently authoritative and restrained.
- **Fail**: Presence of typos, American spellings (e.g., "color", "customize"), use of mass-market terminology ("Sale", "Buy Now"), culturally inaccurate descriptions, or jarring tone shifts.

## 16. Acceptance Criteria
The editorial review is considered complete when the Editorial Director signs off on the full site copy, and all QA tickets related to text changes have been merged into the `main` branch.

## 17. Quality Gates
1. **Copywriter Handoff**: Initial draft completed and spell-checked.
2. **Editorial Review**: Tone, voice, and structural review.
3. **Cultural Audit**: Verification of traditional/historical references.
4. **UX Integration**: Copy reviewed in the staging UI.

## 18. Evidence Required
- A completed, signed-off version of this document's checklists.
- A PDF export or link to the final Editorial Audit Report.
- Screenshots of corrected error messages in the staging environment.

## 19. Documentation Requirements
- All changes to the core brand lexicon must be updated in the centralized `Brand_Guidelines.pdf` or equivalent Notion workspace.
- Specific phrasing decisions regarding complex cultural terms must be documented for future reference.

## 20. Common Failure Scenarios
- **The "Lorem Ipsum" Leak**: Placeholder text left in edge-case UI states (e.g., empty cart, account creation error).
- **Inconsistent Capitalization**: Buttons using Title Case ("Add To Bag") while others use Sentence Case ("Add to bag").
- **Americanisms Slipping In**: Developers or external tools defaulting to US spelling.
- **Over-written Alt Text**: Alt text that tries to be poetic rather than descriptive, hindering accessibility.

## 21. Troubleshooting
- **Issue**: Disagreement on tone for a specific page.
  **Resolution**: Revert to the core brand pillars (Quiet authority, restraint). Ask: "Is this how a century-old luxury house would say it?" If unsure, simplify.
- **Issue**: CMS truncating long product titles.
  **Resolution**: UX Writer must collaborate with the Frontend team to adjust CSS line-clamping or rewrite the title to fit within constraints without losing elegance.
- **Issue**: Dynamic data inserting poor grammar (e.g., "You have 1 items in your bag").
  **Resolution**: Ensure developers implement proper pluralization logic in the frontend code.

## 22. Best Practices
- **Read it out loud.** This is the single most effective way to catch awkward phrasing.
- **Context is everything.** Never approve microcopy from a spreadsheet without seeing where it lives on the screen.
- **Keep a running list.** If you find yourself correcting the same word repeatedly, add it to the global prohibited words list.

## 23. Standards
- adherence to the Oxford English Dictionary (OED) for spelling baselines.
- W3C Web Content Accessibility Guidelines (WCAG) 2.1 Level AA for Alt Text descriptiveness.

## 24. Review Process
1. UX Writer conducts the first pass in staging.
2. Lead Copywriter reviews for brand voice.
3. Cultural Consultant reviews specific product/heritage pages.
4. Editorial Director provides final approval.

## 25. Sign-off Requirements
- Name and Date of Lead Copywriter approval.
- Name and Date of Cultural Consultant approval.
- Name and Date of Editorial Director approval.

## 26. Completion Criteria
The SOP is complete when all text on the staging environment exactly matches the approved editorial standards, zero spelling/grammar errors remain, and the staging environment is approved for production deployment from an editorial standpoint.

## 27. References
- → See `02_UI_UX_REVIEW.md` for layout and typographic hierarchy context.
- → See `04_CONTENT_REVIEW.md` for image and video asset alignment.
- → See `06_ACCESSIBILITY_AUDIT.md` for deeper details on screen reader compliance and ARIA labels.
- → See `11_ECOMMERCE_AUDIT.md` for validation of the checkout copy flow.

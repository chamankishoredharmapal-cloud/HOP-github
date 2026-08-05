# 05_BRAND_REVIEW

## 1. Purpose
The purpose of this Standard Operating Procedure (SOP) is to define the exact processes, criteria, and standards for conducting a comprehensive Brand Review of the House of Padmavati (HOP) digital platform. This document ensures that every digital touchpoint faithfully embodies the brand's philosophy of uncompromising handcrafted luxury, cultural authenticity, and quiet elegance.

## 2. Scope
This brand review encompasses all user-facing interfaces, assets, and copy on the HOP platform, including but not limited to:
- Brand identity elements (logos, watermarks, monograms).
- Typographic hierarchy (Cormorant Garamond, Inter, Vonca Regular).
- Color palette implementation (jasmine, teal, sand, sakura, ink, crimson, warm-white).
- Photographic art direction and presentation.
- Iconography (Lucide React implementation).
- Tone of voice and copywriting.
- Digital representations of physical brand assets (packaging, unboxing).
- Visual hierarchy, whitespace usage, and rhythmic pacing of content.

This SOP applies to all phases of development, from initial design handoff to pre-launch verification and post-launch audits.

## 3. Objectives
- Ensure strict adherence to the HOP Brand Context document.
- Prevent brand dilution by enforcing luxury positioning standards.
- Maintain visual and tonal consistency across all pages and interactive states.
- Guarantee that Indian craftsmanship is portrayed with profound dignity and respect, avoiding exoticism or mass-market tropes.
- Verify that the brand promise ("Excellence will never be sacrificed for growth") is palpable in the user experience.

## 4. Definitions
- **Quiet Elegance:** A design approach that prioritizes subtlety, high-quality materials (or digital equivalents like high-res imagery and smooth interactions), and restrained use of ornamentation.
- **Cultural Authenticity:** Accurate, respectful representation of Indian heritage, avoiding superficial stereotypes.
- **Visual Rhythm:** The intentional spacing and pacing of elements on a page to create a deliberate, unhurried reading and browsing experience.
- **Anti-Pattern:** A design or copy decision that contradicts the brand philosophy (e.g., aggressive sales tactics, cluttered layouts).

## 5. Roles & Responsibilities
| Role | Responsibility |
| :--- | :--- |
| **Brand Director** | Ultimate approver of brand compliance; signs off on final audit. |
| **Lead Designer** | Executes the visual review; verifies typography, color, and layout fidelity. |
| **Copywriter / Editor** | Reviews all text for tone of voice and narrative consistency. |
| **QA Engineer** | Verifies technical implementation of brand assets (e.g., SVGs, font loading). |

## 6. Prerequisites
- Access to the latest HOP Brand Context document.
- Staging environment deployed with production-ready assets.
- Complete set of brand assets (logos, fonts, design tokens).
- Cross-browser testing environment configured.

## 7. Inputs
- `00_MASTER_EXECUTION_PLAN.md` (for scheduling context).
- Figma design files (final approved versions).
- Content matrix and copy decks.
- Staging URL.

## 8. Outputs
- Completed Brand Compliance Audit Report.
- Logged Jira/Linear tickets for any brand violations.
- Signed-off `05_BRAND_REVIEW.md` checklist.

## 9. Dependencies
- → See `02_UI_UX_REVIEW.md` (must be completed prior).
- → See `03_EDITORIAL_REVIEW.md` (must be completed prior).
- → See `04_CONTENT_REVIEW.md` (must be completed prior).

## 10. Execution Order
1. Foundational Asset Verification (Logo, Color, Typography).
2. Visual Language & Imagery Audit (Photography, Iconography, Hierarchy).
3. Tone of Voice & Narrative Review.
4. Experience & Positioning Check.
5. Anti-Pattern Sweep.

## 11. Phases / Stages

### Phase 1: Foundational Asset Verification
Focuses on the immutable building blocks of the brand identity.

### Phase 2: Visual Language & Imagery Audit
Evaluates the emotional resonance and quality of the visual components.

### Phase 3: Tone of Voice & Narrative Review
Ensures the written word aligns with the brand's persona.

### Phase 4: Experience & Positioning Check
Verifies that the sum of the parts creates a genuinely luxurious experience.

### Phase 5: Anti-Pattern Sweep
A final check against known violations of the HOP brand ethos.

## 12. Detailed Step-by-Step Procedures

### 12.1 Logo Usage and Placement
1. **Primary Logo Verification:** Inspect the header on all core pages (Index, Collections, Category, ProductDetail, Cart, Checkout).
2. **Clear Space:** Measure the padding around the logo. Ensure it meets the minimum clear space requirements defined in the brand guidelines (usually 2x the height of the logomark).
3. **Responsive Behavior:** Verify that the logo scales elegantly on mobile devices without becoming illegible.
4. **Contrast:** Ensure the logo maintains strict contrast ratios against all backgrounds (e.g., ink logo on sand background, warm-white logo on teal background).
5. **No Distortion:** Check CSS to ensure the logo is never stretched, squashed, or altered in aspect ratio.

### 12.2 Color Palette Compliance
The platform must strictly use the predefined HSL design tokens.
1. **Token Usage:** Inspect the CSS/Tailwind configuration to confirm ONLY the following brand colors are used:
    - **Jasmine:** Subtle accents, highlight states.
    - **Teal:** Deep, rich backgrounds, primary brand moments.
    - **Sand:** Primary background for content areas, providing warmth.
    - **Sakura:** Soft background variations, delicate highlights.
    - **Ink:** Primary text color, dark backgrounds.
    - **Crimson:** Specific calls to action, error states (muted), profound accents.
    - **Warm-White:** Secondary backgrounds, high-contrast text on dark backgrounds.
2. **Hex/RGB Ban:** Run a code search to ensure no hardcoded Hex or RGB values exist in the stylesheets outside of the core token definitions.
3. **Harmony:** Review pages to ensure colors are paired correctly (e.g., avoiding jarring contrast, maintaining the muted, earthy luxury feel).

### 12.3 Typography Compliance
1. **Font Loading:** Verify that all three brand fonts are loading correctly and efficiently.
    - **Cormorant Garamond:** Primary serif, used for long-form editorial, product descriptions, and formal headers.
    - **Inter:** Secondary sans-serif, used for UI elements, utility text, metadata, and fine print.
    - **Vonca Regular:** Display serif, reserved EXCLUSIVELY for high-impact hero headlines, collection titles, and primary brand moments.
2. **Hierarchy:** Inspect `h1` through `h6` tags. Ensure consistent application of font families, weights, and letter-spacing (tracking).
3. **Kerning/Tracking:** Verify that display type (Vonca) has appropriate tracking applied, especially in all-caps scenarios if applicable.
4. **Line Height (Leading):** Ensure long-form text (Cormorant Garamond) has a line height of at least 1.5 to 1.6 for optimal readability and a relaxed, luxurious pacing.

### 12.4 Photography Style Compliance
1. **Art Direction:** Review all hero images, product shots, and editorial imagery. They must evoke handcrafted luxury.
2. **Lighting:** Look for soft, natural lighting, deep shadows, and rich textures. Reject any images that look over-lit, flat, or "stock-like."
3. **Focus:** Ensure images highlight the intricate details of the sarees (zari work, weaving patterns) with sharp focus.
4. **Consistency:** Verify that product grid images have a consistent background (e.g., warm-white or sand) and consistent cropping.
5. **No Mass-Market Tropes:** Reject images with aggressive drop shadows, artificial reflections, or cluttered compositions.

### 12.5 Iconography Consistency
1. **Library Verification:** Confirm that ONLY `lucide-react` icons are used across the platform.
2. **Stroke Weight:** Ensure all icons are configured with a consistent `strokeWidth` (typically 1 or 1.5 for a delicate, refined look).
3. **Sizing:** Icons must be sized consistently relative to the text they accompany (e.g., 16px icons with 16px text).
4. **Color:** Icons must inherit the appropriate text color (usually Ink or Warm-White) and never use off-brand colors.

### 12.6 Tone of Voice Compliance
1. **Editorial Review:** Read through key pages (About, Journal, Product Descriptions).
2. **Persona Check:** The tone must be knowledgeable, respectful, passionate about craft, and quietly confident.
3. **Pacing:** Sentences should be well-crafted, avoiding breathless excitement or overly urgent language.
4. **Vocabulary:** Ensure the use of precise terminology regarding Indian textiles and craftsmanship.

### 12.7 Visual Hierarchy and Spacing Standards
1. **Whitespace (Negative Space):** Luxury is often defined by space. Verify generous use of padding and margin, especially around hero elements, product details, and typography.
2. **Grid Alignment:** Inspect layouts to ensure strict adherence to the underlying grid system.
3. **Rhythm:** Scroll through long pages (like Lookbook or Journal). The spacing between sections should feel deliberate and consistent, creating a comfortable reading rhythm.

### 12.8 Cultural Authenticity Verification
1. **Respectful Portrayal:** Ensure that artisans and traditional techniques are presented with deep respect, acknowledging their expertise and heritage.
2. **Avoiding Exoticism:** Reject any copy or imagery that leans into tired stereotypes, overly mystical tropes, or superficial representations of Indian culture.
3. **Accuracy:** Verify that regional styles, weaving techniques, and historical references are entirely accurate.

### 12.9 Packaging and Unboxing Experience (Digital)
1. **Representation:** If the digital platform features imagery or descriptions of the physical packaging, ensure it matches the physical reality (e.g., bespoke boxes, tissue paper, personalized notes).
2. **Expectation Setting:** The digital experience of placing an order and receiving confirmation must foreshadow the physical unboxing experience—meticulous, personalized, and premium.

### 12.10 Social Proof and Testimonials
1. **Curation:** Testimonials must be carefully selected. They should highlight the quality, craftsmanship, and emotional resonance of the product, not just "fast shipping."
2. **Presentation:** Display social proof elegantly. Avoid flashy badge graphics, generic star ratings (unless highly styled), or intrusive pop-ups. Use clean typography and ample whitespace.

## 13. Validation Steps
1. Execute the checklist in Section 14 for every core page template.
2. Use browser developer tools to inspect typography and color values.
3. Capture screenshots of any discrepancies.
4. Conduct a side-by-side comparison of the staging environment against the Figma designs and the Brand Context document.

## 14. Checklists

### 14.1 Foundational Assets
- [ ] Primary logo is used correctly in the header on all pages.
- [ ] Logo clear space requirements are met.
- [ ] Only HSL design tokens are used for colors.
- [ ] No hardcoded Hex/RGB values exist in the codebase.
- [ ] Cormorant Garamond is used for primary serif text.
- [ ] Inter is used for UI and secondary text.
- [ ] Vonca Regular is used exclusively for high-impact display headers.

### 14.2 Imagery & Visuals
- [ ] Photography reflects handcrafted luxury and quiet elegance.
- [ ] Image lighting is natural, rich, and textural.
- [ ] Product grid images have consistent backgrounds and cropping.
- [ ] Lucide React icons are used exclusively.
- [ ] Icon stroke weights are consistent across the platform.
- [ ] Generous whitespace is utilized to create visual breathing room.

### 14.3 Narrative & Positioning
- [ ] Tone of voice is quietly confident, respectful, and knowledgeable.
- [ ] Indian craftsmanship is portrayed with dignity and authenticity.
- [ ] No exoticizing language or imagery is present.
- [ ] Digital representation of packaging reflects the premium physical experience.
- [ ] Social proof is presented elegantly and focuses on product quality.

### 14.4 Anti-Patterns Check
- [ ] NO aggressive sales tactics (e.g., "Hurry, only 1 left!", countdown timers).
- [ ] NO generic, stock-like photography.
- [ ] NO cluttered layouts or cramped typography.
- [ ] NO deviation from the core brand color palette.
- [ ] NO intrusive, unstyled pop-ups or banners.
- [ ] NO UI elements that feel "cheap" or poorly constructed.
- [ ] NO generic fashion e-commerce templates; the site must feel distinct to HOP.

## 15. Pass / Fail Criteria
- **Pass:** Zero violations of foundational assets (Logo, Color, Typography) AND zero instances of Anti-Patterns. Minor spacing or copy issues may exist but must be ticketed for resolution before launch.
- **Fail:** Any deviation from the defined color palette, typography rules, logo usage, or the presence of any Anti-Patterns. Any portrayal of culture that fails the authenticity check.

## 16. Acceptance Criteria
- All items in Section 14 are checked.
- All non-blocking issues are logged in the bug tracker.
- Brand Director provides explicit written sign-off.

## 17. Quality Gates
- **Gate 1:** Automated CSS linting passes (ensuring no hardcoded colors).
- **Gate 2:** Lead Designer signs off on visual fidelity.
- **Gate 3:** Brand Director signs off on overall positioning and tone.

## 18. Evidence Required
- Links to staging environment.
- Screenshots documenting key brand moments (Hero sections, Product pages).
- Screenshots of identified violations (if any).
- A completed copy of this document with checkboxes filled.

## 19. Documentation Requirements
- All findings must be documented in `15_BUG_TRACKER.md`.
- Severe brand violations must be flagged immediately in project communication channels.

## 20. Common Failure Scenarios
- **Font Fallbacks:** Web fonts fail to load, resulting in system fonts that destroy the luxury aesthetic.
- **Color Inconsistency:** A developer introduces a slightly off-brand hex code for a button hover state.
- **Aggressive Copy:** Marketing introduces urgency-driven copy (e.g., "Sale Ends Soon!") that violates the quiet elegance ethos.
- **Image Compression:** Images are overly compressed, resulting in artifacts that ruin the perception of quality.

## 21. Troubleshooting
- **Fonts not rendering:** Check CORS policies, font file paths, and `@font-face` declarations.
- **Colors appearing incorrect:** Verify monitor calibration and check for conflicting CSS rules or dark mode overrides that haven't been styled for the brand.

## 22. Best Practices
- **Design in the Browser:** While Figma is the source of truth, typography and spacing often need subtle adjustments in the browser to achieve true elegance.
- **Read Aloud:** Read copy aloud to test the rhythm and tone. It should sound like a knowledgeable artisan speaking to a respected patron.
- **Less is More:** When in doubt about a design element, remove it. Luxury thrives on restraint.

## 23. Standards
- All typography must adhere to WCAG AA contrast standards, balanced against brand aesthetic requirements (e.g., using Warm-White on Teal ensures readability while maintaining brand identity).
- All visual assets must be optimized for performance without sacrificing perceived quality.

## 24. Review Process
1. Internal review by Lead Designer.
2. Content review by Copywriter.
3. Final comprehensive review by Brand Director.

## 25. Sign-off Requirements
- Name: ___________________________
- Title: ___________________________
- Date: ___________________________
- Signature: _______________________

## 26. Completion Criteria
- This document is fully executed.
- All high and medium severity brand violations are resolved.
- Sign-off is obtained.
- The platform is deemed fundamentally aligned with the House of Padmavati brand philosophy.

---
title: Content Review Standard Operating Procedure
document_id: SOP-PRD-04
version: 1.0.0
status: ACTIVE
owner: Content Strategy Team
last_updated: 2026-08-05
---

# 04 CONTENT REVIEW

## 1. Purpose
The purpose of this document is to define the standard operating procedure for the Content Review at House of Padmavati (HOP). This review ensures the completeness, accuracy, and structural integrity of all content across the e-commerce platform. While the Editorial Review (→ See `03_EDITORIAL_REVIEW.md`) focuses on tone, voice, and stylistic expression, the Content Review ensures that all required information is present, factual, properly formatted, and correctly mapped within the platform's architecture.

## 2. Scope
This procedure applies to all digital content within the HOP platform, including but not limited to:
- Product Catalog Data (Titles, descriptions, metadata, specifications)
- Image Assets (Resolution, aspect ratios, file types, alternate text)
- Collection & Category Taxonomy
- Pricing, Inventory, and Availability Data
- Auxiliary Content (Lookbooks, Journal, Campaigns, About, Appointments, Gifting)
- Functional Content (Policies, FAQs, Shipping, Returns, Contact Information)
- Cross-sell and Product Recommendations

## 3. Objectives
- To verify that every product listing contains all mandatory data fields required for a luxury e-commerce experience.
- To ensure image assets meet the exact specifications for resolution, quality, and consistency.
- To confirm the accuracy of pricing, inventory status, and transactional information.
- To validate the completeness and factual correctness of brand narrative pages (Craft, Heritage, etc.).
- To prevent any incomplete, inaccurate, or unstructured content from reaching the production environment.

## 4. Definitions
- **Content Completeness**: The presence of all required data fields and assets for a given entity (e.g., a product must have at least 4 images, a description, fabric details, etc.).
- **Taxonomy**: The hierarchical structure used to categorize products (e.g., Sarees > Handwoven > Kanjivaram).
- **Asset Specifications**: The defined technical parameters for digital media (e.g., 2000x3000px for primary product imagery).
- **Cross-sell**: Recommended items that complement the current product being viewed.
- **PIM**: Product Information Management system (within Supabase for HOP).

## 5. Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Content Strategist | Orchestrates the review, validates taxonomy, and oversees the complete audit process. |
| Catalog Manager | Verifies product data, inventory counts, pricing accuracy, and category mappings. |
| Digital Asset Manager | Audits all imagery, videos, and media for resolution, format, and consistency. |
| E-commerce Manager | Reviews functional content (shipping, returns, policies, FAQs, contact info). |
| SEO Specialist | Ensures all content meets structural requirements for search visibility (metatags, alt text). |
| QA Engineer | Assists in validating that content renders correctly on the frontend without missing data errors. |

## 6. Prerequisites
- All content for the current release cycle has been uploaded to the staging environment (Supabase staging database).
- UI/UX Review (→ See `02_UI_UX_REVIEW.md`) is complete.
- Editorial Review (→ See `03_EDITORIAL_REVIEW.md`) is complete or running concurrently.
- Access to the HOP PIM dashboard, staging frontend, and analytics/SEO tools.
- Master Product Data Sheet (or equivalent inventory export) is available for reconciliation.

## 7. Inputs
- Staging Environment URL (e.g., `https://staging.houseofpadmavati.com`).
- Master Product Data Sheet (CSV/Excel).
- Image Asset Library Guidelines.
- Brand Policy Documentation (Shipping rates, return policies, contact details).
- Campaign and Lookbook Asset Manifests.

## 8. Outputs
- Content Audit Report detailing missing or inaccurate data fields.
- Image Asset Defect List (images requiring replacement, resizing, or retagging).
- Taxonomy Correction Requests.
- Final Content Sign-off Certificate.

## 9. Dependencies
- Dependent on the completion of initial content entry into the CMS/PIM.
- Must be completed before the SEO Audit (→ See `09_SEO_AUDIT.md`) and Accessibility Audit (→ See `06_ACCESSIBILITY_AUDIT.md`) as content structure impacts those areas.
- Required before final Production Readiness (→ See `16_PRODUCTION_READINESS.md`).

## 10. Execution Order
1. Platform-wide Functional Content Audit.
2. Taxonomy and Navigation Structure Review.
3. Product Catalog Completeness Audit.
4. Image Asset Audit.
5. Brand & Narrative Content Review.
6. Validation and Defect Resolution.
7. Final Sign-off.

## 11. Phases / Stages

### Phase 1: Functional and Policy Content Review
Reviewing the static, transactional, and customer service information to ensure legal and operational accuracy.

### Phase 2: Structural and Taxonomy Review
Validating the categories, collections, and overall site architecture to ensure logical navigation.

### Phase 3: Catalog & Asset Audit
The most intensive phase, ensuring every product and its associated media meets the luxury standard.

### Phase 4: Narrative & Campaign Audit
Reviewing the storytelling elements (Journal, Lookbooks, About pages) for completeness.

## 12. Detailed Step-by-Step Procedures

### Step 1: Functional Content & Policies
The E-commerce Manager shall verify the following content areas on staging:
1.  **Shipping Information**:
    -   Navigate to `/shipping`.
    -   Verify that all domestic and international shipping rates are accurate.
    -   Confirm delivery timeframes are stated correctly (e.g., 3-5 days domestic, 7-14 days international).
    -   Check that duty/tax responsibilities for international orders are clearly defined.
2.  **Return & Exchange Policy**:
    -   Navigate to `/returns`.
    -   Verify the return window (e.g., 14 days) is accurately stated.
    -   Confirm the condition requirements for returns (unworn, tags attached).
    -   Check the procedure for initiating a return.
3.  **FAQ Content**:
    -   Navigate to `/faq`.
    -   Review all questions and answers for factual accuracy.
    -   Ensure contact information within FAQs is correct.
4.  **Contact Information**:
    -   Navigate to `/contact`.
    -   Verify the accuracy of email addresses (e.g., `concierge@houseofpadmavati.com`), phone numbers, and physical studio address.
    -   Test the contact form to ensure all fields are present and accurate.
5.  **Social Media Links**:
    -   Check the footer on all pages.
    -   Click every social media icon (Instagram, Pinterest, YouTube) to ensure they link to the correct, official HOP profiles.

### Step 2: Collection Structure and Taxonomy
The Content Strategist shall validate the site navigation and categorization:
1.  **Main Navigation**:
    -   Verify that the main menu structure matches the approved architecture.
    -   Ensure all dropdowns populate correctly with the intended sub-categories.
2.  **Category Mapping**:
    -   Navigate to the `/categories` and specific category pages (e.g., `/category/kanjivaram`).
    -   Verify that only relevant products appear in each category.
    -   Ensure no products are "orphaned" (lacking a category assignment).
3.  **Collection Logic**:
    -   Check curated collections (e.g., "The Bridal Edit").
    -   Verify the products listed match the intended theme and inventory list.

### Step 3: Product Catalog Completeness
The Catalog Manager shall perform a comprehensive audit of the product database:
1.  **Mandatory Field Verification**:
    -   Export the current product database from Supabase staging.
    -   Run a script or visually inspect to ensure EVERY product has the following fields populated:
        -   `title`
        -   `description`
        -   `price`
        -   `category_id`
        -   `fabric_details`
        -   `weave_type`
        -   `dimensions` (Length, Width, Blouse Piece details)
        -   `care_instructions`
        -   `availability_status` (In Stock, Out of Stock, Pre-order)
2.  **Pricing and Currency Accuracy**:
    -   Verify all prices are formatted correctly in Indian Rupees (INR) with the correct symbol (₹).
    -   Ensure luxury pricing formatting is used (e.g., ₹1,50,000 without trailing decimals unless required).
    -   Cross-reference staging prices against the Master Product Data Sheet to ensure 100% match.
3.  **Inventory Data**:
    -   Check that products marked "Out of Stock" correctly disable the "Add to Cart" button.
    -   Verify that low stock warnings trigger correctly if configured.
4.  **Cross-sell / Recommendations**:
    -   Review product detail pages (PDPs) for 10 random items.
    -   Verify that the "You May Also Like" or related products section is populated.
    -   Ensure recommended items are logically related (e.g., matching accessories or similar weaves).

### Step 4: Image and Media Content Audit
The Digital Asset Manager shall review all media:
1.  **Product Photography Standards**:
    -   Ensure every product has a minimum of 4 images (Front full, detail drape, macro fabric shot, alternate angle).
    -   Verify resolution: All primary product images must be high-resolution (minimum 2000x3000px) to support the zoom functionality.
    -   Check aspect ratios: Ensure a consistent aspect ratio (e.g., 2:3 or 3:4) across all catalog images to prevent misaligned grids.
    -   Confirm consistency in lighting, background (e.g., HOP signature sand/warm-white), and styling across the catalog.
2.  **Lookbook Imagery**:
    -   Navigate to `/lookbooks`.
    -   Verify that editorial images are optimized for web but retain luxury sharpness.
    -   Ensure lookbook images map correctly to the featured products.
3.  **Video Content**:
    -   If videos are used (e.g., drape movement), ensure they auto-play smoothly without sound by default, and have a high-quality poster image.

### Step 5: Narrative and Auxiliary Content
The Content Strategist shall review:
1.  **About Pages (Craft, Heritage, Atelier, Sustainability)**:
    -   Navigate to `/about`, `/craft`, `/sustainability`.
    -   Verify all text sections are populated and structurally sound (headers, paragraphs, blockquotes).
    -   Ensure imagery supporting the narrative is present and correctly placed.
2.  **Journal / Blog Content**:
    -   Navigate to `/journal`.
    -   Check that at least the minimum required launch articles are present.
    -   Verify author names, publication dates, featured images, and category tags are complete.
3.  **Gift Section**:
    -   Navigate to `/gift`.
    -   Verify content regarding gift packaging, personalized notes, and digital gift cards is accurate.
4.  **Campaign Pages**:
    -   Navigate to `/campaigns`.
    -   Review specific campaign landing pages for complete text, hero imagery, and correct product grids.
5.  **Appointment Booking**:
    -   Navigate to `/appointments`.
    -   Verify the descriptions of appointment types (Virtual Consultation, Studio Visit) are accurate.
    -   Ensure operating hours and location details match the current physical studio policies.

## 13. Validation Steps
1.  **Automated Data Check**: Run a database query on the staging environment to identify any products with `NULL` values in mandatory fields (`description`, `fabric`, `images` array < 4).
2.  **Visual Sweep**: Perform a manual walkthrough of the top 50 highest-value products to visually confirm data and image integrity.
3.  **Price Reconciliation Script**: Execute a script comparing staging database prices against the Master CSV; output any discrepancies.

## 14. Checklists

### Catalog Content Completeness
- [ ] All products have Titles.
- [ ] All products have Descriptions.
- [ ] All products have accurate Prices formatted in INR (₹).
- [ ] All products are assigned to at least one valid Category.
- [ ] Fabric and Weave type data is present for all sarees.
- [ ] Dimensions (Saree length/width, blouse piece details) are specified.
- [ ] Care instructions are explicitly stated (e.g., Dry Clean Only).
- [ ] Inventory status (In Stock/Out of Stock) is accurate.
- [ ] Cross-sell / Related products are configured.

### Media & Assets
- [ ] Every product has a minimum of 4 high-quality images.
- [ ] All product images meet the minimum resolution (2000x3000px).
- [ ] All product images adhere to the defined aspect ratio (e.g., 2:3).
- [ ] Lookbook and editorial images are present and correctly linked.
- [ ] No broken image links or placeholder images (`<img>` tags failing to load) exist on the site.

### Functional & Narrative Content
- [ ] Shipping policy is accurate and complete.
- [ ] Return/Exchange policy is accurate and complete.
- [ ] FAQs are populated with factual answers.
- [ ] Contact information (Email, Phone, Address) is verified.
- [ ] Social media links in the footer navigate to the correct external profiles.
- [ ] Craft, Heritage, and Sustainability pages are fully populated.
- [ ] Journal articles have correct metadata (date, author, tags).
- [ ] Appointment booking information is factually correct.

## 15. Pass / Fail Criteria
- **Pass**: 100% of products have mandatory fields populated. 100% of images meet resolution and aspect ratio standards. All policy and contact information is factually accurate. Zero broken links or missing assets.
- **Fail**: Any product is missing a mandatory field (e.g., price, description, images). Any incorrect pricing data. Any placeholder text ("Lorem Ipsum") or missing images on live pages. Incorrect or missing policy information.

## 16. Acceptance Criteria
- The staging environment data perfectly mirrors the intended launch data.
- The UI renders all content correctly without layout breaks caused by missing or malformed content (e.g., extremely long titles, missing images).
- The Content Audit Report shows zero outstanding critical or high-severity defects.

## 17. Quality Gates
- **Data Integrity Gate**: Automated database checks must return 0 records with missing mandatory fields before manual review begins.
- **Visual Asset Gate**: Digital Asset Manager must sign off on image quality and consistency across the catalog.
- **Policy Gate**: Legal/Operations must verify that Shipping and Return policies match current business practices.

## 18. Evidence Required
- Database query results showing no null values for required product fields.
- Completed and signed Content Review Checklist.
- Screenshot evidence of corrected content for any defects found during the audit.
- Price reconciliation script output showing zero variance.

## 19. Documentation Requirements
- All identified content gaps must be logged in the Bug Tracker (→ See `15_BUG_TRACKER.md`) with the label `content-defect`.
- The final Content Audit Report must be archived in the release documentation folder.
- Any changes made to taxonomy or mandatory fields during the review must be updated in the Master Product Data Sheet.

## 20. Common Failure Scenarios
1.  **Missing Blouse Piece Information**: Sarees are listed without specifying whether a blouse piece is included, leading to customer confusion.
2.  **Inconsistent Image Ratios**: Mixed portrait and square images uploaded for products, causing the category grid to misalign.
3.  **Orphaned Products**: Products uploaded to the database but not assigned to any category, making them unfindable via navigation.
4.  **Lorem Ipsum Artifacts**: Placeholder text left in secondary pages (e.g., Journal, specific Craft pages) that was missed during initial data entry.
5.  **Pricing Discrepancies**: Staging database prices not updated to reflect the latest pricing strategy decisions.

## 21. Troubleshooting
- **Missing Data Fields in UI**: If a field (e.g., Fabric) is populated in the database but not showing on the frontend, check the GraphQL/Supabase query in the frontend component to ensure the field is being requested.
- **Images Not Loading**: Verify the image paths in the database map correctly to the storage bucket URLs. Check CORS policies on the storage bucket.
- **Incorrect Currency Format**: Ensure the frontend localization utility (e.g., `Intl.NumberFormat`) is strictly configured for `en-IN` and `INR`.

## 22. Best Practices
- **Single Source of Truth**: Always treat the PIM/Database as the source of truth; do not hardcode product data in frontend components.
- **Automated Validation**: Utilize database constraints (e.g., `NOT NULL` in PostgreSQL) to prevent incomplete product records from being saved in the first place.
- **Batch Processing**: When correcting image aspect ratios, use batch processing tools (e.g., Photoshop actions or ImageMagick) to ensure absolute consistency.
- **Continuous Content Monitoring**: Treat content review as an ongoing process, not just a pre-launch activity, especially for user-generated content or frequently updated journal articles.

## 23. Standards
- **Currency**: `en-IN` formatting (`₹1,50,000`, not `₹150,000`).
- **Measurements**: Metric system standard (cm/meters) for product dimensions, with imperial (inches) provided as secondary if necessary.
- **Image Resolution**: 2000x3000px minimum for primary product imagery. WebP format preferred for performance (→ See `07_PERFORMANCE_AUDIT.md`).
- **Tone**: Must align with the HOP Brand Philosophy (Quiet luxury, uncompromising standards).

## 24. Review Process
1.  The Content Strategist coordinates the audit across respective roles (Catalog, Assets, Operations).
2.  Issues are logged in the issue tracker.
3.  The Content Team remediates the issues directly in the staging database/CMS.
4.  A secondary review is performed on the specific failed items.
5.  The Content Strategist compiles the final report.

## 25. Sign-off Requirements
- Signature from the Content Strategist confirming all narrative and taxonomy content is complete.
- Signature from the Catalog Manager confirming product data and pricing accuracy.
- Signature from the Digital Asset Manager confirming all media assets meet technical specifications.

## 26. Completion Criteria
- All items on the Content Review Checklist are marked complete.
- Zero outstanding `content-defect` issues in the Bug Tracker.
- The platform is structurally and factually ready for the SEO Audit and Accessibility Audit.

## 27. References
- → See `00_MASTER_EXECUTION_PLAN.md`
- → See `02_UI_UX_REVIEW.md`
- → See `03_EDITORIAL_REVIEW.md`
- → See `06_ACCESSIBILITY_AUDIT.md`
- → See `07_PERFORMANCE_AUDIT.md`
- → See `09_SEO_AUDIT.md`
- → See `15_BUG_TRACKER.md`
- → See `16_PRODUCTION_READINESS.md`

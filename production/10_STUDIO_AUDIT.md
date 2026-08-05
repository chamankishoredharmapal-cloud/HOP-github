---
title: "Studio & Content Management Audit"
document_id: "HOP-PROD-010"
version: "1.0.0"
status: "Active"
author: "Engineering & Editorial Teams"
last_updated: "2026-08-05"
---

# 10. STUDIO AND CONTENT MANAGEMENT AUDIT

## Purpose
The purpose of this Standard Operating Procedure (SOP) is to govern the audit of the House of Padmavati (HOP) Studio content management system (CMS) layer. This document ensures that the content authoring workflows, asset management capabilities, publishing pipelines, and editorial governance mechanisms strictly uphold the brand’s uncompromising standards for luxury presentation and flawless execution.

## Scope
This audit encompasses all aspects of the HOP Studio (located in `src/studio/`), including the Supabase-backed content data layers, content compilation scripts (`scripts/compile-content.js`), asset storage pipelines, user roles and permissions, editorial workflows, content versioning, and integration with the primary Vite/React frontend.

## Objectives
1. Verify the integrity and flexibility of the content models (products, collections, journal entries).
2. Ensure secure, intuitive, and efficient content authoring and publishing workflows for editors.
3. Validate robust media asset management and image optimization pipelines.
4. Guarantee that content versioning, scheduling, and rollback capabilities operate flawlessly.
5. Confirm that SEO and metadata management fields are fully integrated and functional.

## Definitions
- **Studio:** The internal CMS interface and tools used by editors to manage HOP content.
- **Content Model:** The structured schema defining entities like Products, Collections, Lookbooks, and Journal entries.
- **Draft State:** Content that is actively being edited and is not visible to the public.
- **Published State:** Content that has passed the quality gates and is live on the production site.
- **Asset Pipeline:** The automated processes for uploading, storing, compressing, and serving media.

## Roles & Responsibilities
| Role | Responsibility |
|------|----------------|
| **Studio Administrator** | Oversees user roles, content permissions, and system configurations. |
| **Editorial Lead** | Manages content approval workflows and enforces brand voice guidelines. |
| **Content Editor** | Authors, formats, and schedules content via the Studio interface. |
| **Frontend Engineer** | Maintains content compilation scripts and schema sync with the UI. |
| **QA Engineer** | Executes this audit to ensure Studio reliability and integrity. |

## Prerequisites
- Access to the staging and production environments of the HOP Studio.
- Superadmin or Admin credentials for the CMS interface.
- Execution of `01_PRE_PRODUCTION_AUDIT.md`.
- Supabase project access for verifying backend data consistency.
- A suite of test content (text, high-resolution imagery, meta descriptions).

## Inputs
- Content Model Schema documentation.
- Brand Editorial Guidelines.
- List of current user roles and permissions matrix.
- Test assets (images in various formats, text strings covering edge cases).

## Outputs
- Studio Audit Report detailing schema validation, workflow tests, and bug logs.
- Sign-off from the Editorial Lead and Studio Administrator.
- Identified action items for resolving workflow or schema issues.

## Dependencies
- Database schemas must be locked in Supabase.
- Edge functions related to content scheduling or processing must be deployed.
- Content compilation script (`scripts/compile-content.js`) must be passing CI tests.
- → See [08_SECURITY_AUDIT.md] for backend access requirements.
- → See [04_CONTENT_REVIEW.md] for editorial content standards.

## Execution Order
This audit should be executed post-development freeze and prior to the Content Review phase, enabling content editors to populate final production data confidently.

---

## Phases / Stages

### Phase 1: Content Model and Schema Verification
Validating that the content architecture supports all luxury brand requirements without compromise.

### Phase 2: Authoring Workflow & Studio UX
Ensuring the internal tools provide a seamless, robust experience for content editors.

### Phase 3: Media Asset Management & Pipelines
Testing the ingestion, processing, and delivery of high-end imagery.

### Phase 4: Publishing, Scheduling, and Governance
Auditing the content lifecycle, approval gates, versioning, and rollback safety mechanisms.

---

## Detailed Step-by-Step Procedures

### 1. Content Management System Review (Supabase Integration)
1. Log in to the HOP Studio using administrator credentials.
2. Verify that the Studio interface successfully reads from and writes to the correct Supabase staging/production database.
3. Monitor network requests to ensure database queries are optimized and secure (e.g., proper Row Level Security).
4. Validate that content changes immediately reflect in the backend data layer.

### 2. Content Model Verification
1. Navigate to the schema configuration panel or review the schema definition files.
2. **Product Schema:** Verify existence of fields for name, SKU, price, materials, care instructions, origin, sizing, and related editorial content.
3. **Collection Schema:** Verify fields for collection title, narrative text, cover image, and linked products.
4. **Journal Schema:** Verify fields for title, author, publish date, rich text body, pull quotes, and embedded media.

### 3. Content Authoring Workflow Audit
1. Create a new test entry for a Product, Collection, and Journal article.
2. Utilize all rich text editing features (bold, italics, links, blockquotes, lists).
3. Validate that the editor accurately preserves formatting without injecting erroneous HTML tags.
4. Save the entry as a draft and ensure no data loss occurs upon page refresh or session timeout.

### 4. Content Publishing Pipeline Review
1. Transition a test draft to a 'Published' state.
2. Execute the content compilation script (`node scripts/compile-content.js`) if working in a static-generation context, or verify immediate availability via API.
3. Confirm that the published content appears correctly on the staging frontend.
4. Unpublish the content and verify it is immediately removed from the frontend.

### 5. Content Versioning and Rollback
1. Make three distinct edits to a published Journal entry, saving after each edit.
2. Access the version history panel for the entry.
3. Select an older version and execute a rollback.
4. Verify that the content perfectly matches the selected historical version.

### 6. Media Asset Management
1. Upload high-resolution TIFF, PNG, and JPEG files to the Studio media library.
2. Ensure the system accepts valid formats and rejects malicious or unsupported file types.
3. Assign alt text, captions, and copyright metadata to the uploaded images.
4. Link the media assets to test products and journal entries.

### 7. Content Preview Functionality
1. Open a draft entry in the Studio.
2. Click the 'Preview' button.
3. Verify that a secure, non-indexed preview URL is generated.
4. Confirm the preview accurately reflects the exact layout and typography of the live site.

### 8. Content Scheduling Capabilities
1. Create a new Journal entry and set the publish date for 1 hour in the future.
2. Verify the status reflects 'Scheduled'.
3. Wait or simulate the time passage.
4. Confirm the system automatically publishes the entry at the exact designated time without manual intervention.

### 9. Content Localization Readiness
1. Ensure the schema supports locale-specific fields (e.g., `en-US`, `en-GB`, `fr-FR`).
2. Add translation strings for a test product.
3. Verify that the frontend correctly fetches and displays the assigned locale content based on routing or user preferences.

### 10. Content API Integration Verification
1. Inspect the `scripts/compile-content.js` script.
2. Ensure the script fetches data securely using authorized API keys.
3. Run the script manually and verify the integrity of the generated output (e.g., JSON files or statically generated pages).
4. Verify graceful error handling if the CMS API is temporarily unreachable.

### 11. Editorial Workflow and Approval Process
1. Log in as a 'Content Editor' (restricted role) and submit a draft for review.
2. Verify the Editor cannot publish the content directly.
3. Log in as 'Editorial Lead', review the submission, and approve it.
4. Ensure audit logs capture the specific users involved in the approval chain.

### 12. Content Backup Procedures
1. Trigger a manual content backup from the Supabase dashboard or automated script.
2. Verify the backup is securely stored in an encrypted offsite bucket.
3. Perform a dry-run restoration of the backup to a safe staging environment to ensure data integrity.

### 13. User Role and Permission Management
1. Review the Roles matrix (Admin, Editor, Reviewer, Viewer).
2. Attempt to perform unauthorized actions (e.g., Editor trying to delete an entire collection).
3. Confirm the system blocks unauthorized actions and logs the attempt.

### 14. Content Migration Procedures
1. If migrating from a legacy system, execute the migration script.
2. Validate that markdown, HTML, and media references are correctly parsed and mapped to the new schema.
3. Spot-check 10% of migrated entries for formatting anomalies.

### 15. Content Quality Assurance Process
1. Use the Studio tools to check for broken links within rich text fields.
2. Ensure mandatory fields (e.g., Product Price, SKU) cannot be bypassed.
3. Validate that content cannot be published if it fails internal validation checks.

### 16. Studio UI/UX Review
1. Assess the Studio interface against the brand's aesthetic standards (clean, minimalist, distraction-free).
2. Verify that drag-and-drop operations (e.g., reordering lookbook images) function smoothly.
3. Ensure the Studio is responsive and usable on tablet devices for editors on the go.

### 17. Content Performance Monitoring
1. Monitor the load times of the Studio interface when querying large datasets (e.g., 500+ products).
2. Ensure pagination and lazy loading are implemented in the list views.
3. Validate that API response times for content queries remain under 200ms.

### 18. Content Audit Trail and Change Logging
1. Review the global activity log in the Studio.
2. Verify that every create, update, delete, and publish action is recorded with a timestamp, user ID, and diff of changes.

### 19. SEO Integration within Studio
1. Verify dedicated fields for Meta Title, Meta Description, Canonical URL, and Open Graph Image.
2. Validate that URL slugs are automatically generated from titles but can be manually overridden.
3. Ensure character counters warn editors if meta descriptions exceed optimum lengths (e.g., 160 characters).

### 20. Image Optimization Pipeline
1. Verify that uploaded high-resolution images are automatically processed.
2. Confirm generation of multiple responsive variants (e.g., WebP, AVIF, JPEG fallbacks).
3. Ensure EXIF data is stripped for security, while color profiles (sRGB/Display P3) are preserved for luxury color accuracy.

---

## Validation Steps
1. **Schema Check:** Run an automated script to fetch one of every content type and validate against the JSON schema definitions.
2. **E2E Publish Test:** Run a Playwright test that logs into the Studio, creates a product, publishes it, and verifies it on the frontend.
3. **Role Test:** Execute automated API requests using tokens from different roles to ensure proper 403 Forbidden responses on restricted endpoints.

## Checklists

### Content Model Readiness
- [ ] Product schema covers all required attributes.
- [ ] Collection schema allows for nested references.
- [ ] Journal schema supports modular rich text blocks.
- [ ] Mandatory fields are strictly enforced.
- [ ] Fallback values are defined where appropriate.

### Media & Assets
- [ ] Upload limits (size/type) are configured.
- [ ] Automatic responsive image generation is active.
- [ ] Global CDN distribution is verified.
- [ ] Asset tagging and search function correctly.

### Workflow & Governance
- [ ] Roles and RLS (Row Level Security) are properly configured in Supabase.
- [ ] Draft to Publish lifecycle requires appropriate permissions.
- [ ] Version history accurately restores previous states.
- [ ] Scheduled publishing triggers accurately.

### Developer Integration
- [ ] `scripts/compile-content.js` executes without warnings.
- [ ] API keys for frontend are restricted to read-only access.
- [ ] Webhooks for cache invalidation trigger successfully upon content updates.

## Pass / Fail Criteria
- **Pass:** All content models validate perfectly. Editors can manage, schedule, and publish content without errors. Media is processed and optimized automatically. Permissions are strictly enforced.
- **Fail:** Data loss during editing. Schema mismatches between CMS and frontend. Unauthorized users can publish content. Media uploads fail or degrade image quality unacceptably.

## Acceptance Criteria
1. Zero critical or high-severity bugs in the content creation workflow.
2. Asset pipeline successfully processes a 50MB TIFF into appropriate web formats in under 10 seconds.
3. Content rollout (publishing) propagates to the frontend within 60 seconds.
4. Successful demonstration of content rollback to a previous version.

## Quality Gates
- **Gate 1:** Local schema validation passes.
- **Gate 2:** Staging environment successfully syncs with CMS test data.
- **Gate 3:** Editorial Lead signs off on the Studio UI/UX and workflow.
- **Gate 4:** Security audit confirms RLS policies on content tables.

## Evidence Required
- Screen recordings of the complete authoring and publishing workflow.
- Exported JSON payload demonstrating schema compliance.
- Screenshot of the version history and successful rollback.
- Logs from `compile-content.js` showing successful execution.

## Documentation Requirements
- A comprehensive "Editor's Manual" must be generated and distributed to the editorial team.
- API documentation for any custom Studio endpoints must be updated.
- Schema ERD (Entity Relationship Diagram) must be archived in the project wiki.

## Common Failure Scenarios
1. **Rich Text Mangling:** Editor pastes text from Microsoft Word, bringing in hidden, invalid HTML that breaks the frontend layout.
2. **Webhook Failures:** Content is published in the Studio, but the frontend cache invalidation webhook fails, causing stale data to display.
3. **Asset Timeout:** Extremely large image uploads time out before processing completes.
4. **Race Conditions:** Two editors attempt to modify the same document simultaneously.

## Troubleshooting
- **If content doesn't appear on frontend:** 
  1. Check if the entry is in 'Published' state, not 'Draft'.
  2. Run `compile-content.js` manually and check for errors.
  3. Clear the frontend data cache/revalidate the path.
- **If image upload fails:**
  1. Check file size against the Supabase storage limits.
  2. Verify the file extension matches the internal mime-type checks.
- **If schema validation fails on compile:**
  1. Ensure the frontend types are synced with the latest CMS schema changes.
  2. Check for missing required fields in recently edited documents.

## Best Practices
- **Atomic Edits:** Encourage editors to save drafts frequently.
- **Clean Pasting:** Train editors to paste text without formatting (Cmd/Ctrl + Shift + V) to maintain clean markup.
- **Alt Text First:** Make alt text mandatory upon image upload to ensure accessibility compliance from the start.
- **Regular Backups:** Schedule automated database snapshots every 12 hours.

## Standards
- Strict adherence to the JSON schema standards for content modeling.
- ISO 8601 format for all timestamps and scheduling fields.
- BCP 47 language tags for localization fields.
- WCAG 2.1 AA standards for the Studio interface itself.

## Review Process
1. QA Engineer performs the technical validation.
2. Frontend Lead reviews the API and compilation scripts.
3. Editorial Lead tests the UI and authoring workflow.
4. Studio Administrator verifies roles and security.

## Sign-off Requirements
- Signature from the QA Engineer indicating all technical tests passed.
- Signature from the Editorial Lead confirming workflow usability.
- Signature from the Lead Engineer confirming architectural integrity.

## Completion Criteria
- All checklists are 100% completed.
- No P1/P2 issues remain in the Studio bug tracker.
- Final schemas are locked and documented.
- The Studio environment is deemed fully production-ready for the content team.

## References
- → See [01_PRE_PRODUCTION_AUDIT.md]
- → See [04_CONTENT_REVIEW.md]
- → See [08_SECURITY_AUDIT.md]
- → See [11_ECOMMERCE_AUDIT.md]
- → See [16_PRODUCTION_READINESS.md]

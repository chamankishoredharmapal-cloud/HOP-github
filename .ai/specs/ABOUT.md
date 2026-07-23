# Specification: About Pages

## Purpose
Tell the brand story, provide customer support information, and display legal policies.

## Pages Covered
- Our Story (/about)
- Customer Care (/customer-care)
- Privacy Policy (/privacy-policy)
- Terms of Service (/terms-of-service)

## Functional Requirements

### Our Story
- Page header with title
- Brand story sections with editorial text
- Alternating image/text blocks
- Team/mission section (future)
- Brand values/commitment section

### Customer Care
- FAQ accordion sections
- Shipping policy
- Returns and exchanges policy
- Size guide link
- Contact information (email, phone, response time)

### Legal Pages
- Privacy Policy content (GDPR/CCPA compliant)
- Terms of Service content
- Last updated date
- Print-friendly styling

## User Journey
1. User clicks "Our Story" in footer → reads brand narrative
2. Engages with imagery and text, builds trust
3. OR user clicks "Customer Care" → finds shipping/returns info
4. OR user needs legal info → reads Privacy Policy / Terms
5. All pages: user can navigate back or to other sections via footer

## Edge Cases
- Very long legal text → smooth scroll, table of contents
- FAQ accordion: multiple open (or single, decision: single)
- Print legal pages → print CSS stylesheet
- Missing content → graceful fallback

## Acceptance Criteria
- Our Story: editorial layout with image/text blocks
- Customer Care: FAQ accordion functional, shipping/returns info clear
- Legal pages: all required sections present, last updated date
- All pages: responsive, consistent styling
- Footer: links to all about pages

## Analytics Events
- `about_story_view`
- `about_customer_care_view`
- `about_faq_open` { question_id }
- `about_faq_close` { question_id }
- `about_privacy_view`
- `about_terms_view`
- `about_contact_click` { method: "email" | "phone" }

## Accessibility Requirements
- Content: semantic HTML sections
- FAQ accordion: accessible (button + region pattern)
- Headings: proper hierarchy (h1 → h2 → h3)
- Legal pages: no links open in new tab unnecessarily
- Contact: mailto: and tel: links

## Performance Targets
- Lighthouse Performance >= 95 (text-heavy, few images)
- No hero images (or optimized if used)
- Legal pages: LCP < 1.5s (pure text)

## Future Expansion
- Team page with bios
- Craftsmanship page (deep-dive on techniques)
- Sustainability page
- Press/press mentions page
- Store locator (if physical stores open)

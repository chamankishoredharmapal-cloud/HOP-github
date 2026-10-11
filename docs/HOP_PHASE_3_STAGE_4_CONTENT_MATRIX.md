# HOP — Phase 3, Stage 4: Remaining Pages & Policies Content Matrix

**Status:** Certified Architecture & Content Specification  
**Execution Date:** 2026-10-12  
**Target Architecture:** House of Padmavati Unified Site Update Workspace  
**Author:** Principal Software Architect, CMS Architect, Security Engineer & Production QA Lead  

---

## 1. Executive Summary & Purpose

This Content Matrix specifies the architecture, data models, section keys, validation rules, fallback payloads, and security boundaries for **Phase 3 — Stage 4: Remaining Pages & Policies**.

The goal of Stage 4 is to extend the dynamic content infrastructure established in Stages 1–3 (`site_sections`, `site_section_revisions`, RPCs, Studio Site Update UI) across all remaining customer-facing information and policy pages:
1. **About / Brand Story** (`/about` -> `OurStory.tsx`)
2. **Customer Care / Contact Information** (`/customer-care` -> `CustomerCare.tsx`)
3. **Shipping Policy** (`/shipping-policy` -> `ShippingPolicy.tsx`)
4. **Returns & Refund Policy** (`/returns-policy` -> `ReturnsPolicy.tsx`)
5. **Privacy Policy** (`/privacy-policy` -> `PrivacyPolicy.tsx`)
6. **Terms of Service** (`/terms-of-service` -> `TermsOfService.tsx`)

---

## 2. Strict Content Boundaries & Non-Negotiables

To maintain documentation and operational integrity, all editable sections adhere to strict boundary rules:

1. **Preserved Business & Operational Facts:**
   - **Shipping:** India-only delivery; flat standard shipping ₹99; first-order free delivery benefit consumed on first qualifying order; dispatch within 1 business day; domestic transit 3–5 business days. Courier partners: Delhivery, Blue Dart, DTDC.
   - **Returns:** 3 calendar days for 1–3 items; 7 calendar days for >3 items from delivery date; refunds to original payment method within 5–7 business days post-inspection.
   - **Order Cancellation:** 1-hour window from placement; zero fee; non-cancellable after 1 hour or post-dispatch.
   - **Contact:** Support correspondence via `houseofpadmavati@gmail.com`. Location: Bangalore, India. GST: Not Registered.

2. **Prohibited Changes (Zero Fabrication):**
   - No fictitious legal entities, false registration numbers, invented telephone numbers, physical street addresses, or imaginary grievance officers.
   - No hardcoded checkout overrides or payment calculation changes.

3. **Code-Owned Application Invariants:**
   - Interactive contact form submission handler (`submitContactForm`) and field validation.
   - Mandatory Privacy Policy consent checkbox before form submission.
   - Prerender integration (`usePrerenderReady(true)`).
   - Dynamic document title and OpenGraph metadata hooks (`useMetadata`).
   - Breadcrumbs, sidebar navigation (`AboutSidebar`), and header/footer layouts (`PageLayout`).

4. **Security & Draft Isolation Invariants:**
   - Anonymous visitors only receive published payloads via `get_published_site_sections(p_page)`.
   - Direct `SELECT` on `public.site_sections` and `public.site_section_revisions` is denied to anonymous callers by RLS.
   - Administrative draft previews (`?studio_preview=true`) strictly require an authenticated administrator session (`public.is_admin()`).
   - All mutations enforce optimistic locking (`expected_version`).
   - All payloads are sanitized and validated against script injection, event handlers, and data URIs via `validate_section_payload()`.

---

## 3. Comprehensive Section Registry & Mapping Matrix

| Page Name | Route | Section Key | Section Type | Display Name | Editable Editorial Fields | Code-Owned Elements |
|---|---|---|---|---|---|---|
| `about` | `/about` | `about.story` | `story` | The House (Our Story) | `header_title`, `header_subtitle`, `heading`, `story_title`, `story_content`, `image_url`, `image_alt`, `image_position` | `PageLayout`, `AboutSidebar`, `useMetadata`, `usePrerenderReady` |
| `care` | `/customer-care` | `care.info` | `custom_section` | Customer Care Info | `header_title`, `header_subtitle`, `intro_heading`, `intro_text`, `response_time_note`, `email_address` | Contact form state, validation, `submitContactForm`, consent checkbox, layout |
| `policy` | `/shipping-policy` | `policy.shipping` | `policy_document` | Shipping Policy | `title`, `last_updated`, `meta_description`, `sections` array (`id`, `title`, `content`), `contact_email`, `contact_business` | `PageLayout`, layout styling, metadata |
| `policy` | `/returns-policy` | `policy.returns` | `policy_document` | Returns & Refund Policy | `title`, `last_updated`, `meta_description`, `sections` array (`id`, `title`, `content`), `contact_email`, `contact_business` | `PageLayout`, layout styling, eligibility table rendering, metadata |
| `policy` | `/privacy-policy` | `policy.privacy` | `policy_document` | Privacy Policy | `title`, `last_updated`, `meta_description`, `sections` array (`id`, `title`, `content`), `contact_email`, `contact_business` | `PageLayout`, layout styling, metadata |
| `policy` | `/terms-of-service` | `policy.terms` | `policy_document` | Terms & Conditions | `title`, `last_updated`, `meta_description`, `sections` array (`id`, `title`, `content`), `contact_email`, `contact_business` | `PageLayout`, layout styling, metadata |

---

## 4. Detailed Data Schemas (Zod Specifications)

### 4.1 About Page Schema (`about.story`)
```typescript
export const AboutStoryPayloadSchema = z.object({
  header_title: z.string().min(1, "Header title is required").max(100),
  header_subtitle: z.string().max(250),
  heading: z.string().min(1, "Section heading is required").max(120),
  story_title: z.string().min(1, "Story title is required").max(150),
  story_content: z.string().min(1, "Story content is required").max(3000),
  image_url: z.string().min(1, "Story image is required"),
  image_alt: z.string().max(200).default("House of Padmavati"),
  image_position: z.enum(["left", "right"]).default("left"),
});
```

### 4.2 Customer Care Schema (`care.info`)
```typescript
export const CustomerCarePayloadSchema = z.object({
  header_title: z.string().min(1, "Header title is required").max(100),
  header_subtitle: z.string().max(250),
  intro_heading: z.string().min(1, "Intro heading is required").max(120),
  intro_text: z.string().min(1, "Intro text is required").max(1000),
  response_time_note: z.string().max(300),
  email_address: z.string().email("Valid email required").max(120),
});
```

### 4.3 Policy Document Schemas (`policy.*`)
```typescript
export const PolicySectionItemSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().min(1, "Section title required").max(150),
  content: z.string().min(1, "Section content required").max(8000),
});

export const PolicyDocumentPayloadSchema = z.object({
  title: z.string().min(1, "Document title required").max(120),
  last_updated: z.string().min(1, "Last updated date required").max(80),
  meta_description: z.string().max(300),
  sections: z.array(PolicySectionItemSchema).min(1, "At least one section required").max(30),
  contact_email: z.string().email().default("houseofpadmavati@gmail.com"),
  contact_business: z.string().default("House of Padmavati, Bangalore, India"),
});
```

---

## 5. Grounded Fallback Payloads

If the database is unreachable, a network timeout occurs, or a row contains unparseable data, the storefront seamlessly renders verified source-code defaults without visual breakage or console crashes:

### 5.1 `DEFAULT_ABOUT_STORY_PAYLOAD`
- `header_title`: `"The House."`
- `header_subtitle`: `"A digital fashion house for Indian sarees."`
- `heading`: `"House of Padmavati"`
- `story_title`: `"House of Padmavati is named for a real woman."`
- `story_content`: `"We curate the Indian saree for the modern wardrobe. Our collections are designed not as seasonal trends, but as enduring expressions of identity."`
- `image_url`: `"/content/weaver-portrait/gangamma-molakalmuru/hero.jpg"`
- `image_alt`: `"House of Padmavati - The House"`
- `image_position`: `"left"`

### 5.2 `DEFAULT_CUSTOMER_CARE_PAYLOAD`
- `header_title`: `"Customer Care."`
- `header_subtitle`: `"We are here to assist you."`
- `intro_heading`: `"Write to the House"`
- `intro_text`: `"We welcome your thoughts and questions. Please leave a message below, and we will respond with care."`
- `response_time_note`: `"We have received your message and will reply within two business days."`
- `email_address`: `"houseofpadmavati@gmail.com"`

### 5.3 `DEFAULT_SHIPPING_POLICY_PAYLOAD`
- `title`: `"Shipping"`
- `last_updated`: `"October 2026"`
- `meta_description`: `"Shipping policy for House of Padmavati — delivery timelines, charges, courier partners, and coverage areas."`
- 9 verified sections: Coverage, Charges, Dispatch Timeline, Delivery Timelines, Courier Partners, Delivery Instructions, Order Tracking, Undeliverable Packages, Contact.

### 5.4 `DEFAULT_RETURNS_POLICY_PAYLOAD`
- `title`: `"Returns & Refund"`
- `last_updated`: `"October 2026"`
- `meta_description`: `"Returns, refund, and replacement policy for House of Padmavati — eligibility windows by order size, conditions, and process."`
- 10 verified sections: Return and Replacement Eligibility, Eligible Reasons, Not Eligible, Inspection Condition, How to Initiate, Return Shipping, Exchange Policy, Refund Process, Cancellation, Contact.

### 5.5 `DEFAULT_PRIVACY_POLICY_PAYLOAD`
- `title`: `"Privacy"`
- `last_updated`: `"October 2026"`
- `meta_description`: `"Privacy policy for House of Padmavati — how we collect, use, and protect your personal information."`
- 12 verified sections: Introduction, Information We Collect, How We Use Your Information, Third-Party Services We Use, Cookies and Local Storage, Data Sharing and Disclosure, Data Security, Data Retention, Your Rights, Children's Privacy, Changes to This Policy, Contact Us.

### 5.6 `DEFAULT_TERMS_POLICY_PAYLOAD`
- `title`: `"Terms"`
- `last_updated`: `"October 2026"`
- `meta_description`: `"Terms and conditions for using House of Padmavati and purchasing our products."`
- 18 verified sections: Introduction, Business Information, Definitions, Eligibility, Products, Orders, Payments, Shipping, Returns and Refunds, Account Responsibility, Intellectual Property, Privacy, Third-Party Services, Limitation of Liability, Force Majeure, Governing Law and Jurisdiction, Changes to Terms, Contact Information.

---

## 6. Studio Site Update Navigation & Workspace Layout

In Studio (`/studio/site-update`), the operator can switch between distinct page workspaces via a dedicated sub-navigation bar:
1. **Homepage** (`home`): Hero, Craft Story, Philosophy, Ownership, Invitation.
2. **About / Story** (`about`): The House brand story, lede, imagery with Media Picker integration.
3. **Customer Care** (`care`): Contact headers, correspondence notes, support email.
4. **Policies** (`policy`): Tabbed policy editor for Shipping, Returns, Privacy, and Terms of Service. Each policy supports structured section re-titling and rich text/paragraphs editing.

Every section provides:
- Live status indicator (Published / Draft with unpublished changes / Version number).
- Media Library picker for image replacement (in About Story).
- Optimistic locking (`expected_version`) concurrency protection.
- Isolated Draft Preview link (`?studio_preview=true`).
- Two-step publication confirmation modal with change summary log.
- Revision history audit drawer.

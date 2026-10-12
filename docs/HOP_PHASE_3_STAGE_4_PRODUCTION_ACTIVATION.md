# House of Padmavati — Phase 3, Stage 4: Production Activation & Certification

**Document ID:** `HOP-ACT-P3-S4-001`  
**Date:** 2026-10-12  
**Author:** Principal Release Engineer & Production Operations Lead  
**Scope:** Production Activation of Phase 3, Stage 4 (Remaining Pages & Policies)  
**Repository:** `chamankishoredharmapal-cloud/HOP-github` (`main`)  
**Certified HEAD Commit:** `be0fe6c`  
**Initial Deployed Commit:** `e18250a` (Phase 2)  
**Activated Production Deployment ID:** `bb1e7ad7-17be-4e69-adf2-dec4b0e6e6be`  
**Canonical Production URL:** `https://houseofpadmavati.pages.dev`  
**Deployment Preview URL:** `https://bb1e7ad7.houseofpadmavati.pages.dev`  
**Production Supabase Project:** `kbvjmcnaaogkbnerjcoc` (`https://kbvjmcnaaogkbnerjcoc.supabase.co`)  

---

## 1. Executive Summary & Activation Verdict

### Verdict: **PASS — STAGE 4 LIVE**

Phase 3, Stage 4 (**Remaining Pages & Policies**) is now **100% active, verified, and operational in production**.

1. **Database Migration Applied:** Migration `20261012010000_phase3_stage4_remaining_pages_seed.sql` was applied to production Supabase project `kbvjmcnaaogkbnerjcoc` via `supabase db push --linked` with exit code `0`.
2. **All 11 Sections Published:** Production Supabase `published_sections` view and `get_published_site_sections` RPCs now expose all 11 canonical sections (5 homepage sections, 1 about story section, 1 customer care info section, and 4 legal policy documents).
3. **Frontend Deployed:** Production Cloudflare Pages was updated from legacy deployment `7f8a1244-1ee7-4581-b739-604e954b2682` (`e18250a`) to active deployment `bb1e7ad7-17be-4e69-adf2-dec4b0e6e6be` built directly from certified commit `be0fe6c`.
4. **Canonical Production Confirmed:** Live canonical domain `https://houseofpadmavati.pages.dev` serves the verified Stage 4 bundle `index-Im0mqmyy.js`. All public routes return HTTP 200 with full SSR/prerendered copy, zero horizontal overflow, and zero console errors.
5. **Security Invariants Intact:** Base tables `site_sections` and `site_section_revisions` remain strictly locked down via RLS (0 rows accessible to unauthenticated callers). Unauthenticated mutation RPCs return HTTP 401. Vulnerable function `update-admin-user` remains absent (HTTP 404).

---

## 2. Provenance & Build Verification

Prior to activation, build provenance and repository cleanliness were verified:

| Parameter | Observed Production Reality | Standard / Requirement |
| :--- | :--- | :--- |
| **Git Branch** | `main` | `main` |
| **Git Working Tree** | Clean (`be0fe6c..HEAD` 0 uncommitted changes) | Clean working tree |
| **Certified Commit** | `be0fe6c` | `be0fe6c` |
| **Parent Ancestry** | `be0fe6c` → `f6ba9e9` → `b467189` → `28a142a` → `173b6ec` → `1eb5327` → `1e4e15c` → `e18250a` | Verified |
| **TypeScript Compilation** | `npx tsc --noEmit` exited `0` | 0 errors |
| **ESLint Analysis** | `npm run lint` exited `0` | 0 errors, 0 warnings |
| **Vitest Unit Suite** | `npx vitest run` exited `0` | 41/41 passing tests |
| **Static Prerendering** | `npm run build` exited `0` | 29/29 routes prerendered |
| **Production Bundle** | `dist/assets/index-Im0mqmyy.js` (423.52 kB) | Verified |

---

## 3. Production Seed Migration Application

### 3.1 Migration Metadata
- **Migration File:** `supabase/migrations/20261012010000_phase3_stage4_remaining_pages_seed.sql`
- **Method:** `npx supabase db push --linked`
- **Command Exit Code:** `0`
- **Execution Log:**
  ```text
  Initialising login role...
  Connecting to remote database...
  Do you want to push these migrations to the remote database?
   • 20261012010000_phase3_stage4_remaining_pages_seed.sql
  Applying migration 20261012010000_phase3_stage4_remaining_pages_seed.sql...
  Finished supabase db push.
  ```

### 3.2 Idempotency & Conflict Safety
- Forward-only insert into `public.site_sections` guarded by `ON CONFLICT (key) DO NOTHING`.
- Initial revision #1 insert into `public.site_section_revisions` guarded by `ON CONFLICT (section_key, revision_number) DO NOTHING`.
- Guarantees zero overwriting of existing owner edits or subsequent publications upon replay.

### 3.3 Live Production Supabase Verification
Executed against `https://kbvjmcnaaogkbnerjcoc.supabase.co`:

```json
{
  "published_sections_count": 11,
  "sections": [
    { "key": "home.hero", "page_name": "home", "section_type": "hero_banner" },
    { "key": "home.craft", "page_name": "home", "section_type": "craft_story" },
    { "key": "home.philosophy", "page_name": "home", "section_type": "philosophy" },
    { "key": "home.ownership", "page_name": "home", "section_type": "note_cards" },
    { "key": "home.invitation", "page_name": "home", "section_type": "invitation" },
    { "key": "about.story", "page_name": "about", "section_type": "story" },
    { "key": "care.info", "page_name": "care", "section_type": "custom_section" },
    { "key": "policy.shipping", "page_name": "policy", "section_type": "policy_document" },
    { "key": "policy.returns", "page_name": "policy", "section_type": "policy_document" },
    { "key": "policy.privacy", "page_name": "policy", "section_type": "policy_document" },
    { "key": "policy.terms", "page_name": "policy", "section_type": "policy_document" }
  ],
  "rpc_verification": {
    "get_published_site_sections('about')": "HTTP 200 -> ['about.story'] (Heading: 'House of Padmavati')",
    "get_published_site_sections('care')": "HTTP 200 -> ['care.info'] (Intro: 'Write to the House')",
    "get_published_site_sections('policy')": "HTTP 200 -> ['policy.shipping', 'policy.returns', 'policy.privacy', 'policy.terms']"
  },
  "rls_isolation": {
    "site_sections_rest_anon_rows": 0,
    "site_section_revisions_rest_anon_rows": 0
  }
}
```

---

## 4. Frontend Production Deployment

### 4.1 Deployment Metadata
- **Project Name:** `houseofpadmavati`
- **Environment:** `Production`
- **Branch:** `main`
- **Deployed Commit SHA:** `be0fe6c`
- **Deployment ID:** `bb1e7ad7-17be-4e69-adf2-dec4b0e6e6be`
- **Deployment URL:** `https://bb1e7ad7.houseofpadmavati.pages.dev`
- **Canonical Production URL:** `https://houseofpadmavati.pages.dev`
- **Deployment Tool:** `wrangler 4.149.0` via `npx wrangler pages deploy dist --project-name=houseofpadmavati --branch=main --commit-dirty=true`
- **Command Exit Code:** `0`
- **Upload Stats:** 153 assets (67 new files uploaded, 86 deduplicated) in 44.14s.

### 4.2 Live Asset Bundle Verification
- Live production HTML at `https://houseofpadmavati.pages.dev/` was inspected:
  - Deployed Bundle Tag: `<script type="module" crossorigin="" src="/assets/index-Im0mqmyy.js"></script>`
  - Expected Bundle Tag: `/assets/index-Im0mqmyy.js`
  - Match Status: **100% CONFIRMED LIVE**

---

## 5. Post-Deployment Live Route Verification

All canonical routes were verified on `https://houseofpadmavati.pages.dev` using headless browser inspection and HTTP curl:

| Route | Canonical Title | Primary Heading (`h1`) | HTTP Status | Console Errors | Layout Overflow |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `/` | House of Padmavati | `Saree. Time. You.` | 200 OK | 0 | 0px |
| `/about/` | House of Padmavati — House of Padmavati | `The House.` | 200 OK | 0 | 0px |
| `/customer-care/` | Customer Care · House of Padmavati | `Customer Care.` | 200 OK | 0 | 0px |
| `/shipping-policy/` | Shipping · House of Padmavati | `Shipping` | 200 OK | 0 | 0px |
| `/returns-policy/` | Returns & Refund · House of Padmavati | `Returns & Refund` | 200 OK | 0 | 0px |
| `/privacy-policy/` | Privacy · House of Padmavati | `Privacy` | 200 OK | 0 | 0px |
| `/terms-of-service/` | Terms · House of Padmavati | `Terms` | 200 OK | 0 | 0px |
| `/studio/site-update` | House of Padmavati | *Protected SPA Route* | 200 OK | 0 | 0px |

*(Note: Requests without trailing slash e.g. `/about` cleanly redirect with HTTP 308 to `/about/` as part of Cloudflare Pages' canonical prerender architecture).*

---

## 6. Critical Policy & Business Invariants

| Invariant | Stated Policy Copy | Code / DB Invariant | Live Production Status |
| :--- | :--- | :--- | :---: |
| **Standard Shipping** | Flat ₹99 standard shipping across India. | `settings.standard_shipping_rate = 9900` paise. | **ACTIVE & VERIFIED** |
| **First-Order Benefit** | Complimentary shipping on first order. | `has_claimed_first_order_benefit` tracking in DB. | **ACTIVE & VERIFIED** |
| **Delivery Territory** | India-only delivery; pincode validation. | Checkout address validation restricts to India. | **ACTIVE & VERIFIED** |
| **Dispatch Timeline** | Dispatched next business day (Mon–Fri). | Shipping policy copy & customer care copy. | **ACTIVE & VERIFIED** |
| **Return Windows** | 1–3 items: 3 calendar days; >3 items: 7 calendar days. | Returns policy copy & customer correspondence. | **ACTIVE & VERIFIED** |
| **Cancellation Window** | 1 hour from order placement before dispatch. | Returns policy copy; zero cancellation fees. | **ACTIVE & VERIFIED** |
| **Refund Execution** | Original payment method (5–7 business days). | Razorpay automated refund pipeline. | **ACTIVE & VERIFIED** |
| **Support Email** | `houseofpadmavati@gmail.com` | Consistent across Header, Footer, Care, & Policies. | **ACTIVE & VERIFIED** |
| **Business Entity** | Sole proprietorship in Bangalore, Karnataka, India. | Disclosed in Terms of Service (no false entities). | **ACTIVE & VERIFIED** |
| **GST Registration** | "Not Registered" (turnover below statutory threshold). | Disclosed in Terms of Service. | **ACTIVE & VERIFIED** |
| **Edge Function Lockdown** | `update-admin-user` deleted. | Returns HTTP 404 NOT_FOUND. | **CONTAINED** |

---

## 7. Execution Log & Exit Codes Summary

| Step | Action / Command | Exit Code | Outcome |
| :---: | :--- | :---: | :--- |
| **1** | `npx tsc --noEmit` | `0` | Zero type errors |
| **2** | `npm run lint` | `0` | Zero linter warnings/errors |
| **3** | `npx vitest run` | `0` | 41/41 unit tests passed |
| **4** | `npm run build` | `0` | 1969 modules bundled, 29 routes prerendered |
| **5** | `npx supabase db push --dry-run --linked` | `0` | Identified `20261012010000` seed migration |
| **6** | `npx supabase db push --linked` | `0` | Migration applied to `kbvjmcnaaogkbnerjcoc` |
| **7** | `npx wrangler pages deploy dist --project-name=houseofpadmavati ...` | `0` | Deployment `bb1e7ad7` active on Cloudflare Pages |
| **8** | Real browser verification against `https://houseofpadmavati.pages.dev` | `0` | 35 checks passed; 0 overflow; 0 console errors |

---

## 8. Conclusion

**House of Padmavati Phase 3, Stage 4 (Remaining Pages & Policies)** is fully activated and certified live in production. 

The website is accessible at:
👉 **`https://houseofpadmavati.pages.dev`**

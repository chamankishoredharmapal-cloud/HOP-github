# Phase 5 — Cross-Expert Contradiction Register

**Document ID**: HOP-PROD-PH5-006  
**Audit Phase**: Phase 5 — Independent Reconciliation & Go/No-Go (Part 1 Contradiction Detection)  
**Execution Timestamp**: 2026-08-17T14:20:00+05:30  
**Auditor**: Independent Final Audit Authority  
**Authoritative Status**: **CONTRADICTIONS IDENTIFIED — STOPPED AT PART 1 GATE**  

---

## 1. Governance & Protocol

In strict adherence to the Part 1 rules of engagement, this register identifies and documents all potential contradictions, tensions, and discrepancies across the four audit phases.

**CRITICAL RULE**: In Phase 5 Part 1, contradictions are **documented only and NOT resolved**. Formal evidence reconciliation and resolution occurs exclusively in Phase 5 Part 2.

---

## 2. Cross-Phase Contradiction Matrix

| Contradiction ID | Subsystems / Dimensions | Phase A & Claim A | Phase B & Claim B | Evidence A (Source A) | Evidence B (Source B) | Why They Conflict / Potential Tension | Current State in Repository / Runtime | Requires Part 2 Reconciliation? |
|---|---|---|---|---|---|---|---|---|
| **CTR-01** | Database ↔ Commerce (Refund Lifecycle) | **Phase 3 (App/Commerce)**: Studio Admin UI allows transitioning order status to `refunded` upon customer return. | **Phase 1/2/3 (DB/Edge)**: No Edge Function exists to disburse automated refunds via Razorpay API. | `src/studio/pages/OrderDetail.tsx` (UI state transitions) | `supabase/functions/` (Absence of `refund-payment` function); Finding `F-P3-01` | An administrator might expect clicking "Refund" to electronically return funds, whereas payment gateway refund must be executed manually in Razorpay Dashboard. | Documented as luxury concierge manual workflow; DB status updates independently of gateway payout. | **YES** |
| **CTR-02** | Security ↔ Customer Identity (Guest Linkage) | **Phase 2 (Identity)**: `customers.id` was originally designed as matching `auth.uid()`. | **Phase 3 (Commerce)**: Guest checkout creates customer records with random UUIDs before account creation. | `supabase/migrations/20260706000001_create_order_system.sql` | `src/services/customerAuthService.ts` / `20260816000000_...sql` | If a guest user later registers with the same email, `auth.uid()` cannot overwrite the existing `customers.id` without foreign key cascading violations. | Resolved in Phase 2/3 via `upsert_customer_profile` RPC linking by unique email without mutating PK. | **YES** |
| **CTR-03** | Payment ↔ Database (Dual-Path Race Condition) | **Phase 3 (Client Flow)**: Client browser invokes `verify-payment` immediately upon Razorpay modal completion. | **Phase 3 (Serverless Flow)**: Razorpay asynchronously dispatches `payment.captured` webhook to `razorpay-webhook`. | `src/services/paymentService.ts` (`verifyPayment` API call) | `supabase/functions/razorpay-webhook/index.ts` (Event handler) | If both paths execute simultaneously, a race condition could attempt double order confirmation or duplicate inventory reduction. | Both call `confirm_paid_order` with `FOR UPDATE` lock and `payment_events` unique constraint. | **YES** |
| **CTR-04** | Webhook ↔ Inventory (Stock Deduction Timing) | **Phase 1 (Foundation)**: Assumed inventory is reserved/deducted at cart checkout initiation. | **Phase 3 (Commerce)**: Inventory is checked at order creation, but only permanently deducted upon `confirm_paid_order` execution. | `engineering/audit/phase-1/PHASE-1-MASTER-PLAN.md` | `supabase/migrations/20260718000000_reconcile_order_schema.sql` | Potential stock overselling if two users initiate checkout for the last item simultaneously and both pay. | `create_order` checks available stock; `confirm_paid_order` decrements with locking. | **YES** |
| **CTR-05** | Application ↔ Infrastructure (Local Env vs Linked Cloud) | **Phase 4 (Infra)**: Staging project `zalbmbhczouhrdboucfe` is linked and authoritative for all testing. | **Phase 1/4 (Config)**: Local `.env` contains `VITE_SUPABASE_PROJECT_ID="kbvjmcnaaogkbnerjcoc"` (Production ID). | `npx supabase projects list` (`linked: true` for `zalbmbhczouhrdboucfe`) | `.env` lines 1–3 (`VITE_SUPABASE_URL` pointing to `kbvjmcnaaogkbnerjcoc`) | Local build and prerender script query `.env` (production read-only URL) while database CLI points to staging. | Finding `F-P4-01` classified as acceptable risk (public read-only anon key). | **YES** |
| **CTR-06** | Infrastructure ↔ SEO (404 Response Code vs Dynamic Fallback) | **Phase 4 (SEO Standard)**: Non-existent pages must return HTTP 404 status code to search crawlers. | **Phase 4 (SPA Delivery)**: Dynamic non-existent routes (e.g. `/product/deleted-id`) return HTTP 200 via `dist/index.html` rewrite. | `production/09_SEO_AUDIT.md` (HTTP 404 requirement) | `vercel.json` SPA catch-all rewrite rule `{"source": "/((?!assets/).*)", "destination": "/index.html"}` | Search bots could perceive soft-404s if client does not explicitly signal noindex. | `ProductDetail.tsx` dynamically injects `<meta name="robots" content="noindex, nofollow" />` on missing entities. | **YES** |
| **CTR-07** | SSG ↔ SEO (Prerender Scope vs Catalog Growth) | **Phase 4 (SSG Audit)**: Static HTML files are generated for 20 known routes during build time. | **Phase 3 (Studio Operations)**: Administrators can create and publish new products and collections dynamically in Studio. | `scripts/prerender.js` (Discovers published routes at build time) | `src/studio/pages/ProductWorkspace.tsx` (Dynamic publishing) | Newly published products after a build will serve client-rendered SPA fallback until the next CI build runs. | Search indexing of new products requires triggering a production redeployment. | **YES** |
| **CTR-08** | Application ↔ Performance (Heavy Video Assets vs Bundle Budget) | **Phase 1 (Perf Standard)**: All assets in build must adhere to strict size and compression budgets. | **Phase 4 (Brand Experience)**: Luxury campaign pages feature full-width high-definition brand video loops. | `production/07_PERFORMANCE_AUDIT.md` (< 500 kB chunk threshold) | `src/data/collectionVideos.ts` (Remote MP4 URLs) | Serving heavy video from app bundle would destroy LCP and mobile data performance. | Resolved by hosting video files on external Supabase Storage CDN with 1-year immutable caching. | **YES** |
| **CTR-09** | Phase 1 (Report 15) ↔ Phase 4 (Staging Migrations) | **Phase 3 Report `15`**: Recorded that staging only had migration 1 applied and failed schema checks. | **Phase 4 Report `21`**: Recorded that staging has 18/18 migrations applied and is 100% synchronized. | `production/phase-3/15_MIGRATION_RECONCILIATION_STAGING.md` | `production/phase-4/21_PHASE_4_FINAL_GATE.md` & `npx supabase migration list --linked` | Stale historical report in Phase 3 directory contradicts current verified database state. | Live database query confirms 18/18 applied; Report 15 was an intermediate pre-reconciliation capture. | **YES** |
| **CTR-10** | SEO Canonicals ↔ DNS Public Delegation | **Phase 4 (SEO Audit)**: Prerendered HTML and sitemaps declare canonical URLs at `https://houseofpadmavati.com/`. | **Phase 4 (Network Audit)**: Domain `houseofpadmavati.com` currently resolves to NXDOMAIN on public DNS. | `dist/index.html` canonical link tags | `Resolve-DnsName houseofpadmavati.com` -> NXDOMAIN | Canonical URLs point to a domain that is not yet routed on the public internet. | Standard pre-launch staging posture; domain will be mapped at Phase 5 Go-Live cutover. | **YES** |

---

## 3. Contradiction Summary & Next Steps

- **Total Cross-Phase Contradictions Catalogued**: 10 items.
- **Categorization**:
  - Architectural / Operational Trade-offs: 4 (CTR-01, CTR-04, CTR-07, CTR-08)
  - Concurrency & Identity Boundary Designs: 2 (CTR-02, CTR-03)
  - Environment & Delivery Configurations: 3 (CTR-05, CTR-06, CTR-10)
  - Historical Documentation Drift: 1 (CTR-09)
- **Part 2 Disposition Requirement**: All 10 items are flagged for formal evidence reconciliation in Phase 5 Part 2.

**Contradiction Register Status**: **DOCUMENTED & READY FOR PART 2 RECONCILIATION**.

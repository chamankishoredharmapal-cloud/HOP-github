# HOP FINAL COMPLETION TODO — MASTER EXECUTION REGISTER

**Document ID**: HOP-MASTER-TODO-2026-10-08  
**Version**: 1.0.0  
**Classification**: AUTHORITATIVE REAL COMPLETION REGISTER  
**Audit Scope**: House of Padmavati (`E:\HOP`) & AI Marketing System (`E:\DHARMAPAL'S MARKETING`)  
**Timestamp**: 2026-10-08T02:25:00+05:30  
**Status**: ACTIVE EXECUTION  

---

## 0. EXECUTIVE STATUS SUMMARY

| Area | Status | Verified Evidence |
| :--- | :---: | :--- |
| **Marketing Engine Tests** | ✅ PASS | 803/803 tests pass across all 13 suites in isolated subprocesses |
| **Marketing UI Cockpit** | ✅ PASS | 11/11 tests pass; production build `tsc --noEmit && vite build` clean (265 kB) |
| **Website Frontend Build** | ✅ PASS | `pnpm run build` succeeds in 9.55s; 29/29 routes prerendered cleanly |
| **Website Typecheck & Lint** | ✅ PASS | `tsc --noEmit` exits 0 (0 errors); `eslint .` exits 0 (0 errors) |
| **Website Unit Tests** | ✅ PASS | 23/23 tests pass in `vitest run src/lib/__tests__` |
| **Cloudflare Pages Production** | ✅ ACTIVE | `https://hop-production.pages.dev` returns HTTP 200 (47,086 bytes) |
| **Cloudflare Pages Staging** | ✅ ACTIVE | `https://hop-staging.pages.dev` returns HTTP 200 (47,086 bytes) |
| **Custom Domain DNS** | 🔴 BLOCKED | `houseofpadmavati.com` has NO DNS records at registrar (`getaddrinfo failed`) |
| **Meta Graph API Access** | ✅ UNBLOCKED | HTTP 200 on `/v22.0/app`, `/roles`, `/accounts`; Administrator verified |
| **Meta OAuth Callback** | ✅ LISTENING | Port 8413 active; listener daemon running; redaction & security locked |
| **Meta Real Authorization** | 🟡 PENDING | Awaiting operator browser consent on Facebook OAuth dialog |
| **Razorpay LIVE Payment** | 🟡 PENDING | Awaiting operator live ₹1 authorization & refund verification |
| **Catalog Seeding** | 🟡 PENDING | Only 2 test products currently published in database |
| **Content Batch 1** | 🟡 PENDING | Marketing content directories empty; awaiting campaign creation & approval |
| **Security Isolation** | ✅ VERIFIED | Zero secrets in git; .gitignore covers all runtime tokens, codes, and listener state |

---

## 1. MASTER TODO REGISTER

```
PRIORITY TIERS:
P0 — BLOCKS LAUNCH (Must be resolved before accepting public customers)
P1 — REQUIRED BEFORE MARKETING (Must be resolved before automated social campaigns)
P2 — REQUIRED AFTER LAUNCH (Performance, analytics, post-launch hypercare)
P3 — OPTIONAL / FUTURE / HYGIENE (Enhancements and non-blocking optimizations)
```

---

### P0 — BLOCKS LAUNCH

#### `P0-DNS-01`: Custom Apex & WWW Domain DNS Delegation
- **Area**: Website Production / Infrastructure
- **Description**: The official production domain `houseofpadmavati.com` and `www.houseofpadmavati.com` fail DNS resolution. DNS records must be configured at the domain registrar to route to Cloudflare Pages.
- **Current status**: 🔴 BLOCKED
- **Evidence**: `Resolve-DnsName houseofpadmavati.com` exits code 1; `curl` returns `[Errno 11001] getaddrinfo failed`. Meanwhile, `https://hop-production.pages.dev` returns HTTP 200.
- **Dependency**: Domain Registrar account access (GoDaddy/Namecheap/Cloudflare Registrar).
- **Human action required?**: YES. Domain Administrator must map CNAME/A records to `hop-production.pages.dev` or delegate nameservers.
- **Exact completion condition**: `Resolve-DnsName houseofpadmavati.com` resolves successfully; `curl -I https://houseofpadmavati.com` returns HTTP 200 with active SSL.
- **Safe to execute automatically?**: NO (Requires external registrar credentials).
- **Files affected**: Domain registrar DNS manager, Cloudflare Pages Custom Domain settings.
- **Test required**: `Resolve-DnsName houseofpadmavati.com -Type A`, `curl -I https://houseofpadmavati.com`.
- **Final verification method**: Live browser navigation to `https://houseofpadmavati.com` loads the production luxury storefront over HTTPS.

#### `P0-PAY-01`: Razorpay LIVE Credentials & Vault Secret Activation
- **Area**: Payments / Backend Infrastructure
- **Description**: Ensure Razorpay LIVE keys (`rzp_live_...`) and webhook secret are injected into production Supabase Edge Functions secrets (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`).
- **Current status**: 🟡 PENDING HUMAN CONFIRMATION
- **Evidence**: Supabase Edge Function `create-razorpay-order` dynamically reads `Deno.env.get("RAZORPAY_KEY_ID")` and passes it to the frontend `usePayment.ts`. Staging tested with test keys; production secrets must be confirmed active.
- **Dependency**: Active Razorpay Merchant Dashboard in LIVE mode with approved KYC.
- **Human action required?**: YES (E-Commerce Manager / Founder must confirm production secrets in Supabase Dashboard).
- **Exact completion condition**: `create-razorpay-order` issues live Razorpay order IDs without 500 configuration errors.
- **Safe to execute automatically?**: NO (Human-only financial credentials gate).
- **Files affected**: Supabase Dashboard Edge Function Secrets (`kbvjmcnaaogkbnerjcoc`).
- **Test required**: `curl -I https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`.
- **Final verification method**: Edge Function logs show `RAZORPAY_KEY_ID available: true`.

#### `P0-PAY-02`: Controlled ₹1 Live Authorization & Immediate Refund Verification
- **Area**: Payments / Commerce Verification
- **Description**: Execute a controlled ₹1.00 live transaction on the production checkout flow, confirm database order creation and webhook receipt, then immediately refund the transaction.
- **Current status**: 🟡 PENDING (Awaits P0-PAY-01 and operator card authorization)
- **Evidence**: Documented in `productionTODO.md` as mandatory gate COND-03. Webhooks tested 20/20 on staging, but zero live transactions have been captured in production.
- **Dependency**: P0-PAY-01.
- **Human action required?**: YES. Human operator must authorize a ₹1.00 payment using real payment instrument in the Razorpay checkout modal.
- **Exact completion condition**: ₹1.00 transaction appears as `captured` in Razorpay LIVE dashboard, Supabase `payments` table records success, order status moves to `confirmed`, and ₹1.00 is refunded within 5 minutes.
- **Safe to execute automatically?**: NO (Requires real payment credentials).
- **Files affected**: `orders`, `payments`, `payment_events` tables in Supabase production.
- **Test required**: Live storefront checkout flow → verify-payment → refund RPC.
- **Final verification method**: Net transaction impact is ₹0.00 (refunded); complete audit trail present in database.

#### `P0-CAT-01`: Production Product Catalog Seeding
- **Area**: Merchandising / Catalog
- **Description**: The production catalog currently contains only 2 published products. A luxury e-commerce launch requires the full curated launch inventory across all 5 collections (Kalyani, Viara, Arya, Padma, Yugen).
- **Current status**: 🟡 PENDING (2 products present in production database)
- **Evidence**: `pnpm run build` output: `Found 2 published products, Found 5 collections`.
- **Dependency**: Final product SKUs, photography, weave notes, and pricing from Brand Director / Founder.
- **Human action required?**: YES. Provide production product data.
- **Exact completion condition**: Launch catalog (minimum 10-15 sarees) inserted into `products`, `product_images`, and `inventory_history` tables with `status = 'published'`.
- **Safe to execute automatically?**: NO (Merchandising and pricing data must be authoritatively supplied).
- **Files affected**: Supabase `products`, `product_images` tables.
- **Test required**: `pnpm run build` prerenders all product pages; `/collections` showcases full assortment.
- **Final verification method**: `SELECT count(*) FROM products WHERE status = 'published'` matches launch list.

---

### P1 — REQUIRED BEFORE MARKETING

#### `P1-SOC-01`: Meta OAuth Final Human Consent & Token Exchange
- **Area**: Social Dispatcher / Meta Integration
- **Description**: Complete the Meta OAuth consent dialog in the browser to obtain an authorization code, exchange it for permanent Page access token for "Chaman Dharmapal", and discover linked Instagram "@dharmapal_management_test_01".
- **Current status**: 🟡 WAITING FOR HUMAN ACTION (Preflight PASS, listener active on port 8413)
- **Evidence**: Graph API preflight passed (`GET /app`, `/roles`, `/accounts` all 200 OK); admin role verified; port 8413 actively listening; OAuth URL inspected and valid.
- **Dependency**: Operator completing login/consent in the opened Meta authorization browser.
- **Human action required?**: YES. Operator must click "Continue" / "Grant Permissions" in the opened browser window.
- **Exact completion condition**: Browser redirects to `http://localhost:8413/callback?code=...`; daemon exchanges code for tokens; `.facebook_connection.json` and `.instagram_connection.json` update to `CONNECTED` and `TOKEN_VALID`.
- **Safe to execute automatically?**: Code exchange and discovery are automatic once human consents in browser.
- **Files affected**: `integrations/social/.facebook_token.json`, `.facebook_connection.json`, `.instagram_token.json`, `.instagram_connection.json`.
- **Test required**: `py -3 -m integrations.social.cli meta status`, `py -3 -m integrations.social.cli facebook verify`.
- **Final verification method**: CLI reports `Connection: CONNECTED`, `Token: TOKEN_VALID` for both Facebook Page and Instagram.

#### `P1-SOC-02`: Controlled Test Publishing, Verification & Idempotency Check
- **Area**: Social Dispatcher / Publishing Pipeline
- **Description**: Publish controlled test post to test Page ("Chaman Dharmapal") and linked Instagram ("@dharmapal_management_test_01"), verify publication permalink via Graph API, query insights, and verify replay idempotency prevents duplicate posting.
- **Current status**: 🟡 PENDING P1-SOC-01
- **Evidence**: Test content objects exist in `content/approved/PHASE13B-FACEBOOK-CONNECTION-TEST` and `PHASE13A-INSTAGRAM-CONNECTION-TEST`. Test mode guard (`assert_publish_allowed`) enforces strict account allowlisting.
- **Dependency**: P1-SOC-01.
- **Human action required?**: Gate 2 approval sign-off.
- **Exact completion condition**: Test post appears on Facebook Page; permalink returns HTTP 200; replay of exact same execution returns existing ledger entry with 0 duplicate posts.
- **Safe to execute automatically?**: YES (Strictly within test-mode boundary).
- **Files affected**: `integrations/social/.ledger.json`.
- **Test required**: `cli.py facebook test-publish`, `cli.py facebook publication-status`, `cli.py facebook insights`.
- **Final verification method**: Live Facebook Page permalink verification and ledger idempotency match.

#### `P1-MKT-01`: Generation & Gate 2 Approval of Launch Content Batch
- **Area**: Content Production / Marketing Operations
- **Description**: Content directories (`content/ideas`, `content/scripts`, `content/published`, `content/assets`) are currently empty of campaign materials. Produce and approve the first batch of 3-5 launch posts covering brand positioning, artisan spotlight, and collection narratives.
- **Current status**: 🟡 PENDING CONTENT GENERATION
- **Evidence**: `content/scripts` and `content/published` contain 0 files; only connection test objects exist.
- **Dependency**: Brand positioning files in `brand/HOP/`.
- **Human action required?**: YES (CHAMAN Gate 2 Approval on generated content packages).
- **Exact completion condition**: 3-5 approved content folders created under `content/approved/` with captions, media URLs, and signed `approval.md` files matching Content_SHA256 checksums.
- **Safe to execute automatically?**: Draft generation is automated; approval requires human CHAMAN.
- **Files affected**: `content/briefs/`, `content/scripts/`, `content/approved/`.
- **Test required**: `py -3 -m integrations.social.approval` validation.
- **Final verification method**: Approval interlock verifies checksums and signatures for all batch 1 items.

#### `P1-SEC-01`: Meta App Secret Rotation Prior to Production Mode
- **Area**: Security / Governance
- **Description**: The Meta App Secret was exposed during early development iterations. Rotate the App Secret in the Meta Developer Dashboard before transitioning the app to live production mode.
- **Current status**: 🟡 REQUIRED BEFORE PRODUCTION LAUNCH
- **Evidence**: User prompt explicitly records that App Secret was previously exposed during development.
- **Dependency**: Access to Meta Developer Dashboard (`developers.facebook.com`).
- **Human action required?**: YES. Operator must click "Reset Secret" in App Dashboard → Basic Settings and update `.env`.
- **Exact completion condition**: New secret saved in `.env`; old secret deactivated; Graph API preflight verifies new secret.
- **Safe to execute automatically?**: NO (External Meta Developer Dashboard action).
- **Files affected**: `.env`, Meta App Dashboard.
- **Test required**: Re-run `test_meta_graph.py` with rotated secret.
- **Final verification method**: Graph API responds with HTTP 200 using new credentials.

---

### P2 — REQUIRED AFTER LAUNCH

#### `P2-MED-01`: High-Resolution Static Image Optimization (WebP/AVIF)
- **Area**: Performance / Asset Pipeline
- **Description**: Convert large static image files (such as `hero-image.png` at 2.79 MB and `hop-brand-board.png` at 1.84 MB) to optimized WebP/AVIF formats to reduce first-contentful-paint transfer sizes.
- **Current status**: 🟡 BASELINE WORKS, OPTIMIZATION DESIRED
- **Evidence**: Asset inspection shows images up to 2.79 MB in `src/assets/`.
- **Dependency**: None.
- **Human action required?**: NO.
- **Exact completion condition**: Assets compressed and converted; `pnpm run build` bundle size reduced.
- **Safe to execute automatically?**: YES.
- **Files affected**: `E:\HOP\src\assets\`, `E:\HOP\public\`.
- **Test required**: `pnpm run build` succeeds and images display correctly.
- **Final verification method**: Largest image asset < 300 KB.

#### `P2-ANA-01`: Production Analytics & Meta Pixel Firing Verification
- **Area**: Analytics / Attribution
- **Description**: Confirm production Google Analytics 4 stream and Meta Pixel are active and recording standard e-commerce events (`view_item`, `add_to_cart`, `purchase`) on `houseofpadmavati.com`.
- **Current status**: 🟡 PENDING CUSTOM DOMAIN LAUNCH
- **Evidence**: Verified in staging code; requires custom domain traffic to verify live production stream.
- **Dependency**: P0-DNS-01.
- **Human action required?**: NO.
- **Exact completion condition**: GA4 Realtime and Meta Events Manager show incoming events from live domain.
- **Safe to execute automatically?**: YES once IDs are injected.
- **Files affected**: `E:\HOP\index.html`, `src/services/analytics.ts`.
- **Test required**: Browser network payload inspection for `collect` and `tr/` requests.
- **Final verification method**: Real-time console logs and dashboard hit counters reflect customer visits.

#### `P2-OPS-01`: Post-Launch 72-Hour Hypercare Monitoring Cadence
- **Area**: SRE / Operations
- **Description**: Maintain War Room monitoring for the first 72 hours post-launch (5-minute alert windows for 5xx errors, payment drops, or Edge Function timeouts).
- **Current status**: ⚪ DOCUMENTED IN SOP
- **Evidence**: `productionTODO.md` Section 16 outlines hypercare procedures.
- **Dependency**: P0-DNS-01, P0-PAY-02.
- **Human action required?**: SRE / DevOps on-call presence.
- **Exact completion condition**: 72 hours elapsed post-launch with 0 P0 incidents.
- **Safe to execute automatically?**: NO.
- **Files affected**: Monitoring alerts, incident logs.
- **Test required**: Uptime check verification.
- **Final verification method**: 99.9% uptime and 0 unhandled exceptions across hypercare window.

---

### P3 — OPTIONAL / FUTURE / HYGIENE

#### `P3-PKG-01`: Manifest Hygiene in `E:\HOP\package.json`
- **Area**: Code Hygiene
- **Description**: Update `package.json` manifest name from `"vite_react_shadcn_ts"` to `"house-of-padmavati"` and remove unused `"express"` and `"serve-static"` dependencies.
- **Current status**: ⚪ READY TO EXECUTE
- **Evidence**: `package.json` line 2 (`"name": "vite_react_shadcn_ts"`), line 56 (`"express"`), line 67 (`"serve-static"`).
- **Dependency**: None.
- **Human action required?**: NO.
- **Exact completion condition**: Clean manifest without unused server dependencies.
- **Safe to execute automatically?**: YES.
- **Files affected**: `E:\HOP\package.json`.
- **Test required**: `pnpm run build` exits 0.
- **Final verification method**: `package.json` inspection.

#### `P3-DEP-01`: ₹200 Deposit Model Production Evaluation
- **Area**: Business Strategy / Checkout Option
- **Description**: Model B (₹200 deposit + balance on delivery) is implemented in local schema and Edge Functions (`mark-delivery-paid`). Evaluate whether to expose this payment selector on production storefront alongside full payment.
- **Current status**: ⚪ IMPLEMENTATION READY LOCALLY, PENDING BUSINESS DECISION
- **Evidence**: `productionreadyHOP.md` Section 9.
- **Dependency**: Founder business decision.
- **Human action required?**: YES (Founder / Brand decision).
- **Exact completion condition**: Explicit sign-off to enable or keep hidden.
- **Safe to execute automatically?**: NO.
- **Files affected**: `src/pages/Checkout.tsx`.
- **Test required**: Deposit E2E test.
- **Final verification method**: Order created with `deposit_paid` status.

#### `P3-VID-01`: Production Video Storytelling Assets
- **Area**: Creative / Media
- **Description**: Currently 0 video files exist. Produce artisan loom videos and drape motion reels for brand storytelling.
- **Current status**: ⚪ FUTURE ROADMAP
- **Evidence**: Media audit confirms 0 video assets.
- **Dependency**: Videography production in Patan / weaver clusters.
- **Human action required?**: Production team filming and editing.
- **Exact completion condition**: High-res video assets uploaded to CDN and linked in lookbook.
- **Safe to execute automatically?**: NO.
- **Files affected**: `E:\HOP\public\videos\`.
- **Test required**: Video playback and viewport responsiveness tests.
- **Final verification method**: Video hero stream verified on mobile and desktop.

# Phase 5 — Human Action & Operational Responsibility Register

**Document ID**: HOP-PROD-PH5-013  
**Audit Phase**: Phase 5 — Independent Reconciliation & Go/No-Go (Part 2 Step 13)  
**Execution Timestamp**: 2026-08-17T15:00:00+05:30  
**Auditor**: Independent Final Audit Authority  
**Authoritative Status**: **REGISTER ESTABLISHED — STOPPED AT DEPLOYMENT GATE**  

---

## 1. Governance & Classification Protocol

In strict compliance with the Phase 5 mandate, operational prerequisites requiring authorized human execution are explicitly catalogued.

Human actions are categorized as either:
- **BLOCKING HUMAN ACTION (PRE-LAUNCH GATEWAY / TRAFFIC CUTOVER)**: Mandatory administrative actions required immediately prior to or during live traffic cutover. These do **not** indicate a software defect, but are the explicit real-world prerequisites for public operation.
- **NON-BLOCKING HUMAN ACTION (POST-LAUNCH OPERATIONS)**: Ongoing operational, financial, and fulfillment workflows governed by Standard Operating Procedures.

---

## 2. Master Human Action & Responsibility Register

| Action ID | Operational Human Action | Why It Is Required | Responsible Role | Execution Timing | Risk If Omitted | Classification | Evidence Required for Closure | Current Status |
|---|---|---|---|---|---|---|---|---|
| **HA-01** | Production Supabase Database Migration | Apply all 18 canonical migrations to the untouched production Supabase project (`kbvjmcnaaogkbnerjcoc`). | Lead Database Engineer / Release Manager | T-minus 2 hours before traffic cutover | Storefront fails to load dynamic products or insert orders due to missing schema. | **BLOCKING HUMAN ACTION** | Output of `supabase migration list` on production showing 18/18 applied. | **PENDING AUTHORIZATION** |
| **HA-02** | Production Supabase Edge Functions Deployment | Deploy all 7 Edge Functions (`create-razorpay-order`, `verify-payment`, `razorpay-webhook`, etc.) to production Supabase project. | Backend Engineer / DevOps Lead | T-minus 2 hours before traffic cutover | Checkout and payment flows fail with 404/500 errors. | **BLOCKING HUMAN ACTION** | Output of `supabase functions list` on production showing 7 ACTIVE functions. | **PENDING AUTHORIZATION** |
| **HA-03** | Razorpay Live Gateway Credentials Injection | Configure live production credentials (`VITE_RAZORPAY_KEY_ID=rzp_live_...` in Vercel, `RAZORPAY_KEY_SECRET` in Supabase Secrets). | E-Commerce Manager / DevOps Lead | T-minus 1 hour before traffic cutover | Customers cannot process real-money payments (system remains in test mode). | **BLOCKING HUMAN ACTION** | Successful live ₹1 authorization capture and instant refund test. | **PENDING AUTHORIZATION** |
| **HA-04** | Razorpay Live Webhook URL Configuration | Add production webhook endpoint (`https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`) in Razorpay Live Dashboard and set secret. | Lead DevOps Engineer | T-minus 1 hour before traffic cutover | Asynchronous payment confirmations fail to update database orders. | **BLOCKING HUMAN ACTION** | Razorpay dashboard webhook ping test returns HTTP 200/400. | **PENDING AUTHORIZATION** |
| **HA-05** | Production Domain DNS Cutover | Map apex `houseofpadmavati.com` and `www.houseofpadmavati.com` A/CNAME records to Vercel global edge network. | Domain Administrator / Lead DevOps | T-minus 30 mins before launch (Go-Live) | Storefront remains inaccessible at the official brand domain. | **BLOCKING HUMAN ACTION** | `Resolve-DnsName houseofpadmavati.com` returns Vercel IP addresses + valid SSL certificate. | **PENDING AUTHORIZATION** |
| **HA-06** | Production Vercel Deployment Promotion | Trigger production build and promotion of verified commit (`da6158f`) on Vercel. | Release Manager | T-minus 30 mins before launch | Production domain serves stale or default page. | **BLOCKING HUMAN ACTION** | Vercel production deployment URL returns HTTP 200 with pre-rendered luxury storefront. | **PENDING AUTHORIZATION** |
| **HA-07** | Luxury Concierge Refund Operations | Finance officer physically inspects returned luxury silk garment, logs into Razorpay Dashboard, and issues refund. | Finance Officer / Concierge Support | Ongoing Post-Launch Operations | Customer does not receive money back for returned garment. | **NON-BLOCKING HUMAN ACTION** | Signed refund receipt logged in internal financial ERP. | **GOVERNED BY SOP 11** |
| **HA-08** | Order Fulfillment & Studio Tracking | Warehouse staff inspects sari, packs in signature luxury packaging, and updates Studio status (`confirmed -> packed -> shipped`). | Fulfillment Lead / Studio Manager | Ongoing Post-Launch Operations | Delayed shipment or untracked delivery to luxury client. | **NON-BLOCKING HUMAN ACTION** | Shipping tracking number entered in Studio Order Detail. | **GOVERNED BY SOP 11** |
| **HA-09** | Periodic Inventory Reconciliation Audit | Physical count of luxury inventory matched against Studio stock levels. | Inventory Manager | Weekly / Monthly Operations | Ghost inventory or overselling rare one-of-a-kind silk saris. | **NON-BLOCKING HUMAN ACTION** | Physical count audit log signed and updated via `admin_update_inventory`. | **GOVERNED BY SOP 11** |
| **HA-10** | External APM Monitoring Ownership | Lead DevOps monitors error trends in Vercel logs and Supabase dashboard; optionally links Sentry. | Lead DevOps Engineer | Post-Launch Monitoring | Unnoticed client exceptions or edge function timeout spikes. | **NON-BLOCKING HUMAN ACTION** | Daily telemetry review log. | **GOVERNED BY SOP 18** |

---

## 3. Human Action Sign-Off Boundary

- **Total Human Actions Identified**: 10 actions.
- **Blocking Pre-Launch Human Actions**: 6 actions (HA-01 through HA-06).
- **Non-Blocking Post-Launch Human Actions**: 4 actions (HA-07 through HA-10).
- **Execution Authority**: The Phase 5 audit authority confirms that all software, schemas, configurations, and procedures are **100% prepared** for human execution.
- **Safety Reminder**: The audit authority is strictly **NOT authorized** to execute these actions. Execution requires explicit human management authorization.

**Human Action Register Status**: **DOCUMENTED & PREPARED FOR HUMAN EXECUTION**.

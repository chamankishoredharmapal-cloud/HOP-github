# COND-05 Production DNS & SSL Configuration Evidence

**Date**: 2026-09-26 15:35:00 IST
**Target Domain**: `houseofpadmavati.com`
**Alternative Hostname**: `www.houseofpadmavati.com`
**Target Destination**: `hop-production.pages.dev`
**Hosting Provider**: Cloudflare Pages (Project: `hop-production`)

---

## 1. Cloudflare Pages Custom Domain Mapping

The custom domains were added to the `hop-production` Cloudflare Pages project via Cloudflare API:

| Hostname | Pages Project | Cloudflare Status | Verification Status | Target Canonical Host |
|----------|---------------|-------------------|---------------------|-----------------------|
| `houseofpadmavati.com` | `hop-production` | `pending` | `pending` (awaiting DNS CNAME/Apex) | `hop-production.pages.dev` |
| `www.houseofpadmavati.com` | `hop-production` | `pending` | `pending` (awaiting DNS CNAME) | `hop-production.pages.dev` |

---

## 2. DNS Investigation & Registrar Status

- Global DNS Lookup (`Resolve-DnsName houseofpadmavati.com`): `DNS_ERROR_RCODE_NAME_ERROR` (NXDOMAIN).
- Authoritative TLD (.com) query to `a.gtld-servers.net`: Confirms domain is registered but external nameservers are currently non-resolving or awaiting nameserver cutover at registrar.
- Cloudflare Pages Target: `hop-production.pages.dev` is fully active with valid SSL, HSTS, CSP, and serves the live storefront.

---

## 3. Required Operational Action for Domain Administrator

To finalize DNS cutover:
1. Log into domain registrar (or authoritative DNS host).
2. Point apex `houseofpadmavati.com` to `hop-production.pages.dev` (via CNAME flattening or Cloudflare proxy).
3. Point `www.houseofpadmavati.com` via CNAME to `hop-production.pages.dev`.
4. Cloudflare Pages will automatically validate ownership and activate the Universal SSL certificate.

---

## 4. Current Status
- Cloudflare Pages configuration: **READY**
- Target infrastructure: **ACTIVE & SERVING TRAFFIC** (`hop-production.pages.dev`)
- External DNS cutover: **PENDING REGISTRAR CNAME DELEGATION**

# Known Bugs — House of Padmavati

> Add new bugs here as discovered. Remove when fixed.

## Active

| ID | Description | Severity | Found | Status |
|----|-------------|----------|-------|--------|
| None | All certified defects resolved | — | — | Clean |

## Fixed

| ID | Description | Fix | Date |
| BUG-001 | Missing adjust_product_stock RPC in production DB blocks inventory modal | Created atomic RPC with FOR UPDATE locking, negative stock prevention, and public.is_admin() auth guard | 2026-10-04 |
| BUG-002 | Studio Journal saves to localStorage; storefront reads static journalArticles.ts | Created public.journal_articles table with RLS, seeded 6 articles, connected Studio & storefront reactively | 2026-10-04 |
| BUG-003 | Settings table not consumed by public storefront | Created get_public_store_settings() RPC and wired dynamic social/brand links to HopFooter | 2026-10-04 |
| BUG-004 | Studio audit log uses browser localStorage only | Created public.studio_activities table with admin RLS for shared multi-admin persistence | 2026-10-04 |
| BUG-005 | Prerendered HTML captured loading skeleton instead of dynamic data | Updated prerender script to wait explicitly for __PRERENDER_STATUS=ready and dynamic routes | 2026-10-04 |

# Backlog

## Sprint 4.5

### Checkout
- Verify Edge Function errors propagate correctly through `FunctionsHttpError`
- Improve payment error handling with user-friendly messages
- Finalize Playwright payment suite
- Add payment integration tests for success and failure paths

### Media Library
- Add folder organization for uploaded images
- Support drag-and-drop reordering
- Add bulk delete and multi-select
- Show image dimensions and file size from metadata

### Customers
- Add `status` and `notes` columns to the `customers` table via migration
- Enable customer status management (active / vip / blocked)
- Add customer notes with audit trail

### Permissions
- Wire `PermissionGuard` into studio routes
- Add role management UI in Settings
- Sync role from Supabase Auth `app_metadata` on every auth state change

---

## Sprint 5

### Email Templates
- Transactional email editor for order confirmations, shipping updates
- Preview and test email delivery

### Reporting
- Revenue reports with date range picker
- Exportable CSV/PDF
- Sales by product, collection, and time period

### Coupons & Discounts
- Discount code management with CRUD
- Auto-applied rules (percentage, flat, free shipping)
- Validation at checkout

### Notifications
- In-app notification center
- Email notification preferences per user
- Real-time alerts for new orders and low stock

### Audit Log
- All studio actions logged with user, timestamp, details
- Searchable and filterable audit trail
- Exportable logs

---

## Sprint 6

### Internationalization
- Multi-language support (i18n)
- Currency and locale switching

### Performance
- Image optimization pipeline (WebP, AVIF, responsive srcset)
- Lazy loading for below-fold content
- Bundle analysis and code splitting audit

### SEO
- Structured data (JSON-LD) for products and collections
- Breadcrumb schema
- Automated sitemap generation on publish

### Analytics
- Dashboard integration with Google Analytics 4
- Custom event tracking (add to cart, checkout, purchase)
- Conversion funnel visualization

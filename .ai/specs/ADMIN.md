# Specification: Admin (Studio Dashboard)

## Purpose
Provide a centralized dashboard for managing the e-commerce platform — orders, products, collections, customers, inventory, and content.

## Functional Requirements

### Dashboard
- Summary cards: total orders (today/week/month), revenue, new customers, products
- Revenue chart (Recharts, last 30 days)
- Recent orders list (last 10)
- Low stock alerts
- Quick navigation to all sections

### Products
- Product list: table with pagination, search, filter by status
- Create product form (name, slug, description, price, images, variants, status)
- Edit product form (same fields, pre-populated)
- Product status toggle: draft / active / archived
- Media management: upload, reorder, delete images
- Inventory tracking per product

### Collections
- Collection list with products assigned
- Create/edit collection form (name, slug, description, image, products)

### Customers
- Customer list: table with search (email, name, phone)
- Customer detail: contact info, order history, total spent

### Settings
- Store information, payment settings, shipping, tax

## Common Components
- DataTable: sortable, filterable, paginated, searchable
- Form builder: text, select, date, file upload, rich text
- Modal/Dialog for confirmations
- Toast notifications for all actions (create, update, delete)
- Loading states, empty states, error states per section

## User Journey (Admin)
1. Admin logs in → dashboard overview
2. Sees summary cards and recent orders
3. Navigates to Products → searches, edits a product, saves
4. Toast: "Product updated successfully"
5. Navigates to Orders → filters by pending, processes order
6. Updates status → confirmation modal → toast

## Edge Cases
- No data yet → "No products yet. Create your first product." with CTA
- Large datasets (>1000 rows) → server-side pagination + search
- Concurrent edits → last-write-wins (note in UI)
- Image upload failure → retry with specific file error
- Session timeout → redirect to login, preserve form state

## Acceptance Criteria
- Dashboard: all widgets load within 2s, charts render
- Product CRUD: create, read, update, delete all work with validation
- Order management: list, filter, detail, status update
- Customer search: by email, name, phone — results < 1s
- All actions: toast confirmation, optimistic UI
- Empty states: helpful CTAs, not just "no data"
- Error states: retry button, specific error message

## Analytics Events
- `studio_login`
- `studio_dashboard_view`
- `studio_product_create` { product_name }
- `studio_product_update` { product_id }
- `studio_order_status_change` { order_id, old_status, new_status }
- `studio_customer_search` { search_term }

## Accessibility Requirements
- DataTable: sortable headers with aria-sort, keyboard row navigation
- Forms: labels, error messages, focus management
- Modals: focus trap, Escape to close, aria-labelledby
- Toasts: aria-live="polite"

## Performance Targets
- Dashboard load: < 2s (multiple parallel queries)
- DataTable: rendered rows <= 50 (paginate server-side)
- Image upload: preview < 1s, full upload < 5s
- Lighthouse Performance >= 90

## Future Expansion
- Bulk product edit
- CSV import/export
- Email template editor
- Discount/coupon management
- Blog editor (rich text)
- Role-based access (editor, admin, super-admin)
- Activity log / audit trail

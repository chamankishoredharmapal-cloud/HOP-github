# Studio Guide

## Overview

The Studio is the authenticated editorial workspace at `/studio/*`. It provides CRUD for orders, products, collections, and dashboard analytics — all backed by Supabase.

## Authentication

- Route protection: `AuthGuard` component redirects to `/studio/login` if no session
- Session stored in `localStorage` via Supabase Auth
- Auto-refresh via `onAuthStateChange` listener

## Layout

```
StudioLayout (flex h-screen)
├── StudioSidebar (w-56, collapsible)
│   └── Nav items: Dashboard, Orders, Products, Collections, ...
├── StudioHeader (title + breadcrumb)
└── Content area (flex-1, overflow-auto)
```

## Pages

### Dashboard — `/studio`

4 metric cards + 2 widgets:

| Card | Query | Description |
|------|-------|-------------|
| Revenue Today | `SUM(total) WHERE created_at=today AND payment_status=paid` | Daily revenue |
| Orders Today | `COUNT(*) WHERE created_at=today` | Daily order count |
| Pending Payments | `COUNT(*) WHERE status=pending_payment` | Awaiting payment |
| Customers | `COUNT(*) FROM customers` | Total customers |

Widgets: Recent Orders (last 10), Recent Customers (last 10).

### Orders — `/studio/orders`

| Feature | Implementation |
|---------|---------------|
| Metrics | 4 cards (Orders Today, Revenue Today, Pending, AOV) |
| Search | Debounced 300ms — searches order_number, customer name/email/phone |
| Status tabs | All / Pending / Confirmed / Processing / Shipped / Delivered / Cancelled / Returned |
| Payment filter | All / Paid |
| Table | 8 columns: Order, Customer, Status, Payment, Items, Total, Date, Actions |

### Order Detail — `/studio/orders/:id`

| Section | Content |
|---------|---------|
| Customer | Name, email, phone |
| Items | Table: image, name, price, quantity, subtotal |
| Shipping | Address fields + editable courier and tracking number |
| Payments | Amount, currency, status, Razorpay IDs |
| Actions | Status buttons (Confirm, Pack, Ship, Deliver) + Cancel with dialog |

### Products — `/studio/products`

Grid of product cards with status badges. Each card shows:
- Primary image (or placeholder)
- Name, SKU, selling price, stock
- Status badge (Active / Draft / Archived)

### Product Editor — `/studio/products/:id` or `/studio/products/new`

7-section workspace:

| Section | Key Fields |
|---------|-----------|
| Identity | Name*, SKU*, Slug (auto-generated) |
| Pricing | Selling Price*, MRP, Cost Price |
| Technical | Fabric, Weave, Colour, Occasion, Length, Weight, Care, Country of Origin, Dispatch Days |
| Editorial Story | Rich text area |
| SEO | Meta Title, Meta Description, OG Image URL |
| Media | Image upload with drag-reorder, set primary |
| Checklist | Progress percentage (7 items) |

### Collections — `/studio/collections`

List of collections with status, product count, featured flag.

### Collection Editor — `/studio/collections/:id` or `/studio/collections/new`

Form with:
- Name, Slug, Tagline
- Description, Editorial Story
- Status (Published/Draft)
- Display Order
- Featured on Homepage toggle
- Hero Image upload
- Hero Video upload

### Additional Pages

| Path | Page |
|------|------|
| `/studio/inventory` | Inventory dashboard with stock metrics, adjustments, history |
| `/studio/customers` | Customers (placeholder) |
| `/studio/journal` | Journal (placeholder) |
| `/studio/media` | Media (placeholder) |
| `/studio/settings` | Settings (placeholder) |

## Service Architecture

```
src/studio/services/
├── dashboardService.ts    — 6 queries for dashboard
├── orderService.ts        — 6 queries/mutations for orders
├── productService.ts      — 10 queries/mutations for products
├── collectionService.ts   — 6 queries/mutations for collections
└── authService.ts         — signIn, signOut, getSession
```

All services use `supabase.from()` with typed Database types.

## Hook Architecture

```
src/studio/hooks/
├── useOrders.ts           — 6 React Query hooks
├── useProducts.ts         — 10 React Query hooks
├── useCollections.ts      — 5 React Query hooks
└── useProductForm.ts      — Form state, dirty tracking, auto-slug
```

Each entity follows the pattern: `use<Entity>List`, `use<Entity>`, `useCreate<Entity>`, `useUpdate<Entity>`.

## Known Limitations

1. **RLS on orders**: Zero SELECT policies for `authenticated` users cause empty results
2. **COD filter**: Payment method filter always shows 0 rows (schema doesn't distinguish payment methods)
3. **No file deletion from Studio**: Collection files must be cleaned up separately
4. **No pagination**: Lists load all rows at once

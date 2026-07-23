# Changelog

## Sprint 4.5 — Inventory Management (Current)

- Inventory dashboard with 5 live metric cards (Total Products, In Stock, Low Stock, Out of Stock, Reserved)
- Searchable product list with status filter and sort (name/SKU/stock)
- Stock adjustment dialog with Add/Remove modes
- 7 adjustment reasons (Initial Stock, Purchase, Sale, Return, Damage, Manual Adjustment, Correction)
- Full audit trail via `inventory_history` table — every adjustment records product, change, previous/new stock, reason, notes, timestamp
- Expandable adjustment history per product (date, change, previous, new, reason, notes)
- Low stock thresholds per product with Healthy/Low Stock/Out of Stock badges
- Reserved stock calculation from active orders
- Product Workspace integration — inventory status display with link to manage stock

## Sprint 4.4 — Orders Management

- Order list page with metric cards (Orders Today, Revenue Today, Pending, AOV)
- Search by order ID, customer name, email, phone
- Status tabs (All, Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned)
- Payment filter (All / Paid)
- Order detail page with customer info, items, shipping address, payments
- Status action buttons with confirmation dialog
- Full status flow: pending_payment → confirmed → processing → shipped → delivered
- Cancel order with reason
- Shipping info editor (courier name, tracking number)
- Order metrics query with combined Promise.all
- Debounced search (300ms)

## Sprint 4.3 — Collections CMS

- Collections CRUD in Studio
- File uploads to HOP-films bucket (images + videos)
- Storefront collections queries (fetchCollections, fetchFeaturedCollection, fetchCollectionBySlug)
- Database migration: renamed sort_order→display_order, image_url→hero_image_url
- Added columns: hero_video_url, editorial_story, tagline, featured_on_homepage, status
- Homepage video system with hardcoded COLLECTION_VIDEOS fallback
- RLS policies for anon read on collections + HOP-films bucket

## Sprint 4.2.2 — Storefront Connection

- Product detail page with Supabase queries
- Related products from same collection
- Collection/category page with products grid
- Loading skeletons, error states, empty states
- Price formatting (paise → INR)

## Sprint 4.2 — Product Workspace

- Product list with card grid + status badges
- Product editor with 7 sections (Identity, Pricing, Technical, Story, SEO, Media, Checklist)
- Image upload to product-images bucket
- Image reorder + set primary
- Auto-slug generation from product name
- Dirty tracking with unsaved changes indicator
- Editorial checklist with progress percentage
- Create/update/archive product mutations

## Sprint 4.1.1 — Live Dashboard

- Revenue today (paid orders sum)
- Orders today count
- Pending payments count
- Customer count
- Recent orders table (last 10)
- Recent customers list (last 10)

## Sprint 4.1 — Studio Foundation

- Vite + React + shadcn/ui setup
- Supabase integration
- React Router with studio routes
- AuthGuard + StudioLayout
- Studio sidebar with 9 navigation items
- Login page with email/password
- Placeholder pages for all studio sections

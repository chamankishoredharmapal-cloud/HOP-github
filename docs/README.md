# House of Padmavati — Product Platform

A saree atelier e‑commerce platform with a full editorial workspace and a cinematic storefront, powered by Supabase.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Vite + React 18 + TypeScript |
| **Styling** | Tailwind CSS v3 + shadcn/ui |
| **Routing** | React Router v6 |
| **Server state** | TanStack React Query v5 |
| **Backend** | Supabase (PostgreSQL + PostgREST + Auth + Storage) |
| **Fonts** | Cormorant Garamond (serif), Inter (sans) |

## Project Structure

```
src/
├── components/hop/        # Storefront UI components
├── components/layout/     # PageLayout
├── components/ui/         # 49 shadcn UI primitives
├── contexts/              # Cart, Wishlist (localStorage)
├── data/                  # Hardcoded video URLs
├── integrations/supabase/ # Client + auto-generated types
├── pages/                 # 13 storefront pages
├── services/              # Storefront API functions
├── studio/                # Editorial management workspace
│   ├── components/        # 15 studio components
│   ├── hooks/             # React Query hooks
│   ├── pages/             # 13 studio pages
│   ├── services/          # Supabase queries + mutations
│   └── types/             # TypeScript interfaces
└── App.tsx                # Route definitions + providers
```

## Routes

### Public Storefront

| Path | Page |
|------|------|
| `/` | Homepage (hero, collections, craft, journal) |
| `/collections` | Collection listing |
| `/collections/:slug` | Collection detail with products |
| `/product/:productId` | Product detail |
| `/cart` | Shopping cart |
| `/wishlist` | Saved items |
| `/checkout` | Order creation |
| `/journal` | Journal index |
| `/journal/:slug` | Journal entry |
| `/about` | Our Story |
| `/customer-care` | Customer Care |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |

### Studio (authenticated)

| Path | Page |
|------|------|
| `/studio/login` | Login |
| `/studio` | Dashboard |
| `/studio/orders` | Order list |
| `/studio/orders/:id` | Order detail |
| `/studio/products` | Product list |
| `/studio/products/new` | Product editor |
| `/studio/products/:id` | Product editor |
| `/studio/collections` | Collection list |
| `/studio/collections/new` | Collection editor |
| `/studio/collections/:id` | Collection editor |
| `/studio/inventory` | Inventory |
| `/studio/customers` | Customers |
| `/studio/journal` | Journal |
| `/studio/media` | Media |
| `/studio/settings` | Settings |

## Quick Start

```bash
# Install
npm install

# Environment
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# Development
npm run dev

# Build
npm run build
```

## Documentation

| Document | Purpose |
|----------|---------|
| `ARCHITECTURE.md` | System architecture, data flow, component hierarchy |
| `DATABASE_SCHEMA.md` | Complete schema reference (ERD, enums, indexes, RPCs) |
| `API_REFERENCE.md` | All Supabase queries — storefront + studio |
| `STUDIO_GUIDE.md` | Studio workspace walkthrough |
| `STOREFRONT_GUIDE.md` | Storefront pages and features |
| `DEPLOYMENT.md` | Build, deploy, post-deployment checklist |
| `SECURITY.md` | Auth flow, RLS policies, environment variables |
| `BRAND_SYSTEM.md` | Brand identity (palette, typography, voice) |
| `UI_DESIGN_SYSTEM.md` | Component library, layout, states, animations |
| `EDITORIAL_SYSTEM.md` | Content model, writing guidelines, video system |
| `PERFORMANCE.md` | Bundle size, optimization notes, Lighthouse estimates |
| `QA_CHECKLIST.md` | Pre/post-deployment test points, known issues |
| `ROADMAP.md` | Sprint status, completed features, planned work |
| `CHANGELOG.md` | Feature history by sprint |

### Subdirectories

| Directory | Contents |
|-----------|----------|
| `database/` | Per-table schemas (customers, orders, payments, collections, products, inventory) |
| `studio/` | Workspace guides (dashboard, orders, products, collections, inventory) |
| `storefront/` | Feature guides (homepage, collections + products) |
| `assets/` | Storage structure, naming conventions, optimization |
| `decisions/` | Architecture Decision Records (ADR-001 through ADR-005) |
| `08-development/` | Engineering constitution, coding standards |

## Supabase Project

```
Project ID: kbvjmcnaaogkbnerjcoc
URL:       https://kbvjmcnaaogkbnerjcoc.supabase.co
```

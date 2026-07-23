# Project Architecture — House of Padmavati

## System Overview

House of Padmavati (HOP) is a luxury fashion e-commerce platform built as a React 18 single-page application with a Supabase backend and Razorpay payment processing.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Vite + React 18 SPA                     │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────────────┐   │  │
│  │  │Public   │ │Admin     │ │Shared Components│   │  │
│  │  │Storefront│ │Studio    │ │UI / Layout / Hooks│  │  │
│  │  └─────────┘ └──────────┘ └──────────────────┘   │  │
│  │                                                   │  │
│  │  TanStack Query  │  React Router  │  React Hook Form│
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────────┐
│              Supabase Backend                           │
│  ┌─────────────────┐  ┌───────────────────────────┐    │
│  │  PostgreSQL DB  │  │    Edge Functions         │    │
│  │  - customers    │  │  - create-razorpay-order  │    │
│  │  - orders       │  │  - verify-payment         │    │
│  │  - products     │  │  - razorpay-webhook       │    │
│  │  - collections  │  │  - get-order-confirmation │    │
│  │  - inventory    │  │                           │    │
│  │  - payments     │  │  Row Level Security (RLS) │    │
│  └─────────────────┘  └───────────────────────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Razorpay Payment Gateway                   │
│  Orders → Payment Intents → Webhooks → Confirmation     │
└─────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| React 18 SPA | Fast page transitions, rich interactivity, broad ecosystem |
| Vite + SWC | Fast builds and HMR, modern ESBuild-based bundling |
| TypeScript (non-strict) | Developer velocity with type safety for public surfaces |
| Tailwind CSS + shadcn/ui | Utility-first styling + accessible Radix primitives |
| Supabase (BaaS) | PostgreSQL, auth, Edge Functions, storage, RLS — single platform |
| TanStack React Query | Server state caching, deduplication, background refetching |
| React Router v6 | Lazy loading, nested routes, data loaders |
| Razorpay | Indian payment gateway with full order lifecycle support |
| pnpm workspaces | Monorepo-ready package management |
| Playwright E2E | Cross-browser testing with accessibility-first selectors |

## Two App Architecture

### Public Storefront (`src/pages/`)
- Homepage, Collections, Product Detail, Cart, Checkout, Journal, About, Legal pages
- Routes under `/collections`, `/product/:id`, `/cart`, `/checkout`, `/journal`, etc.
- Served to all visitors; optimized for SEO, performance, and luxury brand experience

### Admin Studio (`src/studio/`)
- Dashboard, Products, Collections, Orders, Inventory, Customers, Journal, Media, Settings
- Routes under `/studio/*` — lazy-loaded, authentication-guarded
- Full CRUD over storefront data with editorial workflows

## Data Flow

```
User Action → React Component → Custom Hook / Context
  → Service Layer (async) → Supabase Client
    → Supabase REST / Realtime → Edge Functions (payments)
      → Response → TanStack Query Cache → Re-render
```

## State Management Strategy

| State Type | Solution | Examples |
|-----------|----------|---------|
| Server state | TanStack React Query | Products, orders, collections |
| Client state | React Context + useReducer | Cart, wishlist |
| Form state | React Hook Form + Zod | Checkout, product forms |
| URL state | React Router params | Product ID, collection slug |
| Persistent state | localStorage | Cart items, wishlist items |

## Authentication & Authorization

- **Storefront**: Guest browsing, no auth required for purchase
- **Admin Studio**: Email/password auth via Supabase Auth
- **RLS Policies**: Row-level security on all tables
  - Customers: own data only
  - Orders: own orders only (storefront), all orders (admin)
  - Products/Collections: public read, admin write

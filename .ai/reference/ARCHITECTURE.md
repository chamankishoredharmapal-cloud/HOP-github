# System Architecture — House of Padmavati

> Consolidates: old `architecture/PROJECT_ARCHITECTURE.md` + `context/PROJECT_CONTEXT.md`

## Overview

React 18 SPA + Supabase backend + Razorpay payments. Hosted on Vercel. Two sub-apps in one codebase: Storefront (public) and Studio (admin, lazy-loaded).

```
Browser → Vite SPA → Supabase REST/Realtime → PostgreSQL + Edge Functions
                   → Razorpay Checkout (PCI DSS Level 1, iframe)
```

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| React 18 SPA | Rich interactivity, broad ecosystem, fast transitions |
| Vite + SWC | Fast builds, ESBuild bundling, HMR |
| TypeScript (non-strict) | Developer velocity with public-surface type safety |
| Tailwind + shadcn/ui | Utility-first + accessible Radix primitives |
| Supabase BaaS | PostgreSQL, Auth, Edge Functions, Storage, RLS — single platform |
| TanStack React Query | Server state caching, dedup, background refetch |
| React Router v6 | Lazy loading, nested routes |
| Razorpay | Indian market, PCI DSS Level 1, full order lifecycle |
| pnpm | Monorepo-ready, fast, disk-efficient |

## Routing

| Path | Component | Lazy? |
|------|-----------|-------|
| `/` | Index | No |
| `/collections` | Collections | Yes |
| `/collections/:slug` | Category | Yes |
| `/product/:productId` | ProductDetail | Yes |
| `/cart`, `/wishlist`, `/checkout`, `/*about` | Various | No |
| `/journal`, `/journal/:slug` | Journal | Yes |
| `/studio/*` | Studio (14 pages) | Yes + AuthGuard |

## State Management

| State Type | Solution |
|-----------|----------|
| Server data | TanStack React Query |
| Client global | Context + useReducer (cart, wishlist) |
| Form | React Hook Form + Zod |
| URL | React Router params |
| Persistent | localStorage |

## Provider Hierarchy

```
QueryClientProvider → TooltipProvider → CartProvider → WishlistProvider → BrowserRouter → ScrollToTop → Suspense → Routes
```

## Data Flow

```
User Action → Component → Hook/Context → Service → Supabase Client → Edge Function → Response → Query Cache → Re-render
```

## Two-App Architecture

**Storefront** (`src/pages/`): Homepage, collections, product, cart, checkout, journal, about, legal. SEO-optimized.

**Studio** (`src/studio/`): Dashboard, products, collections, orders, customers, inventory, journal, media, settings. Auth-guarded, lazy-loaded.

See `reference/TECHNOLOGY_STACK.md` for versions.
See `reference/FOLDER_STRUCTURE.md` for directory layout.
See `reference/DATA_FLOW.md` for detailed data flows.

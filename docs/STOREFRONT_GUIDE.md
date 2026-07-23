# Storefront Guide

## Overview

The storefront is a public, editorial e-commerce experience. It features cinematic video storytelling, collection browsing, and product discovery — all powered by Supabase.

## Page Structure

### Homepage — `/`

```
PageLayout (pt-28 to pt-48 for header clearance)
├── HopHeader (transparent variant on homepage)
├── HeroSection
│   ├── fetchFeaturedCollection() → hero_video_url
│   └── Film component (autoplay, loop, muted)
├── CollectionStage (5 collections alternating)
│   └── Film + info panels
├── CraftSection ("The Craft" brand section)
├── ModernHeirlooms (gift section)
└── JournalPreview (3 entries)
```

### Collection Listing — `/collections`

All published collections in a grid. Each card shows hero image/video.

### Collection Detail — `/collections/:slug`

Products filtered by collection slug. Grid of `ProductCard` components.

### Product Detail — `/product/:productId`

| Section | Implementation |
|---------|---------------|
| Gallery | `ProductGallery` — primary image + thumbnails |
| Info | Name, price (paise → INR formatted), MRP comparison |
| Story | Editorial narrative from `story` field |
| Actions | Add to cart, wishlist toggle |
| Related Products | From same collection (excl. current) |

### Other Pages

| Path | Content |
|------|---------|
| `/cart` | Cart items from `CartContext` (localStorage), checkout button |
| `/wishlist` | Saved items from `WishlistContext` (localStorage) |
| `/checkout` | Customer form + order creation via `create_order()` RPC |
| `/journal` | Journal entry grid placeholder |
| `/journal/:slug` | Journal entry detail |
| `/about` | "Our Story" brand page |
| `/customer-care` | Customer care information |
| `/privacy-policy` | Privacy Policy |
| `/terms-of-service` | Terms of Service |

## Service Layer

```
src/services/
├── collectionService.ts   — 3 queries
├── productService.ts      — 3 queries
└── orderService.ts        — createOrder RPC call
```

## Video System

6 cinematic films drive the homepage experience:

| Video | Source | Location |
|-------|--------|----------|
| Hero | `COLLECTION_VIDEOS.hero` | `src/data/collectionVideos.ts` |
| Collection | `COLLECTION_VIDEOS[kalyanī]` … `COLLECTION_VIDEOS[spandana]` | Same file (keyed by collection slug) |

The `Film` component handles:
- Auto-play with `play()` on `onLoadedData`
- Fallback via `readyState >= 2` check in `useEffect`
- Poster image from `poster` prop, alt text from `alt` prop
- Muted + loop + playsInline attributes
- Cinematic styling via `isCinematic` boolean prop
- Preload mode configurable via `preload` prop

## State Handling

| State | Implementation |
|-------|---------------|
| Loading | `Skeleton` components (animated placeholders) |
| Error | `Card` with `text-destructive` message |
| Empty | `Card` with `text-muted-foreground` message |
| Not Found | Centered text for missing entities |

## Checkout Flow

1. Customer fills email, name, phone, shipping address
2. Cart items + customer info → `create_order()` RPC
3. RPC creates: customer, shipping_address, order, order_items in a transaction
4. Returns `order_number` and `order_id`

# UI Design System

## Component Library

The project uses **shadcn/ui** (49 components) built on Radix UI primitives, styled with Tailwind CSS.

### shadcn Components

```
alert         alert-dialog    aspect-ratio    avatar
badge         breadcrumb      button          calendar
card          carousel        chart           checkbox
collapsible   command         context-menu    dialog
drawer        dropdown-menu   form            hover-card
input         input-otp       label           menubar
navigation-menu  pagination   popover         progress
radio-group   resizable       scroll-area     select
separator     sheet           sidebar         skeleton
slider        sonner          switch          table
tabs          textarea        toast           toaster
toggle        toggle-group    tooltip         use-toast
accordion
```

## Custom Components

### Hop Components (`src/components/hop/`)

| Component | Purpose |
|-----------|---------|
| `Film` | Auto-playing muted looping video with poster fallback |
| `HeroSection` | Featured collection hero video with overlays |
| `CollectionStage` | Alternating collection showcases (5 collections) |
| `CraftSection` | "The Craft" brand section |
| `ModernHeirlooms` | Gift section |
| `JournalPreview` | 3-card journal entry grid |
| `ProductCard` | Storefront product card |
| `ProductGallery` | Product image gallery |
| `HopHeader` | Navigation header (transparent variant) |
| `HopFooter` | Site footer |
| `Monogram` | Decorative brand SVGs |

### Studio Components (`src/studio/components/`)

| Component | Purpose |
|-----------|---------|
| `AuthGuard` | Route protection, redirects to login |
| `StudioLayout` | Sidebar + header + content wrapper |
| `StudioSidebar` | 9-item sidebar navigation |
| `StudioHeader` | Top bar with title |
| `DashboardCard` | Metric display card |
| `RecentOrders` | Orders table widget (dashboard) |
| `RecentCustomers` | Customer list widget |
| `ProductIdentity` | Name, SKU, slug form section |
| `ProductPricing` | Selling price, MRP, cost form section |
| `TechnicalDetails` | Fabric, weave, colour, etc. form section |
| `EditorialStory` | Story editor textarea |
| `SeoSection` | Meta title/description fields |
| `MediaWorkspace` | Image upload, reorder, delete |
| `EditorialChecklist` | Progress checklist for product completeness |
| `TopActionBar` | Save/publish sticky bar |

## Layout

### Page Layout (Storefront)

```
PageLayout (min-h-screen bg-background)
├── HopHeader (h-28 sm:h-28 md:h-32 lg:h-48)
│   └── transparent prop removes background
├── Content area
│   └── pt-28 sm:pt-28 md:pt-32 lg:pt-48
└── HopFooter
```

### Studio Layout

```
StudioLayout
├── Sidebar (collapsible, 9 nav items)
├── StudioHeader
│   └── Title + breadcrumb
└── Content area
    └── space-y-6 padding
```

## States

### Loading

All list pages render skeleton placeholders with:
```css
bg-muted animate-pulse
```

### Error

All query-dependent pages show:
```
Card with text-destructive "Failed to load..."
```

### Empty

All list pages show:
```
Card with centered text-muted-foreground "No [entity] yet."
```

### Not Found

Detail pages show centered text for missing entities.

## Animations

| Class | Timing | Easing |
|-------|--------|--------|
| `animate-fade-in` | 0.8s | ease-out |
| `animate-fade-up` | 1s | cubic-bezier(0.22, 1, 0.36, 1) |
| `animate-drift` | 6s | ease-in-out infinite |
| `gallery-shadow` | — | `0 40px 100px -40px hsl(var(--teal-deep) / 0.3)` |

## Responsive Breakpoints

| Breakpoint | Width |
|------------|-------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1440px (container max) |

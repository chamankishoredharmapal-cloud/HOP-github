# HOP Engineering Constitution

## Purpose

This document establishes the foundational principles, philosophies, and standards for the House of Padmavati (HOP) digital fashion house platform. Every developer and AI assistant must adhere to these principles to ensure a cohesive, premium, and performant user experience that reflects HOP's status as a Digital Fashion House.

## Core Identity

HOP is a **Digital Fashion House**, not an ecommerce platform. Our focus is on:
- Editorial storytelling and cinematic presentation
- Premium visual experiences with fluid animations
- Craft documentation and heritage preservation
- Magazine-style editorial layout
- Tactile, intuitive touch interactions

---

## Coding Philosophy

### Write Clean, Editorial Code

- **Descriptive, self-documenting code** over pragmatic shortcuts
- **Single responsibility principle** with clear component boundaries
- **Functional composition** over complex state manipulation
- **Write tests for critical user flows** (video playback, image loading, animations)
- **Document design decisions** in code comments

### Code Quality Standards

```javascript
// Always use explicit typing
const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>): void => {
  // Clear, descriptive variable names
  const videoElement = e.currentTarget;
};

// Component naming: EditorialTitle, CollectionStage, CraftSection
// Not: Component, Title, Section
```

### Development Workflow

- **Continuous Integration** required for all changes
- **Lighthouse performance targets:** 90+ score
- **Mobile-first approach** with progressive enhancement
- **Accessibility first** - never sacrifice screen reader support for aesthetics

---

## Architecture Philosophy

### Component-Based Architecture

- **Atomic design system**: EditorialTypography, EditorialButton, EditorialSection
- **Platform-specific components**: src/components/ui/ for base UI, src/components/hop/ for editorial components
- **Clear layer hierarchy**: Infrastructure → Editorial → Presentation
- **Maximum composability** of editorial components

### Technology Stack

```javascript
// Required dependencies maintained at appropriate versions
// Always upgrade gradually with testing
@tanstack/react-query  // For data fetching
React.memo  // Component optimization
IntersectionObserver  // Performance critical
Tailwind CSS + Radix UI  // Editorial consistency
```

### Separation of Concerns

- **Typescript first** - every interface defined explicitly
- **React with hooks** - functional components only
- **Vite for development**, optimized for production
- **No server-side rendering** - client-side performance is paramount

---

## Component Philosophy

### Editorial-First Components

- **Every component tells a story** - a closet full of narratives
- **Flexible composition** - pieces that work together seamlessly
- **Responsive by default** - mobile presentations driving desktop layouts
- **Performance optimized** - lazy loading, IntersectionObserver, React.memo

### Component Categories

1. **Editorial Core**: BaseContainer, EditorialTypography, EditorialButton
2. **Presentation**: Film, EditorialImage, Monogram, ProductCard
3. **Layout**: CollectionStage, CraftSection, ModernHeirlooms
4. **Navigation**: HopHeader, HopFooter, EditorialNavItem
5. **Content**: ImageTextBlock, ContentSection, QuoteSection

### Component Rules

```typescript
// ALWAYS use forwardRef for custom components
export const EditorialSection = forwardRef<HTMLElement, EditorialSectionProps>(
  // Use explicit TypeScript interfaces
);

// Components must be fully accessible
// Use proper ARIA labels and keyboard navigation
// Never break touch interactions on mobile
```

---

## Performance Philosophy

### Cinematic Experience Priority

- **Video-first approach** - videos load prioritized over images
- **Smooth 60fps animations** - no layout thrashing
- **Zero render-blocking resources** - critical CSS inlined, lazy loading for assets
- **Hardware acceleration** - transform/opacity animations only
- **Progressive degradation** - graceful fallbacks for slow connections

### Optimization Targets

- **First Contentful Paint:** < 1.2s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.0s
- **Bundle size:** < 500KB gzipped for homepage

### Performance Implementation

```typescript
// Always use IntersectionObserver for lazy loading
// React.memo for component optimization
// Use requestIdleCallback for non-critical work
// Implement image/webp fallbacks
// Cache video/poster combinations for seamless playback
```

### Performance Monitoring

- **Lighthouse CI checks** in development and production
- **Bundle analyzer** for tracking bundle sizes
- **Core Web Vitals monitoring**
- **Performance budgets** for critical paths

---

## Accessibility Philosophy

### Inclusive Editorial Design

- **Keyboard navigation primary** - no mouse-only interactions
- **Screen reader support** - all visual content has textual equivalent
- **High contrast defaults** - respect dark/light modes
- **Touch targets 44px+** - editorial aesthetics with accessibility
- **Semantic HTML** - proper heading hierarchy, landmarks

### Implementation Requirements

```typescript
// ALWAYS include:
- aria-label for icon-only buttons
- aria-current="page" for navigation
- Keyboard event handlers
- Focus management for modals/drawers
- Role attributes for custom components

// Editorial navigation:
<nav role="navigation" aria-label="Main navigation">
<ul role="list">
  <li role="listitem"><a href="/" aria-current="page">Home</a></li>
</ul>
</nav>
```

### Color Contrast Standards

- **WCAG AA minimum**: 4.5:1 for normal text, 3:1 for large text
- **Editorial brand colors**: Ensure contrast compliance
- **Focus indicators**: Visible with high contrast
- **Video captions** - all video content includes subtitles

---

## SEO Philosophy

### Editorial-First Search Strategy

- **Structured content** - JSON-LD for collections, products, articles
- **Semantic markup** - HTML5 with appropriate element hierarchy
- **Server-side rendered metadata** - Open Graph for social sharing
- **Clean URLs** - descriptive, SEO-friendly paths
- **Image optimization** - WebP with proper alt tags

### SEO Implementation

```typescript
// Article schema for journal posts
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How morning light reads a weave...",
  "author": "House of Padmavati",
  "publisher": "House of Padmavati",
  "datePublished": "2026-07-05",
  "image": "/assets/hop-fabric.jpg"
}

// Collection pages use:
- Product schema for featured products
- Collection schema for editorial collections
- Breadcrumb navigation for hierarchy
```

### Search Optimization

- **Semantic URLs**: /collections/kalyani, /journal/essays/how-light-reads-a-weave
- **Meta titles**: include collection name and House of Padmavati
- **Meta descriptions**: editorial summary with compelling copy
- **Open Graph rich media**: video thumbnails, collection images

---

## Animation Philosophy

### Premium Cinematic Animations

- **Staggered reveals** - collections cascade into view
- **Smooth 300-500ms transitions** - never instant
- **Micro-interactions** - tactile feedback for all interactions
- **Hardware accelerated** - transform/opacity only
- **Performance prioritized** - reduce motion for preference

### Animation Guidelines

```typescript
// Cinematic fade-in with stagger
const staggerChildren = (baseDelay = 0) => {
  return children.map((child, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8,
        delay: baseDelay + (index * 0.15)
      }}
    />
  ));
};

// Editorial hover states
const editorialHover = {
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" }
};
```

### Touch-First Animation

- **Tap-to-play for videos** - tactile video interaction
- **Haptic feedback** - simulated on touch devices
- **No hover on mobile** - touch-friendly interactions
- **Consistent easing** - editorialTiming.all.

---

## Typography Philosophy

### Editorial Typography System

- **Serif for headlines** - 'Cormorant Garamond' for editorial impact
- **Sans-serif for body** - 'Inter' for readability
- **Font sizes responsive** - mobile-first scaling
- **Line heights optimized** - 1.2 for headlines, 1.6 for body
- **Font weights controlled** - thin(100) to medium(500) for editorial clarity

### Typography Implementation

```typescript
export const EditorialTypography = {
  h1: "font-serif text-5xl md:text-6xl lg:text-7xl font-light text-ink leading-tight tracking-tight text-balance",
  h2: "font-serif text-4xl md:text-5xl font-light text-ink leading-tight tracking-tight text-balance", 
  h3: "font-serif text-3xl md:text-4xl font-light text-ink leading-tight tracking-tight text-balance",
  h4: "font-serif text-2xl md:text-3xl font-light text-ink leading-snug tracking-tight text-balance",
  h5: "font-serif text-xl md:text-2xl font-light text-ink leading-snug tracking-tight text-balance",
  
  bodyLarge: "font-sans text-lg md:text-xl font-light text-ink-soft leading-relaxed text-pretty",
  bodyBase: "font-sans text-base md:text-lg font-light text-ink-soft leading-relaxed text-pretty",
  bodySmall: "font-sans text-sm md:text-base font-light text-ink-soft leading-relaxed text-pretty",
  
  label: "font-sans text-sm font-medium text-ink tracking-wider uppercase",
  caption: "font-sans text-xs text-ink-soft/60 tracking-wider uppercase",
};
```

### Typography Rules

- **Headers**: Editorial serif, weight-light for elegance
- **Body**: Sans-serif, weight-light for readability
- **Navigation**: Uppercase tracking-wide, weight-light
- **Prices**: Serif, medium weight, sizing scale
- **Captions**: Sans-serif, tracking-wide, muted opacity

---

## State Management Philosophy

### Minimal, Predictable State

- **React hooks** - useState, useEffect, useReducer patterns
- **Local state only** - server state fetched via TanStack Query
- **Component state** - not global unless essential
- **Predictable updates** - state changes flow one way
- **Debuggable state** - console logging for development only

### State Implementation

```typescript
// useState for simple values
const [isPlaying, setIsPlaying] = useState(false);

// useReducer for complex state
const videoReducer = (state, action) => {
  switch(action.type) {
    case 'PLAY': return { ...state, isPlaying: true };
    case 'PAUSE': return { ...state, isPlaying: false };
    default: return state;
  }
};

const [videoState, dispatch] = useReducer(videoReducer, {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
});
```

### State Rules

- **Always reset component state** between route changes
- **Derive state from props** where possible
- **Use effects to synchronize side effects** only
- **Never store authentication state** - HOP doesn't require user accounts

---

## API Philosophy

### Editorial Content APIs

- **Static content** - collections, products, journal entries in data.tsx
- **No user interaction** - HOP doesn't collect user data or require auth
- **Video management** - Supabase storage for video assets
- **Image CDN** - optimized delivery with WebP fallbacks

### API Implementation

```typescript
// Structured data for collections
interface CollectionItem {
  code: string;          // "01", "02", "03"
  name: string;          // "Kalyani", "Viara"
  theme: string;         // "Wedding Elegance · Heritage Luxury"
  story: string;         // Long editorial copy
  poster: string;        // Image path
  href: string;          // "/category/kalyani"
  align: "left" | "right";
  accent: "sand" | "teal" | "sakura";
  flagship?: boolean;
}

// Video API configuration
{
  heroVideo: {
    src: "supabase://videos/hero.mp4",
    poster: "/assets/hop-hero.jpg",
    priority: true,
    autoplay: true,
    muted: true,
    loop: true
  },
  collectionVideos: "supabase://videos/collection/"
}
```

### API Rules

- **No external API calls** for core editorial content
- **Rate limiting** for video/image CDN requests
- **Error states handled gracefully** - fallback images/videos
- **Video retry logic** - automatic recovery from playback errors

---

## Folder Structure Philosophy

### Standardized Editorial Structure

```
src/
  assets/                    // Images, videos, icons (optimized)
  components/
    ui/                      // Base shadcn/ui components
    hop/                     // Editorial-specific components
    home/                    // Homepage components  
    about/                   // About page components
  hooks/                     // Custom hooks
  integrations/              // Supabase, external services
  lib/                       // Shared utilities
  pages/                     // Route components
  lib_backup/               // DEPRECATED - remove after consolidation
  components/hop/            // Editorial components (move here)
```

### Structure Rules

- **Components over pages** - components in components/, routes in pages/
- **Two component tiers** - src/components/ui/ (base) and src/components/hop/ (editorial)
- **No business logic in components** - keep pure presentation
- **Shared libraries in lib/** - utilities, constants, helpers
- **Remove lib_backup/ after consolidation**

---

## Naming Conventions

### Consistent Naming Patterns

```typescript
// Components: EditorialTitle, ProductCard, CollectionStage
// Not: Title, Card, Stage

// Files: editorial-title.tsx, product-card.tsx, collection-stage.tsx
// Not: title.tsx, card.ts, stage.tsx

// Variables: collectionFilms, featuredProducts, editorialState
// Not: films, products, state

// Functions: handleVideoPlay, updateCollectionFilter
// Not: playVideo, updateFilter

// Interfaces: CollectionItem, FeaturedProduct, EditorialTypography
// Not: Item, Product, Typography

// Constants: VIDEO_PLAYING, COLLECTION_SOLDOUT
// Not: playing, soldout
```

### Naming Rules

- **PascalCase** for components and interfaces
- **kebab-case** for file and function names
- **snake_case** for internal constants
- **camelCase** for variables and function parameters
- **UPPER_SNAKE_CASE** for environment variables

---

## Reusability Principles

### Component Composability

- **Always consider reusability** - can this component tell multiple stories?
- **Build with composition** - smaller pieces over monoliths
- **Document component relationships** - storyTellingsystem.md
- **Export atomic pieces** - Typography, Buttons, Sections

### Implementation Example

```typescript
// EditorialCard - reusable with different content
export const EditorialCard = forwardRef<HTMLDivElement, EditorialCardProps>(
  ({ className, imageSrc, imageAlt, children }, ref) => {
    return (
      <div ref={ref} className={cn(
        "group relative bg-white rounded-md overflow-hidden transition-all duration-300 hover:shadow-sm",
        className
      )}>
        {imageSrc && (
          <EditorialImage
            src={imageSrc}
            alt={imageAlt}
            containerClassName="relative aspect-[3/4] overflow-hidden"
          />
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  }
);

// Reused in ProductCard, JournalArticle, CraftSection
// With different content, same structure
```

### Reusability Checklist

- [ ] Can component exist without parent container?
- [ ] Is component tested independently?
- [ ] Does component have clear TypeScript interface?
- [ ] Can component be styled without breaking?
- [ ] Is component accessible out of the box?

---

## Code Review Checklist

### Completeness

- [ ] Component has TypeScript interface?
- [ ] Fully accessible with proper ARIA labels?
- [ ] Mobile-first tested?
- [ ] Lighthouse score target met?
- [ ] Performance optimized (IntersectionObserver, React.memo)?

### Quality

- [ ] Component naming follows conventions?
- [ ] File naming follows conventions?
- [ ] Consistent with editorial design system?
- [ ] Responsive breakpoints correct?
- [ ] Focus indicators visible?

### Editorial

- [ ] Typography matches EditorialTypography?
- [ ] Colors match design tokens?
- [ ] Animations are editorial and smooth?
- [ ] Component tells the right story?
- [ ] Matches HOP digital fashion house identity?

### Performance

- [ ] All images lazy-loaded?
- [ ] Videos have proper fallbacks?
- [ ] Component memoized if complex?
- [ ] No layout thrashing?
- [ ] Bundle size tracked?

### SEO

- [ ] Semantic HTML used?
- [ ] Proper meta tags?
- [ ] JSON-LD structured data?
- [ ] Alt tags descriptive?
- [ ] Open Graph tags complete?

### Documentation

- [ ] Component documented with examples?
- [ ] Design decisions noted?
- [ ] Accessibility notes included?
- [ ] Performance considerations noted?
- [ ] Migration notes for refactoring?

---

## Adoption

This Engineering Constitution is the foundational document for all future development in the House of Padmavati platform. New team members, contractors, and AI assistants must review and agree to these principles before contributing code.

**Version:** 1.0
**Date:** July 5, 2026
**Review Cycle:** Every 6 months or major platform revision
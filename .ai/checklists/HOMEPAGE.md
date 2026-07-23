# Homepage Engineering Checklist

## Pre-Flight
- [ ] Design mockups reviewed
- [ ] Analytics tracking requirements defined
- [ ] A/B test requirements (if any)
- [ ] SEO keywords identified

## Layout
- [ ] Hero section (full-bleed image/video)
- [ ] Brand tagline overlay
- [ ] Featured collections section
- [ ] New arrivals / featured products grid
- [ ] Journal preview section
- [ ] Brand story / about snippet
- [ ] Newsletter signup (optional, non-intrusive)
- [ ] Footer with all links

## Components
- [ ] HeroSection renders with correct image
- [ ] CollectionFilm cards navigate correctly
- [ ] FeaturedProducts grid renders
- [ ] JournalPreview links to journal
- [ ] HopHeader with navigation
- [ ] HopFooter with all sections
- [ ] ScrollToTop works

## SEO
- [ ] Meta title: "House of Padmavati | Luxury Sarees & Heritage Fashion"
- [ ] Meta description: compelling, keyword-rich
- [ ] Open Graph tags (title, description, image)
- [ ] JSON-LD: Organization structured data
- [ ] H1 present and descriptive
- [ ] Canonical URL set
- [ ] All images have alt text

## Performance
- [ ] Hero image optimized (WebP/AVIF, responsive)
- [ ] Below-fold images lazy-loaded
- [ ] Critical CSS inlined
- [ ] Font: preconnected, display:swap
- [ ] Bundle size < 200KB gzipped
- [ ] Lighthouse score >= 90

## Accessibility
- [ ] Skip-to-content link present
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] All images have alt text
- [ ] Heading hierarchy: h1 (brand/headline), h2 (sections)
- [ ] ARIA landmarks: banner, navigation, main, contentinfo
- [ ] Color contrast meets WCAG AA

## Responsive
- [ ] Mobile (< 768px): single column, hamburger nav
- [ ] Tablet (768-1024px): 2-column grid
- [ ] Desktop (> 1024px): full layout, multi-column
- [ ] Touch targets >= 44x44px
- [ ] No horizontal scroll

## Animations
- [ ] Hero entrance: fade-up (400ms)
- [ ] Sections animate on scroll (Intersection Observer)
- [ ] Subtle hover effects on cards
- [ ] prefers-reduced-motion respected

## Testing
- [ ] E2E: homepage renders correctly
- [ ] E2E: navigation to all sections works
- [ ] E2E: featured products click navigates to product
- [ ] E2E: collections click navigates to collection
- [ ] E2E: journal preview click navigates to journal
- [ ] E2E: all header links work
- [ ] E2E: all footer links work
- [ ] Visual: no layout shifts
- [ ] Visual: images load without distortion

## Data
- [ ] Featured collections loaded from API
- [ ] Featured products loaded from API
- [ ] Journal articles loaded from data (or API)
- [ ] Loading state: skeleton
- [ ] Error state: fallback message
- [ ] Empty state: graceful fallback

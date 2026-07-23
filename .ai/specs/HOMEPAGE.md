# Specification: Homepage

## Purpose
First impression of House of Padmavati. Establishes brand identity, showcases collections, and drives exploration.

## Functional Requirements
- Hero section with full-bleed editorial image + brand tagline
- Featured collections section (2-4 collections)
- Featured products grid (6-12 products)
- Journal preview (latest 3 articles)
- Brand story snippet with link to About
- Footer with navigation, social links, newsletter signup
- Navigation: collections, journal, about, customer care, cart, wishlist

## User Journey
1. User lands on homepage → sees hero image with tagline
2. Scrolls → featured collections catch attention
3. Clicks a collection → navigates to collection page
4. OR scrolls further → sees featured products
5. Clicks a product → navigates to product page
6. OR scrolls to journal preview → clicks article → reads

## Edge Cases
- Hero image fails to load → show background color + text only
- No featured collections/empty API → hide section gracefully
- Journal has < 3 articles → show available count
- Very long page → smooth scroll, lazy load below-fold content

## Acceptance Criteria
- Hero image loads within 2s (LCP target)
- All navigation links work
- Collections grid is responsive (2 cols tablet, 3-4 desktop)
- Product cards show image, name, price
- Journal preview links to journal detail
- Footer has all required sections
- Works on mobile (320px) through desktop (1920px)

## Analytics Events
- `homepage_hero_view`
- `homepage_collection_click` { collection_id, collection_name }
- `homepage_product_click` { product_id, product_name }
- `homepage_journal_click` { article_id, article_title }
- `homepage_newsletter_signup` { email }

## Accessibility Requirements
- Hero image: meaningful alt text describing the scene
- Skip-to-content link before hero
- All cards keyboard-focusable with visible outline
- Heading hierarchy: h1 (brand name), h2 (section titles), h3 (card titles)
- Carousel/navigation: accessible with keyboard arrows

## Performance Targets
- LCP < 2.5s (hero image preloaded)
- CLS < 0.1 (image dimensions set)
- Lighthouse Performance >= 90 (mobile)
- Total page weight < 800 KB

## Future Expansion
- Video hero (autoplay, muted, loop)
- Personalized hero based on time/day/season
- Instagram feed integration
- Announcement bar for launches
- Mega menu navigation

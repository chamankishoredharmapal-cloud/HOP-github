# Specification: Journal

## Purpose
Publish editorial content about fashion, craftsmanship, heritage, and lifestyle. Drive engagement and SEO.

## Functional Requirements
- Journal listing page: grid of article cards
- Article card: image, title, tag, date, dek (summary)
- Article detail page: full content with images
- Share buttons (social media, copy link)
- Related articles section (3 articles)
- Category/tag filter (future)
- Author byline with publication date
- Internal links to products and collections

## User Journey
1. User clicks "Journal" in navigation → sees article grid
2. Scans articles, reads deks, clicks interesting one
3. Reads full article, views images
4. Clicks product link → navigates to product page
5. Shares article on social media
6. Scrolls to related articles → continues reading

## Edge Cases
- No articles → "Journal coming soon" message
- Article not found → 404 with "Article not found"
- Very long article → table of contents, smooth scroll
- No related articles → hide section
- Image fails to load → placeholder

## Acceptance Criteria
- Article grid: 3 cols desktop, 2 tablet, 1 mobile
- Article detail: readable typography (18px body), generous spacing
- Share buttons: social + copy link with toast confirmation
- Related articles: 3 cards, responsive
- Internal links: open in same tab, descriptive anchor text
- SEO: unique title, description, OG tags, Article structured data
- Author byline and publication date visible

## Analytics Events
- `journal_view`
- `journal_article_click` { article_slug, article_title }
- `journal_article_read` { article_slug, time_on_page }
- `journal_article_share` { article_slug, platform }
- `journal_article_link_click` { article_slug, target_url, link_type: "product"|"collection" }

## Accessibility Requirements
- Article: semantic HTML (article, header, section, footer)
- Images: descriptive alt text (e.g., "Woman wearing Banarasi silk saree at sunset")
- Links: descriptive anchor text (not "click here")
- Share buttons: accessible labels
- Typography: 18px body for readability

## Performance Targets
- Article images: optimized WebP, lazy load below-fold
- No hero image (or lazy-load hero) — LCP < 2s
- Typography loads with font-display: swap

## Future Expansion
- Rich text editor for admin (heading, image, quote, link blocks)
- Article categories/tags
- Author pages
- Search within journal
- Newsletter signup within articles
- Estimated read time
- Comments (enabled/disabled per article)

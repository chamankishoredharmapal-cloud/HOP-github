# Journal Engineering Checklist

## Layout
- [ ] Journal listing page (grid of articles)
- [ ] Article cards (image, title, tag, date, dek)
- [ ] Article detail page
- [ ] Share buttons
- [ ] Related articles
- [ ] Category/tag filter (future)

## Components
- [ ] JournalCard (listing)
- [ ] JournalArticle (detail)
- [ ] RelatedArticles
- [ ] ShareButtons

## SEO
- [ ] Meta title: "[Article Title] | House of Padmavati Journal"
- [ ] Meta description: article summary
- [ ] Open Graph tags: article, author, publish date
- [ ] JSON-LD: Article structured data
- [ ] H1: article title
- [ ] Author byline and publish date
- [ ] Canonical URL
- [ ] Internal links to products/collections

## Performance
- [ ] Article images optimized
- [ ] Lazy load below-fold content
- [ ] Typography: 18px body for readability

## Accessibility
- [ ] Article: semantic HTML (article, header, section)
- [ ] Images: descriptive alt text
- [ ] Links: descriptive anchor text
- [ ] Share buttons: accessible labels

## Data
- [ ] Articles loaded from static data (or API)
- [ ] Article detail loaded by slug
- [ ] Related articles loaded
- [ ] Loading state: skeleton
- [ ] 404 state: article not found

## Testing
- [ ] E2E: journal listing renders
- [ ] E2E: article card click navigates to detail
- [ ] E2E: article detail renders correctly
- [ ] E2E: related articles navigate correctly
- [ ] E2E: 404 for invalid article slug

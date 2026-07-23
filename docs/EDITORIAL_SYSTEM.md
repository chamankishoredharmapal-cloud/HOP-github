# Editorial System

## Content Model

### Collections

Each collection is a curated set of products with editorial metadata:

| Field | Type | Purpose |
|-------|------|---------|
| `name` | text | Display name |
| `slug` | text | URL path |
| `tagline` | text | Short descriptor shown above name |
| `editorial_story` | text | Long-form narrative description |
| `description` | text | Fallback description |
| `hero_image_url` | text | Poster/fallback image |
| `hero_video_url` | text | Cinematic film URL |
| `featured_on_homepage` | boolean | Controls hero section visibility |
| `display_order` | integer | Sort order |
| `status` | text | `published` or `draft` |

### Products

| Field | Type | Editorial Purpose |
|-------|------|-------------------|
| `name` | text | Display name |
| `story` | text | Main editorial narrative |
| `short_description` | text | Listing summary |
| `customer_description` | text | Customer-facing details |
| `meta_title` | text | SEO title |
| `meta_description` | text | SEO description |
| `og_image_url` | text | Social share image |

## Editorial Checklist

Products have a built-in editorial checklist tracking completion:

```
- Hero Image
- Product Name
- Story
- Collection
- Price
- Inventory
- SEO
```

Progress is calculated as a percentage and displayed in the product workspace.

## Writing Guidelines

### Collection Taglines

Short, evocative, 2-4 words with a separator:
- "Wedding Elegance · Heritage Luxury"
- "Modern Working Woman · Social"
- "Geometry · Structure · Craft"

### Collection Stories

Narrative paragraphs (100-200 words) that describe:
- The woman the collection is named for
- The occasions it serves
- The emotional/mood qualities
- The craft details

### Product Stories

Describe:
- The saree's character
- What makes it special
- How it makes the wearer feel

## Video System

Homepage uses 6 cinematic films (1 hero + 5 collection) sourced from Supabase Storage bucket `HOP-films`. Currently hardcoded via `src/data/collectionVideos.ts`.

🚧 **Planned**: CMS-driven video selection where `hero_video_url` is managed through the Studio Collections workspace.

## Media

- Images: Uploaded to `product-images` bucket for products, `HOP-films` for collections
- Videos: Stored in `HOP-films` bucket
- All files: Public-read via RLS policies

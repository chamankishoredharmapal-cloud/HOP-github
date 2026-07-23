# ADR-0002: Video-First Homepage

**Status**: Proposed  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
The homepage hero is the first and most impactful touchpoint for new visitors. A static image, while reliable, cannot convey the movement, drape, and texture of luxury sarees as effectively as video. Luxury fashion brands increasingly use video hero sections to create emotional impact.

## Decision
The homepage hero section will be video-first, with a static image fallback:
- Short-form editorial video (15-30s, autoplay, muted, loop)
- Cinematic, slow-paced, focused on fabric movement and detail
- Poster image (static) displayed while video loads and on devices with `prefers-reduced-motion`
- Video hosted on CDN, optimized for fast loading (compressed, poster preloaded)
- Subtle text overlay with brand tagline

## Consequences
### Positive
- Dramatically higher emotional engagement
- Better conveys fabric quality, drape, and texture
- Aligns with luxury fashion industry standards
- Social media cross-use (same content on Instagram)

### Negative
- Heavier page weight (requires optimization)
- Longer LCP if video is not handled correctly (poster image is LCP element, video loads after)
- Not supported in all email clients (irrelevant — this is web only)
- Accessibility: must provide pause control, respect reduced motion

## Compliance
- Poster image is the LCP element (preloaded, optimized)
- Video loads progressively (poster → low-res → high-res)
- Pause button overlay on video
- `prefers-reduced-motion` disables autoplay, shows static image
- Video compressed to < 5MB (15s, 720p, H.264)
- Modern format: WebM + H.264 fallback

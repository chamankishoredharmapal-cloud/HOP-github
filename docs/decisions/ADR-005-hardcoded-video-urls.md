# ADR-005: Hardcoded Video URLs (Pre-CMS)

**Date**: 2026-07-12

## Context
The homepage cinematic system required 6 video URLs. The CMS-driven solution (reading from `collections.hero_video_url`) wasn't ready.

## Decision
Hardcode video URLs in `src/data/collectionVideos.ts` as a temporary measure.

## Rationale
- Unblocks homepage launch
- Videos are stable (don't change frequently)
- Simple key-value map is easy to maintain
- CMS integration planned for post-launch

## Consequences
- Changing a video URL requires a code deployment
- Hardcoded map must be replaced once CMS is ready
- Fallback logic exists: DB URL > hardcoded URL > no video

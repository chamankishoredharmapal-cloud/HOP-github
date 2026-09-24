# HOP Media Production & Optimization Pipeline

Reproducible, production-grade media infrastructure for House of Padmavati (HOP).

## Stack Architecture
- **Orchestration**: Node.js 22
- **Primary Image Engine**: Sharp (backed by `libvips`)
- **Secondary Image Engine**: ImageMagick
- **Video Engine**: FFmpeg & ffprobe
- **Execution Container**: Docker (`node:22-bookworm-slim`)

## Source Immutability
All source media in `src/assets/`, `public/`, and `src/content/` are strictly immutable and protected by:
- 5-layer path guards
- SHA-256 pre/post execution checksum verification
- Isolated target output directory (`tools/media-pipeline/output/`)

## Developer Commands

```bash
# Audit repository media
npm run media:audit

# Simulate optimization without modifying any files
npm run media:optimize -- --dry-run

# Run Stage 1 (Controlled test on hero-image.png)
npm run media:optimize -- --stage 1

# Run Stage 2 (Representative sample test - requires Stage 1 CTO approval)
npm run media:optimize -- --stage 2

# Run Stage 3 (Full media library - requires Stage 2 CTO approval)
npm run media:optimize -- --stage 3

# Docker commands
npm run media:docker:build
npm run media:docker:run
```

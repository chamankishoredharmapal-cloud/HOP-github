# Loading Order

Every AI session must load context in a specific order. This ensures the AI builds understanding layer by layer — identity before voice, voice before vocabulary, vocabulary before task.

## Standard Loading Order

### Layer 1: Identity (Who HOP Is)

Load first. Establishes the brand's fundamental nature.

1. `system/brand-context.md` — Brand identity, territories, philosophy, audience, promises
2. `docs/editorial/02-brand-architecture/brand-bible.md` — Full brand bible (if deeper context needed)

### Layer 2: Voice (How HOP Sounds)

Load second. Establishes the brand's communication style.

1. `system/master-system-prompt.md` — Complete voice, vocabulary, grammar, and quality instructions
2. `docs/editorial/02-brand-architecture/voice-bible.md` — Tone matrix, sentence architecture, voice dimensions

### Layer 3: Vocabulary (What HOP Says)

Load third. Establishes the brand's word choices.

1. `docs/editorial/04-vocabulary-system/approved-words.md` — Words to use
2. `docs/editorial/04-vocabulary-system/forbidden-words.md` — Words to never use
3. `docs/editorial/04-vocabulary-system/grammar-and-usage.md` — Grammar rules

### Layer 4: Editorial Governance (How HOP Judges Content)

Load fourth. Establishes quality standards.

1. `system/editorial-context.md` — Editorial principles, messaging pillars
2. `system/writing-principles.md` — Writing-specific principles
3. `system/reasoning-principles.md` — Reasoning framework

### Layer 5: Emotional Architecture (How HOP Makes People Feel)

Load fifth. Establishes emotional intent.

1. `docs/editorial/02-brand-architecture/emotional-principles.md` — Emotional design principles
2. `docs/editorial/07-emotional-architecture/emotional-journey.md` — Full emotional arc
3. `docs/editorial/07-emotional-architecture/page-emotion-map.md` — Emotion by page

### Layer 6: Task-Specific Context

Load sixth. The actual writing, editing, or review brief.

1. The relevant `writing/`, `editing/`, or `review/` document
2. The relevant `templates/` document
3. Any research or reference material from `docs/research/`

## Quick Loading by Task

| Task | Load These |
|------|------------|
| Write a journal article | brand-context → master-system-prompt → approved-words → forbidden-words → editorial-context → writing-principles → reasoning-principles → writing/journal → templates/writing-template |
| Write a product story | brand-context → master-system-prompt → approved-words → forbidden-words → editorial-context → writing-principles → reasoning-principles → writing/product-pages → templates/writing-template |
| Edit existing copy | brand-context → master-system-prompt → forbidden-words → grammar-and-usage → editorial-context → writing-principles → reasoning-principles → relevant editing/ doc → templates/editing-template |
| Review content | brand-context → master-system-prompt → forbidden-words → editorial-context → relevant review/ doc → templates/review-template |
| New session | templates/session-bootstrap (covers all layers) |

## Rules

- Do not skip layers. If you load only Layer 6 without Layers 1-5, the AI lacks the identity and voice context to produce correct output.
- Do not reorder layers. Identity must precede voice. Voice must precede vocabulary.
- Layer 5 (Emotional Architecture) is optional for small tasks (microcopy, CTAs) but required for major content (journal, collections, product stories).
- When using `templates/session-bootstrap.md`, it handles all layers — use it for every new session.
# AI Writing Operating System

**Status:** Active
**Owner:** Editorial Lead
**Last updated:** July 2026
**Model target:** Model-agnostic (Claude, GPT, Gemini, Kimi, etc.)

---

## What This Is

The AI Writing Operating System is the permanent editorial brain that every AI collaborator loads before writing or editing any House of Padmavati content. It is not a prompt collection. It is a complete reasoning, writing, editing, and review system that teaches AI how to think about, write for, and protect the HOP brand.

## What This Is Not

- Not a prompt library for copy-pasting
- Not optimised for any single AI model
- Not a substitute for the Editorial Operating System — it references, extends, and operationalises it

## Architecture

```
docs/editorial/prompts/
├── README.md                        # This file — system overview
├── INDEX.md                         # Quick navigation
├── loading-order.md                 # Context loading sequence for AI sessions
├── usage-guide.md                   # How to use the system
│
├── system/                          # Permanent editorial brain
│   ├── master-system-prompt.md      # The one prompt that teaches AI who HOP is
│   ├── brand-context.md             # Brand identity summary for AI context
│   ├── editorial-context.md         # Editorial governance summary for AI context
│   ├── writing-principles.md        # HOP writing principles for AI reasoning
│   ├── reasoning-principles.md      # How AI should reason before writing
│   └── output-format.md             # Standard output format for all content
│
├── writing/                         # Content type prompts
│   ├── homepage.md                  # Homepage hero, tagline, sections
│   ├── collections.md               # Collection narratives
│   ├── product-pages.md             # Product stories
│   ├── journal.md                   # Journal articles
│   ├── about.md                     # About / Our Story
│   ├── craft-notes.md               # Educational craft content
│   ├── glossary.md                  # Glossary definitions
│   ├── ritual-guides.md             # Occasion and care guides
│   ├── emails.md                    # Email copy across all touchpoints
│   ├── seo-copy.md                  # SEO metadata generation
│   ├── microcopy.md                 # UI microcopy
│   └── CTAs.md                      # Call-to-action copy
│
├── editing/                         # Editorial transformation prompts
│   ├── rewrite.md                   # Full rewrite in HOP voice
│   ├── proofread.md                 # Grammar and mechanical correctness
│   ├── expand.md                    # Elaborate without padding
│   ├── shorten.md                   # Condense without losing essence
│   ├── luxury-tone.md               # Refine for luxury register
│   ├── clarity.md                   # Improve clarity and readability
│   └── consistency.md               # Enforce brand consistency
│
├── review/                          # Quality assurance prompts
│   ├── quality-checklist.md         # Comprehensive quality review
│   ├── fact-checking.md             # Verify factual claims
│   ├── hallucination-prevention.md  # Detect fabricated content
│   ├── brand-review.md             # Brand voice and identity fidelity
│   ├── seo-review.md               # SEO best practice compliance
│   └── accessibility-review.md     # Accessibility standards
│
└── templates/                       # Reusable session templates
    ├── writing-template.md          # Standard writing request template
    ├── editing-template.md          # Standard editing request template
    ├── review-template.md           # Standard review request template
    ├── context-loader.md            # Context loading checklist
    └── session-bootstrap.md         # Complete session setup template
```

## Principles

| Principle | Meaning |
|-----------|---------|
| **Modular** | Each document is self-contained. Load only what you need. |
| **Composable** | Documents combine naturally — system + writing + review = complete workflow. |
| **Model-agnostic** | No vendor-specific instructions. Works with any capable LLM. |
| **Cross-referencing, not duplicating** | The system references existing EOS documents. It does not repeat them. |
| **Reusable** | Every document is designed for repeated use across sessions and models. |

## How to Use

1. **Load context** — Use `templates/context-loader.md` to identify which documents to load
2. **Bootstrap session** — Use `templates/session-bootstrap.md` to set up the AI
3. **Select task** — Choose the appropriate writing, editing, or review document
4. **Use template** — Use `templates/` to structure your request
5. **Generate, edit, or review** — Follow the selected document's instructions
6. **Validate** — Run review prompts against the output

## Related Documents

- `docs/editorial/README.md` — Editorial Operating System overview
- `docs/editorial/02-brand-architecture/` — Brand identity, voice, messaging, principles
- `docs/editorial/04-vocabulary-system/` — Approved words, forbidden words, grammar
- `docs/editorial/06-page-strategy/` — Page strategy framework
- `docs/editorial/07-emotional-architecture/` — Emotional journey and page emotion map
- `docs/research/` — Knowledge base for strategic grounding
- `src/content/README.md` — Runtime content architecture and schemas
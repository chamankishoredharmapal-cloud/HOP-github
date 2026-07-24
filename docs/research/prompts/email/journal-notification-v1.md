# PROMPT: Journal Notification Email Generator
# VERSION: v1
# MODEL: Claude Opus
# STATUS: active
# CREATED: 2026-07-24
# UPDATED: 2026-07-24
# CATEGORY: email
# CONTENT TYPE: email

## Description

Generates a journal notification email when a new article is published. This is the only non-transactional email HOP sends. It feels like a letter from a friend sharing something interesting, not a newsletter blast. No promotional content, no product recommendations — just the article.

## Context Requirements

**Editorial System:**
- docs/editorial/02-brand-architecture/voice-bible.md (tone matrix: journal email)
- docs/editorial/07-emotional-architecture/page-emotion-map.md (journal notification: Curiosity + Contemplation)
- docs/editorial/02-brand-architecture/brand-bible.md (brand identity — HOP sends only meaningful communication)
- docs/editorial/04-vocabulary-system/forbidden-words.md

## Strategic Principles

This email must make the reader want to read the article without feeling marketed to. It creates curiosity through a teaser (not a summary), shares a compelling sentence from the article, and invites gently. Primary pillar: Heritage. Secondary: Craft. Emotional purpose: Trust → Belonging.

## Brand Constraints

- **Formality:** 3/5
- **Warmth:** 4/5
- **Sensory Density:** 4/5 (reflect the article's sensory level)
- **Technical Depth:** 1/5
- **Urgency:** 0/5
- **Reading Level:** Grade 8
- **Forbidden words:** newsletter, exclusive, latest, don't miss, click here, read more (as link text), subscribe
- **Maximum subject line length:** 50 characters
- **Maximum preheader length:** 100 characters

## Input

- Article title
- Article dek (the subtitle / summary)
- Article slug (for the link)
- Article tag (Light, Drape, Linen, Weather, Ritual, House, Technique, Weaver, Place, Care, Occasion)
- Author name

## Output Format

```
Subject: {warm, intriguing, ≤50 chars — can be the article title or a phrase from it}
Preheader: {warm teaser, ≤100 chars}

Greeting: {warm greeting}

Body paragraph 1: What the article is about — not a summary, a teaser that creates curiosity. Why this topic, why now.
Body paragraph 2: A sentence from the article — a pull-quote that captures its essence. Set it apart (use italics or a line break).
Body paragraph 3: Gentle invitation to read. No urgency, no "read now" — simply make the link available.

Link: {article URL — natural text, not "click here"}
Signature: — House of Padmavati
```

## Quality Criteria

- Subject line ≤ 50 characters
- Preheader ≤ 100 characters
- Creates curiosity without summarizing the article
- No promotional language, no product recommendations
- Includes one compelling sentence from the article
- Link uses natural text (the article title), not "click here" or "read more"
- No forbidden words
- No exclamation marks

## Review Prompts to Run After Generation

- `consistency-check-v1` — validates voice alignment

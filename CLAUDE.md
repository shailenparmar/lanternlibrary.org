@AGENTS.md

# Lantern Library — CLAUDE.md

## Overview

Nonprofit archive of identity-reconstruction recovery stories (BDD, OCD, hair loss, chronic pain, etc.). People who made it through hard chapters sit with a warm AI-guided reflection tool (voice + text, simultaneous) and leave wisdom for the next person walking the same path. Founder records her own BDD recovery story first; everything else follows.

Domain: lanternlibrary.org (Cloudflare, DNS hardened — null MX, SPF -all, DMARC reject, DNSSEC).

Old name: `lanter.ai` (deprecated — references in older docs).

## Stack

- Next.js 16 (App Router), TypeScript, Tailwind v4
- Future per brief: Pipecat / Deepgram / Claude / ElevenLabs (reflection tool); Postgres + pgvector (story storage + semantic retrieval); S3 (raw audio); Modal (orchestration)

## Commands

```bash
npm run dev          # dev server (localhost:3000)
npm run build        # production build
npm run lint         # eslint
```

## Source-of-truth context

- Product brief v0.4: `~/Downloads/Lantern_Library_Brief_v0_4.txt`
- Input device ideation notes: `~/Downloads/lanter-input-device-ideation.txt`
- Cloudflare setup log: `~/Downloads/lanternlibrary-cloudflare-setup-log.txt`

These live in Downloads for now. If they move into the repo, update this section.

## Design Principles (from brief)

1. **Warm light on dark.** Amber, candlelight, deep blue-black. Muted saturations; never bright-startup.
2. **Literary, not marketing.** Serif body (stories read like well-typeset books). Warm sans-serif for interface chrome only.
3. **Quiet interactions.** Transitions feel like turning a page, not loading a screen.
4. **Founder-first copy.** Landing in founder's voice directly. Specificity is warmth ("if you've recovered from BDD and thought about sharing...").
5. **Honest about what it isn't.** No medical advice, no forum, no comments.
6. **Dignity over growth.** No engagement metrics that turn contributors into audience-managers.

## Core metaphor

A field of lanterns on dark water. Each story is a lantern lit for the next person. Browsing should feel like walking a shore at dusk.

## What lives where (planned)

```
app/
  page.tsx              # landing — founder-first, paths to read or share
  layout.tsx            # root: fonts, dark background, metadata
  globals.css           # color tokens, typography baseline
  reflect/              # contributor reflection tool (voice + text, simultaneous)
  stories/              # archive — tile browse + individual story pages
  read/                 # reader discovery flow (conversational agent)
```

Nothing in `reflect/` or `stories/` yet — landing page first.

## Copy notes

- "Lantern Library" — full name. Never "LL", never abbreviated.
- Tagline: "A dignified channel for people who made it through hard things to leave their wisdom for those walking the same path."
- Founder voice copy is **placeholder until founder writes her own** — flagged in source.

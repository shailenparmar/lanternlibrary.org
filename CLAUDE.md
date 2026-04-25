@AGENTS.md

# Lantern Library — CLAUDE.md

## Overview

Nonprofit archive of identity-reconstruction recovery stories (BDD, OCD, hair loss, chronic pain, etc.). People who made it through hard chapters sit with a warm AI-guided reflection tool (voice + text, simultaneous) and leave wisdom for the next person walking the same path. Founder records her own BDD recovery story first; everything else follows.

Domain: lanternlibrary.org (Cloudflare, DNS hardened — null MX, SPF -all, DMARC reject, DNSSEC).

Old name: `lanter.ai` (deprecated — references in older docs).

## Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind v4
- **/read agent**: Anthropic SDK, Claude Opus 4.7 with prompt caching + tool use to surface 3–5 matching stories
- **Storage**: Postgres + pgvector via Drizzle ORM. Falls back to in-memory `lib/stories.ts` when `DATABASE_URL` is unset.
- **Reflection backend** (`server/`): Pipecat (Python) — Daily WebRTC + Deepgram Nova-3 + Claude Opus 4.7 + ElevenLabs Turbo v2.5. Currently a working scaffold; needs API keys to run end-to-end.
- **Future per brief**: S3 (raw audio retention), Modal (bot orchestration)

## Commands

```bash
# Web app
npm run dev              # dev server (localhost:3000)
npm run build            # production build
npm run lint             # eslint

# Postgres (optional — app works without it)
npm run db:up            # docker compose up -d (pgvector/pg16)
npm run db:push          # push drizzle schema
npm run db:seed          # seed from lib/stories.ts + lib/tiles.ts
npm run db:studio        # drizzle-kit studio (browse data)
npm run db:down          # stop and remove the db container

# Reflection bot (server/)
cd server && python -m venv .venv && source .venv/bin/activate
pip install -e .
python -m lantern_reflect.server      # HTTP launcher on :7860
python -m lantern_reflect.bot --room-url ...  # one-off bot
```

## Env vars

- `ANTHROPIC_API_KEY` — required for `/read` agent. Without it the API returns 503 with a helpful message.
- `DATABASE_URL` — optional. When set, `lib/storage.ts` reads from Postgres; otherwise from `lib/stories.ts`.
- `server/.env` — separate env file for the Python reflection backend (Daily, Deepgram, ElevenLabs, Anthropic).

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

## What lives where

```
app/
  page.tsx                       # landing — founder-first, paths to read or share
  layout.tsx                     # root: fonts, dark background, metadata
  globals.css                    # color tokens, typography baseline
  read/page.tsx                  # Claude-guided story discovery (chat UI)
  reflect/page.tsx               # static UI prototype of voice+text reflection
  stories/                       # tile grid + collection lists
  story/[slug]/page.tsx          # individual story page
  api/read/                      # Claude API route + companion stories endpoint

components/                      # Wordmark, Lantern, SampleBadge

lib/
  stories.ts                     # in-memory sample stories (source of truth until DB seeded)
  tiles.ts                       # condition + theme tiles
  storage.ts                     # async data layer — DB if DATABASE_URL else in-memory
  llm.ts                         # Anthropic SDK setup + read-agent matching
  db/
    schema.ts                    # Drizzle schema (stories + tiles + pgvector embedding)
    index.ts                     # lazy DB client

scripts/db-seed.ts               # tsx script: push lib/stories.ts into Postgres

drizzle/init/00_extension.sql    # enables pgvector on container init
docker-compose.yml               # local pgvector/pg16 on port 5433

server/                          # Python — Pipecat reflection backend
  pyproject.toml
  lantern_reflect/
    bot.py                       # Pipecat pipeline (Daily/Deepgram/Claude/ElevenLabs)
    server.py                    # FastAPI room launcher
    prompts.py                   # 8-beat system prompt
```

## Copy notes

- "Lantern Library" — full name. Never "LL", never abbreviated.
- Tagline: "A dignified channel for people who made it through hard things to leave their wisdom for those walking the same path."
- Founder voice copy is **placeholder until founder writes her own** — flagged in source.

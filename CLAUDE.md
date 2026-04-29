@AGENTS.md

# Lantern Library — CLAUDE.md

## Style guide workflow — load-bearing

`STYLE_GUIDE.md` (in this directory) is the source of truth for design and
copy decisions. Treat it as a living document, not a snapshot.

**Before any UI, copy, color, animation, or component change:**
1. Read `STYLE_GUIDE.md`. Use it to inform the change.
2. If the change conflicts with the guide, raise that with the user
   explicitly — don't silently override.

**After any UI, copy, color, animation, or component change that
establishes (or shifts) a pattern:**
1. Update the relevant section of `STYLE_GUIDE.md` *in the same commit*.
2. Date the section you touched (`Last updated: YYYY-MM-DD`).
3. If you found yourself making a one-off decision a second time in this
   conversation, that's a sign it should be codified — add it.

The guide is short and opinionated by design. Don't pad it with vague
principles. Encode specific decisions and the reasoning when non-obvious.

## Overview

Nonprofit archive of identity-reconstruction recovery stories (BDD, OCD, hair loss, chronic pain, etc.). People who made it through hard chapters sit with a warm AI-guided reflection tool (voice + text, simultaneous) and leave wisdom for the next person walking the same path. Founder records her own BDD recovery story first; everything else follows.

Domain: lanternlibrary.org (Cloudflare, DNS hardened — null MX, SPF -all, DMARC reject, DNSSEC).

Old name: `lanter.ai` (deprecated — references in older docs).

## Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind v4
- **Search (home)**: Anthropic SDK, Claude Opus 4.7. Live tile output via tool use. Prompt-cached corpus.
- **Reflect tiles (/reflect)**: same SDK, separate tool — phrases the contributor said back to them, plus one prompt question.
- **Storage**: in-memory only (`lib/stories.ts`). The Postgres + Drizzle layer was removed because Cloudflare Workers don't run `node-postgres`. When real story volume warrants a DB, swap to a serverless-friendly driver (Neon over HTTP).
- **Reflection backend** (`server/`): Pipecat (Python) — Daily WebRTC + Deepgram Nova-3 + Claude Opus 4.7 + ElevenLabs Turbo v2.5. Working scaffold; needs API keys to run end-to-end.
- **Hosting**: Cloudflare Workers via `@opennextjs/cloudflare` (the modern OpenNext adapter for Next.js 16). Built bundle goes to `.open-next/`. Domain DNS lives on Cloudflare too.

## Commands

```bash
# Web app
npm run dev              # dev server (localhost:3000)
npm run build            # production build
npm run lint             # eslint

# Cloudflare deploy
npm run cf:build         # bundle the Worker into .open-next/
npm run cf:preview       # local preview against the Worker bundle
npm run cf:deploy        # deploy via wrangler (requires `wrangler login`)

# Reflection bot (server/)
cd server && python -m venv .venv && source .venv/bin/activate
pip install -e .
python -m lantern_reflect.server      # HTTP launcher on :7860
python -m lantern_reflect.bot --room-url ...  # one-off bot
```

## Env vars

- `ANTHROPIC_API_KEY` — required for the search and reflect tile APIs. Without it the routes return 503.
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
  stories.ts                     # in-memory sample story corpus (source of truth)
  tiles.ts                       # condition + theme tiles
  storage.ts                     # thin async wrapper around the in-memory data
  llm.ts                         # Anthropic SDK setup + search + reflect tile prompts

server/                          # Python — Pipecat reflection backend
  pyproject.toml
  lantern_reflect/
    bot.py                       # Pipecat pipeline (Daily/Deepgram/Claude/ElevenLabs)
    server.py                    # FastAPI room launcher
    prompts.py                   # eight-beat system prompt (internal LLM signal only)

wrangler.jsonc                   # Cloudflare Worker config (compatibility flags, asset binding)
open-next.config.ts              # OpenNext adapter config (defaults)
```

## Copy notes

- "Lantern Library" — full name. Never "LL", never abbreviated.
- Tagline: "A dignified channel for people who made it through hard things to leave their wisdom for those walking the same path."
- Founder voice copy is **placeholder until founder writes her own** — flagged in source.

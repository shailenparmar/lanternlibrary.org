# Lantern Reflect — Pipecat backend

Voice + AI backend for the Lantern Library reflection tool. Implements the
brief's pipeline:

```
Daily (WebRTC)  →  Deepgram Nova-3 (STT)
                       │
                       ▼
                    Claude Opus 4.7 (warm reflection LLM)
                       │
                       ▼
                  ElevenLabs Turbo v2.5 (TTS)
                       │
                       ▼
                    Daily (back to contributor)
```

The contributor talks. Claude listens, holds the space, and gently
surfaces follow-ups across the eight narrative beats from the brief.
Transcripts are persisted on disk for the post-session structured-extraction
pipeline.

## Status

Working scaffold. End-to-end requires API keys (Daily, Deepgram, ElevenLabs,
Anthropic) — see `.env.example`. Pipecat APIs move quickly; if your installed
version's import paths differ from `bot.py`, adjust to current Pipecat docs.

## Setup

```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -e .
cp .env.example .env  # fill in your API keys
```

## Run

**Option A — test against a hand-crafted Daily room.** Create a room in the
Daily dashboard, then:

```bash
python -m lantern_reflect.bot --room-url https://your-domain.daily.co/lantern-test
```

Then join the same room URL in your browser to talk to the bot.

**Option B — run the HTTP launcher.** The Next.js app calls into this to
provision rooms on demand:

```bash
python -m lantern_reflect.server
# listens on http://127.0.0.1:7860
```

`POST /reflect/start` body `{"condition": "Body dysmorphic disorder"}`
creates a Daily room, spawns a bot into it, and returns
`{room_url, token}` for the browser to open via the Daily call-frame SDK.

## What's still TODO

- **Frontend integration.** `app/reflect/page.tsx` is currently a static
  prototype. It needs to call `/reflect/start`, then mount the Daily
  call-frame to actually connect the contributor to the bot.
- **Salient-phrase tile generation.** The brief specifies live tiles
  surfacing salient phrases as the contributor speaks. Add a Pipecat
  frame processor that intercepts `TranscriptionFrame`s, asks a fast
  Claude (Haiku) for 3–4 salient phrases, and pushes them to the browser
  via Daily's app-message channel.
- **Post-session pipeline.** See the TODO at the bottom of `bot.py` —
  structured extraction → prose rendering → contributor review email.
- **Crisis classifier.** A parallel classifier should listen for active
  crisis signals (suicidal ideation, imminent self-harm, present-tense
  abuse, severe dissociation) and pause the session with a hand-off
  message + resources.
- **Modal deployment.** Local subprocess spawning is fine for development;
  production should run bots under Modal (per the brief's stack) for
  isolation and auto-scaling.

## Cost sanity check

Per the brief, end-to-end target is ~$2 per 25-minute reflection.
Approximate breakdown:

| Service                        | Per 25-min session |
| ------------------------------ | ------------------ |
| Deepgram Nova-3 STT            | ~$0.10             |
| ElevenLabs Turbo v2.5 TTS      | ~$0.30             |
| Claude Opus 4.7 (cached)       | ~$1.20             |
| Daily room time                | ~$0.10             |
| Modal compute (bot subprocess) | ~$0.10             |
| **Total**                      | **~$1.80**         |

The Claude line dominates; prompt caching (`enable_prompt_caching_beta=True`)
is what keeps it sane.

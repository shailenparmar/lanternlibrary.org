"""Lantern Library reflection tool — Pipecat backend.

Realizes the brief's voice + text reflection experience:
  Daily (WebRTC) → Deepgram (STT) → Claude (LLM) → ElevenLabs (TTS) → Daily

The contributor speaks; Claude responds with gentle, beat-aware prompting; the
narrative is captured for the post-session structured-extraction pipeline.

Run a bot directly:
    python -m lantern_reflect.bot --room-url <daily-url>

Run the HTTP launcher (creates rooms on demand from the Next.js app):
    python -m lantern_reflect.server
"""

__version__ = "0.1.0"

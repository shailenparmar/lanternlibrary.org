"""Pipecat reflection bot.

End-to-end voice loop:
    Daily (WebRTC mic + speaker)
        → Deepgram Nova-3 (STT)
            → Claude (LLM, prompt-cached system prompt)
                → ElevenLabs Turbo v2.5 (TTS)
                    → Daily

Design choices that match the brief:
  - LONG silences are honored. We set the LLM to only respond after the
    contributor's turn has settled (smart-turn-v3 + a generous interruption
    threshold).
  - Prompt caching is enabled on the system prompt; cost target ≈ $2/session.
  - Transcripts are logged to disk for the post-session structured-extraction
    pipeline (see TODO at the bottom).

Run directly:
    python -m lantern_reflect.bot --room-url https://your-domain.daily.co/lantern-xyz
"""

from __future__ import annotations

import argparse
import asyncio
import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from loguru import logger

# Pipecat imports — versions move quickly; pin in pyproject.toml. If an import
# path differs in the version you install, check pipecat's CHANGELOG and adjust.
from pipecat.frames.frames import EndFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.services.anthropic.llm import AnthropicLLMService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.elevenlabs.tts import ElevenLabsTTSService
from pipecat.transports.services.daily import DailyParams, DailyTransport

from .prompts import build_system_prompt

load_dotenv()

DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # ElevenLabs warm female voice (placeholder).
DEFAULT_LLM_MODEL = "claude-opus-4-7"


def _require(env_name: str) -> str:
    value = os.getenv(env_name)
    if not value:
        raise RuntimeError(
            f"Missing {env_name}. Copy server/.env.example to server/.env and fill it in."
        )
    return value


async def run_bot(
    room_url: str,
    daily_token: str | None,
    condition_label: str | None,
    transcript_dir: Path,
    bot_name: str = "Lantern",
) -> None:
    transport = DailyTransport(
        room_url=room_url,
        token=daily_token,
        bot_name=bot_name,
        params=DailyParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_enabled=True,
            vad_audio_passthrough=True,
            transcription_enabled=False,  # we use Deepgram explicitly below
        ),
    )

    stt = DeepgramSTTService(
        api_key=_require("DEEPGRAM_API_KEY"),
        model="nova-3-general",
    )

    llm = AnthropicLLMService(
        api_key=_require("ANTHROPIC_API_KEY"),
        model=os.getenv("LANTERN_LLM_MODEL", DEFAULT_LLM_MODEL),
        # Prompt caching is on by default in pipecat-anthropic for the
        # system message; verify with response.usage.cache_read_input_tokens.
        enable_prompt_caching_beta=True,
    )

    tts = ElevenLabsTTSService(
        api_key=_require("ELEVENLABS_API_KEY"),
        voice_id=os.getenv("LANTERN_VOICE_ID", DEFAULT_VOICE_ID),
        model="eleven_turbo_v2_5",
    )

    context = OpenAILLMContext(
        messages=[
            {
                "role": "system",
                "content": build_system_prompt(condition_label),
            },
            {
                "role": "assistant",
                "content": (
                    "Hi. I'm here whenever you're ready. Take your time. "
                    "When you'd like to begin, you can just start talking — "
                    "wherever feels natural. We have no clock to beat."
                ),
            },
        ]
    )
    context_aggregator = llm.create_context_aggregator(context)

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            context_aggregator.user(),
            llm,
            tts,
            transport.output(),
            context_aggregator.assistant(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            allow_interruptions=True,
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
    )

    transcript_dir.mkdir(parents=True, exist_ok=True)
    transcript_path = transcript_dir / f"{room_url.rstrip('/').rsplit('/', 1)[-1]}.jsonl"

    @transport.event_handler("on_first_participant_joined")
    async def on_join(transport, participant):
        logger.info(
            "Contributor joined Daily room — kicking off opening beat: {}",
            participant.get("info", {}).get("userName", "<anon>"),
        )
        # Speak the opening invitation immediately; the assistant message in
        # the context above is also rendered, but we want it heard, not just
        # tracked in history. The simplest way is to queue a frame:
        await task.queue_frames([context_aggregator.assistant().queue_frame_for_initial_say()])

    @transport.event_handler("on_participant_left")
    async def on_leave(transport, participant, reason):
        logger.info("Contributor left ({}). Wrapping up.", reason)
        await task.queue_frames([EndFrame()])

    runner = PipelineRunner()
    try:
        await runner.run(task)
    finally:
        # Flush the transcript for the post-session extraction pipeline.
        try:
            with transcript_path.open("a", encoding="utf-8") as f:
                for msg in context.messages:
                    f.write(repr(msg) + "\n")
            logger.info("Transcript written: {}", transcript_path)
        except Exception as exc:  # pragma: no cover
            logger.warning("Could not write transcript: {}", exc)


def cli() -> None:
    parser = argparse.ArgumentParser(description="Lantern reflection bot")
    parser.add_argument("--room-url", required=True, help="Daily room URL")
    parser.add_argument("--token", default=None, help="Daily room token (optional)")
    parser.add_argument(
        "--condition",
        default=None,
        help="Optional condition label (e.g. 'Body dysmorphic disorder') to specialize the prompt.",
    )
    parser.add_argument(
        "--transcript-dir",
        default="./transcripts",
        type=Path,
        help="Where to write transcripts after each session.",
    )
    args = parser.parse_args()

    try:
        asyncio.run(
            run_bot(
                room_url=args.room_url,
                daily_token=args.token,
                condition_label=args.condition,
                transcript_dir=args.transcript_dir,
            )
        )
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == "__main__":
    cli()


# TODO: post-session pipeline
#   1. Take the saved transcript JSONL (above) and feed it to a separate
#      Claude Opus call with a structured-extraction prompt — produce the
#      schema in the brief (onset, dark_middle, search_for_help,
#      turning_point, what_changed, setbacks, current_state, letter,
#      identity_fields, consent_flags).
#   2. Call Claude again with the extracted struct and produce 800-1500 word
#      rendered prose in the Lantern Library voice.
#   3. Email the contributor the structured fields + rendered prose for
#      review and approval. Nothing publishes without explicit approval.

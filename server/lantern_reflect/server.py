"""HTTP launcher for the reflection bot.

The Next.js frontend POSTs to /reflect/start; we create a Daily room, spawn a
bot subprocess that joins it, and return the room URL + token to the browser.
The browser opens the room with the Daily call-frame SDK; the bot is already
in the room waiting.

This is intentionally minimal — production should run the bot under a process
supervisor (systemd, PM2, or Modal) rather than a subprocess.
"""

from __future__ import annotations

import asyncio
import os
import secrets
import sys
from typing import Any

import httpx
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from loguru import logger
from pydantic import BaseModel

load_dotenv()


class StartReflectionRequest(BaseModel):
    condition: str | None = None


class StartReflectionResponse(BaseModel):
    room_url: str
    token: str


app = FastAPI(title="Lantern Reflect", version="0.1.0")


def _require(env_name: str) -> str:
    value = os.getenv(env_name)
    if not value:
        raise HTTPException(
            status_code=500,
            detail=f"Server is missing {env_name}. See server/.env.example.",
        )
    return value


async def _create_daily_room() -> dict[str, Any]:
    api_key = _require("DAILY_API_KEY")
    room_name = f"lantern-{secrets.token_urlsafe(8)}"
    async with httpx.AsyncClient(timeout=30) as client:
        # Room
        room_resp = await client.post(
            "https://api.daily.co/v1/rooms",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "name": room_name,
                "privacy": "private",
                "properties": {
                    "exp": int(asyncio.get_event_loop().time()) + 60 * 60,  # 1h expiry
                    "enable_chat": False,
                    "enable_recording": "cloud",  # Brief: store raw audio in S3
                    "max_participants": 2,  # contributor + bot
                },
            },
        )
        room_resp.raise_for_status()
        room = room_resp.json()
        # Owner token (used by the browser participant)
        token_resp = await client.post(
            "https://api.daily.co/v1/meeting-tokens",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"properties": {"room_name": room_name, "is_owner": True}},
        )
        token_resp.raise_for_status()
        token = token_resp.json()["token"]
        return {"room_url": room["url"], "user_token": token, "room_name": room_name}


async def _spawn_bot(room_url: str, condition: str | None) -> None:
    """Run the bot as a subprocess so this HTTP request can return immediately."""
    cmd = [sys.executable, "-m", "lantern_reflect.bot", "--room-url", room_url]
    if condition:
        cmd.extend(["--condition", condition])
    logger.info("Spawning bot: {}", " ".join(cmd))
    await asyncio.create_subprocess_exec(*cmd)


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/reflect/start", response_model=StartReflectionResponse)
async def start_reflection(req: StartReflectionRequest) -> StartReflectionResponse:
    room = await _create_daily_room()
    await _spawn_bot(room["room_url"], req.condition)
    return StartReflectionResponse(room_url=room["room_url"], token=room["user_token"])


def cli() -> None:
    uvicorn.run(
        "lantern_reflect.server:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "7860")),
        reload=False,
    )


if __name__ == "__main__":
    cli()

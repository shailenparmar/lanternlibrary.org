import { NextResponse } from "next/server";
import { liveReaderTiles } from "@/lib/llm";

export const runtime = "nodejs";

const MAX_DRAFT_LEN = 4000;
const MIN_DRAFT_LEN = 12;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const draft = (body as { draft?: unknown })?.draft;
  if (typeof draft !== "string") {
    return NextResponse.json({ error: "draft must be a string" }, { status: 400 });
  }
  if (draft.length > MAX_DRAFT_LEN) {
    return NextResponse.json(
      { error: `draft too long (max ${MAX_DRAFT_LEN} chars)` },
      { status: 400 },
    );
  }
  if (draft.trim().length < MIN_DRAFT_LEN) {
    return NextResponse.json({ phrases: [], storySlugs: [] });
  }
  try {
    const tiles = await liveReaderTiles(draft);
    return NextResponse.json(tiles);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    if (msg.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 503 });
    }
    console.error("read tiles error:", err);
    return NextResponse.json({ error: "tile generation failed" }, { status: 500 });
  }
}

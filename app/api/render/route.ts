import { NextResponse } from "next/server";
import { renderLantern } from "@/lib/llm";

export const runtime = "nodejs";

const MAX_DRAFT_LEN = 12000;
const MIN_DRAFT_LEN = 200;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const draft = (body as { draft?: unknown })?.draft;
  if (typeof draft !== "string") {
    return NextResponse.json(
      { error: "draft must be a string" },
      { status: 400 },
    );
  }
  if (draft.length > MAX_DRAFT_LEN) {
    return NextResponse.json(
      { error: `draft too long (max ${MAX_DRAFT_LEN} chars)` },
      { status: 400 },
    );
  }
  if (draft.trim().length < MIN_DRAFT_LEN) {
    return NextResponse.json(
      { error: "keep going — there isn't enough yet to render a lantern" },
      { status: 400 },
    );
  }
  try {
    const rendered = await renderLantern(draft);
    return NextResponse.json(rendered);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    if (msg.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 503 });
    }
    console.error("render error:", err);
    return NextResponse.json(
      { error: "rendering failed — please try again" },
      { status: 500 },
    );
  }
}

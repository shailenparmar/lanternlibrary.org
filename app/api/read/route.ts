import { NextResponse } from "next/server";
import { readMatch, type ChatMessage } from "@/lib/llm";

export const runtime = "nodejs";

const MAX_MESSAGES = 30;
const MAX_CONTENT_LEN = 2000;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array" },
      { status: 400 },
    );
  }
  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: `conversation too long (max ${MAX_MESSAGES} turns)` },
      { status: 400 },
    );
  }

  const validated: ChatMessage[] = [];
  for (const m of messages) {
    const msg = m as { role?: unknown; content?: unknown };
    if (
      (msg.role !== "user" && msg.role !== "assistant") ||
      typeof msg.content !== "string" ||
      msg.content.length === 0 ||
      msg.content.length > MAX_CONTENT_LEN
    ) {
      return NextResponse.json(
        { error: "invalid message shape" },
        { status: 400 },
      );
    }
    validated.push({ role: msg.role, content: msg.content });
  }

  if (validated[0].role !== "user") {
    return NextResponse.json(
      { error: "first message must be from user" },
      { status: 400 },
    );
  }

  try {
    const result = await readMatch(validated);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    if (msg.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 503 });
    }
    console.error("read agent error:", err);
    return NextResponse.json(
      { error: "agent failed — please try again" },
      { status: 500 },
    );
  }
}

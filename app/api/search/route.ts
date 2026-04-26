import { NextResponse } from "next/server";
import { searchStories } from "@/lib/llm";

export const runtime = "nodejs";

const MAX_QUERY_LEN = 500;
const MIN_QUERY_LEN = 2;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }
  const query = (body as { query?: unknown })?.query;
  if (typeof query !== "string") {
    return NextResponse.json({ error: "query must be a string" }, { status: 400 });
  }
  if (query.length > MAX_QUERY_LEN) {
    return NextResponse.json(
      { error: `query too long (max ${MAX_QUERY_LEN} chars)` },
      { status: 400 },
    );
  }
  if (query.trim().length < MIN_QUERY_LEN) {
    return NextResponse.json({ storySlugs: [], followUps: [] });
  }
  try {
    const results = await searchStories(query);
    return NextResponse.json(results);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    if (msg.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json({ error: msg }, { status: 503 });
    }
    console.error("search error:", err);
    return NextResponse.json({ error: "search failed" }, { status: 500 });
  }
}

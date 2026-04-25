"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { Lantern } from "@/components/Lantern";
import { SampleBadge } from "@/components/SampleBadge";

type Turn = { role: "user" | "assistant"; content: string };
type ReadResponse =
  | { type: "text"; text: string }
  | { type: "stories"; slugs: string[]; note?: string };

type StoryCard = {
  slug: string;
  title: string;
  contributor: string;
  contributorAge: number;
  conditionLabel: string;
  dek: string;
};

const OPENING =
  "I'm here whenever you're ready. What brings you to Lantern Library today? You can be as broad or as specific as you like.";

export default function ReadPage() {
  const [turns, setTurns] = useState<Turn[]>([
    { role: "assistant", content: OPENING },
  ]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matched, setMatched] = useState<{
    slugs: string[];
    note?: string;
  } | null>(null);
  const [storyMeta, setStoryMeta] = useState<Record<string, StoryCard>>({});
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [turns, matched]);

  useEffect(() => {
    if (!matched) return;
    fetch("/api/read/stories?slugs=" + matched.slugs.join(","))
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { stories: StoryCard[] }) => {
        const next: Record<string, StoryCard> = {};
        for (const s of data.stories) next[s.slug] = s;
        setStoryMeta(next);
      })
      .catch(() => {});
  }, [matched]);

  async function send() {
    const trimmed = draft.trim();
    if (!trimmed || pending) return;
    setError(null);
    const next = [...turns, { role: "user" as const, content: trimmed }];
    setTurns(next);
    setDraft("");
    setPending(true);
    try {
      const res = await fetch("/api/read", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((_, i) => !(i === 0 && next[0].role === "assistant")),
        }),
      });
      const data = (await res.json()) as ReadResponse | { error: string };
      if (!res.ok) {
        setError(("error" in data && data.error) || "Something went wrong.");
        setTurns(next);
        return;
      }
      if ("type" in data) {
        if (data.type === "text") {
          setTurns([...next, { role: "assistant", content: data.text }]);
        } else {
          setMatched({ slugs: data.slugs, note: data.note });
          setTurns([
            ...next,
            {
              role: "assistant",
              content:
                data.note ??
                "Here are a few stories from the collection that may resonate.",
            },
          ]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setTurns(next);
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    setTurns([{ role: "assistant", content: OPENING }]);
    setMatched(null);
    setStoryMeta({});
    setError(null);
    setDraft("");
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <header className="flex items-center justify-between">
        <Wordmark />
        <div className="flex items-center gap-5 font-sans text-sm">
          <Link
            href="/stories"
            className="text-muted hover:text-foreground transition-colors"
          >
            Browse all
          </Link>
          {turns.length > 1 && (
            <button
              type="button"
              onClick={reset}
              className="text-muted hover:text-foreground transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </header>

      <p className="mt-6 font-sans text-[11px] tracking-[0.2em] uppercase text-flame/70">
        Conversational discovery — Claude-guided
      </p>

      <main className="flex-1 max-w-2xl mx-auto w-full pt-12 pb-8 flex flex-col">
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground">
          Find a story <span className="italic text-flame">that finds you.</span>
        </h1>
        <p className="font-serif text-lg leading-snug text-foreground/70 mt-3">
          Tell me what you are walking through. I have read every story in this
          collection and will surface a few that may resonate.
        </p>

        <div
          ref={scrollRef}
          className="mt-10 flex-1 space-y-6 overflow-y-auto max-h-[55vh] pr-1"
        >
          {turns.map((t, i) => (
            <div
              key={i}
              className={`font-serif text-lg leading-relaxed ${
                t.role === "assistant"
                  ? "text-foreground/85"
                  : "text-foreground/65 italic border-l-2 border-rule pl-4"
              }`}
            >
              {t.role === "assistant" && (
                <span className="inline-block mr-2 align-middle">
                  <Lantern lit />
                </span>
              )}
              {t.content}
            </div>
          ))}

          {pending && (
            <div className="font-sans text-xs text-muted tracking-wide animate-pulse">
              listening…
            </div>
          )}

          {matched && (
            <section className="mt-10 border-t border-rule pt-8 space-y-5">
              <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
                Stories the host pulled for you
              </h2>
              {matched.slugs.map((slug) => {
                const meta = storyMeta[slug];
                return (
                  <Link
                    key={slug}
                    href={`/story/${slug}`}
                    className="group block hover:bg-flame/[0.03] -mx-3 px-3 py-3 rounded-sm transition-colors"
                  >
                    {meta ? (
                      <>
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h3 className="font-serif text-xl text-foreground group-hover:text-flame transition-colors">
                            {meta.title}
                          </h3>
                          <SampleBadge />
                        </div>
                        <p className="font-serif text-base text-foreground/70 mt-1">
                          {meta.dek}
                        </p>
                        <p className="font-sans text-xs text-muted mt-2">
                          {meta.contributor}, {meta.contributorAge} ·{" "}
                          {meta.conditionLabel}
                        </p>
                      </>
                    ) : (
                      <p className="font-serif text-foreground/60">
                        Loading {slug}…
                      </p>
                    )}
                  </Link>
                );
              })}
            </section>
          )}
        </div>

        {!matched && (
          <div className="mt-6">
            {error && (
              <p className="font-sans text-xs text-flame/80 mb-3">{error}</p>
            )}
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={pending}
                rows={2}
                placeholder="Type something — short or long, doesn't matter."
                className="flex-1 bg-transparent border border-rule rounded-sm p-4 font-serif text-lg leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-none"
              />
              <button
                type="button"
                onClick={send}
                disabled={pending || !draft.trim()}
                className="font-sans text-sm tracking-wide text-flame hover:text-foreground disabled:opacity-30 transition-colors px-3 py-3"
              >
                send →
              </button>
            </div>
            <p className="font-sans text-xs text-muted mt-2">
              Press Enter to send · Shift+Enter for newline
            </p>
          </div>
        )}
      </main>

      <footer className="font-sans text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-6 pt-8 border-t border-rule mt-auto">
        <span>lanternlibrary.org</span>
        <span>A nonprofit archive.</span>
        <span>Not medical advice.</span>
      </footer>
    </div>
  );
}

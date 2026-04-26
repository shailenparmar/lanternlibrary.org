"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

export function ReadChat() {
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
          messages: next.filter(
            (_, i) => !(i === 0 && next[0].role === "assistant"),
          ),
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
    inputRef.current?.focus();
  }

  return (
    <section className="w-full">
      <div className="space-y-6">
        {turns.map((t, i) => (
          <div
            key={i}
            className={`font-serif text-lg sm:text-xl leading-relaxed ${
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
          <div className="mt-10 border-t border-rule pt-8 space-y-5">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
              Stories from the collection
            </p>
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
          </div>
        )}
      </div>

      {!matched && (
        <div className="mt-10">
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

      {(matched || turns.length > 1) && (
        <button
          type="button"
          onClick={reset}
          className="mt-6 font-sans text-xs text-muted hover:text-foreground transition-colors"
        >
          ← start over
        </button>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLiveTiles } from "./useLiveTiles";
import { SampleBadge } from "./SampleBadge";

type ReaderTiles = {
  phrases: string[];
  storySlugs: string[];
};

type StoryCard = {
  slug: string;
  title: string;
  contributor: string;
  contributorAge: number;
  conditionLabel: string;
  dek: string;
};

export function ReaderSurface() {
  const [draft, setDraft] = useState("");
  const { data, pending, error } = useLiveTiles<ReaderTiles>({
    endpoint: "/api/tiles/read",
    draft,
    minLength: 12,
  });
  const [storyMeta, setStoryMeta] = useState<Record<string, StoryCard>>({});

  useEffect(() => {
    const slugs = data?.storySlugs ?? [];
    const missing = slugs.filter((s) => !storyMeta[s]);
    if (missing.length === 0) return;
    fetch("/api/read/stories?slugs=" + missing.join(","))
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((res: { stories: StoryCard[] }) => {
        setStoryMeta((prev) => {
          const next = { ...prev };
          for (const s of res.stories) next[s.slug] = s;
          return next;
        });
      })
      .catch(() => {});
  }, [data?.storySlugs, storyMeta]);

  const phrases = data?.phrases ?? [];
  const storyCards = (data?.storySlugs ?? [])
    .map((slug) => storyMeta[slug])
    .filter((s): s is StoryCard => Boolean(s));

  return (
    <div className="space-y-10">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="What are you walking through? Write as much or as little as you like — a few words, a paragraph, doesn't matter. Tiles will surface as you go."
        rows={5}
        className="w-full bg-transparent border border-rule rounded-sm p-5 font-serif text-lg sm:text-xl leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-y"
        autoFocus
      />

      {/* Status line */}
      <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/70 -mt-7 px-1 flex items-center gap-3 min-h-[1em]">
        {pending && <span className="text-flame/70 animate-pulse">listening</span>}
        {error && <span className="text-flame/80">{error}</span>}
        {!pending && !error && draft.trim().length > 0 && draft.trim().length < 12 && (
          <span>keep going — a few more words</span>
        )}
      </div>

      {/* Phrase tiles — what was heard */}
      {phrases.length > 0 && (
        <section>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-4">
            What I'm hearing
          </p>
          <ul className="flex flex-wrap gap-2">
            {phrases.map((p) => (
              <li
                key={p}
                className="group rounded-sm border border-flame/30 bg-flame/[0.04] px-3 py-2 font-serif italic text-base text-foreground/85 transition-all duration-500 ease-out animate-tile-in"
              >
                "{p}"
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Story tiles */}
      {storyCards.length > 0 && (
        <section>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-4">
            Stories that may resonate
          </p>
          <ul className="space-y-3">
            {storyCards.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/story/${s.slug}`}
                  className="group block rounded-sm border border-rule px-4 py-3 hover:border-flame/50 hover:bg-flame/[0.03] transition-all animate-tile-in"
                >
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-flame transition-colors">
                      {s.title}
                    </h3>
                    <SampleBadge />
                  </div>
                  <p className="font-serif text-sm text-foreground/65 mt-1">
                    {s.dek}
                  </p>
                  <p className="font-sans text-[11px] text-muted mt-1.5">
                    {s.contributor}, {s.contributorAge} · {s.conditionLabel}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

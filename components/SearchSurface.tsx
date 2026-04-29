"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLiveTiles } from "./useLiveTiles";
import { SampleBadge } from "./SampleBadge";

type SearchResults = {
  storySlugs: string[];
  followUps: string[];
};

type StoryCard = {
  slug: string;
  title: string;
  contributor: string;
  contributorAge: number;
  conditionLabel: string;
  dek: string;
};

const SAMPLE_QUERIES = [
  "I think I have BDD",
  "Hate my own face",
  "Stuck in the mirror",
  "Compare myself constantly",
  "Anxious all the time",
  "Can't get out of bed",
  "I think I'm depressed",
  "Numb for months",
  "So lonely",
  "No one to talk to",
  "Looking for community",
  "I think I have OCD",
  "Struggling with anorexia",
  "I'm losing my hair",
  "Chronic pain that won't go away",
  "After a spinal cord injury",
  "I'm in the dark middle",
  "Brain fog",
  "Always tired",
  "Just got diagnosed",
];

const SAMPLE_CYCLE_MS = 3500;

export function SearchSurface() {
  const [query, setQuery] = useState("");
  const [sampleIdx, setSampleIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, pending, error } = useLiveTiles<SearchResults>({
    endpoint: "/api/search",
    draft: query,
    bodyKey: "query",
    minLength: 3,
    debounceMs: 600,
  });
  const [storyMeta, setStoryMeta] = useState<Record<string, StoryCard>>({});

  // Cycle sample placeholders only when input is empty.
  useEffect(() => {
    if (query.length > 0) return;
    const t = setInterval(
      () => setSampleIdx((i) => (i + 1) % SAMPLE_QUERIES.length),
      SAMPLE_CYCLE_MS,
    );
    return () => clearInterval(t);
  }, [query]);

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

  const storyCards = (data?.storySlugs ?? [])
    .map((slug) => storyMeta[slug])
    .filter((s): s is StoryCard => Boolean(s));

  const showShimmer = pending && query.trim().length >= 3;

  return (
    <div className="space-y-6">
      <div className="relative">
        <SearchIcon />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=""
          autoFocus
          className="w-full bg-transparent border border-rule rounded-sm pl-11 pr-16 py-3.5 font-serif text-lg leading-relaxed text-foreground/90 focus:outline-none focus:border-flame/50 transition-colors"
        />

        {/* Cycling sample placeholders — only when input is empty */}
        {query.length === 0 && (
          <div
            key={sampleIdx}
            aria-hidden="true"
            className="pointer-events-none absolute left-11 right-16 top-1/2 -translate-y-1/2 font-serif italic text-foreground/40 truncate animate-sample-cycle"
          >
            {SAMPLE_QUERIES[sampleIdx]}
          </div>
        )}

        {!pending && query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-sans text-xs text-muted hover:text-foreground transition-colors"
            aria-label="Clear"
          >
            clear
          </button>
        )}
      </div>

      {error && <p className="font-sans text-xs text-flame/80">{error}</p>}

      {/* Shimmer skeletons while loading */}
      {showShimmer && storyCards.length === 0 && (
        <ul className="space-y-2" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="rounded-sm border border-rule px-4 py-3 overflow-hidden relative animate-shimmer"
            >
              <div className="h-5 w-3/4 rounded-sm bg-foreground/[0.06]" />
              <div className="h-3.5 w-5/6 rounded-sm bg-foreground/[0.04] mt-2" />
              <div className="h-3 w-1/3 rounded-sm bg-foreground/[0.04] mt-2.5" />
            </li>
          ))}
        </ul>
      )}

      {storyCards.length > 0 && (
        <ul className="space-y-2">
          {storyCards.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/story/${s.slug}`}
                className="group block rounded-sm border border-rule px-4 py-3 hover:border-flame/50 hover:bg-flame/[0.03] transition-all animate-tile-in"
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="font-serif text-lg text-foreground group-hover:text-flame transition-colors leading-tight">
                    {s.title}
                  </h3>
                  <SampleBadge />
                </div>
                <p className="font-serif text-sm text-foreground/65 mt-1 leading-snug">
                  {s.dek}
                </p>
                <p className="font-sans text-[11px] text-muted mt-1.5">
                  {s.contributor}, {s.contributorAge} · {s.conditionLabel}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

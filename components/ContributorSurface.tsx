"use client";

import { useState } from "react";
import { useLiveTiles } from "./useLiveTiles";
import { useDictation } from "./useDictation";

type ContributorTiles = {
  phrases: string[];
  invitations: string[];
};

const RELEASE_THRESHOLD = 600;

export function ContributorSurface() {
  const [draft, setDraft] = useState("");
  const dictation = useDictation({
    onFinal: (text) =>
      setDraft((d) => (d.endsWith(" ") || d === "" ? d : d + " ") + text),
  });
  const { data, pending, error } = useLiveTiles<ContributorTiles>({
    endpoint: "/api/tiles/reflect",
    draft,
    minLength: 20,
  });

  const phrases = data?.phrases ?? [];
  const invitations = data?.invitations ?? [];
  const enoughToRelease = draft.trim().length >= RELEASE_THRESHOLD;

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-10 items-start">
      {/* Drafting column */}
      <div>
        <div className="relative">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Start anywhere. Wander. Contradictions welcome — say the thing, then say the opposite if both are true."
            rows={14}
            className="w-full bg-transparent border border-rule rounded-sm px-5 pt-5 pb-12 font-serif text-lg leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-y min-h-[280px]"
            autoFocus
          />

          {/* Floating words — proof of listening (voice) */}
          {dictation.active && dictation.interim && (
            <div
              key={dictation.interim}
              className="pointer-events-none absolute bottom-3 left-5 right-16 font-serif italic text-flame/75 text-base truncate animate-floating-word"
              aria-live="polite"
            >
              {dictation.interim}
            </div>
          )}

          {/* Voice mic button */}
          <button
            type="button"
            onClick={dictation.toggle}
            disabled={!dictation.supported}
            title={
              !dictation.supported
                ? "Voice not supported in this browser"
                : dictation.active
                  ? "Listening — click to stop"
                  : "Speak instead of typing"
            }
            className={`absolute bottom-3 right-3 inline-flex items-center justify-center h-9 w-9 rounded-full transition-all ${
              dictation.active
                ? "bg-flame/15 text-flame shadow-[0_0_12px_2px_rgba(244,162,60,0.4)]"
                : "border border-rule text-muted hover:text-foreground hover:border-flame/40 disabled:opacity-30 disabled:hover:text-muted disabled:hover:border-rule"
            }`}
          >
            <MicIcon />
            {dictation.active && (
              <span className="absolute inset-0 rounded-full animate-ping bg-flame/30" />
            )}
          </button>
        </div>

        <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/70 mt-2 px-1 flex items-center gap-3 min-h-[1em]">
          {pending && (
            <span className="text-flame/70 animate-pulse">listening</span>
          )}
          {error && <span className="text-flame/80">{error}</span>}
          {!pending && !error && draft.trim().length === 0 && (
            <span>auto-saves as you write</span>
          )}
          {dictation.active && !pending && (
            <span className="text-flame/60">voice on</span>
          )}
          {!dictation.active && !pending && draft.trim().length > 0 && !error && (
            <span>{draft.trim().length} characters</span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="font-sans text-xs text-muted">
            {enoughToRelease
              ? "Ready when you are."
              : "You'll be able to release your lantern in a moment."}
          </span>
          <button
            type="button"
            disabled={!enoughToRelease}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-sans text-sm tracking-wide border-flame/40 text-flame hover:bg-flame/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title={
              enoughToRelease
                ? "Send your draft to the rendering pipeline; you'll review before publishing."
                : "Keep writing."
            }
          >
            <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
            Release my lantern
          </button>
        </div>
      </div>

      {/* Reflecting tiles + prompts column */}
      <aside className="space-y-10 lg:sticky lg:top-10">
        {phrases.length === 0 && invitations.length === 0 && !pending && (
          <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/40">
            a question and a few tiles will surface here
          </p>
        )}

        {/* One question, on top */}
        {invitations[0] && (
          <section
            key={invitations[0]}
            className="animate-tile-in"
          >
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-3">
              If you want to go deeper
            </p>
            <p className="font-serif italic text-2xl sm:text-3xl leading-snug text-flame/90">
              {invitations[0]}
            </p>
          </section>
        )}

        {/* Three reflection tiles, beneath */}
        {phrases.length > 0 && (
          <section>
            <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-3">
              What I'm hearing
            </p>
            <ul className="space-y-3">
              {phrases.map((p) => (
                <li
                  key={p}
                  className="rounded-sm border border-flame/30 bg-flame/[0.05] px-5 py-4 font-serif italic text-xl sm:text-2xl leading-snug text-foreground/90 animate-tile-in"
                >
                  &ldquo;{p}&rdquo;
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative z-10"
    >
      <rect x="9" y="2" width="6" height="13" rx="3" />
      <path d="M19 11a7 7 0 0 1-14 0" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  );
}

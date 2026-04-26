"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveTiles } from "./useLiveTiles";
import { useDictation } from "./useDictation";

type ContributorTiles = {
  phrases: string[];
  invitations: string[];
};

const RELEASE_THRESHOLD = 600;
const VISIBLE_TAIL_CHARS = 110;
const FADE_AFTER_MS = 2200;

export function ContributorSurface() {
  const [draft, setDraft] = useState("");
  const [showing, setShowing] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const dictation = useDictation({
    onFinal: (text) =>
      setDraft((d) => (d.endsWith(" ") || d === "" ? d : d + " ") + text),
  });

  const { data, pending, error } = useLiveTiles<ContributorTiles>({
    endpoint: "/api/tiles/reflect",
    draft,
    minLength: 20,
  });

  // Auto-fade the live display after a pause in input.
  useEffect(() => {
    setShowing(true);
    const t = setTimeout(() => setShowing(false), FADE_AFTER_MS);
    return () => clearTimeout(t);
  }, [draft, dictation.interim]);

  const phrases = data?.phrases ?? [];
  const invitation = data?.invitations?.[0] ?? null;
  const enoughToRelease = draft.trim().length >= RELEASE_THRESHOLD;

  // What's visible right now: tail of accumulated draft + any interim voice words.
  const liveText = (() => {
    const combined = (
      draft +
      (dictation.interim ? (draft.endsWith(" ") || draft === "" ? "" : " ") + dictation.interim : "")
    ).trimStart();
    if (combined.length === 0) return "";
    if (combined.length > VISIBLE_TAIL_CHARS) {
      return "…" + combined.slice(-VISIBLE_TAIL_CHARS);
    }
    return combined;
  })();

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Hidden textarea — captures all input but is never displayed */}
      <textarea
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        autoFocus
        aria-label="Share your story"
        className="sr-only"
      />

      {/* Centered question */}
      <div className="min-h-[5rem] flex items-end w-full">
        {invitation && (
          <p
            key={invitation}
            className="font-serif italic text-2xl sm:text-3xl leading-snug text-flame/90 text-center w-full animate-tile-in"
          >
            {invitation}
          </p>
        )}
      </div>

      {/* Centered reflection tiles */}
      <ul className="mt-8 space-y-3 w-full max-w-xl min-h-[8rem]">
        {phrases.map((p) => (
          <li
            key={p}
            className="rounded-sm border border-flame/30 bg-flame/[0.05] px-5 py-4 font-serif italic text-xl sm:text-2xl leading-snug text-foreground/90 text-center animate-tile-in"
          >
            &ldquo;{p}&rdquo;
          </li>
        ))}
      </ul>

      {/* Status line */}
      <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/70 mt-8 mb-4 min-h-[1em] flex items-center gap-3">
        {pending && <span className="text-flame/70 animate-pulse">listening</span>}
        {error && <span className="text-flame/80">{error}</span>}
        {dictation.active && !pending && (
          <span className="text-flame/60">voice on</span>
        )}
        {!pending && !error && draft.trim().length === 0 && !dictation.active && (
          <span className="text-muted/60">type or speak — your words pass through</span>
        )}
      </div>

      {/* Live ephemeral display — type or speak shows here, fades on pause */}
      <button
        type="button"
        onClick={() => inputRef.current?.focus()}
        className="w-full text-center cursor-text bg-transparent border-none focus:outline-none"
        aria-label="Focus input"
      >
        <div
          className="font-serif italic text-2xl sm:text-3xl leading-relaxed text-foreground/85 min-h-[3em] px-2 transition-opacity duration-[1600ms] ease-out"
          style={{
            opacity: liveText ? (showing ? 1 : 0) : 0.25,
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 100%)",
          }}
        >
          {liveText || (
            <span className="font-sans not-italic text-xs tracking-[0.2em] uppercase text-muted/40">
              click here and start
            </span>
          )}
        </div>
      </button>

      {/* Bottom controls */}
      <div className="mt-12 flex items-center gap-6">
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
          className={`relative inline-flex items-center justify-center h-12 w-12 rounded-full transition-all ${
            dictation.active
              ? "bg-flame/15 text-flame shadow-[0_0_16px_3px_rgba(244,162,60,0.4)]"
              : "border border-rule text-muted hover:text-foreground hover:border-flame/40 disabled:opacity-30 disabled:hover:text-muted disabled:hover:border-rule"
          }`}
        >
          <MicIcon />
          {dictation.active && (
            <span className="absolute inset-0 rounded-full animate-ping bg-flame/30" />
          )}
        </button>

        <button
          type="button"
          disabled={!enoughToRelease}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border font-sans text-sm tracking-wide border-flame/40 text-flame hover:bg-flame/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title={
            enoughToRelease
              ? "Send your draft to the rendering pipeline; you'll review before publishing."
              : "Keep going."
          }
        >
          <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
          Release my lantern
        </button>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      width="18"
      height="18"
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

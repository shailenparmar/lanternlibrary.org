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
const FADE_DURATION_MS = 1600;

export function ContributorSurface() {
  const [draft, setDraft] = useState("");
  // sessionStart marks the position in `draft` where the CURRENT visible
  // bubble began. When the bubble fades out completely, sessionStart is
  // bumped to draft.length so the next input starts a fresh bubble — old
  // text never returns.
  const [sessionStart, setSessionStart] = useState(0);
  const [showing, setShowing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dictation = useDictation({
    onFinal: (text) =>
      setDraft((d) => (d.endsWith(" ") || d === "" ? d : d + " ") + text),
  });

  const { data, error } = useLiveTiles<ContributorTiles>({
    endpoint: "/api/tiles/reflect",
    draft,
    minLength: 20,
  });

  // Auto-focus textarea on any global keystroke so the user never has to click.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const ta = inputRef.current;
      if (!ta) return;
      if (document.activeElement === ta) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Skip if focus is on another text-entry element (e.g. mic button retains focus briefly).
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.length === 1) {
        e.preventDefault();
        setDraft((d) => d + e.key);
        ta.focus();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setDraft((d) => d.slice(0, -1));
        ta.focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        setDraft((d) => d + "\n");
        ta.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Schedule the fade-out and the post-fade clear on each input.
  useEffect(() => {
    const hasNewInput =
      draft.length > sessionStart || dictation.interim.length > 0;
    if (!hasNewInput) return;

    setShowing(true);
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    fadeTimerRef.current = setTimeout(() => {
      setShowing(false);
      clearTimerRef.current = setTimeout(() => {
        // Snapshot current draft length: next input starts a fresh bubble.
        setSessionStart(draft.length);
      }, FADE_DURATION_MS);
    }, FADE_AFTER_MS);

    return () => {
      // We intentionally do NOT clear the fade timer on rerender — we want
      // it to keep running across input updates so the most recent timer wins.
    };
  }, [draft, dictation.interim, sessionStart]);

  const phrases = data?.phrases ?? [];
  const invitation = data?.invitations?.[0] ?? null;
  const enoughToRelease = draft.trim().length >= RELEASE_THRESHOLD;

  // What's visible right now: only the tail of the CURRENT bubble + interim.
  const liveText = (() => {
    const sessionPart = draft.slice(sessionStart);
    const interimPart = dictation.interim
      ? (sessionPart.endsWith(" ") || sessionPart === "" ? "" : " ") +
        dictation.interim
      : "";
    const combined = (sessionPart + interimPart).trimStart();
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

      {/* Four reflector squares — at the top, fade in/out as you type */}
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {[0, 1, 2, 3].map((i) => {
          const phrase = phrases[i];
          return (
            <li
              key={phrase ?? `empty-${i}`}
              className={`aspect-square rounded-sm border flex items-center justify-center p-3 transition-all duration-700 ease-out ${
                phrase
                  ? "border-flame/30 bg-flame/[0.05] animate-tile-in"
                  : "border-rule/60 bg-transparent"
              }`}
            >
              {phrase ? (
                <span className="font-serif text-base sm:text-lg leading-tight text-foreground/90 text-center">
                  &ldquo;{phrase}&rdquo;
                </span>
              ) : (
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/30">
                  ·
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Prompt question — beneath the squares */}
      <div className="mt-10 min-h-[3.5rem] flex items-start w-full">
        {invitation && (
          <p
            key={invitation}
            className="font-serif text-xl sm:text-2xl leading-snug text-flame/90 text-center w-full animate-tile-in"
          >
            {invitation}
          </p>
        )}
      </div>

      {/* Status line — only shows errors or voice-on state */}
      <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/70 mt-8 mb-4 min-h-[1em] flex items-center gap-3">
        {error && <span className="text-flame/80">{error}</span>}
        {dictation.active && (
          <span className="text-flame/60">voice on</span>
        )}
      </div>

      {/* Live ephemeral display — type or speak shows here, fades on pause */}
      <div
        className="w-full text-center font-serif text-2xl sm:text-3xl leading-relaxed text-foreground/85 min-h-[3em] px-2 transition-opacity duration-[1600ms] ease-out"
        style={{
          opacity: liveText ? (showing ? 1 : 0) : 0.3,
          maskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 10%, black 100%)",
        }}
      >
        {liveText || (
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted/40">
            start typing
          </span>
        )}
      </div>

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
          I'm ready to see my lantern
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

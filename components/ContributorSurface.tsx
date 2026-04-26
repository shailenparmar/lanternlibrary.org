"use client";

import { useState } from "react";
import { useLiveTiles } from "./useLiveTiles";

type ContributorTiles = {
  phrases: string[];
  invitations: string[];
};

const RELEASE_THRESHOLD = 600; // chars before "release my lantern" enables

export function ContributorSurface() {
  const [draft, setDraft] = useState("");
  const [voiceOn, setVoiceOn] = useState(false);
  const { data, pending, error } = useLiveTiles<ContributorTiles>({
    endpoint: "/api/tiles/reflect",
    draft,
    minLength: 20,
  });

  const phrases = data?.phrases ?? [];
  const invitations = data?.invitations ?? [];

  const enoughToRelease = draft.trim().length >= RELEASE_THRESHOLD;

  return (
    <div className="space-y-8">
      <p className="font-serif text-base sm:text-lg leading-relaxed text-foreground/70 italic">
        Write freely. Wander. Free associate. Contradictions welcome — say the
        thing, then say the opposite if both are true. We will organize your
        thoughts afterward, and you can edit before releasing your lantern.
      </p>

      <div className="relative">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Start anywhere. Onset, the worst of it, what you tried, the turn, where you are now — in any order, in any voice. The system will hold the structure."
          rows={14}
          className="w-full bg-transparent border border-rule rounded-sm p-5 font-serif text-lg leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-y"
          autoFocus
        />
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVoiceOn((v) => !v)}
            title={voiceOn ? "Voice on — speak; we'll listen" : "Voice off"}
            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border font-sans text-xs transition-colors ${
              voiceOn
                ? "border-flame/40 text-flame bg-flame/[0.06]"
                : "border-rule text-muted hover:text-foreground/80"
            }`}
          >
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                voiceOn
                  ? "bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]"
                  : "bg-foreground/30"
              }`}
            />
            voice
          </button>
        </div>
      </div>

      <div className="font-sans text-[11px] tracking-[0.18em] uppercase text-muted/70 px-1 flex items-center gap-4 min-h-[1em]">
        {pending && <span className="text-flame/70 animate-pulse">listening</span>}
        {error && <span className="text-flame/80">{error}</span>}
        {!pending && !error && draft.trim().length > 0 && draft.trim().length < 20 && (
          <span>keep going</span>
        )}
        {voiceOn && (
          <span className="text-flame/60">
            voice prototype — speech-to-text not wired yet
          </span>
        )}
      </div>

      {/* What was heard */}
      {phrases.length > 0 && (
        <section>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-4">
            What I'm hearing
          </p>
          <ul className="flex flex-wrap gap-2">
            {phrases.map((p) => (
              <li
                key={p}
                className="rounded-sm border border-flame/30 bg-flame/[0.04] px-3 py-2 font-serif italic text-base text-foreground/85 animate-tile-in"
              >
                "{p}"
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Gentle invitations */}
      {invitations.length > 0 && (
        <section>
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 mb-4">
            If you want to go deeper
          </p>
          <ul className="space-y-2">
            {invitations.map((inv) => (
              <li
                key={inv}
                className="font-serif text-base sm:text-lg italic text-foreground/70 before:content-['—'] before:mr-2 before:text-flame/60 animate-tile-in"
              >
                {inv}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-8 border-t border-rule flex items-center justify-between flex-wrap gap-4">
        <span className="font-sans text-xs text-muted">
          {draft.trim().length === 0
            ? "Auto-saving when you start writing."
            : enoughToRelease
              ? "Ready to release whenever you are."
              : `Auto-saving · ${draft.trim().length} characters so far`}
        </span>
        <button
          type="button"
          disabled={!enoughToRelease}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border font-sans text-sm tracking-wide border-flame/40 text-flame hover:bg-flame/[0.08] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title={
            enoughToRelease
              ? "Send your draft to the rendering pipeline; you'll review before anything publishes."
              : "Keep writing. You'll be able to release your lantern in a moment."
          }
        >
          <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
          Release my lantern
        </button>
      </div>
    </div>
  );
}

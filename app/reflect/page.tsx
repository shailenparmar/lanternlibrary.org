"use client";

import { useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

type Beat = {
  slug: string;
  label: string;
  invitation: string;
  voicePrompt: string;
  tiles: string[];
  follows: string[];
  scratch: string;
};

const beats: Beat[] = [
  {
    slug: "onset",
    label: "Onset",
    invitation: "When did this first appear in your life?",
    voicePrompt: "Take me back to when it started. Where were you?",
    tiles: ["the first time I noticed", "I was eleven", "my mother said something"],
    follows: ["Tell me more about that day.", "What did you make of it then?"],
    scratch:
      "It started in eighth grade. There was a comment from a boy in my class — I cannot even remember his name now. He probably forgot it inside an hour. I carried it for the next twelve years…",
  },
  {
    slug: "dark-middle",
    label: "The dark middle",
    invitation: "What was it like at its worst?",
    voicePrompt: "What does the worst of it look like, when you go back there?",
    tiles: [
      "felt completely and hopelessly alone",
      "I lost forty-five minutes to a mirror",
      "it was a hostage situation",
      "I could not be late again",
    ],
    follows: [
      "Tell me more about how you hid this.",
      "What was going through your head then?",
    ],
    scratch:
      "I would lose forty-five minutes to a mirror without intending to. Late to work. Late to my own birthday. The thing I had been doing the entire time was studying a face I had already studied ten thousand times…",
  },
  {
    slug: "search",
    label: "Search for help",
    invitation: "What did you try? What worked, what didn't?",
    voicePrompt: "What did you reach for when you knew you needed something?",
    tiles: [
      "tried makeup, tried no makeup",
      "three surgical consultations",
      "an older man with kind eyes",
    ],
    follows: ["What kind of therapy?", "What did your therapist actually have you do?"],
    scratch:
      "I tried makeup. I tried no makeup. I tried surgery consultations — three of them — and one of the surgeons sat me down and said something I did not appreciate at the time…",
  },
  {
    slug: "turn",
    label: "Turning point",
    invitation: "When and how did something shift?",
    voicePrompt: "Was there a moment you can name, or was it more like a slow turn?",
    tiles: ["she did not call it BDD", "we worked on the loop", "not on my face"],
    follows: ["What changed in the moment?", "What did you notice first?"],
    scratch: "She did not call it BDD for the first six months. She called it the loop…",
  },
  {
    slug: "changed",
    label: "What changed",
    invitation: "What was the actual mechanism of change?",
    voicePrompt: "When you look back, what was it that did the work?",
    tiles: ["the loop had less air to breathe in", "a life full enough"],
    follows: ["What does \"a life full enough\" mean to you now?"],
    scratch:
      "What changed it was not believing I was beautiful. I am not sure I believe that even now. What changed it was building a life full enough that the loop had less air to breathe in…",
  },
  {
    slug: "setbacks",
    label: "Setbacks",
    invitation: "Recovery is not linear. How did you find your way back?",
    voicePrompt: "When it came back — and it did come back — what did you do?",
    tiles: ["the old pattern came back", "I went to my therapist", "it lifted"],
    follows: ["What was the trigger that time?", "How long did the flare last?"],
    scratch: "",
  },
  {
    slug: "now",
    label: "Now",
    invitation: "What does life look like, honestly, today?",
    voicePrompt: "If you had to describe your life right now, in a sentence?",
    tiles: ["I think about it less than once a week", "I am doing well"],
    follows: ["What is something small that has changed?"],
    scratch: "",
  },
  {
    slug: "letter",
    label: "Letter to past self",
    invitation: "What would you tell yourself at the lowest point?",
    voicePrompt: "If she could hear you for thirty seconds — what is it?",
    tiles: ["you will not be inside the mirror forever", "what you look like stops being the thing your day is about"],
    follows: [],
    scratch:
      "I am writing this for the version of me who was nineteen and convinced she would be inside the mirror forever. You will not be…",
  },
];

export default function ReflectPage() {
  const [activeBeat, setActiveBeat] = useState<string>("dark-middle");
  const [voiceOn, setVoiceOn] = useState(true);
  const [textOn, setTextOn] = useState(true);
  const [draft, setDraft] = useState<string>("");

  const beat = beats.find((b) => b.slug === activeBeat) ?? beats[0];
  const completedIndex = beats.findIndex((b) => b.slug === activeBeat);

  return (
    <div className="flex flex-col flex-1 min-h-screen px-6 py-8 sm:px-10 sm:py-10">
      <header className="flex items-center justify-between">
        <Wordmark />
        <div className="flex items-center gap-6 font-sans text-sm">
          <Link
            href="/"
            className="text-muted hover:text-foreground transition-colors"
          >
            Save & exit
          </Link>
        </div>
      </header>

      <p className="mt-6 font-sans text-[11px] tracking-[0.2em] uppercase text-flame/70">
        Prototype — voice and AI not yet wired
      </p>

      {/* Beat strip */}
      <nav className="mt-6 -mx-2 overflow-x-auto">
        <ol className="flex items-center gap-1 min-w-max px-2">
          {beats.map((b, i) => {
            const active = b.slug === activeBeat;
            const done = i < completedIndex;
            return (
              <li key={b.slug} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveBeat(b.slug)}
                  className={`font-sans text-xs px-3 py-1.5 rounded-sm transition-colors whitespace-nowrap ${
                    active
                      ? "bg-flame/15 text-flame border border-flame/40"
                      : done
                        ? "text-foreground/70 hover:text-foreground border border-transparent"
                        : "text-muted hover:text-foreground/80 border border-transparent"
                  }`}
                >
                  <span className="mr-2 text-[10px] tabular-nums opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {b.label}
                </button>
                {i < beats.length - 1 && (
                  <span className="text-rule mx-0.5">·</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full pt-12 pb-16">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          {String(completedIndex + 1).padStart(2, "0")} of{" "}
          {String(beats.length).padStart(2, "0")}
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-foreground mt-3">
          {beat.label}
        </h1>
        <p className="font-serif text-xl leading-snug text-foreground/70 mt-3 italic max-w-xl">
          {beat.invitation}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-10 mt-14">
          {/* Voice column */}
          <section
            className={`transition-opacity ${voiceOn ? "" : "opacity-30"}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`relative inline-flex h-3 w-3 ${
                  voiceOn ? "" : "opacity-40"
                }`}
              >
                <span className="absolute inset-0 rounded-full bg-flame animate-ping opacity-50" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-flame shadow-[0_0_16px_3px_rgba(244,162,60,0.5)]" />
              </span>
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
                {voiceOn ? "Listening" : "Voice off"}
              </span>
            </div>

            {/* Orb */}
            <div className="mt-10 flex items-center justify-center">
              <div className="relative h-44 w-44">
                <span className="absolute inset-0 rounded-full bg-flame/10 blur-2xl" />
                <span
                  className={`absolute inset-3 rounded-full bg-gradient-to-br from-flame/40 via-flame/20 to-transparent ${
                    voiceOn ? "animate-pulse" : ""
                  }`}
                />
                <span className="absolute inset-10 rounded-full bg-flame/40 shadow-[0_0_60px_20px_rgba(244,162,60,0.35)]" />
                <span className="absolute inset-16 rounded-full bg-flame shadow-[0_0_40px_12px_rgba(244,162,60,0.6)]" />
              </div>
            </div>

            <p className="mt-10 font-serif text-base italic text-foreground/70 max-w-md mx-auto text-center">
              "{beat.voicePrompt}"
            </p>

            {beat.scratch && (
              <div className="mt-10 border-l-2 border-rule pl-4 font-serif text-base text-foreground/55 italic leading-relaxed max-h-40 overflow-hidden">
                <p className="text-[10px] not-italic tracking-[0.2em] uppercase text-muted mb-2 font-sans">
                  Heard so far
                </p>
                {beat.scratch}
              </div>
            )}
          </section>

          {/* Tiles column */}
          <section>
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
              What I'm hearing
            </h2>
            <p className="font-serif text-sm text-foreground/55 mt-2">
              Phrases from what you've said. Tap one to go deeper.
            </p>

            <ul className="mt-6 space-y-3">
              {beat.tiles.map((t, i) => (
                <li
                  key={t}
                  className={`group cursor-pointer rounded-sm px-4 py-3 transition-all border ${
                    i === 0
                      ? "border-flame/50 bg-flame/[0.06] shadow-[0_0_24px_-8px_rgba(244,162,60,0.4)]"
                      : "border-rule bg-rule/20 hover:border-flame/40 hover:bg-flame/[0.04]"
                  }`}
                >
                  <span className="font-serif text-base sm:text-lg italic text-foreground/85 group-hover:text-flame transition-colors">
                    "{t}"
                  </span>
                </li>
              ))}
            </ul>

            {beat.follows.length > 0 && (
              <div className="mt-10">
                <h3 className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
                  Gentle follow-ups
                </h3>
                <ul className="mt-4 space-y-2">
                  {beat.follows.map((f) => (
                    <li
                      key={f}
                      className="font-serif text-base text-foreground/70 italic before:content-['—'] before:mr-2 before:text-flame/60"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Text input */}
        <section className={`mt-16 ${textOn ? "" : "opacity-40"}`}>
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
              Or write freely
            </h2>
            <p className="font-sans text-xs text-muted">
              Contradictions welcome — say the thing, then say the opposite if both are true.
            </p>
          </div>
          <textarea
            disabled={!textOn}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write freely. Write openly. Write passionately. Wander. Free associate. Write your feelings. We will organize your thoughts afterward, and you can edit before releasing your lantern."
            className="mt-4 w-full min-h-[180px] bg-transparent border border-rule rounded-sm p-5 font-serif text-lg leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-y"
          />
        </section>
      </main>

      {/* Mode + footer */}
      <footer className="border-t border-rule pt-6 mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans text-xs">
        <div className="flex items-center gap-5">
          <ModeToggle
            label="Voice"
            on={voiceOn}
            onChange={() => setVoiceOn((v) => !v)}
          />
          <ModeToggle
            label="Text"
            on={textOn}
            onChange={() => setTextOn((v) => !v)}
          />
          <span className="text-muted hidden sm:inline">
            Use both. Or one. Switch any time.
          </span>
        </div>
        <div className="flex items-center gap-4 text-muted">
          <span>Auto-saving</span>
          <button
            type="button"
            disabled={completedIndex >= beats.length - 1}
            onClick={() =>
              setActiveBeat(beats[Math.min(completedIndex + 1, beats.length - 1)].slug)
            }
            className="text-foreground hover:text-flame transition-colors disabled:opacity-30 disabled:hover:text-foreground"
          >
            Next beat →
          </button>
        </div>
      </footer>
    </div>
  );
}

function ModeToggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-sm border transition-colors ${
        on
          ? "border-flame/40 text-flame bg-flame/[0.06]"
          : "border-rule text-muted hover:text-foreground/80"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          on
            ? "bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]"
            : "bg-foreground/30"
        }`}
      />
      {label}
    </button>
  );
}

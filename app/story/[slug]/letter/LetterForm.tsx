"use client";

import { useState } from "react";

const MIN_LENGTH = 80;

export function LetterForm({
  contributorFirstName,
}: {
  contributorFirstName: string;
}) {
  const [body, setBody] = useState("");
  const [fromName, setFromName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSend = body.trim().length >= MIN_LENGTH;

  if (submitted) {
    return (
      <section className="mt-12 border-t border-rule pt-10">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-flame">
            Letter received
          </p>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl leading-snug text-foreground mt-5">
          Your letter is on its way to a reader before it reaches {contributorFirstName}.
        </h2>
        <p className="font-serif text-base leading-relaxed text-foreground/70 mt-5">
          A moderator will read it within a few days. If it passes, it
          will be delivered privately. You won&rsquo;t hear back, and that
          is by design.
        </p>
      </section>
    );
  }

  return (
    <form
      className="mt-12"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSend) return;
        setSubmitted(true);
      }}
    >
      <label className="block">
        <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          Your letter
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder={`Dear ${contributorFirstName},`}
          className="w-full mt-3 bg-transparent border border-rule rounded-sm px-4 py-3 font-serif text-lg leading-relaxed text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors resize-none"
        />
      </label>

      <label className="block mt-6">
        <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          Sign as
        </span>
        <input
          type="text"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          placeholder="A first name, initials, or 'A reader'"
          className="w-full mt-3 bg-transparent border border-rule rounded-sm px-4 py-2.5 font-serif text-base text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors"
        />
      </label>

      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-sans text-xs text-muted">
          {body.trim().length < MIN_LENGTH
            ? `${MIN_LENGTH - body.trim().length} more characters before you can send.`
            : "Ready when you are."}
        </p>
        <button
          type="submit"
          disabled={!canSend}
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-flame/40 bg-flame/[0.06] text-flame hover:bg-flame/[0.12] hover:border-flame/70 transition-all font-sans text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-flame/[0.06] disabled:hover:border-flame/40"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
          <span>Send for moderation</span>
        </button>
      </div>
    </form>
  );
}

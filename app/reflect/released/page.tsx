"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { Lantern } from "@/components/Lantern";

type ReleasedLantern = {
  title: string;
  dek: string;
  contributor: string;
  releasedAt: string;
};

const RELEASED_STORAGE_KEY = "lantern.released";

export default function ReleasedPage() {
  const [latest, setLatest] = useState<ReleasedLantern | null>(null);

  useEffect(() => {
    try {
      const list = JSON.parse(
        localStorage.getItem(RELEASED_STORAGE_KEY) || "[]",
      ) as ReleasedLantern[];
      setLatest(list[0] ?? null);
    } catch {
      setLatest(null);
    }
  }, []);

  return (
    <div className="relative flex flex-col flex-1 min-h-screen px-6 sm:px-12 py-8 sm:py-10">
      <LanternField />

      <header className="relative z-10">
        <Link
          href="/"
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Lantern Library</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center w-full">
        <div className="max-w-xl w-full text-center">
          <div className="flex justify-center mb-8">
            <span className="relative inline-flex h-6 w-6">
              <span className="absolute inset-0 rounded-full bg-flame/30 animate-ping" />
              <span className="relative inline-flex h-6 w-6 rounded-full bg-flame shadow-[0_0_36px_10px_rgba(244,162,60,0.55)]" />
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground">
            Your lantern is{" "}
            <span className="text-flame italic">lit.</span>
          </h1>

          <p className="font-serif text-lg leading-relaxed text-foreground/75 mt-6 max-w-md mx-auto">
            Thank you. Someone walking the path you walked will read this and
            feel less alone.
          </p>

          {latest && (
            <div className="mt-12 pt-8 border-t border-rule text-left">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70">
                Released
              </p>
              <h2 className="font-serif text-xl text-foreground mt-2">
                {latest.title}
              </h2>
              <p className="font-serif text-sm text-foreground/60 mt-1.5 italic">
                {latest.dek}
              </p>
              <p className="font-sans text-xs text-muted mt-3">
                {latest.contributor} ·{" "}
                {new Date(latest.releasedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-flame/40 bg-flame/[0.06] text-flame hover:bg-flame/[0.12] hover:border-flame/70 transition-all font-sans text-sm tracking-wide"
            >
              <Lantern lit />
              <span>Back to the library</span>
            </Link>
            <p className="font-sans text-[11px] text-muted/70 mt-2">
              You can edit, redact, or take down your lantern any time —
              we'll email you a private link.
            </p>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { DRAFT_STORAGE_KEY } from "@/components/ContributorSurface";

type RenderedLantern = {
  title: string;
  dek: string;
  prose: string[];
  pullQuote: { text: string; afterParagraph: number } | null;
};

type ReleasedLantern = RenderedLantern & {
  releasedAt: string;
  contributor: string;
};

const RELEASED_STORAGE_KEY = "lantern.released";

export default function PreviewPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<string | null>(null);
  const [rendered, setRendered] = useState<RenderedLantern | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(true);
  const [contributor, setContributor] = useState("");

  // Load the draft from sessionStorage on mount.
  useEffect(() => {
    try {
      const d = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (!d || d.trim().length < 200) {
        router.replace("/reflect");
        return;
      }
      setDraft(d);
    } catch {
      router.replace("/reflect");
    }
  }, [router]);

  // Render once the draft is in.
  useEffect(() => {
    if (!draft) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/render", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ draft }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error ?? `Error ${res.status}`);
          setPending(false);
          return;
        }
        setRendered(data as RenderedLantern);
        setPending(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Network error");
        setPending(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [draft]);

  function updateProse(idx: number, text: string) {
    setRendered((r) => {
      if (!r) return r;
      const next = { ...r, prose: [...r.prose] };
      next.prose[idx] = text;
      return next;
    });
  }

  function release() {
    if (!rendered) return;
    const payload: ReleasedLantern = {
      ...rendered,
      releasedAt: new Date().toISOString(),
      contributor: contributor.trim() || "Anonymous",
    };
    try {
      const existing = JSON.parse(
        localStorage.getItem(RELEASED_STORAGE_KEY) || "[]",
      ) as ReleasedLantern[];
      localStorage.setItem(
        RELEASED_STORAGE_KEY,
        JSON.stringify([payload, ...existing]),
      );
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore — localStorage failure shouldn't block the release UX
    }
    router.push("/reflect/released");
  }

  return (
    <div className="relative flex flex-col flex-1 min-h-screen px-6 sm:px-12 py-8 sm:py-10">
      <LanternField />

      <header className="relative z-10">
        <Link
          href="/reflect"
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Back to drafting</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full pt-12 pb-12">
        <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-flame/70">
          Preview
        </p>
        <p className="font-serif text-base sm:text-lg leading-snug text-foreground/65 mt-3">
          Here's your lantern. Edit anything you'd like to change. Nothing
          publishes until you release it.
        </p>

        {error && (
          <div className="mt-10 rounded-sm border border-flame/40 bg-flame/[0.05] p-4 font-sans text-sm text-flame/90">
            {error}
            <div className="mt-3">
              <Link
                href="/reflect"
                className="font-sans text-xs underline hover:text-foreground"
              >
                ← go back to your draft
              </Link>
            </div>
          </div>
        )}

        {pending && !error && (
          <div className="mt-10 space-y-4 animate-shimmer" aria-hidden="true">
            <div className="h-9 w-3/4 rounded-sm bg-foreground/[0.06]" />
            <div className="h-5 w-2/3 rounded-sm bg-foreground/[0.04]" />
            <div className="h-3 w-full rounded-sm bg-foreground/[0.04] mt-8" />
            <div className="h-3 w-11/12 rounded-sm bg-foreground/[0.04]" />
            <div className="h-3 w-10/12 rounded-sm bg-foreground/[0.04]" />
            <div className="h-3 w-full rounded-sm bg-foreground/[0.04] mt-6" />
            <div className="h-3 w-11/12 rounded-sm bg-foreground/[0.04]" />
          </div>
        )}

        {rendered && !error && (
          <article className="mt-10 space-y-8">
            {/* Editable title */}
            <EditableField
              value={rendered.title}
              onChange={(v) =>
                setRendered((r) => (r ? { ...r, title: v } : r))
              }
              className="font-serif text-3xl sm:text-4xl leading-[1.1] text-foreground"
              ariaLabel="Title"
              singleLine
            />

            <EditableField
              value={rendered.dek}
              onChange={(v) =>
                setRendered((r) => (r ? { ...r, dek: v } : r))
              }
              className="font-serif text-lg sm:text-xl leading-snug text-foreground/70"
              ariaLabel="Subtitle"
            />

            {/* Editable paragraphs with optional pull-quote insert */}
            <div className="space-y-6 font-serif text-lg leading-[1.7] text-foreground/85">
              {rendered.prose.map((para, i) => (
                <div key={i}>
                  <EditableField
                    value={para}
                    onChange={(v) => updateProse(i, v)}
                    className="font-serif text-lg leading-[1.7] text-foreground/85"
                    ariaLabel={`Paragraph ${i + 1}`}
                  />
                  {rendered.pullQuote &&
                    rendered.pullQuote.afterParagraph === i && (
                      <blockquote className="my-10 border-l-2 border-flame pl-6 font-serif text-2xl sm:text-3xl leading-snug text-flame/90">
                        <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted block mb-3">
                          In your words
                        </span>
                        {rendered.pullQuote.text}
                      </blockquote>
                    )}
                </div>
              ))}
            </div>

            {/* Contributor name + release */}
            <section className="mt-16 pt-8 border-t border-rule space-y-6">
              <div>
                <label className="font-sans text-[11px] tracking-[0.2em] uppercase text-muted/80 block mb-2">
                  How would you like to be credited?
                </label>
                <input
                  type="text"
                  value={contributor}
                  onChange={(e) => setContributor(e.target.value)}
                  placeholder="A first name, initials, or 'Anonymous'"
                  className="w-full bg-transparent border border-rule rounded-sm px-4 py-2.5 font-serif text-base text-foreground/90 placeholder:text-foreground/35 placeholder:italic focus:outline-none focus:border-flame/50 transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="font-serif text-sm text-foreground/65 max-w-md">
                  Releasing publishes your lantern to the archive. You can
                  edit, redact, or take it down anytime.
                </p>
                <button
                  type="button"
                  onClick={release}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-sm border border-flame/50 bg-flame/[0.08] text-flame hover:bg-flame/[0.16] hover:border-flame transition-colors font-sans text-sm tracking-wide"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
                  Release my lantern
                </button>
              </div>
            </section>
          </article>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

function EditableField({
  value,
  onChange,
  className,
  ariaLabel,
  singleLine = false,
}: {
  value: string;
  onChange: (v: string) => void;
  className: string;
  ariaLabel: string;
  singleLine?: boolean;
}) {
  // Auto-grow textarea on each change so it sizes to content.
  const handle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  return (
    <textarea
      value={value}
      onChange={handle}
      rows={singleLine ? 1 : 2}
      aria-label={ariaLabel}
      className={`${className} block w-full bg-transparent border-0 border-b border-transparent hover:border-rule focus:border-flame/50 focus:outline-none resize-none p-0 transition-colors`}
      ref={(el) => {
        if (!el) return;
        // Ensure correct initial height
        requestAnimationFrame(() => {
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        });
      }}
    />
  );
}

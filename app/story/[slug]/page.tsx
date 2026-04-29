import Link from "next/link";
import { notFound } from "next/navigation";
import { Lantern } from "@/components/Lantern";
import { SampleBadge } from "@/components/SampleBadge";
import { stories as inMemoryStories } from "@/lib/stories";
import {
  getRelatedStories,
  getStoryBySlug,
  tileBySlug,
} from "@/lib/storage";

export function generateStaticParams() {
  return inMemoryStories.map((s) => ({ slug: s.slug }));
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const conditionTile = tileBySlug(story.condition);
  const themeTiles = story.themes
    .map((t) => tileBySlug(t))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const related = await getRelatedStories(slug, 3);

  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header>
        <Link
          href="/"
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Lantern Library</span>
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full py-16">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
            {conditionTile?.label}
          </p>
          <SampleBadge />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.1] text-foreground mt-4">
          {story.title}
        </h1>
        <p className="font-serif text-xl leading-snug text-foreground/70 mt-5 italic">
          {story.dek}
        </p>

        <div className="font-sans text-xs text-muted mt-8 flex flex-wrap gap-x-4 gap-y-1 items-center">
          <span>
            {story.contributor}, {story.contributorAge}
          </span>
          <span className="text-rule">·</span>
          <span>{formatDate(story.publishedAt)}</span>
          <span className="text-rule">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Lantern lit /> {story.lanterns}
          </span>
        </div>

        <article className="mt-12 font-serif text-lg sm:text-xl leading-[1.7] text-foreground/85 space-y-6">
          {story.prose.map((para, i) => {
            const insertQuote =
              story.pullQuote && story.pullQuote.afterParagraph === i;
            return (
              <div key={i}>
                <p>{para}</p>
                {insertQuote && story.pullQuote && (
                  <blockquote className="my-10 border-l-2 border-flame pl-6 font-serif italic text-2xl sm:text-3xl leading-snug text-flame/90">
                    <span className="font-sans not-italic text-xs tracking-[0.2em] uppercase text-muted block mb-3">
                      In her words
                    </span>
                    {story.pullQuote.text}
                  </blockquote>
                )}
              </div>
            );
          })}
        </article>

        {story.updates && story.updates.length > 0 && (
          <section className="mt-16 border-t border-rule pt-10">
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-6">
              Updates
            </h2>
            <div className="space-y-8">
              {story.updates.map((u, i) => (
                <div key={i}>
                  <p className="font-sans text-xs text-muted">
                    {formatDate(u.date)}
                  </p>
                  <p className="font-serif text-lg leading-relaxed text-foreground/80 mt-2">
                    {u.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 border-t border-rule pt-10">
          <p className="font-serif text-base italic text-foreground/70">
            {story.presenceNote}
          </p>
        </section>

        <section className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            className="group inline-flex items-center gap-2.5 font-sans text-sm text-foreground/80 hover:text-flame transition-colors"
          >
            <Lantern lit size="md" />
            <span>Light the lantern</span>
            <span className="text-muted">·</span>
            <span className="text-muted">{story.lanterns}</span>
          </button>
          <span className="font-sans text-xs text-muted">
            A quiet acknowledgment that this story helped you.
          </span>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap gap-2">
            {[conditionTile, ...themeTiles].filter(Boolean).map((t) => (
              <span
                key={t!.slug}
                className={`font-sans text-xs px-2.5 py-1 rounded-sm border ${
                  t!.kind === "condition"
                    ? "border-rule text-foreground/70"
                    : "border-transparent bg-rule/40 text-foreground/65 italic"
                }`}
              >
                {t!.label}
              </span>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-20 border-t border-rule pt-10">
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-6">
              Stories like this
            </h2>
            <ul className="space-y-6">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/story/${r.slug}`}
                    className="group block hover:bg-flame/[0.03] -mx-3 px-3 py-3 rounded-sm transition-colors"
                  >
                    <h3 className="font-serif text-xl text-foreground group-hover:text-flame transition-colors">
                      {r.title}
                    </h3>
                    <p className="font-serif text-sm text-foreground/65 mt-1">
                      {r.contributor}, {r.contributorAge} ·{" "}
                      {tileBySlug(r.condition)?.label}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* End-of-article back link — saves a scroll-up after long reads */}
        <div className="mt-20 pt-10 border-t border-rule flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-sm border border-rule text-muted hover:text-flame hover:border-flame/40 transition-colors font-sans text-sm tracking-[0.18em] uppercase"
          >
            <span aria-hidden="true">←</span>
            <span>Lantern Library</span>
          </Link>
        </div>
      </main>

      <footer className="font-sans text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-6 pt-8 border-t border-rule">
        <a
          href="mailto:hello@lanternlibrary.org"
          className="hover:text-foreground transition-colors"
        >
          hello@lanternlibrary.org
        </a>
        <span>An independent archive.</span>
        <span>Not medical advice.</span>
      </footer>
    </div>
  );
}

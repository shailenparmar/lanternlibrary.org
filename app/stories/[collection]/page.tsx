import Link from "next/link";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/Wordmark";
import { Lantern } from "@/components/Lantern";
import { SampleBadge } from "@/components/SampleBadge";
import { tiles } from "@/lib/tiles";
import { getStoriesByTile, tileBySlug } from "@/lib/storage";

export function generateStaticParams() {
  return tiles.map((t) => ({ collection: t.slug }));
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  const tile = tileBySlug(collection);
  if (!tile) notFound();

  const stories = await getStoriesByTile(collection);
  const isCondition = tile.kind === "condition";

  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link
          href="/stories"
          className="font-sans text-sm tracking-wide text-muted hover:text-foreground transition-colors"
        >
          ← all tiles
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full py-16">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          {isCondition ? "By experience" : "By theme"}
        </p>
        <h1
          className={`font-serif ${
            isCondition ? "" : "italic"
          } text-4xl sm:text-5xl leading-tight text-foreground mt-2`}
        >
          {tile.label}
        </h1>
        {tile.description && (
          <p className="font-serif text-lg leading-snug text-foreground/70 mt-4 max-w-xl">
            {tile.description}
          </p>
        )}
        <p className="font-sans text-xs text-muted mt-6">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </p>

        <ul className="mt-12 divide-y divide-rule">
          {stories.map((story) => (
            <li key={story.slug}>
              <Link
                href={`/story/${story.slug}`}
                className="group block py-8 hover:bg-flame/[0.03] -mx-3 px-3 rounded-sm transition-colors"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-serif text-2xl leading-tight text-foreground group-hover:text-flame transition-colors">
                    {story.title}
                  </h2>
                  <SampleBadge />
                </div>
                <p className="font-serif text-base leading-snug text-foreground/70 mt-2">
                  {story.dek}
                </p>
                <div className="font-sans text-xs text-muted mt-4 flex flex-wrap gap-x-4 gap-y-1 items-center">
                  <span>
                    {story.contributor}, {story.contributorAge}
                  </span>
                  <span className="text-rule">·</span>
                  <span>
                    {tileBySlug(story.condition)?.label ?? story.condition}
                  </span>
                  <span className="text-rule">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lantern lit /> {story.lanterns}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="font-sans text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-6 pt-8 border-t border-rule">
        <span>lanternlibrary.org</span>
        <span>A nonprofit archive.</span>
        <span>Not medical advice.</span>
      </footer>
    </div>
  );
}

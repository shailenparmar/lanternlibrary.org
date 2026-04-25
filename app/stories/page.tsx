import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { getAllTiles, getAllStories, getTileStoryCount } from "@/lib/storage";

export default async function StoriesIndex() {
  const [allTiles, stories] = await Promise.all([
    getAllTiles(),
    getAllStories(),
  ]);
  const conditions = allTiles.filter((t) => t.kind === "condition");
  const themes = allTiles.filter((t) => t.kind === "theme");
  const counts = await Promise.all(
    allTiles.map(async (t) => [t.slug, await getTileStoryCount(t.slug)] as const),
  );
  const countMap = new Map(counts);

  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header className="flex items-center justify-between">
        <Wordmark />
        <Link
          href="/reflect"
          className="font-sans text-sm tracking-wide text-muted hover:text-flame transition-colors"
        >
          Share your story →
        </Link>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full py-20">
        <h1 className="font-serif text-4xl sm:text-5xl leading-tight text-foreground max-w-2xl">
          Find a story <span className="italic text-flame">that finds you.</span>
        </h1>
        <p className="font-serif text-lg sm:text-xl leading-snug text-foreground/70 mt-6 max-w-xl">
          {stories.length} stories, organized by what people walked through and
          how it felt to walk through it. Tiles are doorways into curated
          collections — pick whichever way in feels right.
        </p>

        <section className="mt-20">
          <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-6">
            By experience
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {conditions.map((tile) => {
              const count = countMap.get(tile.slug) ?? 0;
              return (
                <Link
                  key={tile.slug}
                  href={`/stories/${tile.slug}`}
                  className="group block border border-rule rounded-sm p-5 hover:border-flame/50 hover:bg-flame/[0.03] transition-all"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-xl text-foreground group-hover:text-flame transition-colors">
                      {tile.label}
                    </h3>
                    <span className="font-sans text-xs text-muted shrink-0">
                      {count} {count === 1 ? "story" : "stories"}
                    </span>
                  </div>
                  {tile.description && (
                    <p className="font-serif text-sm leading-snug text-foreground/60 mt-2">
                      {tile.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-muted mb-6">
            By theme
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {themes.map((tile) => {
              const count = countMap.get(tile.slug) ?? 0;
              return (
                <Link
                  key={tile.slug}
                  href={`/stories/${tile.slug}`}
                  className="group block bg-rule/40 rounded-sm p-5 hover:bg-flame/[0.08] transition-all border border-transparent hover:border-flame/30"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif italic text-xl text-foreground group-hover:text-flame transition-colors">
                      {tile.label}
                    </h3>
                    <span className="font-sans text-xs text-muted shrink-0">
                      {count}
                    </span>
                  </div>
                  {tile.description && (
                    <p className="font-serif text-sm leading-snug text-foreground/60 mt-2">
                      {tile.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="font-sans text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-6 pt-8 border-t border-rule">
        <span>lanternlibrary.org</span>
        <span>A nonprofit archive.</span>
        <span>Not medical advice.</span>
      </footer>
    </div>
  );
}

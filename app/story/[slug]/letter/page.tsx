import Link from "next/link";
import { notFound } from "next/navigation";
import { stories as inMemoryStories } from "@/lib/stories";
import { getStoryBySlug } from "@/lib/storage";
import { LetterForm } from "./LetterForm";

export function generateStaticParams() {
  return inMemoryStories.map((s) => ({ slug: s.slug }));
}

export default async function LetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header>
        <Link
          href={`/story/${slug}`}
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Back to story</span>
        </Link>
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full py-16">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted">
          A letter to {story.contributor}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl leading-[1.15] text-foreground mt-4">
          One letter. No reply expected.
        </h1>
        <p className="font-serif text-lg leading-relaxed text-foreground/75 mt-5">
          If {story.contributor.split(" ")[0]}&rsquo;s story stayed with you, you can write
          a single letter. It will be read by a moderator before it reaches
          her, and there is no channel to reply. If something you write
          moves her enough to respond, she may add it to her story as an
          update.
        </p>

        <LetterForm contributorFirstName={story.contributor.split(" ")[0]} />

        <p className="font-sans text-xs text-muted mt-10 leading-relaxed">
          Letters are screened for safety before delivery. We do not pass
          along messages that contain medical advice, attempts to contact
          off-platform, or anything threatening.
        </p>
      </main>
    </div>
  );
}

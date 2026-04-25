import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { Lantern } from "@/components/Lantern";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <header>
        <Wordmark />
      </header>

      <main className="flex flex-1 flex-col justify-center max-w-2xl mx-auto w-full py-24">
        <h1 className="font-serif text-5xl sm:text-6xl leading-[1.05] text-foreground">
          A library of lanterns.
          <br />
          <span className="italic text-flame">Each one a story</span> lighting
          the way for the next.
        </h1>

        <p className="font-serif text-xl sm:text-2xl leading-snug text-foreground/80 mt-10 max-w-xl">
          Lantern Library is a nonprofit archive of recovery stories. People
          who made it through hard chapters — body dysmorphic disorder, OCD,
          eating disorders, hair loss, chronic pain, and more — sit with a
          warm reflection tool and leave their wisdom for the next person
          walking the same path.
        </p>

        {/* TODO(founder): replace with founder's own voice. The brief calls for
            landing copy in the founder's voice — this is a holding paragraph. */}
        <p className="font-serif text-lg leading-relaxed text-foreground/70 mt-8 max-w-xl">
          If you have recovered, or made meaningful progress, and have thought
          about sharing your story but never did — this is for you. No camera.
          No audience. Twenty minutes of reflection, transformed into a
          structured narrative you approve before anything goes public.
        </p>

        <nav className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-8 font-sans text-sm tracking-wide">
          <Link
            href="/reflect"
            className="group inline-flex items-center gap-3 text-foreground hover:text-flame transition-colors"
          >
            <Lantern lit />
            <span>Share your story</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
          <Link
            href="/stories"
            className="group inline-flex items-center gap-3 text-foreground/80 hover:text-foreground transition-colors"
          >
            <Lantern lit={false} />
            <span>Read stories</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        </nav>
      </main>

      <footer className="font-sans text-xs text-muted flex flex-col sm:flex-row gap-2 sm:gap-6 pt-8 border-t border-rule">
        <span>lanternlibrary.org</span>
        <span>A nonprofit archive.</span>
        <span>Not medical advice.</span>
      </footer>
    </div>
  );
}

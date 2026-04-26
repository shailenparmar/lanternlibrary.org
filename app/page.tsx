import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { ReaderSurface } from "@/components/ReaderSurface";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <LanternField />

      <header className="relative z-10">
        <Wordmark />
      </header>

      <main className="relative z-10 flex flex-1 flex-col max-w-2xl mx-auto w-full pt-16 pb-12">
        <h1 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-foreground">
          A library of lanterns.
          <br />
          <span className="italic text-flame">Each one a story</span> lighting
          the way for the next.
        </h1>

        <p className="font-serif text-lg sm:text-xl leading-snug text-foreground/75 mt-8 max-w-xl">
          A nonprofit archive of recovery stories. Type what you are walking
          through; tiles surface as you go.
        </p>

        <div className="mt-12">
          <ReaderSurface />
        </div>

        <div className="mt-20 pt-8 border-t border-rule">
          <Link
            href="/reflect"
            className="group inline-flex items-baseline gap-3 font-serif text-base text-foreground/70 hover:text-flame transition-colors"
          >
            <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted/70 group-hover:text-flame">
              Or share your own
            </span>
            <span className="italic">
              Leave a story for the next person walking your path
            </span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </Link>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

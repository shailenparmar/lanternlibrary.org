import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { SearchSurface } from "@/components/SearchSurface";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 px-6 sm:px-12 py-8 sm:py-10">
      <LanternField />

      <header className="relative z-10 flex items-center justify-between">
        <Wordmark />
        <Link
          href="/reflect"
          className="font-sans text-xs tracking-wide text-muted hover:text-flame transition-colors"
        >
          share yours →
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col max-w-2xl mx-auto w-full pt-12 sm:pt-16 pb-8">
        <h1 className="font-serif text-3xl sm:text-4xl leading-[1.05] text-foreground mb-8">
          A library of lanterns, each one a story{" "}
          <span className="italic text-flame">
            to guide you out of the dark.
          </span>
        </h1>

        <SearchSurface />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

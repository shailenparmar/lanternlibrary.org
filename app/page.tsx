import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { SearchSurface } from "@/components/SearchSurface";

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 px-6 sm:px-12 py-8 sm:py-10">
      <LanternField />

      <header className="relative z-10">
        <Wordmark />
      </header>

      <main className="relative z-10 flex flex-1 flex-col max-w-2xl mx-auto w-full pt-12 sm:pt-16 pb-8">
        <h1 className="font-serif text-3xl sm:text-4xl leading-[1.05] text-foreground mb-8">
          A library of lanterns, real recovery stories{" "}
          <span className="italic text-flame">to guide you through.</span>
        </h1>

        <SearchSurface />

        <div className="mt-16 pt-10 border-t border-rule flex flex-col items-center gap-4">
          <p className="font-serif text-base sm:text-lg text-foreground/75 text-center max-w-md">
            Made it through something hard? Share a lantern to help others
            in the dark middle.
          </p>
          <Link
            href="/reflect"
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-flame/40 bg-flame/[0.06] text-flame hover:bg-flame/[0.12] hover:border-flame/70 transition-all font-sans text-sm tracking-wide"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-flame shadow-[0_0_8px_2px_rgba(244,162,60,0.6)]" />
            <span>Ten minute reflection</span>
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              →
            </span>
          </Link>
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

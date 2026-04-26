import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { ContributorSurface } from "@/components/ContributorSurface";

export default function ReflectPage() {
  return (
    <div className="relative flex flex-col flex-1 px-6 py-10 sm:px-12 sm:py-16">
      <LanternField />

      <header className="relative z-10 flex items-center justify-between">
        <Wordmark />
        <Link
          href="/"
          className="font-sans text-xs tracking-wide text-muted hover:text-foreground transition-colors"
        >
          ← back
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col max-w-2xl mx-auto w-full pt-12 pb-12">
        <h1 className="font-serif text-3xl sm:text-4xl leading-tight text-foreground">
          Leave a lantern for the next person <span className="italic text-flame">walking your path.</span>
        </h1>
        <p className="font-serif text-base sm:text-lg leading-snug text-foreground/70 mt-4 max-w-xl">
          One canvas. No template. Write what you went through and what you
          learned, in any order, in any voice. Tiles surface as you go to show
          you have been heard. Nothing publishes without your review.
        </p>

        <div className="mt-12">
          <ContributorSurface />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

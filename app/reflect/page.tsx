import Link from "next/link";
import { LanternField } from "@/components/LanternField";
import { Footer } from "@/components/Footer";
import { ContributorSurface } from "@/components/ContributorSurface";

export default function ReflectPage() {
  return (
    <div className="relative flex flex-col flex-1 min-h-screen px-6 sm:px-12 py-8 sm:py-10">
      <LanternField />

      <header className="relative z-10">
        <Link
          href="/"
          className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span aria-hidden="true">←</span>
          <span>Lantern Library</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center w-full">
        <ContributorSurface />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

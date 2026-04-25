import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      className="font-sans text-sm tracking-[0.18em] uppercase text-muted hover:text-foreground transition-colors"
    >
      Lantern Library
    </Link>
  );
}

import Link from "next/link";

export function Wordmark() {
  return (
    <Link
      href="/"
      className="font-sans text-sm tracking-[0.18em] uppercase text-foreground/85 hover:text-foreground transition-colors"
    >
      Lantern Library
    </Link>
  );
}

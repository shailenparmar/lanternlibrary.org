import Link from "next/link";

export function Footer() {
  return (
    <footer className="font-sans text-xs text-muted/80 pt-10 mt-auto flex flex-wrap gap-x-6 gap-y-1">
      <a
        href="mailto:hello@lanternlibrary.org"
        className="hover:text-foreground transition-colors"
      >
        hello@lanternlibrary.org
      </a>
      <Link href="/roadmap" className="hover:text-foreground transition-colors">
        Roadmap
      </Link>
      <span>An independent archive.</span>
      <span>Not medical advice.</span>
    </footer>
  );
}

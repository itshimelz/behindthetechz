import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} behind the TechZ. All rights
          reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/blog"
            className="transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/graph"
            className="transition-colors hover:text-foreground"
          >
            Graph View
          </Link>
          {/*
          <Link
            href="/unsubscribe"
            className="transition-colors hover:text-foreground"
          >
            Unsubscribe
          </Link>
          */}
        </nav>
      </div>
    </footer>
  );
}

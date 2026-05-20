"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  jumpHref?: string;
  showJump?: boolean;
};

export function DetailStickyHeader({
  title,
  backHref,
  backLabel,
  jumpHref,
  showJump = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > 140);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-14 z-40 md:hidden transition-all duration-200",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
      )}
      aria-hidden={!isVisible}
    >
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-border/70 bg-background/95 px-3 py-2 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80">
          <Link
            href={backHref}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {backLabel}
          </Link>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {title}
          </p>
          {showJump && jumpHref ? (
            <a
              href={jumpHref}
              className="rounded-full border border-border/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              Articles
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

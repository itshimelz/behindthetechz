"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/hooks/use-theme";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Moon02Icon, Sun03Icon, RssIcon } from "@hugeicons/core-free-icons";

export function SiteFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/20 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12 pb-8 border-b border-border/40">
          {/* Brand & Description */}
          <div className="space-y-3 md:col-span-6">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
              <Image
                src="/logo_h.png"
                alt="behind the TechZ"
                width={220}
                height={70}
                className="h-auto w-[130px]"
              />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">
              High-signal engineering dispatches, systems architecture notes, and interlinked mental models. Built for thoughtful readers.
            </p>
          </div>

          {/* Core Navigation */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:col-span-6">
            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Writing
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/blog" className="transition-colors hover:text-foreground">
                    All Posts
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="transition-colors hover:text-foreground">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="transition-colors hover:text-foreground">
                    Tags
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Knowledge
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/graph" className="transition-colors hover:text-foreground">
                    Graph View
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-foreground">
                    About Author
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="transition-colors hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Connect
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link href="/feed.xml" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                    <HugeiconsIcon icon={RssIcon} className="size-3" strokeWidth={2} />
                    RSS Feed
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="transition-colors hover:text-foreground">
                    Help & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
                    <HugeiconsIcon icon={Search01Icon} className="size-3" strokeWidth={2} />
                    Search Notes
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} <span className="font-medium text-foreground">behind the TechZ</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun03Icon : Moon02Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              <span>{theme === "dark" ? "Light Theme" : "Dark Theme"}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

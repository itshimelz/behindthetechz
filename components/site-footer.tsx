"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";

export function SiteFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="mt-auto border-t">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} behind the TechZ. All rights
          reserved.
        </p>
        <div className="flex items-center gap-6">
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
            <Link
              href="/feed.xml"
              className="transition-colors hover:text-foreground"
            >
              RSS
            </Link>
          </nav>
          
          <div className="flex items-center gap-4 border-l pl-4">
            <Link 
              href="/search" 
              className="transition-colors hover:text-foreground"
              title="Search"
              aria-label="Search"
            >
              <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
            </Link>
            <button 
              onClick={toggleTheme} 
              className="flex items-center transition-colors hover:text-foreground"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
              aria-label="Toggle theme"
            >
              <HugeiconsIcon 
                icon={theme === "dark" ? Sun03Icon : Moon02Icon} 
                strokeWidth={2} 
                className="size-4" 
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

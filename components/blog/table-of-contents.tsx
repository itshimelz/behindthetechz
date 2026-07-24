"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useTocPreference } from "@/hooks/use-local-storage-pref";
import type { TocHeading } from "@/lib/blog/extract-toc-headings";


function getDepthOffset(level: TocHeading["level"]) {
  return Math.max(0, level - 1);
}

export function TableOfContents({
  headings,
  isDesktop = false,
}: {
  headings: TocHeading[];
  isDesktop?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "");
  const [isExpanded, setIsExpanded] = useState(false);
  const { enabled: tocEnabled } = useTocPreference();
  const headingIds = useMemo(
    () => headings.map((heading) => heading.id),
    [headings],
  );
  const highlightTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const highlightSection = useCallback((el: HTMLElement) => {
    if (highlightTimeoutRef.current !== null) {
      window.clearTimeout(highlightTimeoutRef.current);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const delay = prefersReducedMotion ? 0 : 320;

    highlightTimeoutRef.current = window.setTimeout(() => {
      el.classList.remove("toc-section-highlight");
      void el.offsetWidth;
      el.classList.add("toc-section-highlight");

      highlightTimeoutRef.current = window.setTimeout(() => {
        el.classList.remove("toc-section-highlight");
      }, 1200);
    }, delay);
  }, []);

  useEffect(() => {
    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -70% 0px",
        threshold: 0,
      }
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  const getCurrentHeadingIndex = () => {
    return headingIds.indexOf(activeId);
  };

  const handleClick = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });

    setActiveId(id);
    highlightSection(el);
  };

  const handlePrev = () => {
    if (headings.length === 0) return;
    const currentIdx = getCurrentHeadingIndex();
    if (currentIdx > 0) {
      handleClick(headings[currentIdx - 1].id);
    } else if (currentIdx === -1 || currentIdx === 0) {
      handleClick(headings[0].id);
    }
  };

  const handleNext = () => {
    if (headings.length === 0) return;
    const currentIdx = getCurrentHeadingIndex();
    if (currentIdx >= 0 && currentIdx < headings.length - 1) {
      handleClick(headings[currentIdx + 1].id);
    } else if (currentIdx === -1) {
      handleClick(headings[0].id);
    }
  };

  if (!tocEnabled || headings.length < 2) return null;

  if (isDesktop) {
    const activeIndex = headings.findIndex((h) => h.id === activeId);

    return (
      <nav
        aria-label="Table of contents"
        className="group pointer-events-auto fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-end justify-center space-y-4 xl:flex"
      >
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous section"
          disabled={activeIndex <= 0 && activeIndex !== -1}
          className="flex size-7 items-center justify-center rounded-full bg-transparent text-muted-foreground/40 opacity-0 transition-all duration-300 hover:bg-muted/80 hover:text-foreground group-hover:opacity-100 disabled:opacity-0 disabled:group-hover:opacity-30"
        >
          <HugeiconsIcon icon={ArrowUp01Icon} className="size-4" />
        </button>

        <div className="relative flex flex-col items-end space-y-0.5 py-1">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id;
            const isPast = activeIndex >= 0 && index < activeIndex;
            const depthOffset = getDepthOffset(heading.level);
            const width = `${Math.max(0.9, 2.1 - depthOffset * 0.22)}rem`;
            const activeWidth = `${Math.max(0.7, 1.75 - depthOffset * 0.2)}rem`;
            const idleWidth = `${Math.max(0.45, 1.05 - depthOffset * 0.12)}rem`;
            const isNested = heading.level > 2;

            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                className="group/item relative flex h-3 items-center justify-end rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                style={{ width }}
                onClick={(e) => handleClick(heading.id, e)}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute right-full mr-2.5 w-max max-w-[280px] rounded-2xl bg-zinc-800 px-4 py-2.5 text-sm font-medium leading-relaxed text-zinc-100 opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 dark:bg-zinc-200 dark:text-zinc-900",
                    "group-hover/item:-translate-x-1 group-hover/item:opacity-100 group-focus-visible/item:-translate-x-1 group-focus-visible/item:opacity-100",
                    isNested && "text-xs",
                  )}
                >
                  {heading.text}
                </div>

                <div
                  className={cn(
                    "rounded-full transition-all duration-500 ease-out",
                    isActive
                      ? "h-[2px] bg-primary"
                      : isPast
                        ? "h-px bg-muted-foreground/25 group-hover/item:bg-foreground/50 group-focus-visible/item:bg-foreground/50"
                        : "h-px bg-muted-foreground/30 group-hover/item:bg-foreground/60 group-focus-visible/item:bg-foreground/60",
                  )}
                  style={{ width: isActive ? activeWidth : idleWidth }}
                />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next section"
          disabled={activeIndex === headings.length - 1 || headings.length === 0}
          className="flex size-7 items-center justify-center rounded-full bg-transparent text-muted-foreground/40 opacity-0 transition-all duration-300 hover:bg-muted/80 hover:text-foreground group-hover:opacity-100 disabled:opacity-0 disabled:group-hover:opacity-30"
        >
          <HugeiconsIcon icon={ArrowDown01Icon} className="size-4" />
        </button>
      </nav>
    );
  }

  return (
    <nav className="mx-auto w-full max-w-3xl" aria-label="Table of contents">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
      >
        <HugeiconsIcon icon={Menu01Icon} className="size-4" strokeWidth={2} />
        Table of Contents
        <span className="ml-auto text-xs text-muted-foreground">
          {headings.length} sections
        </span>
      </button>
      {isExpanded && (
        <div className="mt-2 rounded-lg border border-border/50 bg-muted/20 p-4">
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li key={heading.id}>
                <button
                  type="button"
                  onClick={(e) => handleClick(heading.id, e)}
                  className={cn(
                    "w-full rounded-md py-1 text-left text-sm transition-colors hover:text-foreground",
                    activeId === heading.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                  style={{
                    paddingLeft: `${0.5 + getDepthOffset(heading.level) * 0.75}rem`,
                  }}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

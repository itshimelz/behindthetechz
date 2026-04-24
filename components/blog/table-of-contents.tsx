"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useTocPreference } from "@/hooks/use-toc";
import type { TocHeading } from "@/lib/blog/extract-toc-headings";

const HEADING_SELECTOR = "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]";

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
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { enabled: tocEnabled } = useTocPreference();
  const headingIds = useMemo(
    () => headings.map((heading) => heading.id),
    [headings],
  );
  const scrollContainerRef = useRef<HTMLElement | Window | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  const getScrollContainer = useCallback((): HTMLElement | Window => {
    const article = document.querySelector("article");
    const firstHeading =
      article?.querySelector<HTMLElement>(HEADING_SELECTOR) ?? null;

    let current = firstHeading?.parentElement ?? null;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const overflowY = style.overflowY;
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
        current.scrollHeight > current.clientHeight;

      if (isScrollable) return current;
      current = current.parentElement;
    }

    return window;
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current !== null) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const getContainerScrollTop = (container: HTMLElement | Window) =>
    container === window ? window.scrollY : (container as HTMLElement).scrollTop;

  const getElementTopInContainer = (
    el: HTMLElement,
    container: HTMLElement | Window,
  ) => {
    if (container === window) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    const elementContainer = container as HTMLElement;
    const containerRect = elementContainer.getBoundingClientRect();
    return (
      el.getBoundingClientRect().top - containerRect.top + elementContainer.scrollTop
    );
  };

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

    const container = getScrollContainer();
    scrollContainerRef.current = container;

    const updateActiveHeading = () => {
      const scrollAnchor = getContainerScrollTop(container) + 130;
      let nextActiveId = headingIds[0] ?? "";

      for (const id of headingIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (getElementTopInContainer(el, container) <= scrollAnchor) {
          nextActiveId = id;
        } else {
          break;
        }
      }

      setActiveId(nextActiveId);
    };

    updateActiveHeading();
    if (container === window) {
      window.addEventListener("scroll", updateActiveHeading, { passive: true });
    } else {
      container.addEventListener("scroll", updateActiveHeading, { passive: true });
    }
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      if (container === window) {
        window.removeEventListener("scroll", updateActiveHeading);
      } else {
        container.removeEventListener("scroll", updateActiveHeading);
      }
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headingIds, getScrollContainer]);

  const getCurrentHeadingIndex = () => {
    if (headingIds.length === 0) return -1;

    const container = scrollContainerRef.current ?? getScrollContainer();
    scrollContainerRef.current = container;

    const scrollAnchor = getContainerScrollTop(container) + 130;
    let currentIndex = 0;

    for (let i = 0; i < headingIds.length; i++) {
      const el = document.getElementById(headingIds[i]);
      if (!el) continue;
      if (getElementTopInContainer(el, container) <= scrollAnchor) {
        currentIndex = i;
      } else {
        break;
      }
    }

    return currentIndex;
  };

  const handleClick = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const container = scrollContainerRef.current ?? getScrollContainer();
    scrollContainerRef.current = container;

    const scrollOffset = 80;

    if (container === window) {
      const top = getElementTopInContainer(el, window);
      window.scrollTo({
        top: Math.max(0, top - scrollOffset),
        behavior: "smooth",
      });
    } else {
      const htmlContainer = container as HTMLElement;
      const top = getElementTopInContainer(el, htmlContainer);
      htmlContainer.scrollTo({
        top: Math.max(0, top - scrollOffset),
        behavior: "smooth",
      });
    }

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

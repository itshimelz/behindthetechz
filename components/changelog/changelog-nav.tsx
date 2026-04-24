"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { dateToId } from "@/lib/changelog";

type Props = {
  dates: string[];
};

export function ChangelogNav({ dates }: Props) {
  const [activeId, setActiveId] = useState<string>(dateToId(dates[0] ?? ""));
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = dates.map(dateToId);

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
          break;
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    });

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [dates]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Changelog navigation"
      className="sticky top-20 hidden w-36 shrink-0 xl:block"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Jump to
      </p>
      <ul className="space-y-1">
        {dates.map((date) => {
          const id = dateToId(date);
          const isActive = activeId === id;
          return (
            <li key={id}>
              <button
                onClick={() => handleClick(id)}
                className={cn(
                  "group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-1 w-1 shrink-0 rounded-full transition-all duration-200",
                    isActive
                      ? "scale-125 bg-primary"
                      : "bg-muted-foreground/40 group-hover:bg-muted-foreground",
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "truncate transition-colors duration-200",
                    isActive && "font-medium",
                  )}
                >
                  {date}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

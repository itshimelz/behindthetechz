"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clapping02Icon,
  Loading03Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";

type Props = {
  slug: string;
  tags: string[];
  category: string;
  date: string;
  initialClapCount?: number;
  initialViewCount?: number;
};

const MAX_CLAPS_PER_POST = 50;
const CLAPS_STORAGE_PREFIX = "post-claps:";

function getStorageKey(slug: string): string {
  return `${CLAPS_STORAGE_PREFIX}${slug}`;
}

const compactCountFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatCount(value: number): string {
  if (value < 1000) {
    return value.toLocaleString();
  }
  return compactCountFormatter.format(value);
}

export function PostFooter({
  slug,
  tags,
  category,
  date,
  initialClapCount = 0,
  initialViewCount = 0,
}: Props) {
  // — Clap state —
  const [totalClaps, setTotalClaps] = useState(initialClapCount);
  const [userClaps, setUserClaps] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [isLoadingClaps, setIsLoadingClaps] = useState(true);

  // — View state (live-synced) —
  const [liveViewCount, setLiveViewCount] = useState(initialViewCount);

  // Refs for safe optimistic rollback (avoids stale closure capture)
  const totalClapsRef = useRef(initialClapCount);
  const userClapsRef = useRef(0);

  const remainingClaps = useMemo(
    () => Math.max(0, MAX_CLAPS_PER_POST - userClaps),
    [userClaps],
  );

  useEffect(() => {
    let isActive = true;

    setIsMounted(true);

    // Restore user claps from localStorage
    try {
      const raw = localStorage.getItem(getStorageKey(slug));
      const parsed = Number.parseInt(raw ?? "0", 10);
      const safeValue = Number.isFinite(parsed)
        ? Math.min(MAX_CLAPS_PER_POST, Math.max(0, parsed))
        : 0;
      setUserClaps(safeValue);
      userClapsRef.current = safeValue;
    } catch {
      setUserClaps(0);
      userClapsRef.current = 0;
    }

    // Fetch latest clap count
    fetch(`/api/posts/${slug}/claps`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { clapCount?: number } | null) => {
        if (!isActive) return;
        if (typeof data?.clapCount === "number") {
          setTotalClaps(data.clapCount);
          totalClapsRef.current = data.clapCount;
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) setIsLoadingClaps(false);
      });

    // Fetch latest view count (delayed slightly so ViewCounter's POST has time to land)
    const viewTimer = setTimeout(() => {
      fetch(`/api/posts/${slug}/views`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { viewCount?: number } | null) => {
          if (!isActive) return;
          if (typeof data?.viewCount === "number") {
            setLiveViewCount(data.viewCount);
          }
        })
        .catch(() => {});
    }, 2500);

    return () => {
      isActive = false;
      clearTimeout(viewTimer);
    };
  }, [slug]);

  const handleClap = async () => {
    if (!isMounted || remainingClaps < 1 || isSubmitting) return;

    // Snapshot from refs (always current, never stale)
    const previousTotalClaps = totalClapsRef.current;
    const previousUserClaps = userClapsRef.current;

    setIsSubmitting(true);
    setUserClaps((prev) => {
      const next = Math.min(MAX_CLAPS_PER_POST, prev + 1);
      userClapsRef.current = next;
      try {
        localStorage.setItem(getStorageKey(slug), String(next));
      } catch {}
      return next;
    });
    setTotalClaps((prev) => {
      const next = prev + 1;
      totalClapsRef.current = next;
      return next;
    });
    setShowPlusOne(true);
    setTimeout(() => setShowPlusOne(false), 380);

    try {
      const response = await fetch(`/api/posts/${slug}/claps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 1 }),
      });

      if (!response.ok) {
        setTotalClaps(previousTotalClaps);
        totalClapsRef.current = previousTotalClaps;
        setUserClaps(previousUserClaps);
        userClapsRef.current = previousUserClaps;
        try {
          localStorage.setItem(getStorageKey(slug), String(previousUserClaps));
        } catch {}
        return;
      }

      const data = (await response.json()) as {
        clapCount?: number;
        counted?: boolean;
        remainingClaps?: number;
      };

      if (data.counted === false) {
        if (typeof data.remainingClaps === "number") {
          const corrected = MAX_CLAPS_PER_POST - Math.max(0, data.remainingClaps);
          setUserClaps(corrected);
          userClapsRef.current = corrected;
        } else {
          setUserClaps(MAX_CLAPS_PER_POST);
          userClapsRef.current = MAX_CLAPS_PER_POST;
        }
      }

      if (typeof data.clapCount === "number") {
        setTotalClaps(data.clapCount);
        totalClapsRef.current = data.clapCount;
      }
    } catch {
      // Keep optimistic value on network failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <footer className="mx-auto w-full max-w-3xl space-y-5">
      {/* Thin top divider */}
      <div className="border-t border-border/50" />

      {/* Main feedback row */}
      <div className="flex items-center justify-between">
        {/* Left: Claps + Views */}
        <div className="flex items-center gap-4">
          {/* Clap */}
          <button
            type="button"
            onClick={handleClap}
            disabled={!isMounted || remainingClaps < 1}
            className="group relative flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            title={
              remainingClaps > 0
                ? `Clap for this post (${remainingClaps} left)`
                : "Clap limit reached"
            }
          >
            <motion.span
              whileTap={{ scale: 0.85 }}
              transition={{ duration: 0.1 }}
              className="inline-flex"
            >
              <HugeiconsIcon
                icon={Clapping02Icon}
                className="size-[22px] transition-colors group-hover:text-foreground"
                strokeWidth={1.8}
              />
            </motion.span>

            {/* +1 ping */}
            {showPlusOne && (
              <>
                <span className="pointer-events-none absolute -top-3 left-1 text-[10px] font-semibold text-primary animate-bounce">
                  +1
                </span>
              </>
            )}

            <span className="inline-flex min-w-5 overflow-hidden tabular-nums text-sm font-medium">
              {isLoadingClaps ? (
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="size-3.5 animate-spin"
                  strokeWidth={2}
                />
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={totalClaps}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                      mass: 0.6,
                    }}
                    className="inline-block"
                  >
                    {formatCount(totalClaps)}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          </button>

          {/* Separator dot */}
          <span className="text-border" aria-hidden="true">
            ·
          </span>

          {/* Views — live-synced from API */}
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <HugeiconsIcon
              icon={EyeIcon}
              className="size-4"
              strokeWidth={1.8}
            />
            <span className="tabular-nums font-medium">
              {formatCount(liveViewCount)}
            </span>
            <span className="hidden sm:inline">views</span>
          </span>
        </div>

        <span className="text-xs text-muted-foreground">Thanks for reading</span>
      </div>

      {/* Meta line: Category · Date */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link
          href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
          className="font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {category}
        </Link>
        <span aria-hidden="true">·</span>
        <span>{formattedDate}</span>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${tag}`}>
              <Badge
                variant="outline"
                className="cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </footer>
  );
}

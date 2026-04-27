"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clapping02Icon,
  Loading03Icon,
  EyeIcon,
  Bookmark02Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { useFavorites } from "@/hooks/use-favorites";
import { postPath } from "@/lib/blog/post-path";
import { copyToClipboard } from "@/lib/clipboard";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShareButton } from "@/components/blog/share-button";

type Props = {
  slug: string;
  title: string;
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
  title,
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
  const [copied, setCopied] = useState(false);

  // — View state (live-synced) —
  const [liveViewCount, setLiveViewCount] = useState(initialViewCount);

  // — Favorites —
  const { isFavorite, toggleFavorite, isMounted: favMounted } = useFavorites();
  const isBookmarked = favMounted && isFavorite(slug);

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

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${postPath(slug)}`;
    const didCopy = await copyToClipboard(url);
    if (didCopy) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="mx-auto w-full max-w-3xl">
      {/* Top divider */}
      <div className="border-t border-border/50" />

      {/* Engagement bar */}
      <div className="flex items-center justify-between py-3">
        {/* Left group: Claps + Views */}
        <div className="flex items-center gap-0.5">
          {/* Clap button */}
          <Tooltip>
            <TooltipTrigger
              onClick={handleClap}
              disabled={!isMounted || remainingClaps < 1}
              className="group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              <motion.span
                whileTap={{ scale: 0.85 }}
                transition={{ duration: 0.1 }}
                className="inline-flex"
              >
                <HugeiconsIcon
                  icon={Clapping02Icon}
                  className="size-[20px] transition-colors group-hover:text-foreground"
                  strokeWidth={1.8}
                />
              </motion.span>

              {showPlusOne && (
                <span className="pointer-events-none absolute -top-2.5 left-3 text-[10px] font-semibold text-primary animate-bounce">
                  +1
                </span>
              )}

              <span className="inline-flex min-w-4 overflow-hidden tabular-nums text-sm font-medium">
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
            </TooltipTrigger>
            <TooltipContent>
              {remainingClaps > 0
                ? `Clap (${remainingClaps} left)`
                : "Clap limit reached"}
            </TooltipContent>
          </Tooltip>

          {/* Vertical divider */}
          <div className="mx-1 h-5 w-px bg-border/60" aria-hidden="true" />

          {/* Views */}
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground">
            <HugeiconsIcon
              icon={EyeIcon}
              className="size-4"
              strokeWidth={1.8}
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={liveViewCount}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="tabular-nums font-medium"
              >
                {formatCount(liveViewCount)}
              </motion.span>
            </AnimatePresence>
            <span className="hidden sm:inline">views</span>
          </span>
        </div>

        {/* Right group: Copy link, Share, Bookmark */}
        <div className="flex items-center gap-0.5">
          {/* Copy link */}
          <Tooltip>
            <TooltipTrigger
              onClick={handleCopyLink}
              className="flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={copied ? "tick" : "copy"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  <HugeiconsIcon
                    icon={copied ? Tick02Icon : Copy01Icon}
                    className={`size-[18px] ${copied ? "text-primary" : ""}`}
                    strokeWidth={2}
                  />
                </motion.span>
              </AnimatePresence>
            </TooltipTrigger>
            <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
          </Tooltip>

          {/* Share */}
          <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.1 }}>
            <ShareButton slug={slug} title={title} />
          </motion.div>

          {/* Bookmark / Favorite */}
          <Tooltip>
            <TooltipTrigger
              onClick={() => toggleFavorite({ slug, title })}
              className={`flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted ${
                isBookmarked
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <motion.span
                key={isBookmarked ? "saved" : "unsaved"}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
                className="inline-flex"
              >
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  className={`size-[18px] ${isBookmarked ? "fill-current" : ""}`}
                  strokeWidth={2}
                />
              </motion.span>
            </TooltipTrigger>
            <TooltipContent>
              {isBookmarked ? "Remove from Favorites" : "Save to Favorites"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons/core-free-icons";

import { LoadingPill } from "@/components/ui/loading-pill";
import { usePostViews } from "@/hooks/use-post-views";

type Props = {
  slug: string;
  initialCount?: number;
};

const VIEW_TIMER_MS = 1800;

export function ViewCounter({ slug, initialCount = 0 }: Props) {
  const { count, updateCount } = usePostViews(slug, initialCount);
  const [isUpdating, setIsUpdating] = useState(true);

  useEffect(() => {
    let isActive = true;
    let hasTracked = false;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const syncCountFromServer = () => {
      fetch(`/api/posts/${slug}/views`, {
        method: "GET",
        cache: "no-store",
      })
        .then(async (response) => {
          if (!response.ok) {
            return null;
          }

          const data = (await response.json()) as { viewCount?: number };
          return typeof data.viewCount === "number" ? data.viewCount : null;
        })
        .then((nextCount) => {
          if (!isActive) {
            return;
          }

          if (typeof nextCount === "number") {
            updateCount(nextCount);
          }
        })
        .catch(() => {
          // Keep current count when sync fails.
        })
        .finally(() => {
          if (isActive) {
            setIsUpdating(false);
          }
        });
    };

    const incrementViewCount = () => {
      fetch(`/api/posts/${slug}/views`, {
        method: "POST",
        cache: "no-store",
      })
        .then(async (response) => {
          if (!response.ok) {
            return null;
          }

          const data = (await response.json()) as { viewCount?: number };
          return typeof data.viewCount === "number" ? data.viewCount : null;
        })
        .then((nextCount) => {
          if (!isActive) {
            return;
          }

          if (typeof nextCount === "number") {
            updateCount(nextCount);
          }
        })
        .catch(() => {
          // Keep current count when tracking fails.
        })
        .finally(() => {
          if (isActive) {
            setIsUpdating(false);
          }
        });
    };

    syncCountFromServer();

    const trackWithFetch = () => {
      if (hasTracked) {
        return;
      }

      hasTracked = true;
      incrementViewCount();
    };

    const trackWithBeacon = () => {
      if (hasTracked) {
        return;
      }

      hasTracked = true;

      const beaconSent = navigator.sendBeacon(`/api/posts/${slug}/views`);

      if (!beaconSent) {
        incrementViewCount();
      }
    };

    const startTimer = () => {
      if (timerId) {
        return;
      }

      timerId = setTimeout(() => {
        trackWithFetch();
      }, VIEW_TIMER_MS);
    };

    const clearTimer = () => {
      if (!timerId) {
        return;
      }

      clearTimeout(timerId);
      timerId = undefined;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearTimer();
        trackWithBeacon();
        return;
      }

      startTimer();
    };

    const handlePageHide = () => {
      clearTimer();
      trackWithBeacon();
    };

    if (document.visibilityState === "visible") {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      isActive = false;
      clearTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [slug, updateCount]);

  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
      <HugeiconsIcon icon={EyeIcon} className="size-3.5" strokeWidth={2} />
      <span className="tabular-nums">{count.toLocaleString()}</span>
      {isUpdating && <LoadingPill label="Updating" className="ml-1" />}
      <span className="sr-only">views</span>
    </span>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";

const VIEW_UPDATE_EVENT = "btz-post-views-updated";

type ViewUpdateDetail = {
  slug: string;
  viewCount: number;
};

export function broadcastPostViews(slug: string, viewCount: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ViewUpdateDetail>(VIEW_UPDATE_EVENT, {
      detail: { slug, viewCount },
    }),
  );
}

export function usePostViews(slug: string, initialCount = 0) {
  const [count, setCount] = useState(initialCount);

  // Synchronize when initialCount prop updates (e.g. server re-render)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(initialCount);
  }, [initialCount]);

  // Listen for real-time view updates across components on the page
  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ViewUpdateDetail>;
      if (customEvent.detail && customEvent.detail.slug === slug) {
        setCount(customEvent.detail.viewCount);
      }
    };

    window.addEventListener(VIEW_UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(VIEW_UPDATE_EVENT, handleUpdate);
    };
  }, [slug]);

  const updateCount = useCallback(
    (newCount: number) => {
      setCount(newCount);
      broadcastPostViews(slug, newCount);
    },
    [slug],
  );

  return {
    count,
    updateCount,
  };
}

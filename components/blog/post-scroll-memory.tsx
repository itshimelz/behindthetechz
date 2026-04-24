"use client";

import { useEffect } from "react";
import { usePostScrollMemoryPreference } from "@/hooks/use-post-scroll-memory";

type ScrollMemoryPayload = {
  y: number;
  max: number;
  updatedAt: number;
};

const KEY_PREFIX = "post-scroll-memory:";
const SAVE_THROTTLE_MS = 500;
const MIN_RESTORE_Y = 80;

function getStorageKey(slug: string) {
  return `${KEY_PREFIX}${slug}`;
}

export function PostScrollMemory({ slug }: { slug: string }) {
  const { enabled } = usePostScrollMemoryPreference();

  useEffect(() => {
    if (!enabled) return;
    if (!slug) return;
    if (typeof window === "undefined") return;

    const key = getStorageKey(slug);
    let saveTimer: number | null = null;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const writeScrollState = () => {
      const payload: ScrollMemoryPayload = {
        y: window.scrollY,
        max: getMaxScroll(),
        updatedAt: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(payload));
    };

    const scheduleSave = () => {
      if (saveTimer !== null) return;
      saveTimer = window.setTimeout(() => {
        saveTimer = null;
        writeScrollState();
      }, SAVE_THROTTLE_MS);
    };

    const restoreScroll = () => {
      if (window.location.hash) return;

      const raw = sessionStorage.getItem(key);
      if (!raw) return;

      try {
        const payload = JSON.parse(raw) as Partial<ScrollMemoryPayload>;
        if (typeof payload.y !== "number" || payload.y < MIN_RESTORE_Y) return;

        const fallbackMax = getMaxScroll();
        const recordedMax =
          typeof payload.max === "number" && payload.max > 0
            ? payload.max
            : fallbackMax;
        const ratio = recordedMax > 0 ? payload.y / recordedMax : 0;
        const target = Math.round(Math.max(0, Math.min(1, ratio)) * fallbackMax);

        window.scrollTo({ top: target, behavior: "auto" });
      } catch {
        sessionStorage.removeItem(key);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (saveTimer !== null) {
          window.clearTimeout(saveTimer);
          saveTimer = null;
        }
        writeScrollState();
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(restoreScroll);
    });

    window.addEventListener("scroll", scheduleSave, { passive: true });
    window.addEventListener("pagehide", writeScrollState);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
      }
      writeScrollState();
      window.removeEventListener("scroll", scheduleSave);
      window.removeEventListener("pagehide", writeScrollState);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, slug]);

  return null;
}

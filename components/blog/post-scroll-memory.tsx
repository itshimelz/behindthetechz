"use client";

import { useEffect, useRef } from "react";
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
  const lastKnownYRef = useRef(0);
  const lastKnownMaxRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    if (!slug) return;
    if (typeof window === "undefined") return;

    const key = getStorageKey(slug);
    let saveTimer: number | null = null;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const writeScrollState = () => {
      const currentY = window.scrollY;
      const currentMax = getMaxScroll();
      // On route transitions, window.scrollY may reset before cleanup runs.
      // Persist the highest-confidence in-session values instead.
      const y = Math.max(currentY, lastKnownYRef.current);
      const max = Math.max(currentMax, lastKnownMaxRef.current);
      const payload: ScrollMemoryPayload = {
        y,
        max,
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
        const getTargetY = () =>
          Math.round(Math.max(0, Math.min(1, ratio)) * getMaxScroll());

        let attempt = 0;
        const maxAttempts = 6;
        let retryTimer: number | null = null;

        const tryRestore = () => {
          const target = getTargetY();
          window.scrollTo({ top: target, behavior: "auto" });
          attempt += 1;

          // Retry a few times while images/MDX content settle to avoid early undershoot.
          if (attempt < maxAttempts) {
            retryTimer = window.setTimeout(
              tryRestore,
              attempt < 3 ? 120 : 220,
            );
          }
        };

        tryRestore();

        return () => {
          if (retryTimer !== null) {
            window.clearTimeout(retryTimer);
          }
        };
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

    lastKnownYRef.current = window.scrollY;
    lastKnownMaxRef.current = getMaxScroll();

    let cleanupRestore: (() => void) | undefined;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        cleanupRestore = restoreScroll();
      });
    });

    const onScroll = () => {
      lastKnownYRef.current = window.scrollY;
      lastKnownMaxRef.current = getMaxScroll();
      scheduleSave();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", writeScrollState);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cleanupRestore?.();
      if (saveTimer !== null) {
        window.clearTimeout(saveTimer);
      }
      writeScrollState();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", writeScrollState);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, slug]);

  return null;
}

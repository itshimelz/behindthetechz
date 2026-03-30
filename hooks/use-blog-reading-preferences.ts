"use client";

import { useCallback, useEffect, useState } from "react";

export const BLOG_BG_TONE_OPTIONS = ["default", "paper", "mist", "sepia"] as const;
export type BlogBgTone = (typeof BLOG_BG_TONE_OPTIONS)[number];

const BLOG_BG_TONE_KEY = "behindthetechz-blog-bg-tone";
const BLOG_DOTS_ENABLED_KEY = "behindthetechz-blog-dots-enabled";
const BLOG_READING_PREFS_EVENT = "blog-reading-prefs-updated";

function isValidTone(value: string | null): value is BlogBgTone {
  return value !== null && BLOG_BG_TONE_OPTIONS.includes(value as BlogBgTone);
}

function readTone(): BlogBgTone {
  if (typeof window === "undefined") return "default";

  const value = localStorage.getItem(BLOG_BG_TONE_KEY);
  if (!isValidTone(value)) return "default";
  return value;
}

function readDotsEnabled(): boolean {
  if (typeof window === "undefined") return true;

  const value = localStorage.getItem(BLOG_DOTS_ENABLED_KEY);
  if (value === null) return true;
  return value !== "false";
}

export function useBlogReadingPreferences() {
  const [tone, setToneState] = useState<BlogBgTone>("default");
  const [dotsEnabled, setDotsEnabledState] = useState(true);

  useEffect(() => {
    const syncFromStorage = () => {
      setToneState(readTone());
      setDotsEnabledState(readDotsEnabled());
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BLOG_BG_TONE_KEY || event.key === BLOG_DOTS_ENABLED_KEY) {
        syncFromStorage();
      }
    };

    syncFromStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener(BLOG_READING_PREFS_EVENT, syncFromStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(BLOG_READING_PREFS_EVENT, syncFromStorage);
    };
  }, []);

  const setTone = useCallback((tone: BlogBgTone) => {
    localStorage.setItem(BLOG_BG_TONE_KEY, tone);
    setToneState(tone);
    window.dispatchEvent(new Event(BLOG_READING_PREFS_EVENT));
  }, []);

  const setDotsEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem(BLOG_DOTS_ENABLED_KEY, String(enabled));
    setDotsEnabledState(enabled);
    window.dispatchEvent(new Event(BLOG_READING_PREFS_EVENT));
  }, []);

  return {
    tone,
    setTone,
    dotsEnabled,
    setDotsEnabled,
  };
}

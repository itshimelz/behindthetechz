"use client";

import { useCallback, useSyncExternalStore } from "react";

const POST_SCROLL_MEMORY_KEY = "behindthetechz-post-scroll-memory";
const POST_SCROLL_MEMORY_EVENT = "post-scroll-memory-updated";

function readPreference(): boolean {
  if (typeof window === "undefined") return true;

  const value = localStorage.getItem(POST_SCROLL_MEMORY_KEY);
  if (value === null) return true;
  return value === "true";
}

function getSnapshot() {
  return readPreference();
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === POST_SCROLL_MEMORY_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(POST_SCROLL_MEMORY_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(POST_SCROLL_MEMORY_EVENT, callback);
  };
}

export function usePostScrollMemoryPreference() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setEnabled = useCallback((value: boolean) => {
    localStorage.setItem(POST_SCROLL_MEMORY_KEY, String(value));
    window.dispatchEvent(new Event(POST_SCROLL_MEMORY_EVENT));
  }, []);

  const toggleEnabled = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  return {
    enabled,
    setEnabled,
    toggleEnabled,
  };
}

"use client";

import { useCallback, useSyncExternalStore } from "react";

const TOC_PREFERENCE_KEY = "behindthetechz-toc-enabled";
const TOC_PREFERENCE_EVENT = "toc-preference-updated";

function readPreference(): boolean {
  if (typeof window === "undefined") return true;

  const value = localStorage.getItem(TOC_PREFERENCE_KEY);
  if (value === null) return true; // Default to true
  return value === "true";
}

function getSnapshot() {
  return readPreference();
}

function getServerSnapshot() {
  return true; // Match default
}

function subscribe(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === TOC_PREFERENCE_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(TOC_PREFERENCE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(TOC_PREFERENCE_EVENT, callback);
  };
}

export function useTocPreference() {
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setEnabled = useCallback((value: boolean) => {
    localStorage.setItem(TOC_PREFERENCE_KEY, String(value));
    window.dispatchEvent(new Event(TOC_PREFERENCE_EVENT));
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

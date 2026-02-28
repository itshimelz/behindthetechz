"use client";

import { useCallback, useSyncExternalStore } from "react";

const READING_PROGRESS_KEY = "techzblog-reading-progress";
const READING_PROGRESS_EVENT = "reading-progress-updated";

function readPreference(): boolean {
  if (typeof window === "undefined") return true;

  const value = localStorage.getItem(READING_PROGRESS_KEY);
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
    if (event.key === READING_PROGRESS_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(READING_PROGRESS_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(READING_PROGRESS_EVENT, callback);
  };
}

export function useReadingProgressPreference() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setEnabled = useCallback((value: boolean) => {
    localStorage.setItem(READING_PROGRESS_KEY, String(value));
    window.dispatchEvent(new Event(READING_PROGRESS_EVENT));
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

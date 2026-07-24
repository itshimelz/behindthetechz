"use client";

import { useCallback, useSyncExternalStore } from "react";

type LocalStorageBooleanPref = {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  toggleEnabled: () => void;
};

export function useLocalStorageBooleanPref(
  key: string,
  eventName: string,
  defaultValue = true,
): LocalStorageBooleanPref {
  const enabled = useSyncExternalStore(
    useCallback(
      (callback: () => void) => {
        const handleStorage = (event: StorageEvent) => {
          if (event.key === key) {
            callback();
          }
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener(eventName, callback);

        return () => {
          window.removeEventListener("storage", handleStorage);
          window.removeEventListener(eventName, callback);
        };
      },
      [eventName, key],
    ),
    useCallback(() => {
      if (typeof window === "undefined") {
        return defaultValue;
      }

      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }

      return value === "true";
    }, [defaultValue, key]),
    () => defaultValue,
  );

  const setEnabled = useCallback(
    (value: boolean) => {
      if (typeof window === "undefined") {
        return;
      }

      localStorage.setItem(key, String(value));
      window.dispatchEvent(new Event(eventName));
    },
    [eventName, key],
  );

  const toggleEnabled = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  return {
    enabled,
    setEnabled,
    toggleEnabled,
  };
}

export function useTocPreference() {
  return useLocalStorageBooleanPref(
    "behindthetechz-toc-enabled",
    "toc-preference-updated",
    true,
  );
}

export function useReadingProgressPreference() {
  return useLocalStorageBooleanPref(
    "behindthetechz-reading-progress",
    "reading-progress-updated",
    true,
  );
}

export function usePostScrollMemoryPreference() {
  return useLocalStorageBooleanPref(
    "behindthetechz-post-scroll-memory",
    "post-scroll-memory-updated",
    true,
  );
}


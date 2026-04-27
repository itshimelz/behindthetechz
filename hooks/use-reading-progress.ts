"use client";

import { useLocalStorageBooleanPref } from "@/hooks/use-local-storage-pref";

const READING_PROGRESS_KEY = "behindthetechz-reading-progress";
const READING_PROGRESS_EVENT = "reading-progress-updated";

export function useReadingProgressPreference() {
  return useLocalStorageBooleanPref(
    READING_PROGRESS_KEY,
    READING_PROGRESS_EVENT,
    true,
  );
}

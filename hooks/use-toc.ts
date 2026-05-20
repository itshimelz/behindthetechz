"use client";

import { useLocalStorageBooleanPref } from "@/hooks/use-local-storage-pref";

const TOC_PREFERENCE_KEY = "behindthetechz-toc-enabled";
const TOC_PREFERENCE_EVENT = "toc-preference-updated";

export function useTocPreference() {
  return useLocalStorageBooleanPref(
    TOC_PREFERENCE_KEY,
    TOC_PREFERENCE_EVENT,
    true,
  );
}

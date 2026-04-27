"use client";

import { useLocalStorageBooleanPref } from "@/hooks/use-local-storage-pref";

const POST_SCROLL_MEMORY_KEY = "behindthetechz-post-scroll-memory";
const POST_SCROLL_MEMORY_EVENT = "post-scroll-memory-updated";

export function usePostScrollMemoryPreference() {
  return useLocalStorageBooleanPref(
    POST_SCROLL_MEMORY_KEY,
    POST_SCROLL_MEMORY_EVENT,
    true,
  );
}

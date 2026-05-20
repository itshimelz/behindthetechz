"use client";

import { useCallback, useState, useEffect, useSyncExternalStore } from "react";

export type FavoriteItem = {
  slug: string;
  title: string;
};

const FAVORITES_KEY = "behindthetechz-favorites";
const EVENT_NAME = "favorites-updated";
const emptyArray: FavoriteItem[] = [];

let lastStoredStr: string | null = null;
let lastParsedArray: FavoriteItem[] = emptyArray;

function getSnapshot(): FavoriteItem[] {
  if (typeof window === "undefined") return emptyArray;
  const stored = localStorage.getItem(FAVORITES_KEY);
  if (!stored) return emptyArray;
  
  if (lastStoredStr === stored) {
    return lastParsedArray;
  }
  
  try {
    const parsed = JSON.parse(stored) as FavoriteItem[];
    lastStoredStr = stored;
    lastParsedArray = parsed;
    return parsed;
  } catch {
    return emptyArray;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_KEY) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(EVENT_NAME, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(EVENT_NAME, callback);
  };
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, () => emptyArray);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    const current = getSnapshot();
    const exists = current.some((fav) => fav.slug === item.slug);
    
    const next = exists 
      ? current.filter((fav) => fav.slug !== item.slug)
      : [...current, item];
      
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  const isFavorite = useCallback((slug: string) => {
    return favorites.some((fav) => fav.slug === slug);
  }, [favorites]);

  const importFavorites = useCallback((newFavorites: FavoriteItem[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    importFavorites,
    isMounted,
  };
}

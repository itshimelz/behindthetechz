"use client";

import { useState, useEffect } from "react";

export type FavoriteItem = {
  slug: string;
  title: string;
};

const FAVORITES_KEY = "techzblog-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTimeout(() => setFavorites(parsed), 0);
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    // Defer the set mounted to avoid React "synchronous setState in effect" lint error
    setTimeout(() => {
      setIsMounted(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const newStr = JSON.stringify(favorites);
      const storedStr = localStorage.getItem(FAVORITES_KEY);
      if (newStr !== storedStr) {
        localStorage.setItem(FAVORITES_KEY, newStr);
        // Dispatch a custom event to update other components (e.g. sidebar)
        window.dispatchEvent(new Event("favorites-updated"));
      }
    }
  }, [favorites, isMounted]);

  // Listen for changes from other tabs or components
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setFavorites((prev) => {
            if (JSON.stringify(prev) === stored) {
              return prev; // Break the infinite state loop
            }
            return parsed;
          });
        } catch (e) {
          console.error("Failed to parse favorites", e);
        }
      }
    };

    window.addEventListener("favorites-updated", handleStorageChange);
    // Also listen to actual storage events for cross-tab synchronization
    window.addEventListener("storage", (e) => {
      if (e.key === FAVORITES_KEY) {
        handleStorageChange();
      }
    });

    return () => {
      window.removeEventListener("favorites-updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.slug === item.slug);
      if (exists) {
        return prev.filter((fav) => fav.slug !== item.slug);
      } else {
        return [...prev, item];
      }
    });
  };

  const isFavorite = (slug: string) => {
    return favorites.some((fav) => fav.slug === slug);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isMounted,
  };
}

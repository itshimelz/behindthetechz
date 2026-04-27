"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon, Delete02Icon } from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postPath } from "@/lib/blog/post-path";

type FavoriteItem = {
  slug: string;
  title: string;
};

type FavoritesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: FavoriteItem[];
  isMounted: boolean;
  toggleFavorite: (favorite: FavoriteItem) => void;
};

export function FavoritesDialog({
  open,
  onOpenChange,
  favorites,
  isMounted,
  toggleFavorite,
}: FavoritesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Favorites</DialogTitle>
          <DialogDescription>
            Posts you&apos;ve saved for quick access. This list is stored only in
            your browser (local storage) and is not saved in the database.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-72 overflow-y-auto">
          {!isMounted ? (
            <p className="text-muted-foreground text-sm py-4 text-center">
              Loading&hellip;
            </p>
          ) : favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <HugeiconsIcon
                icon={Bookmark02Icon}
                className="size-8 text-muted-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-muted-foreground text-sm">
                No favorites yet. Click the bookmark icon on any post to save it
                here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border" role="list">
              {favorites.map((fav) => (
                <li
                  key={fav.slug}
                  className="flex items-center justify-between gap-2 py-2.5"
                >
                  <Link
                    href={postPath(fav.slug)}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-2 min-w-0 flex-1 group"
                  >
                    <HugeiconsIcon
                      icon={Bookmark02Icon}
                      className="size-4 shrink-0 text-primary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                      {fav.title}
                    </span>
                  </Link>
                  <button
                    onClick={() =>
                      toggleFavorite({ slug: fav.slug, title: fav.title })
                    }
                    className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-muted shrink-0"
                    aria-label={`Remove ${fav.title} from favorites`}
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      className="size-4"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Favorites are private to this device/browser.
        </p>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useFavorites } from "@/hooks/use-favorites";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
  title: string;
};

export function FavoriteButton({ slug, title }: Props) {
  const { isFavorite, toggleFavorite, isMounted } = useFavorites();

  if (!isMounted) return <div className="h-9 w-9" />; // Placeholder to prevent layout shift

  const active = isFavorite(slug);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleFavorite({ slug, title })}
      className={`rounded-full transition-colors ${
        active
          ? "text-primary hover:text-primary/80"
          : "text-muted-foreground hover:text-foreground"
      }`}
      title={active ? "Remove from Favorites" : "Add to Favorites"}
    >
      <HugeiconsIcon
        icon={Bookmark02Icon}
        strokeWidth={2}
        className={active ? "fill-current" : ""}
      />
      <span className="sr-only">Toggle Favorite</span>
    </Button>
  );
}

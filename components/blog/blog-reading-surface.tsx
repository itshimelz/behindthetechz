"use client";

import { cn } from "@/lib/utils";
import { useBlogReadingPreferences } from "@/hooks/use-blog-reading-preferences";

export function BlogReadingSurface({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { tone, dotsEnabled } = useBlogReadingPreferences();

  return (
    <div
      className={cn(
        "blog-reading-surface blog-reading-tone-default",
        `blog-reading-tone-${tone}`,
        dotsEnabled ? "blog-reading-dots-enabled" : "blog-reading-dots-disabled",
        className,
      )}
    >
      {children}
    </div>
  );
}

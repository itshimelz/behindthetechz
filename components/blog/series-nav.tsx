import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  Notebook01Icon,
} from "@hugeicons/core-free-icons";
import type { SeriesWithPosts } from "@/lib/blog/get-series";
import { cn } from "@/lib/utils";

type Props = {
  series: SeriesWithPosts;
  currentSlug: string;
};

export function SeriesNav({ series, currentSlug }: Props) {
  const currentIndex = series.posts.findIndex((p) => p.slug === currentSlug);
  const prevPost = currentIndex > 0 ? series.posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < series.posts.length - 1
      ? series.posts[currentIndex + 1]
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
      {/* Series header */}
      <div className="flex items-center gap-2 text-sm">
        <HugeiconsIcon
          icon={Notebook01Icon}
          className="size-4 text-primary"
          strokeWidth={2}
        />
        <span className="font-medium text-foreground">
          {series.name}
        </span>
        <span className="text-muted-foreground">
          — Part {currentIndex + 1} of {series.posts.length}
        </span>
      </div>

      {/* All parts (collapsible could be added later) */}
      <ol className="space-y-1 pl-1">
        {series.posts.map((post, i) => (
          <li key={post.slug}>
            {post.slug === currentSlug ? (
              <span
                className="flex items-center gap-2 text-sm py-1 pl-2 rounded-md bg-primary/10 text-primary font-medium"
              >
                <span className="text-xs text-primary/60 w-5 shrink-0 tabular-nums">
                  {i + 1}.
                </span>
                {post.title}
              </span>
            ) : (
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center gap-2 text-sm py-1 pl-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-xs opacity-60 w-5 shrink-0 tabular-nums">
                  {i + 1}.
                </span>
                {post.title}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className={cn(
                "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors",
              )}
            >
              <HugeiconsIcon
                icon={ArrowLeft02Icon}
                className="size-3.5"
                strokeWidth={2}
              />
              <span className="truncate max-w-[150px]">{prevPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <span className="truncate max-w-[150px]">{nextPost.title}</span>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                className="size-3.5"
                strokeWidth={2}
              />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

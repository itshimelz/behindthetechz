import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import type { Post } from "@/lib/blog/types";
import { FavoriteButton } from "@/components/blog/favorite-button";
import { ShareButton } from "@/components/blog/share-button";
import { ViewCounter } from "@/components/blog/view-counter";
import { getCategoryColorClass, cn } from "@/lib/utils";

type Props = {
  post: Post;
};

function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function hasSignificantUpdate(post: Post): boolean {
  if (!post.updatedAt) return false;
  const published = new Date(post.date).getTime();
  const updated = new Date(post.updatedAt).getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return updated - published > ONE_DAY;
}

export function PostMeta({ post }: Props) {
  const showUpdated = hasSignificantUpdate(post);
  const publishedDate = new Date(post.date);

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className={cn("border", getCategoryColorClass(post.category))}
        >
          {post.category}
        </Badge>
        {showUpdated && (
          <Tooltip>
            <TooltipTrigger>
              <span className="inline-flex cursor-help items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <HugeiconsIcon
                  icon={RefreshIcon}
                  className="size-3"
                  strokeWidth={2}
                />
                Updated {getRelativeTimeString(new Date(post.updatedAt!))}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Last updated on{" "}
                {new Date(post.updatedAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-1 self-start rounded-full border border-border/60 bg-background/80 p-1 sm:mt-1">
            <ShareButton slug={post.slug} title={post.title} />
            <FavoriteButton slug={post.slug} title={post.title} />
          </div>
        </div>

        {post.excerpt && (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-y border-border/50 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-help">
                {publishedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Published around{" "}
                {publishedDate.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
          <span aria-hidden="true" className="hidden text-border sm:inline">
            ·
          </span>
          <span>{post.readingTime} min read</span>
          <span aria-hidden="true" className="hidden text-border sm:inline">
            ·
          </span>
          <span>{post.wordCount} words</span>
          <span aria-hidden="true" className="hidden text-border sm:inline">
            ·
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <ViewCounter slug={post.slug} initialCount={post.viewCount} />
          </span>
        </div>

        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Take your time with it
        </p>
      </div>
    </header>
  );
}


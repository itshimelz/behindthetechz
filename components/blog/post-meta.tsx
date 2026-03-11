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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="secondary"
          className={cn("border", getCategoryColorClass(post.category))}
        >
          {post.category}
        </Badge>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-muted-foreground text-sm cursor-help">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Published around{" "}
              {new Date(post.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </TooltipContent>
        </Tooltip>
        <span className="text-muted-foreground text-sm">
          · {post.readingTime} min read
        </span>
        <span className="text-muted-foreground text-sm">
          · {post.wordCount} words
        </span>
        <span className="inline-flex items-center gap-1 whitespace-nowrap text-muted-foreground text-sm">
          <span aria-hidden="true">·</span>
          <ViewCounter slug={post.slug} initialCount={post.viewCount} />
        </span>
        {showUpdated && (
          <Tooltip>
            <TooltipTrigger>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 border border-border/50 rounded-md px-2 py-0.5 cursor-help">
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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex items-center gap-1 sm:pt-1">
          <ShareButton slug={post.slug} title={post.title} />
          <FavoriteButton slug={post.slug} title={post.title} />
        </div>
      </div>
      {post.excerpt && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {post.excerpt}
        </p>
      )}
    </div>
  );
}


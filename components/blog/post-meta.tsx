import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, TimeQuarter02Icon } from "@hugeicons/core-free-icons";
import type { Post } from "@/lib/blog/types";
import { ViewCounter } from "@/components/blog/view-counter";
import { formatPostDate, getRelativeTimeString } from "@/lib/format-date";
import { getCategoryColorClass, cn } from "@/lib/utils";

type Props = {
  post: Post;
};

const AUTHOR = {
  name: "Rahat Hossain Himel",
  avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || "/himel-avatar.jpg",
};

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
      {/* Category + updated badge */}
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
                Updated {getRelativeTimeString(post.updatedAt!)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Last updated on{" "}
                {formatPostDate(post.updatedAt!, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Title — full width */}
      <h1
        className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.6rem] lg:leading-tight"
        style={{ fontFamily: '"Blog Title", "Google Sans", sans-serif' }}
      >
        {post.title}
      </h1>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {post.excerpt}
        </p>
      )}

      {/* Author byline */}
      <div className="flex items-center gap-3 border-y-2 border-border/60 py-3">
        <Image
          src={AUTHOR.avatar}
          alt={AUTHOR.name}
          width={36}
          height={36}
          className="aspect-square size-9 rounded-full object-cover"
          unoptimized={AUTHOR.avatar.startsWith("http")}
        />
        <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-0">
          <span className="text-sm font-medium text-foreground">
            {AUTHOR.name}
          </span>
          <span
            aria-hidden="true"
            className="mx-2 hidden text-border sm:inline"
          >
            ·
          </span>
          <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
            <Tooltip>
              <TooltipTrigger>
                <span className="cursor-help">
                  {formatPostDate(post.date, {
                    year: "numeric",
                    month: "short",
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
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={TimeQuarter02Icon}
                className="size-3.5"
                strokeWidth={2}
              />
              {post.readingTime} min read
            </span>
            <span aria-hidden="true" className="hidden text-border sm:inline">
              ·
            </span>
            <span className="hidden sm:inline">
              <ViewCounter slug={post.slug} initialCount={post.viewCount} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

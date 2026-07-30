"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link04Icon, Tick02Icon, StarIcon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { postPath } from "@/lib/blog/post-path";
import { copyToClipboard } from "@/lib/clipboard";
import { formatPostDate } from "@/lib/format-date";
import { AUTHOR_CONFIG } from "@/lib/site";
import type { Post } from "@/lib/blog/types";

type Props = {
  post: Post;
  searchQuery?: string;
  variant?: "card" | "list";
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query?: string) {
  const normalizedQuery = query?.trim();
  if (!normalizedQuery) return text;

  const pattern = new RegExp(`(${escapeRegExp(normalizedQuery)})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === normalizedQuery.toLowerCase();
    if (!isMatch) return part;

    return (
      <mark
        key={`${part}-${index}`}
        className="rounded-sm bg-primary/20 px-1 text-foreground"
      >
        {part}
      </mark>
    );
  });
}

export function PostCard({ post, searchQuery, variant = "card" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}${postPath(post.slug)}`;
    const didCopy = await copyToClipboard(url);
    if (didCopy) {
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === "card") {
    return (
      <Link
        href={postPath(post.slug)}
        className="group flex flex-col justify-between space-y-3 sm:space-y-4 rounded-xl border-none p-0 h-full transition-transform duration-200 ease-out hover:-translate-y-1.5 active:translate-y-0"
      >
        {/* Top Cover Image (Borderless) */}
        <div className="w-full aspect-[16/10] rounded-xl overflow-hidden bg-muted/20 shrink-0 relative border-none">
          <img
            src={post.coverImage || "/images/placeholder.png"}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 space-y-2.5">
          <div className="space-y-2">
            {/* Category Tag with Green Accent Underline */}
            <div className="flex items-center justify-between">
              <div className="w-fit">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground border-b-2 border-emerald-600 dark:border-emerald-500 pb-0.5 inline-block">
                  {post.category}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-all"
                title="Copy post link"
              >
                <HugeiconsIcon
                  icon={copied ? Tick02Icon : Link04Icon}
                  className="size-3.5"
                  strokeWidth={2}
                />
              </button>
            </div>

            {/* Headline / Title */}
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground line-clamp-3 leading-[1.25]">
              {highlightText(post.title, searchQuery)}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-muted-foreground font-normal">
                {highlightText(post.excerpt, searchQuery)}
              </p>
            )}
          </div>

          {/* Author & Date Metadata Bar */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1.5">
            <img
              src={AUTHOR_CONFIG.avatar}
              alt={AUTHOR_CONFIG.name}
              className="size-4.5 rounded-full object-cover shrink-0"
            />
            <span className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              {AUTHOR_CONFIG.name}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <time dateTime={post.date} className="uppercase tracking-wider text-[11px] font-medium text-muted-foreground">
              {formatPostDate(post.date, { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </time>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={postPath(post.slug)}
      className="group flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/40 transition-transform duration-150 ease-out hover:-translate-y-0.5 border-b border-border/30 last:border-0"
    >
      {/* Left Title Container */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Star Icon for Featured */}
        {post.featured ? (
          <HugeiconsIcon icon={StarIcon} className="size-3.5 text-muted-foreground/60 shrink-0" strokeWidth={2} />
        ) : null}

        {/* Post Title */}
        <div className="min-w-0 flex-1 flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground group-hover:text-foreground group-hover:underline decoration-foreground/40 underline-offset-4 line-clamp-1">
            {highlightText(post.title, searchQuery)}
          </h3>
          <button
            type="button"
            onClick={handleCopyLink}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 p-0.5 rounded text-muted-foreground hover:text-foreground transition-all"
            title="Copy post link"
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Link04Icon}
              className="size-3"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {/* Right Metadata: Author, Date, Comment/Reading Pill */}
      <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
        <span className="hidden md:inline font-medium text-muted-foreground/90">
          {AUTHOR_CONFIG.name}
        </span>

        <span className="text-[11px] tabular-nums">
          {formatPostDate(post.date, { month: "short", day: "numeric" })}
        </span>

        {/* Comment count / Reading time pill */}
        <span className="min-w-8 text-center rounded bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-foreground border border-border/50 tabular-nums">
          {post.readingTime}m
        </span>
      </div>
    </Link>
  );
}

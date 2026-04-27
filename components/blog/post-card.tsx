"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link04Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { postPath } from "@/lib/blog/post-path";
import { copyToClipboard } from "@/lib/clipboard";
import { formatPostDate } from "@/lib/format-date";
import type { Post } from "@/lib/blog/types";

type Props = {
  post: Post;
  searchQuery?: string;
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

export function PostCard({ post, searchQuery }: Props) {
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

  return (
    <Link href={postPath(post.slug)} className="group flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-1 text-foreground">
            {highlightText(post.title, searchQuery)}
          </h3>
          <button
            type="button"
            onClick={handleCopyLink}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Copy post link"
          >
            <HugeiconsIcon
              icon={copied ? Tick02Icon : Link04Icon}
              className="size-3.5"
              strokeWidth={2}
            />
          </button>
        </div>
        <span className="text-xs italic text-muted-foreground/70 shrink-0 tabular-nums sm:text-sm sm:text-muted-foreground">
          {formatPostDate(post.date, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          <span className="mx-1">·</span>
          {post.readingTime} min read
        </span>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}

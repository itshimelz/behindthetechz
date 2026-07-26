import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  SparklesIcon,
  TimeQuarter02Icon,
} from "@hugeicons/core-free-icons";
import { postPath } from "@/lib/blog/post-path";
import type { Post } from "@/lib/blog/types";
import { formatPostDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
};

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-12 w-full max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <HugeiconsIcon icon={SparklesIcon} className="size-4" strokeWidth={2} />
          </span>
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            Related Articles
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {posts.length} curated {posts.length === 1 ? "read" : "reads"}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={postPath(post.slug)}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-4 transition-transform duration-150 ease-out hover:-translate-y-1 dark:bg-zinc-900/30"
          >
            <div className="space-y-3">
              {/* Image Frame */}
              {post.coverImage ? (
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-border/40 bg-muted/20">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 360px"
                  />
                </div>
              ) : (
                <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br from-muted/50 via-muted/30 to-primary/5 flex items-center justify-center">
                  <span className="text-xs font-medium text-muted-foreground/60">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Meta Pill */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span
                  className={cn(
                    "inline-block rounded-md border border-border/40 bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-foreground/90 uppercase tracking-wider",
                  )}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <HugeiconsIcon icon={TimeQuarter02Icon} className="size-3" strokeWidth={2} />
                  {post.readingTime}m read
                </span>
              </div>

              {/* Title & Excerpt */}
              <div className="space-y-1">
                <h3 className="line-clamp-2 text-base font-bold text-foreground leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
              <time dateTime={post.date}>
                {formatPostDate(post.date, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <span className="flex items-center gap-1 font-medium text-foreground">
                Read article
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" strokeWidth={2} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

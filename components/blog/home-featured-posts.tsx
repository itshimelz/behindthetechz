"use client";

import Link from "next/link";
import { postPath } from "@/lib/blog/post-path";
import { formatPostDate } from "@/lib/format-date";
import { AUTHOR_CONFIG } from "@/lib/site";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
};

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={postPath(post.slug)}
      className="group flex flex-col justify-between space-y-3 sm:space-y-4 rounded-xl border-none p-0"
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
          <div className="w-fit">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground border-b-2 border-emerald-600 dark:border-emerald-500 pb-0.5 inline-block">
              {post.category}
            </span>
          </div>

          {/* Headline / Title */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:underline decoration-foreground/30 underline-offset-4 line-clamp-3 leading-[1.25]">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-3 text-xs sm:text-sm leading-relaxed text-muted-foreground font-normal">
            {post.excerpt}
          </p>
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

export function HomeFeaturedPosts({ posts }: Props) {
  // Show up to 6 published posts in the 3-column grid
  const displayPosts = posts.slice(0, 6);

  if (displayPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 border-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {displayPosts.map((post) => (
          <FeaturedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

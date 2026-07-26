"use client";

import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { postPath } from "@/lib/blog/post-path";
import { formatPostDate } from "@/lib/format-date";
import { AUTHOR_CONFIG } from "@/lib/site";
import type { Post } from "@/lib/blog/types";
import { SectionIntro } from "@/components/shared/section-intro";

type Props = {
  posts: Post[];
};

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <Link
      href={postPath(post.slug)}
      className="group flex flex-col md:flex-row items-stretch gap-5 sm:gap-6 rounded-2xl border border-border/50 bg-[#FAF8F5]/60 p-4 sm:p-5 transition-all duration-150 ease-out hover:-translate-y-1 hover:bg-[#FAF8F5] dark:bg-zinc-900/30 dark:hover:bg-zinc-900/50"
    >
      {/* Cover Image Frame */}
      <div className="w-full md:w-5/12 h-48 sm:h-52 md:h-auto min-h-[180px] rounded-xl overflow-hidden border border-border/40 bg-muted/20 shrink-0 relative">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          loading="lazy"
        />
      </div>

      {/* Content Area */}
      <div className="flex flex-col justify-between flex-1 space-y-2.5 py-0.5 min-w-0">
        <div className="space-y-2">
          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
            <span className="font-medium text-foreground/80 uppercase tracking-wider text-[10px] bg-muted/60 px-2 py-0.5 rounded border border-border/40">
              {post.category}
            </span>
            <div className="flex items-center gap-2">
              <time dateTime={post.date}>
                {formatPostDate(post.date, { month: "short", day: "numeric", year: "numeric" })}
              </time>
              <span>·</span>
              <span>{post.readingTime}m read</span>
            </div>
          </div>

          {/* Headline */}
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:underline decoration-foreground/40 underline-offset-4 line-clamp-2 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        </div>

        {/* Action Link */}
        <div className="pt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">by {AUTHOR_CONFIG.name}</span>
          <span className="inline-flex items-center gap-1 font-medium text-foreground transition-transform duration-200 group-hover:translate-x-1">
            Read essay
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomeFeaturedPosts({ posts }: Props) {
  const featuredPosts = posts.filter((p) => p.coverImage).slice(0, 2);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full space-y-6">
      <SectionIntro
        eyebrow="Curated Essays"
        title="Foundational & Deep Essays"
        description="High-signal technical breakdowns and core architectural principles."
      />
      <div className="flex flex-col gap-6">
        {featuredPosts.map((post) => (
          <FeaturedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

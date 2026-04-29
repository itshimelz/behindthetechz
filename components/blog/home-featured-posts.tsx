"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { formatPostDate } from "@/lib/format-date";
import { postPath } from "@/lib/blog/post-path";
import type { Post } from "@/lib/blog/types";
import { SectionIntro } from "@/components/shared/section-intro";

type Props = {
  posts: Post[];
};

function FeaturedPostCard({ post }: { post: Post }) {
  return (
    <div className="group flex flex-col gap-5 h-full">
      <Link
        href={postPath(post.slug)}
        className="block w-full overflow-hidden rounded-2xl bg-muted/20 h-64 sm:h-72 md:h-80 shrink-0"
      >
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-primary uppercase tracking-wider">
            {post.category}
          </span>
          <span>·</span>
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </div>

        <Link
          href={postPath(post.slug)}
          className="group-hover:text-primary transition-colors"
        >
          <h3 className="text-xl sm:text-2xl font-bold leading-tight text-foreground line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground mt-1">
          {post.excerpt}
        </p>

        <Link
          href={postPath(post.slug)}
          className="mt-auto pt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Read full post
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export function HomeFeaturedPosts({ posts }: Props) {
  const featuredPosts = posts.filter((p) => p.coverImage).slice(0, 2);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-5 py-4 sm:px-7 md:px-8 md:py-2">
      <div className="space-y-8">
        <SectionIntro
          eyebrow="Latest Updates"
          title="Most recent articles"
          description="The newest stories, complete with rich visual context."
        />
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 items-stretch">
          {featuredPosts.map((post) => (
            <FeaturedPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

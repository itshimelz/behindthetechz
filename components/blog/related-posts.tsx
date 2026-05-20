import Link from "next/link";
import Image from "next/image";
import { postPath } from "@/lib/blog/post-path";
import type { Post } from "@/lib/blog/types";
import { formatPostDate } from "@/lib/format-date";

type Props = {
  posts: Post[];
};

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl rounded-xl border border-border/60 bg-card p-4 sm:p-5">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        Related Posts
      </h2>

      {/* Unified list layout across mobile and desktop */}
      <div className="border-t border-border/60">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={postPath(post.slug)}
            className={`group flex items-start gap-3 py-3.5 ${
              index < posts.length - 1 ? "border-b border-border/60" : ""
            }`}
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <h3 className="line-clamp-2 text-[15px] leading-snug font-medium text-foreground transition-colors group-hover:text-primary sm:text-base">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <p className="pt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80 sm:text-xs">
                {formatPostDate(post.date, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="px-1">•</span>
                {post.category}
              </p>
            </div>

            {post.coverImage ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/20 sm:h-22 sm:w-22">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 80px, 88px"
                />
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

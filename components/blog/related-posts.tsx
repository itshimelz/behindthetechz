import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
};

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl rounded-xl bg-[#faf7f1] p-4 sm:p-5">
      <h2 className="text-xl font-semibold tracking-tight mb-4 text-foreground">
        Related Posts
      </h2>

      {/* Unified list layout across mobile and desktop */}
      <div className="border-t border-border/60">
        {posts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={`group flex items-start gap-3 py-4 ${
              index < posts.length - 1 ? "border-b border-border/60" : ""
            }`}
          >
            <div className="min-w-0 flex-1 space-y-1.5">
              <h3 className="line-clamp-2 text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-primary md:text-lg">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                {post.excerpt}
              </p>
              <p className="pt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/85 md:text-xs">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                <span className="px-1">•</span>
                {post.category}
              </p>
            </div>

            {post.coverImage ? (
              <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted/20 md:h-24 md:w-24">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 88px, 96px"
                />
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}

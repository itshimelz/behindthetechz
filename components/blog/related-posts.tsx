import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { PostCard } from "@/components/blog/post-card";
import type { Post } from "@/lib/blog/types";

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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} variant="card" />
        ))}
      </div>
    </section>
  );
}

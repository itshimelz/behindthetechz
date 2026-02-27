import Link from "next/link";
import type { Post } from "@/lib/blog/types";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-1 text-foreground">
          {post.title}
        </h3>
        <span className="text-sm text-muted-foreground shrink-0 tabular-nums">
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2">
        {post.excerpt}
      </p>
    </Link>
  );
}

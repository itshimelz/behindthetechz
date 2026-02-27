import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/blog/types";

type Props = {
  post: Post;
};

export function PostMeta({ post }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="text-muted-foreground text-sm">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="text-muted-foreground text-sm">
          · {post.readingTime} min read
        </span>
        <span className="text-muted-foreground text-sm">
          · {post.wordCount} words
        </span>
      </div>
      <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="text-muted-foreground text-lg leading-relaxed">
          {post.excerpt}
        </p>
      )}
    </div>
  );
}

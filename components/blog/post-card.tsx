import Link from "next/link";
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
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
        <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-1 text-foreground">
          {highlightText(post.title, searchQuery)}
        </h3>
        <span className="text-xs italic text-muted-foreground/70 shrink-0 tabular-nums sm:text-sm sm:not-italic sm:text-muted-foreground">
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

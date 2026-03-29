import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/blog/empty-state";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
  emptyMessage?: string;
  searchQuery?: string;
  compact?: boolean;
};

export function PostList({ posts, emptyMessage, searchQuery, compact = false }: Props) {
  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`flex flex-col ${compact ? "gap-6 sm:gap-7" : "gap-8"}`}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} searchQuery={searchQuery} />
      ))}
    </div>
  );
}

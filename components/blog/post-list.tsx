import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/blog/empty-state";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
  emptyMessage?: string;
};

export function PostList({ posts, emptyMessage }: Props) {
  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex flex-col gap-1">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

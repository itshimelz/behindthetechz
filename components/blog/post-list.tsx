"use client";

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
    <div className={`flex flex-col ${compact ? "gap-1" : "gap-1.5"}`}>
      <style>{`
        @keyframes postListFadeIn {
          from { opacity: 0; transform: scale(0.985); }
          to { opacity: 1; transform: scale(1); }
        }
        .post-list-animate {
          animation: postListFadeIn 0.24s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .post-list-animate {
            animation: none !important;
          }
        }
      `}</style>
      {posts.map((post, index) => {
        const delay = Math.min(index * 0.035, 0.18);
        return (
          <div
            key={post.slug}
            className="post-list-animate"
            style={{ animationDelay: `${delay}s` }}
          >
            <PostCard post={post} searchQuery={searchQuery} />
          </div>
        );
      })}
    </div>
  );
}

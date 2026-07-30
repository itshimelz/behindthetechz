"use client";

import { PostCard } from "@/components/blog/post-card";
import { EmptyState } from "@/components/blog/empty-state";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
  emptyMessage?: string;
  searchQuery?: string;
  compact?: boolean;
  viewMode?: "grid" | "list";
};

export function PostList({
  posts,
  emptyMessage,
  searchQuery,
  compact = false,
  viewMode = "grid",
}: Props) {
  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const isGrid = viewMode === "grid";

  return (
    <div>
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
      <div
        className={
          isGrid
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
            : `flex flex-col ${compact ? "gap-1" : "gap-1.5"}`
        }
      >
        {posts.map((post, index) => {
          const delay = Math.min(index * 0.035, 0.18);
          return (
            <div
              key={post.slug}
              className={`post-list-animate ${isGrid ? "flex" : ""}`}
              style={{ animationDelay: `${delay}s` }}
            >
              <PostCard
                post={post}
                searchQuery={searchQuery}
                variant={isGrid ? "card" : "list"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

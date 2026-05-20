"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const prefersReducedMotion = useReducedMotion();

  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`flex flex-col ${compact ? "gap-6 sm:gap-7" : "gap-8"}`}>
      {posts.map((post, index) => (
        <motion.div
          key={post.slug}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  duration: 0.24,
                  ease: "easeOut",
                  delay: Math.min(index * 0.035, 0.18),
                }
          }
        >
          <PostCard post={post} searchQuery={searchQuery} />
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { CategoryNav } from "@/components/blog/category-nav";
import { PostList } from "@/components/blog/post-list";
import type { Post, Category } from "@/lib/blog/types";

type Props = {
  posts: Post[];
  categories: Category[];
};

export function BlogSearchWrapper({ posts, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query) ||
      post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <HugeiconsIcon
            icon={Search01Icon}
            className="h-4 w-4 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <Input
          type="search"
          placeholder="Search articles by title, category, or tag..."
          className="pl-9 bg-card"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="mx-auto w-full max-w-4xl">
        <CategoryNav categories={categories} />
      </div>

      {/* Post list */}
      <div className="mx-auto w-full max-w-4xl">
        <PostList
          posts={filteredPosts}
          emptyMessage={
            searchQuery
              ? "No posts found matching your search."
              : "No posts published yet."
          }
        />
      </div>
    </div>
  );
}

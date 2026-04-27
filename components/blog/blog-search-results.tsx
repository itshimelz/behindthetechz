"use client";

import { PostList } from "@/components/blog/post-list";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Post } from "@/lib/blog/types";
import { SORT_OPTIONS, type SortOption } from "@/components/blog/use-blog-search-filters";

type BlogSearchResultsProps = {
  filteredPosts: Post[];
  currentPosts: Post[];
  tagParam: string | null;
  sortBy: SortOption;
  hasActiveFilters: boolean;
  onSortChange: (sortBy: SortOption) => void;
  onReset: () => void;
};

export function BlogSearchResults({
  filteredPosts,
  currentPosts,
  tagParam,
  sortBy,
  hasActiveFilters,
  onSortChange,
  onReset,
}: BlogSearchResultsProps) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Articles
          </span>
          <div className="h-px w-12 bg-border/60 sm:w-24" />
          <p className="truncate text-sm text-muted-foreground">
            {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort</span>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger className="h-8 w-34">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters ? (
            <button
              onClick={onReset}
              className="inline-flex items-center rounded-full border border-border/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Reset
            </button>
          ) : null}
        </div>
      </div>
      <div className="rounded-3xl">
        <PostList
          posts={currentPosts}
          emptyMessage={
            tagParam ? "No posts found for this tag." : "No posts published yet."
          }
        />
      </div>
    </div>
  );
}

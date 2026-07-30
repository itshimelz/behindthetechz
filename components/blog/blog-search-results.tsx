"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LayoutGridIcon, Menu01Icon } from "@hugeicons/core-free-icons";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <div className="flex flex-col gap-3 border-b border-border/40 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Articles
          </span>
          <div className="h-px w-12 bg-border/60 sm:w-24" />
          <p className="truncate text-xs sm:text-sm font-medium text-muted-foreground">
            {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* View Switcher: Grid vs List */}
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View (Home Style)"
              aria-label="Grid View"
            >
              <HugeiconsIcon icon={LayoutGridIcon} className="size-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-background text-foreground shadow-xs border border-border/50 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
              aria-label="List View"
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <div className="h-4 w-px bg-border/60" />

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Sort</span>
            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className="h-8 w-34 text-xs font-medium">
                <SelectValue>
                  {SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Newest"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

      <div>
        <PostList
          posts={currentPosts}
          viewMode={viewMode}
          emptyMessage={
            tagParam ? "No posts found for this tag." : "No posts published yet."
          }
        />
      </div>
    </div>
  );
}

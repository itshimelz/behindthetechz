"use client";

import Link from "next/link";
import { CategoryNav } from "@/components/blog/category-nav";
import { BlogPaginationControls } from "@/components/blog/blog-pagination-controls";
import { BlogSearchResults } from "@/components/blog/blog-search-results";
import { BlogTagFilterChip } from "@/components/blog/blog-tag-filter-chip";
import {
  useBlogSearchFilters,
  type SortOption,
} from "@/components/blog/use-blog-search-filters";
import type { Category, Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
  categories: Category[];
};

export function BlogSearchWrapper({ posts, categories }: Props) {
  const {
    tagParam,
    sortBy,
    setSortBy,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    clearTag,
    clearAllFilters,
    filteredPosts,
    currentPosts,
    totalPages,
    effectivePage,
    handlePageChange,
    topTags,
    topCategories,
    hasActiveFilters,
    hasFilterChips,
  } = useBlogSearchFilters({ posts, categories });

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full max-w-6xl py-2">
        <CategoryNav categories={categories} />
      </div>

      {hasFilterChips ? (
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2">
          {tagParam ? <BlogTagFilterChip tag={tagParam} onClear={clearTag} /> : null}
        </div>
      ) : null}

      <BlogSearchResults
        filteredPosts={filteredPosts}
        currentPosts={currentPosts}
        tagParam={tagParam}
        sortBy={sortBy}
        hasActiveFilters={hasActiveFilters}
        onSortChange={(value: SortOption) => {
          setSortBy(value);
          setCurrentPage(1);
        }}
        onReset={clearAllFilters}
      />

      {filteredPosts.length === 0 && tagParam ? (
        <div className="mx-auto w-full max-w-4xl rounded-xl border border-border/60 bg-card/30 p-4 sm:p-5">
          <p className="text-sm font-medium text-foreground">
            Try another tag or browse categories.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump into popular tags and categories below.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {topCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <button
            onClick={clearAllFilters}
            className="mt-4 inline-flex items-center rounded-full border border-border/70 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            Reset filters
          </button>
        </div>
      ) : null}

      {filteredPosts.length > 0 && (
        <BlogPaginationControls
          filteredCount={filteredPosts.length}
          currentCount={currentPosts.length}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          totalPages={totalPages}
          effectivePage={effectivePage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

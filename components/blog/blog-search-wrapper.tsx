"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { CategoryNav } from "@/components/blog/category-nav";
import { PostList } from "@/components/blog/post-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Post, Category } from "@/lib/blog/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE_STORAGE_KEY = "blog-items-per-page";
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 40] as const;
const DEFAULT_SORT = "newest" as const;

type SortOption = "newest" | "oldest" | "most-viewed" | "most-clapped";

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-viewed", label: "Most viewed" },
  { value: "most-clapped", label: "Most clapped" },
];

type Props = {
  posts: Post[];
  categories: Category[];
};

function toTagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function BlogSearchWrapper({ posts, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");

  const initialSort = isSortOption(searchParams.get("sort"))
    ? (searchParams.get("sort") as SortOption)
    : DEFAULT_SORT;
  const initialPage = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );

  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [itemsPerPage, setItemsPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 10;

    const savedValue = window.localStorage.getItem(ITEMS_PER_PAGE_STORAGE_KEY);
    const parsedValue = Number(savedValue);

    if (
      ITEMS_PER_PAGE_OPTIONS.includes(
        parsedValue as (typeof ITEMS_PER_PAGE_OPTIONS)[number],
      )
    ) {
      return parsedValue;
    }

    return 10;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      ITEMS_PER_PAGE_STORAGE_KEY,
      String(itemsPerPage),
    );
  }, [itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");

    if (sortBy !== DEFAULT_SORT) params.set("sort", sortBy);
    else params.delete("sort");

    if (currentPage > 1) params.set("page", String(currentPage));
    else params.delete("page");

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `/blog?${next}` : "/blog", { scroll: false });
    }
  }, [searchParams, sortBy, currentPage, router]);

  const clearTag = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    params.delete("page");
    setCurrentPage(1);
    router.push(params.toString() ? `/blog?${params.toString()}` : "/blog", {
      scroll: false,
    });
  };

  const clearAllFilters = () => {
    setSortBy(DEFAULT_SORT);
    setCurrentPage(1);
    router.push("/blog", { scroll: false });
  };

  const normalizedTag = tagParam?.trim().toLowerCase() ?? "";

  const topTags = useMemo(() => {
    const counts = new Map<string, { slug: string; count: number }>();

    for (const post of posts) {
      for (const tag of post.tags) {
        const key = tag.toLowerCase();
        const current = counts.get(key);
        if (current) {
          current.count += 1;
        } else {
          counts.set(key, { slug: toTagSlug(tag), count: 1 });
        }
      }
    }

    return [...counts.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([label, value]) => ({ label, slug: value.slug }));
  }, [posts]);

  const topCategories = useMemo(
    () => [...categories].sort((a, b) => b.count - a.count).slice(0, 4),
    [categories],
  );

  const filteredPosts = useMemo(() => {
    const base = posts.filter((post) => {
      if (!normalizedTag) return true;
      return post.tags.some(
        (tag) =>
          tag.toLowerCase() === normalizedTag || toTagSlug(tag) === normalizedTag,
      );
    });

    const arr = [...base];

    switch (sortBy) {
      case "oldest":
        arr.sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "most-viewed":
        arr.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "most-clapped":
        arr.sort((a, b) => b.clapCount - a.clapCount);
        break;
      case "newest":
      default:
        arr.sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
    }

    return arr;
  }, [posts, normalizedTag, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const effectivePage = Math.min(currentPage, totalPages);

  const currentPosts = useMemo(() => {
    const startIndex = (effectivePage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, effectivePage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters = Boolean(
    normalizedTag || sortBy !== DEFAULT_SORT || currentPage > 1,
  );
  const hasFilterChips = Boolean(normalizedTag);

  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full max-w-4xl py-2">
        <CategoryNav categories={categories} />
      </div>

      {hasFilterChips ? (
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-2">
          {tagParam ? (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-1 pl-3 pr-2 text-sm font-medium text-primary shadow-sm shadow-primary/5 transition-colors">
              Tag: {tagParam}
              <button
                onClick={clearTag}
                className="rounded-full p-0.5 transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={`Clear ${tagParam} tag filter`}
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

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
            <Select
              value={sortBy}
              onValueChange={(value) => {
                if (!isSortOption(value)) return;
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
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
                onClick={clearAllFilters}
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
              tagParam
                ? "No posts found for this tag."
                : "No posts published yet."
            }
          />
        </div>
      </div>

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
        <div className="mx-auto w-full max-w-4xl pt-8 pb-10">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {currentPosts.length} of {filteredPosts.length} posts
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Per page</span>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-22">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(effectivePage - 1);
                    }}
                    className={
                      effectivePage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (totalPages > 7) {
                      if (
                        page !== 1 &&
                        page !== totalPages &&
                        Math.abs(page - effectivePage) > 1
                      ) {
                        if (
                          page === effectivePage - 2 ||
                          page === effectivePage + 2
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      }
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={effectivePage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(effectivePage + 1);
                    }}
                    className={
                      effectivePage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}

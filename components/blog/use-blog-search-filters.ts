"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import type { Category, Post } from "@/lib/blog/types";

const ITEMS_PER_PAGE_STORAGE_KEY = "blog-items-per-page";
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30, 40] as const;
export const DEFAULT_SORT = "newest" as const;

export type SortOption = "newest" | "oldest" | "most-viewed" | "most-clapped";

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "most-viewed", label: "Most viewed" },
  { value: "most-clapped", label: "Most clapped" },
];

function toTagSlug(tag: string): string {
  return tag.trim().toLowerCase().replace(/\s+/g, "-");
}

function isSortOption(value: string | null): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value);
}

type UseBlogSearchFiltersParams = {
  posts: Post[];
  categories: Category[];
};

export function useBlogSearchFilters({
  posts,
  categories,
}: UseBlogSearchFiltersParams) {
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
        arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "most-viewed":
        arr.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "most-clapped":
        arr.sort((a, b) => b.clapCount - a.clapCount);
        break;
      case "newest":
      default:
        arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  return {
    tagParam,
    sortBy,
    setSortBy,
    currentPage,
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
    hasActiveFilters: Boolean(
      normalizedTag || sortBy !== DEFAULT_SORT || currentPage > 1,
    ),
    hasFilterChips: Boolean(normalizedTag),
  };
}

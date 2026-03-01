"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
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

type Props = {
  posts: Post[];
  categories: Category[];
};

export function BlogSearchWrapper({ posts, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");

  const [searchQuery, setSearchQuery] = useState(tagParam || "");
  const [prevTagParam, setPrevTagParam] = useState(tagParam);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL tag parameter with local search state without useEffect
  if (tagParam !== prevTagParam) {
    setPrevTagParam(tagParam);
    setSearchQuery(tagParam || "");
    setCurrentPage(1);
  }

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

  const clearTag = () => {
    setSearchQuery("");
    router.push("/blog", { scroll: false });
  };

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }, [posts, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPosts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Smooth scroll to top of calculations/results area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Input */}
      <div className="relative mx-auto w-full max-w-4xl">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <HugeiconsIcon
            icon={Search01Icon}
            className="h-5 w-5 text-muted-foreground"
            strokeWidth={2}
          />
        </div>
        <Input
          type="search"
          placeholder="Search articles by title, category, or tag..."
          className="pl-12 h-14 rounded-2xl bg-card border-border/50 text-base transition-colors focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Category filter */}
      <div className="mx-auto w-full max-w-4xl py-2">
        <CategoryNav categories={categories} />
      </div>

      {/* Active tag indicator */}
      {tagParam && (
        <div className="mx-auto w-full max-w-4xl flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Filtering by tag:
          </span>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 pl-3 pr-2 py-1 text-sm font-medium text-primary transition-colors">
            {tagParam}
            <button
              onClick={clearTag}
              className="rounded-full p-0.5 hover:bg-primary/20 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={`Clear ${tagParam} tag filter`}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Post list */}
      <div className="mx-auto w-full max-w-4xl">
        <PostList
          posts={currentPosts}
          searchQuery={searchQuery}
          emptyMessage={
            searchQuery
              ? "No posts found matching your search."
              : "No posts published yet."
          }
        />
      </div>

      {/* Pagination */}
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
                <SelectTrigger className="h-8 w-[88px]">
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
                      handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Only show a few pages if there are many
                    if (totalPages > 7) {
                      if (
                        page !== 1 &&
                        page !== totalPages &&
                        Math.abs(page - currentPage) > 1
                      ) {
                        if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
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
                          isActive={currentPage === page}
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
                      handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
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

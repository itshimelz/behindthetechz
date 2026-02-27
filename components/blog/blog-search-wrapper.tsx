"use client";

import { useState, useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { CategoryNav } from "@/components/blog/category-nav";
import { PostList } from "@/components/blog/post-list";
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

type Props = {
  posts: Post[];
  categories: Category[];
};

export function BlogSearchWrapper({ posts, categories }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
  }, [filteredPosts, currentPage]);

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

      {/* Post list */}
      <div className="mx-auto w-full max-w-4xl">
        <PostList
          posts={currentPosts}
          emptyMessage={
            searchQuery
              ? "No posts found matching your search."
              : "No posts published yet."
          }
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mx-auto w-full max-w-4xl pt-8 pb-10">
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
        </div>
      )}
    </div>
  );
}

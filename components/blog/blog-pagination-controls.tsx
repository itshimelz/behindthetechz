"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITEMS_PER_PAGE_OPTIONS } from "@/components/blog/use-blog-search-filters";

type BlogPaginationControlsProps = {
  filteredCount: number;
  currentCount: number;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  totalPages: number;
  effectivePage: number;
  onPageChange: (page: number) => void;
};

export function BlogPaginationControls({
  filteredCount,
  currentCount,
  itemsPerPage,
  setItemsPerPage,
  totalPages,
  effectivePage,
  onPageChange,
}: BlogPaginationControlsProps) {
  return (
    <div className="mx-auto w-full max-w-4xl pt-8 pb-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {currentCount} of {filteredCount} posts
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Per page</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => setItemsPerPage(Number(value))}
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
                  onPageChange(effectivePage - 1);
                }}
                className={
                  effectivePage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (totalPages > 7) {
                if (
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - effectivePage) > 1
                ) {
                  if (page === effectivePage - 2 || page === effectivePage + 2) {
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
                      onPageChange(page);
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(effectivePage + 1);
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
  );
}

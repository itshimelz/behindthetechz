"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  activeSlug?: string;
};

function CategoryBadge({
  cat,
  isActive,
  size = "md",
}: {
  cat: Category;
  isActive: boolean;
  size?: "sm" | "md";
}) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={cn(
        "cursor-pointer transition-all rounded-full font-medium border",
        size === "md"
          ? "px-2.5 py-1 text-xs sm:px-4 sm:py-1.5 sm:text-sm"
          : "px-2 py-0.5 text-[11px]",
        isActive
          ? size === "md"
            ? "shadow-md hover:shadow-lg"
            : "shadow-sm"
          : "hover:bg-muted/80 text-foreground/90 border-border/40",
      )}
    >
      {cat.name}
      <span
        className={cn(
          "rounded-full leading-none",
          size === "md"
            ? "ml-1 px-1 py-0.5 text-[9px] sm:ml-1.5 sm:px-1.5 sm:text-[10px]"
            : "ml-1 px-1 py-0.5 text-[9px]",
          isActive ? "bg-primary-foreground/20" : "bg-background/50",
        )}
      >
        {cat.count}
      </span>
    </Badge>
  );
}

export function CategoryNav({ categories, activeSlug }: Props) {
  const router = useRouter();
  const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
  const displayCategories = sortedCategories.slice(0, 4);
  const hiddenCategories = sortedCategories.slice(4);
  const hasMore = categories.length > 4;
  const moreCount = categories.length - 4;

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:overflow-visible sm:items-center sm:justify-start sm:gap-2.5">
      <Link href="/blog" className="shrink-0">
        <Badge
          variant={!activeSlug ? "default" : "secondary"}
          className={`cursor-pointer transition-all ${
            !activeSlug
              ? "shadow-md hover:shadow-lg"
              : "bg-card text-muted-foreground hover:bg-muted/80 border border-border/40 hover:border-border/80"
          } rounded-full px-2.5 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm`}
        >
          All
        </Badge>
      </Link>
      {displayCategories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/categories/${cat.slug}`}
          className="shrink-0"
        >
          <CategoryBadge cat={cat} isActive={activeSlug === cat.slug} size="md" />
        </Link>
      ))}
      {hasMore && (
        <HoverCard>
          <HoverCardTrigger
            onClick={() => router.push("/categories")}
            className="shrink-0"
          >
            <Badge
              variant="secondary"
              className="cursor-pointer bg-card text-muted-foreground hover:bg-muted/80 border border-dashed border-border/80 hover:border-border rounded-full px-2.5 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm transition-all"
            >
              + {moreCount} more
            </Badge>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-auto p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">
                More Categories
              </h4>
              <div className="flex flex-wrap gap-2 pt-1 max-w-[280px]">
                {hiddenCategories.map((cat) => (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                    <CategoryBadge cat={cat} isActive={activeSlug === cat.slug} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}

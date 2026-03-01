import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Category } from "@/lib/blog/types";
import { getCategoryColorClass, cn } from "@/lib/utils";

type Props = {
  categories: Category[];
  activeSlug?: string;
};

export function CategoryNav({ categories, activeSlug }: Props) {
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
          <Badge
            variant={activeSlug === cat.slug ? "default" : "secondary"}
            className={cn(
              "cursor-pointer transition-all rounded-full px-2.5 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm border",
              activeSlug === cat.slug
                ? "shadow-md hover:shadow-lg"
                : cn("hover:opacity-80", getCategoryColorClass(cat.name)),
            )}
          >
            {cat.name}
            <span
              className={cn(
                "ml-1 rounded-full px-1 py-0.5 text-[9px] leading-none sm:ml-1.5 sm:px-1.5 sm:text-[10px]",
                activeSlug === cat.slug
                  ? "bg-primary-foreground/20"
                  : "bg-background/50",
              )}
            >
              {cat.count}
            </span>
          </Badge>
        </Link>
      ))}
      {hasMore && (
        <HoverCard>
          <HoverCardTrigger>
            <Link href="/categories" className="shrink-0">
              <Badge
                variant="secondary"
                className="cursor-pointer bg-card text-muted-foreground hover:bg-muted/80 border border-dashed border-border/80 hover:border-border rounded-full px-2.5 py-1 text-xs font-medium sm:px-4 sm:py-1.5 sm:text-sm transition-all"
              >
                + {moreCount} more
              </Badge>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-auto p-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium leading-none">
                More Categories
              </h4>
              <div className="flex flex-wrap gap-2 pt-1 max-w-[280px]">
                {hiddenCategories.map((cat) => (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                    <Badge
                      variant={
                        activeSlug === cat.slug ? "default" : "secondary"
                      }
                      className={cn(
                        "cursor-pointer transition-all rounded-full px-2 py-0.5 text-[11px] font-medium border",
                        activeSlug === cat.slug
                          ? "shadow-sm"
                          : cn(
                              "hover:opacity-80",
                              getCategoryColorClass(cat.name),
                            ),
                      )}
                    >
                      {cat.name}
                      <span
                        className={cn(
                          "ml-1 rounded-full px-1 py-0.5 text-[9px] leading-none",
                          activeSlug === cat.slug
                            ? "bg-primary-foreground/20"
                            : "bg-background/50",
                        )}
                      >
                        {cat.count}
                      </span>
                    </Badge>
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

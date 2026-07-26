import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

type HomeDiscoveryStripProps = {
  categories: Category[];
};

export function HomeDiscoveryStrip({ categories }: HomeDiscoveryStripProps) {
  return (
    <section className="w-full rounded-3xl border border-border/50 bg-gradient-to-r from-muted/20 via-background to-background p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3 max-w-xl">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Concept Taxonomy & Core Themes
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Badge
                  key={category.slug}
                  variant="secondary"
                  render={<Link href={`/categories/${category.slug}`} />}
                  className={cn(
                    "rounded-full border border-border/40 px-3.5 py-1 text-xs font-medium transition-transform duration-150 hover:-translate-y-0.5 hover:bg-muted/80 text-foreground/90",
                  )}
                >
                  {category.name}
                  {category.count ? (
                    <span className="ml-1.5 rounded-full bg-background/60 px-1.5 py-0.2 text-[10px] text-muted-foreground">
                      {category.count}
                    </span>
                  ) : null}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            render={<Link href="/graph" />}
            variant="outline"
            className="rounded-full px-5 font-medium border-border/80 transition-transform duration-200 hover:-translate-y-0.5"
          >
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-4" strokeWidth={2} />
            Interactive Graph
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </section>
  );
}

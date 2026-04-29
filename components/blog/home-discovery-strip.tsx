import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/blog/types";
import { cn, getCategoryColorClass } from "@/lib/utils";

type HomeDiscoveryStripProps = {
  categories: Category[];
};

export function HomeDiscoveryStrip({ categories }: HomeDiscoveryStripProps) {
  return (
    <section className="w-full bg-card px-5 py-2 sm:px-7 md:px-8 md:py-2 dark:bg-transparent">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Explore by topic
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Badge
                  key={category.slug}
                  variant="secondary"
                  render={<Link href={`/categories/${category.slug}`} />}
                  className={cn(
                    "rounded-full border px-3 py-1 font-medium",
                    getCategoryColorClass(category.name),
                  )}
                >
                  {category.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No categories yet.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            render={<Link href="/graph" />}
            variant="outline"
            className="rounded-full"
          >
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-4" />
            Graph view
            <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

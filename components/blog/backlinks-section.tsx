"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link04Icon,
  ArrowUpRight01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";
import { postPath } from "@/lib/blog/post-path";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Backlink = {
  slug: string;
  title: string;
};

type Props = {
  backlinks: Backlink[];
};

export function BacklinksSection({ backlinks }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!backlinks || backlinks.length === 0) return null;

  const COLLAPSED_COUNT = 6;
  const hasMore = backlinks.length > COLLAPSED_COUNT;
  const visibleLinks = backlinks.slice(0, COLLAPSED_COUNT);

  return (
    <div className="mx-auto w-full max-w-3xl border-t border-border/60 pt-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <HugeiconsIcon icon={Link04Icon} className="size-4 text-primary" strokeWidth={2} />
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Linked From ({backlinks.length})
        </h3>
      </div>

      {/* Clean, Borderless Links List with Brand Blue Color */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
        {visibleLinks.map((bl) => (
          <Link
            key={bl.slug}
            href={postPath(bl.slug)}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground hover:text-primary transition-colors py-0.5"
          >
            <HugeiconsIcon
              icon={ChartBubble02Icon}
              className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
              strokeWidth={2}
            />
            <span className="underline underline-offset-4 decoration-border group-hover:decoration-primary transition-colors">
              {bl.title}
            </span>
            <HugeiconsIcon
              icon={ArrowUpRight01Icon}
              className="size-3.5 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2}
            />
          </Link>
        ))}

        {hasMore && (
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors cursor-pointer py-0.5"
          >
            + {backlinks.length - COLLAPSED_COUNT} more
          </button>
        )}
      </div>

      {/* Dialog for all backlinks */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl p-6">
          <DialogHeader className="gap-1.5 text-left">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <HugeiconsIcon icon={Link04Icon} className="size-4" strokeWidth={2} />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Linked From ({backlinks.length})
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              All articles referencing this dispatch across the knowledge graph.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-72 overflow-y-auto pr-1 mt-2">
            <ul className="divide-y divide-border/40">
              {backlinks.map((bl) => (
                <li key={bl.slug} className="py-2.5 first:pt-0 last:pb-0">
                  <Link
                    href={postPath(bl.slug)}
                    onClick={() => setDialogOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60 group text-foreground hover:text-primary"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <HugeiconsIcon
                        icon={ChartBubble02Icon}
                        className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                        strokeWidth={2}
                      />
                      <span className="truncate text-xs font-medium underline underline-offset-4 decoration-border group-hover:decoration-primary transition-colors">
                        {bl.title}
                      </span>
                    </div>
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

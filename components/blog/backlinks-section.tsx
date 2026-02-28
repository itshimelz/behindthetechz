"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, LinkSquare02Icon } from "@hugeicons/core-free-icons";

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

  const COLLAPSED_COUNT = 5;
  const hasMore = backlinks.length > COLLAPSED_COUNT;
  const visibleLinks = backlinks.slice(0, COLLAPSED_COUNT);

  return (
    <div className="mx-auto w-full max-w-3xl border-t pt-6">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Linked from ({backlinks.length})
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        {visibleLinks.map((bl) => (
          <Link
            key={bl.slug}
            href={`/blog/${bl.slug}`}
            className="hover:bg-muted rounded-md border border-border bg-background px-3 py-1.5 text-sm transition-colors"
          >
            {bl.title}
          </Link>
        ))}

        {hasMore && (
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1 hover:bg-muted rounded-md border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors"
          >
            + {backlinks.length - COLLAPSED_COUNT} more
          </button>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Linked from</DialogTitle>
            <DialogDescription>
              All {backlinks.length} posts that link to this page.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto">
            <ul className="divide-y divide-border">
              {backlinks.map((bl) => (
                <li key={bl.slug} className="py-2.5">
                  <Link
                    href={`/blog/${bl.slug}`}
                    onClick={() => setDialogOpen(false)}
                    className="flex items-center gap-2 min-w-0 flex-1 group"
                  >
                    <HugeiconsIcon
                      icon={LinkSquare02Icon}
                      className="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
                      strokeWidth={2}
                    />
                    <span className="truncate text-sm font-medium group-hover:text-primary transition-colors flex-1">
                      {bl.title}
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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

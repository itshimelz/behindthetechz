"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Notebook01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { postPath } from "@/lib/blog/post-path";
import type { SeriesWithPosts } from "@/lib/blog/get-series";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  series: SeriesWithPosts;
  currentSlug: string;
};

export function SeriesNav({ series, currentSlug }: Props) {
  const currentIndex = series.posts.findIndex((p) => p.slug === currentSlug);
  const totalPosts = series.posts.length;
  const partNumber = currentIndex !== -1 ? currentIndex + 1 : 1;
  const progressPercent = Math.round((partNumber / totalPosts) * 100);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:border-border"
          />
        }
      >
        <HugeiconsIcon icon={Notebook01Icon} className="size-3 text-primary" strokeWidth={2} />
        <span className="font-semibold text-foreground/90">{series.name}</span>
        <span className="text-muted-foreground">· Part {partNumber} of {totalPosts}</span>
        <HugeiconsIcon icon={UnfoldMoreIcon} className="size-3 text-muted-foreground ml-0.5" strokeWidth={2} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80 p-2 sm:w-96">
        <DropdownMenuGroup>
          <div className="p-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-muted-foreground">Series Progress</span>
              <span className="text-foreground font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto space-y-0.5 p-1">
          <DropdownMenuLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Series Outline ({totalPosts} Parts)
          </DropdownMenuLabel>
          {series.posts.map((post, i) => {
            const isCurrent = post.slug === currentSlug;
            const isPast = i < currentIndex;

            return (
              <DropdownMenuItem
                key={post.slug}
                className={cn(
                  "p-2 rounded-lg cursor-pointer flex items-center justify-between gap-2.5 text-xs",
                  isCurrent && "bg-primary/10 text-primary font-semibold focus:bg-primary/15"
                )}
                render={isCurrent ? <div /> : <Link href={postPath(post.slug)} />}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "flex size-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium border",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground font-bold"
                        : isPast
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/80 text-muted-foreground"
                    )}
                  >
                    {isPast ? (
                      <HugeiconsIcon icon={Tick02Icon} className="size-2.5" strokeWidth={2.5} />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className={cn("truncate", isPast && "line-through opacity-75")}>
                    {post.title}
                  </span>
                </div>

                {post.readingTime && (
                  <span className="text-[10px] text-muted-foreground/80 shrink-0">
                    {post.readingTime}m
                  </span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChartBubble02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { postPath } from "@/lib/blog/post-path";
import type { FeaturedHeroItem } from "@/lib/blog/get-featured-hero-data";

type Props = {
  items: FeaturedHeroItem[];
};

export function HomeHeroMinimal({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[activeIndex] || items[0];

  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-[#FAF8F5] p-6 text-foreground dark:bg-zinc-900/60 dark:border-zinc-800">
      {/* Background brand artwork accent on the right */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 opacity-30 dark:opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-primary/10 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 size-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-3xl" />

      {/* Top Header Row with Category Badge & Discrete Navigation Dots */}
      <div className="relative z-10 flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary dark:bg-primary/20 dark:text-primary border border-primary/25">
            <HugeiconsIcon icon={SparklesIcon} className="size-3 text-primary" strokeWidth={2} />
            Featured Essay
          </span>
          <span className="text-xs font-serif italic text-muted-foreground/80 hidden sm:inline">
            Best of behind the TechZ Selection
          </span>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-1.5" aria-label="Featured essays switcher">
            {items.map((item, idx) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View essay ${idx + 1}: ${item.title}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  idx === activeIndex
                    ? "w-5 bg-foreground"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-4 max-w-3xl pt-1">
        {/* Dynamic Title */}
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
          <Link
            href={postPath(currentItem.slug)}
            className="hover:underline underline-offset-4 decoration-foreground/30 transition-all"
          >
            {currentItem.title}
          </Link>
        </h2>

        {/* Dynamic Excerpt Body */}
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3">
          {currentItem.excerpt}
        </p>

        {/* Metadata Line */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>by </span>
          <Link href="/about" className="font-medium text-foreground hover:underline">
            {currentItem.author}
          </Link>
          <span>·</span>
          <span className="font-medium text-foreground/90 uppercase tracking-wider text-[10px] bg-muted/60 px-2 py-0.5 rounded border border-border/40">
            {currentItem.category}
          </span>
          <span>·</span>
          <span>{currentItem.readingTime} min read</span>
        </div>

        {/* Dynamic Insights / Previews (Clean without raw numeric prefixes) */}
        {currentItem.insights && currentItem.insights.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-border/50 text-xs text-muted-foreground">
            {currentItem.insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="font-medium text-foreground/90 shrink-0">
                  {insight.label}:
                </span>
                <span className="line-clamp-1 italic text-muted-foreground/90">
                  &ldquo;{insight.text}&rdquo;
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href={postPath(currentItem.slug)}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            Read Full Essay
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" strokeWidth={2} />
          </Link>
          <Link
            href={`/graph?focus=${currentItem.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-3.5" strokeWidth={2} />
            Explore Graph
          </Link>
        </div>
      </div>
    </section>
  );
}

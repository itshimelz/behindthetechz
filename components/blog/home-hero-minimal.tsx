"use client";

import { useState } from "react";
import Link from "next/link";
import { postPath } from "@/lib/blog/post-path";
import { formatPostDate } from "@/lib/format-date";
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
    <section className="relative w-full py-4 sm:py-6 text-foreground border-none">
      {/* 2-Column Grid matching reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        {/* Left Column: Post details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 sm:space-y-5 py-1">
          <div className="space-y-3 sm:space-y-4">
            {/* Category Tag with Green Accent Underline */}
            <div className="w-fit">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground border-b-2 border-emerald-600 dark:border-emerald-500 pb-0.5 inline-block">
                {currentItem.category}
              </span>
            </div>

            {/* Headline / Title */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-[1.18] sm:leading-[1.15]">
              <Link
                href={postPath(currentItem.slug)}
                className="hover:underline underline-offset-4 decoration-foreground/30 transition-all"
              >
                {currentItem.title}
              </Link>
            </h2>

            {/* Excerpt Body */}
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-4 font-normal">
              {currentItem.excerpt}
            </p>
          </div>

          {/* Author & Date Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground pt-2">
            {currentItem.authorAvatar ? (
              <img
                src={currentItem.authorAvatar}
                alt={currentItem.author}
                className="size-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="size-5 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] shrink-0 text-foreground">
                {currentItem.author[0]}
              </div>
            )}
            <span className="font-bold uppercase tracking-wider text-foreground text-[11px]">
              {currentItem.author}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <time dateTime={currentItem.date} className="uppercase tracking-wider text-[11px] font-medium text-muted-foreground">
              {formatPostDate(currentItem.date, { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
            </time>

            {/* Discrete Navigation Dots (if multiple featured items exist) */}
            {items.length > 1 && (
              <div className="ml-auto flex items-center gap-1.5" aria-label="Featured essays switcher">
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
        </div>

        {/* Right Column: Featured Image (No Border) */}
        <div className="lg:col-span-5">
          <Link
            href={postPath(currentItem.slug)}
            className="group relative block w-full h-full min-h-[240px] sm:min-h-[300px] rounded-xl overflow-hidden bg-muted/20 border-none"
          >
            <img
              src={currentItem.coverImage || "/images/placeholder.png"}
              alt={currentItem.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

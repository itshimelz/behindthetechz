import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryColorClass, cn } from "@/lib/utils";

export default async function HomePage() {
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);
  const latestPosts = allPosts.slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-6 py-6 md:py-20 flex flex-col">
      {/* Sticky identity bar (mobile only) */}
      <div className="sticky top-0 z-40 -mx-6 flex items-center gap-4 bg-background/95 px-6 py-2 backdrop-blur supports-backdrop-filter:bg-background/60 md:static md:mx-0 md:bg-transparent md:p-0 md:backdrop-blur-none transition-colors">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-background shrink-0">
          <Image
            src="/logo.png"
            alt="TechZ Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            behind the TechZ
          </h1>
          <p className="text-muted-foreground text-sm md:text-base mt-1">
            By Rahat Hossain Himel
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="space-y-6 mt-8 md:mt-10">
        <p className="text-muted-foreground text-lg leading-relaxed">
          A minimal knowledge-focused space for development guides, engineering
          stories, and experiments from day-to-day software building.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-4">
          <Link href="/blog">
            <Button className="rounded-full">
              Read Blog
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/graph">
            <Button variant="outline" className="rounded-full">
              <HugeiconsIcon
                icon={ChartBubble02Icon}
                className="mr-2 h-4 w-4"
              />
              Graph Map
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="rounded-full">
              About Me
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="space-y-8 mt-16 md:mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Recent Writings
          </h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            View all archive
            <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-1 text-foreground">
                    {post.title}
                  </h3>
                  <span className="text-sm italic text-muted-foreground shrink-0 tabular-nums">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <span className="mx-1">·</span>
                    {post.readingTime} min read
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No posts published yet.
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6 text-foreground mt-16 md:mt-24">
        <h2 className="text-2xl font-semibold tracking-tight">
          Explore Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`}>
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-md px-3 py-1.5 font-normal hover:opacity-80 transition-colors text-sm border",
                    getCategoryColorClass(category.name),
                  )}
                >
                  {category.name}
                  <span className="text-foreground/70 ml-1.5 text-xs bg-background/50 px-1.5 py-0.5 rounded-sm">
                    {category.count}
                  </span>
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No categories yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

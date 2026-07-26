import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  SparklesIcon,
  Home01Icon,
  Book02Icon,
  ChartBubble02Icon,
  Folder01Icon,
  Bookmark02Icon,
  Notebook01Icon,
} from "@hugeicons/core-free-icons";

import { HomeFeaturedPosts } from "@/components/blog/home-featured-posts";
import { HomeHeroMinimal } from "@/components/blog/home-hero-minimal";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getFeaturedHeroItems } from "@/lib/blog/get-featured-hero-data";
import { getAllSeries } from "@/lib/blog/get-series";
import { postPath } from "@/lib/blog/post-path";

export default async function HomePage() {
  const [allPosts, allSeries, featuredHeroItems] = await Promise.all([
    getAllPosts(),
    getAllSeries(),
    getFeaturedHeroItems(),
  ]);

  return (
    <div
      data-pretext-root="home"
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8"
    >
      <PretextArticleEnhancer
        targetSelector='[data-pretext-root="home"]'
        headingSelector="h1, h2, h3"
        measureSelector="p"
      />

      {/* Main Grid: LessWrong Sidebar + Feed */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Desktop Sidebar Navigation Column */}
        <aside className="hidden lg:col-span-3 lg:block sticky top-20 h-fit space-y-6 text-sm text-muted-foreground pr-2 border-r border-border/40">
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-medium text-foreground bg-muted/60"
            >
              <HugeiconsIcon icon={Home01Icon} className="size-4 text-foreground" strokeWidth={2} />
              <span>Home</span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
            >
              <HugeiconsIcon icon={Book02Icon} className="size-4" strokeWidth={2} />
              <span>All Articles</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
            >
              <HugeiconsIcon icon={Folder01Icon} className="size-4" strokeWidth={2} />
              <span>Categories</span>
            </Link>
          </div>

          {/* Library Section */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Library
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-3.5" strokeWidth={2} />
                  Featured Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/graph"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={ChartBubble02Icon} className="size-3.5" strokeWidth={2} />
                  Knowledge Graph
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={SparklesIcon} className="size-3.5" strokeWidth={2} />
                  Topics & Tags
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Series Section */}
          {allSeries.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                Series & Multi-part Guides
              </p>
              <ul className="space-y-1 text-xs">
                {allSeries.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={s.firstPostSlug ? postPath(s.firstPostSlug) : `/blog?search=${encodeURIComponent(s.name)}`}
                      className="flex items-center justify-between gap-1.5 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <HugeiconsIcon icon={Notebook01Icon} className="size-3.5 shrink-0 text-foreground/80" strokeWidth={2} />
                        <span className="truncate font-medium">{s.name}</span>
                      </span>
                      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shrink-0">
                        {s.postCount} {s.postCount === 1 ? "part" : "parts"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content Feed Area (LessWrong Style) */}
        <main className="col-span-12 lg:col-span-9 space-y-8">
          {/* Featured Essay Banner */}
          <SectionReveal>
            <HomeHeroMinimal items={featuredHeroItems} />
          </SectionReveal>

          {/* Curated Grid */}
          <SectionReveal delay={0.02}>
            <HomeFeaturedPosts posts={allPosts} />
          </SectionReveal>

          {/* Archive Exploration CTA Banner */}
          <SectionReveal delay={0.08}>
            <section className="w-full rounded-2xl border border-border/60 bg-card p-6 dark:bg-zinc-900/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <HugeiconsIcon icon={SparklesIcon} className="size-4 text-foreground" strokeWidth={2} />
                    Looking for specific engineering topics?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Browse our full archive of articles, categories, and connected tags.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Button
                    render={<Link href="/blog" />}
                    variant="outline"
                    className="rounded-full px-5 font-medium border-border/80 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Open Archive
                    <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" strokeWidth={2} />
                  </Button>
                </div>
              </div>
            </section>
          </SectionReveal>
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

import { HomeFeaturedPosts } from "@/components/blog/home-featured-posts";
import { HomeHeroMinimal } from "@/components/blog/home-hero-minimal";
import { HomeTiltedBanner } from "@/components/blog/home-tilted-banner";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getFeaturedHeroItems } from "@/lib/blog/get-featured-hero-data";

export default async function HomePage() {
  const [allPosts, featuredHeroItems] = await Promise.all([
    getAllPosts(),
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

      {/* Main Content Feed Area (Full Width) */}
      <main className="w-full space-y-8">
        {/* Featured Essay Hero */}
        <HomeHeroMinimal items={featuredHeroItems} />

        {/* Mid-Page Tilted Banner Section */}
        <HomeTiltedBanner />

        {/* Curated Grid */}
        <HomeFeaturedPosts posts={allPosts} />

        {/* Archive Exploration CTA Banner */}
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
      </main>
    </div>
  );
}

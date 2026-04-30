import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HomeDiscoveryStrip } from "@/components/blog/home-discovery-strip";
import { HomeFeaturedPosts } from "@/components/blog/home-featured-posts";
import { HomeHeroMinimal } from "@/components/blog/home-hero-minimal";
import { HomeRecentPosts } from "@/components/blog/home-recent-posts";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";

export default async function HomePage() {
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  const recentPosts = allPosts.slice(0, 5);
  const topCategories = categories.slice(0, 5);

  return (
    <div
      data-pretext-root="home"
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6 md:gap-12 md:px-6 md:py-12"
    >
      <PretextArticleEnhancer
        targetSelector='[data-pretext-root="home"]'
        headingSelector="h1, h2, h3"
        measureSelector="p"
      />
      <SectionReveal>
        <HomeHeroMinimal />
      </SectionReveal>

      <SectionReveal delay={0.01}>
        <HomeFeaturedPosts posts={allPosts} />
      </SectionReveal>

      <SectionReveal delay={0.02}>
        <HomeRecentPosts posts={recentPosts} />
      </SectionReveal>

      <SectionReveal delay={0.04}>
        <HomeDiscoveryStrip categories={topCategories} />
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <section className="w-full rounded-3xl border border-border/60 bg-background px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Prefer browsing everything?
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                render={<Link href="/blog" />}
                variant="outline"
                className="rounded-full"
              >
                Open archive
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              </Button>
              <Button
                render={<Link href="/about" />}
                variant="outline"
                className="rounded-full"
              >
                About the site
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}

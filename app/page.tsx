import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  GridViewIcon,
  Notebook01Icon,
} from "@hugeicons/core-free-icons";

import { PostList } from "@/components/blog/post-list";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { SectionIntro } from "@/components/shared/section-intro";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { postPath } from "@/lib/blog/post-path";
import { formatPostDate } from "@/lib/format-date";
import { cn, getCategoryColorClass } from "@/lib/utils";

export default async function HomePage() {
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  const featuredPosts = allPosts.filter((post) => post.featured).slice(0, 2);
  const selectedFeaturedPosts =
    featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 2);
  const recentPosts = allPosts
    .filter(
      (post) =>
        !selectedFeaturedPosts.some(
          (featuredPost) => featuredPost.slug === post.slug,
        ),
    )
    .slice(0, 5);
  const topicPaths = categories.slice(0, 3).map((category) => ({
    ...category,
    samplePost: allPosts.find((post) => post.category === category.name),
  }));
  const totalReadingMinutes = allPosts.reduce(
    (total, post) => total + post.readingTime,
    0,
  );
  const stats = [
    { label: "Published posts", value: allPosts.length, icon: Notebook01Icon },
    { label: "Topic clusters", value: categories.length, icon: GridViewIcon },
    {
      label: "Minutes to explore",
      value: totalReadingMinutes,
      icon: Bookmark02Icon,
    },
  ];

  return (
    <div
      data-pretext-root="home"
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-5 md:gap-16 md:px-6 md:py-12 lg:gap-24"
    >
      <PretextArticleEnhancer
        targetSelector='[data-pretext-root="home"]'
        headingSelector="h1, h2, h3"
        measureSelector="p"
      />
      <SectionReveal>
        <section className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,rgba(95,107,123,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(163,230,53,0.16),transparent_34%),linear-gradient(135deg,color-mix(in_oklch,var(--card)_88%,transparent),color-mix(in_oklch,var(--muted)_42%,transparent))] p-3 sm:p-4 md:rounded-[2rem] md:p-7 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/12 to-transparent" />
          <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.22),transparent_70%)]" />
          <div className="absolute right-[-4rem] bottom-[-5rem] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(190,242,100,0.24),transparent_70%)]" />
          <div className="relative grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,18rem)] lg:items-end lg:gap-8">
            <div className="space-y-4 sm:space-y-5 md:space-y-7">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border/60 bg-background/88 px-2.5 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur-sm sm:gap-3 sm:px-3 sm:text-[11px] md:text-xs">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border/60 bg-background md:h-9 md:w-9">
                  <Image
                    src="/logo.png"
                    alt="behind the TechZ logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="max-w-[11.5rem] truncate sm:max-w-none">
                  Connected developer notes by Rahat Hossain Himel
                </span>
              </div>

              <div className="max-w-3xl space-y-3 md:space-y-4">
                <h1 className="font-heading max-w-4xl text-[2rem] leading-[0.95] font-semibold tracking-[-0.05em] text-foreground text-balance sm:text-4xl md:text-5xl lg:text-7xl">
                  Explore software writing as a connected knowledge map.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7 md:text-lg md:leading-8">
                  behind the TechZ is a calm editorial home for engineering notes,
                  practical tutorials, and experiments linked together through
                  categories, references, and a graph view built for discovery.
                </p>
              </div>

              <div className="grid gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                <Button
                  render={<Link href="/graph" />}
                  size="lg"
                  className="h-10 w-full rounded-full px-4 text-sm sm:h-11 sm:w-auto sm:px-5"
                >
                  Explore Graph View
                  <HugeiconsIcon icon={ChartBubble02Icon} className="size-4" />
                </Button>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                  <Button
                    render={<Link href="/blog" />}
                    size="lg"
                    variant="outline"
                    className="h-10 w-full rounded-full px-4 text-sm sm:h-11 sm:w-auto sm:px-5"
                  >
                    Browse Archive
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Button>
                  <Button
                    render={<Link href="/about" />}
                    size="lg"
                    variant="ghost"
                    className="h-10 w-full rounded-full px-3 text-sm sm:h-11 sm:w-auto sm:px-4"
                  >
                    About
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1rem] bg-background/78 p-3 backdrop-blur-sm md:rounded-[1.35rem] md:p-4"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HugeiconsIcon icon={item.icon} className="size-4" />
                    <p className="text-[10px] uppercase tracking-[0.18em] sm:text-[11px]">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:mt-3 md:text-3xl">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.04}>
        <section className="grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className="rounded-[1.5rem] bg-card p-4 md:rounded-3xl md:p-7">
            <SectionIntro
              eyebrow="Featured"
              title="A strong entry point for new readers"
              description="Start with a highlighted piece, then branch into connected posts and categories from there."
            />

            {selectedFeaturedPosts.length > 0 ? (
              <div className="mt-5 divide-y divide-border/60 md:mt-6">
                {selectedFeaturedPosts.map((featuredPost, index) => (
                  <div
                    key={featuredPost.slug}
                    className="flex flex-col gap-3 py-4 md:gap-4 md:py-5 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0 flex-1 space-y-3 md:space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-full border px-3 py-1 font-medium",
                            getCategoryColorClass(featuredPost.category),
                          )}
                        >
                          {featuredPost.category}
                        </Badge>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <Link
                          href={postPath(featuredPost.slug)}
                          className="group/title block"
                        >
                          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover/title:text-primary md:text-2xl">
                            {featuredPost.title}
                          </h3>
                        </Link>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground line-clamp-3 md:text-base md:line-clamp-none">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground md:gap-x-4 md:gap-y-2 md:text-sm">
                        <span>
                          {formatPostDate(featuredPost.date, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>{featuredPost.readingTime} min read</span>
                        <span>{featuredPost.wordCount.toLocaleString()} words</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-sm text-muted-foreground">
                No posts published yet.
              </p>
            )}
          </div>

          <div className="rounded-[1.5rem] bg-card p-4 md:rounded-3xl md:p-7">
            <SectionIntro
              eyebrow="Graph view preview"
              title="Find ideas through relationships"
              description="Use the graph when you want to discover related notes instead of scrolling the archive."
            />

            <div className="mt-5 space-y-3 md:mt-6 md:space-y-4">
              {[
                {
                  title: "Follow wiki-style references",
                  description:
                    "Trace how one article points to the next and keep context while exploring.",
                },
                {
                  title: "Spot topic clusters",
                  description:
                    "See where software notes gather into themes like web, tools, and experiments.",
                },
                {
                  title: "Open the archive with context",
                  description:
                    "Move from visual discovery into full posts whenever a node catches your attention.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-[1.25rem] bg-muted/20 p-3 md:rounded-2xl md:p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <Button
              render={<Link href="/graph" />}
              variant="outline"
              className="mt-6 w-full rounded-full"
            >
              Open Graph View
              <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
            </Button>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <section className="space-y-5 md:space-y-6">
          <SectionIntro
            eyebrow="Recent writings"
            title="Read the newest essays, guides, and working notes"
            description="A clearer archive preview with context for what each post covers and why it matters."
          />

          {recentPosts.length > 0 ? (
            <div className="w-full">
              <PostList posts={recentPosts} compact />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No posts published yet.</p>
          )}
        </section>
      </SectionReveal>

      <SectionReveal delay={0.12}>
        <section className="grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-[1.5rem] bg-card p-4 md:rounded-3xl md:p-7">
            <SectionIntro
              eyebrow="Reading paths"
              title="Explore by topic cluster"
              description="Choose a theme and jump into a path of related posts instead of starting from page one."
            />

            <div className="mt-5 divide-y divide-border/60 md:mt-6">
              {topicPaths.length > 0 ? (
                topicPaths.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="group block py-3.5 transition-colors hover:bg-muted/10 md:py-4"
                  >
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "rounded-full border px-3 py-1 font-medium",
                            getCategoryColorClass(category.name),
                          )}
                        >
                          {category.name}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {category.count} posts
                        </span>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {category.samplePost ? (
                          <span>
                            Start with{" "}
                            <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                              {category.samplePost.title}
                            </span>
                            .
                          </span>
                        ) : (
                          "Browse posts collected under this topic."
                        )}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_82%,transparent),color-mix(in_oklch,var(--muted)_34%,transparent))] p-4 md:rounded-3xl md:p-7">
            <SectionIntro
              eyebrow="Follow"
              title="Stay close to the work"
              description="Use the homepage as a starting point, then keep up through the archive, RSS, and author page."
            />

            <div className="mt-6 space-y-3">
              <Button
                render={<Link href="/feed.xml" />}
                variant="outline"
                className="h-11 w-full justify-between rounded-2xl px-4"
              >
                Subscribe via RSS
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              </Button>
              <Button
                render={<Link href="/about" />}
                variant="outline"
                className="h-11 w-full justify-between rounded-2xl px-4"
              >
                Meet the author
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              </Button>
              <Button
                render={<Link href="/blog" />}
                variant="outline"
                className="h-11 w-full justify-between rounded-2xl px-4"
              >
                Open full archive
                <HugeiconsIcon icon={ArrowUpRight01Icon} className="size-4" />
              </Button>
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-background/80 p-3.5 md:mt-6 md:rounded-2xl md:p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Reading rhythm
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Best for readers who want a mix of practical engineering notes,
                personal experiments, and connected exploration instead of a
                purely chronological feed.
              </p>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}

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

import { SectionIntro } from "@/components/shared/section-intro";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
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
        !selectedFeaturedPosts.some((featuredPost) => featuredPost.slug === post.slug),
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-6 md:px-6 md:py-12 lg:gap-24">
      <SectionReveal>
        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[radial-gradient(circle_at_top_left,rgba(95,107,123,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(163,230,53,0.12),transparent_32%),linear-gradient(135deg,color-mix(in_oklch,var(--card)_84%,transparent),color-mix(in_oklch,var(--muted)_46%,transparent))] p-5 md:p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/12 to-transparent" />
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border/60 bg-background">
                  <Image
                    src="/logo.png"
                    alt="behind the TechZ logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                Connected developer notes by Rahat Hossain Himel
              </div>

              <div className="max-w-3xl space-y-4">
                <h1 className="font-heading text-4xl font-semibold tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
                  Explore software writing as a connected knowledge map.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  behind the TechZ is a calm editorial home for engineering notes,
                  practical tutorials, and experiments linked together through
                  categories, references, and a graph view built for discovery.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  render={<Link href="/graph" />}
                  size="lg"
                  className="rounded-full px-4"
                >
                  Explore Graph View
                  <HugeiconsIcon
                    icon={ChartBubble02Icon}
                    className="size-4"
                  />
                </Button>
                <Button
                  render={<Link href="/blog" />}
                  size="lg"
                  variant="outline"
                  className="rounded-full px-4"
                >
                  Browse Archive
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
                <Button
                  render={<Link href="/about" />}
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-4"
                >
                  About the author
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/60 bg-background/75 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <HugeiconsIcon icon={item.icon} className="size-4" />
                      <p className="text-[11px] uppercase tracking-[0.18em]">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:pt-2">
              <div className="rounded-3xl border border-border/70 bg-background/90 p-5 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Start here
                    </p>
                    <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                      Why this blog feels different
                    </h2>
                  </div>
                  <HugeiconsIcon
                    icon={ChartBubble02Icon}
                    className="size-5 text-muted-foreground"
                  />
                </div>

                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <p>
                    Follow ideas from article to article instead of reading in a
                    flat timeline.
                  </p>
                  <p>
                    Jump into the graph to trace references, then return to the
                    archive when you want a chronological reading flow.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <span>Discovery flow</span>
                    <span>01</span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm font-medium text-foreground sm:gap-3">
                    <span className="inline-flex min-h-11 items-center rounded-full border border-border/60 bg-background px-3 py-2 leading-tight">
                      Read a post
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-border/60 bg-background px-3 py-2 leading-tight">
                      Follow the links
                    </span>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-sm font-medium text-foreground sm:gap-3">
                    <span className="inline-flex min-h-11 items-center rounded-full border border-border/60 bg-background px-3 py-2 leading-tight">
                      Explore the graph
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-4 shrink-0 text-muted-foreground"
                    />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-border/60 bg-background px-3 py-2 leading-tight">
                      Build a reading path
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border/70 bg-background/85 p-5 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Latest signal
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      New notes and essays are added to the archive regularly.
                    </p>
                  </div>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    {allPosts.length > 0 ? "Updated" : "Starting soon"}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => (
                    <Badge
                      key={category.slug}
                      variant="secondary"
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        getCategoryColorClass(category.name),
                      )}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.04}>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-7">
            <SectionIntro
              eyebrow="Featured"
              title="A strong entry point for new readers"
              description="Start with a highlighted piece, then branch into connected posts and categories from there."
            />

            {selectedFeaturedPosts.length > 0 ? (
              <div className="mt-6 divide-y divide-border/60">
                {selectedFeaturedPosts.map((featuredPost, index) => (
                  <div
                    key={featuredPost.slug}
                    className="flex flex-col gap-4 py-5 lg:flex-row lg:items-start lg:justify-between"
                  >
                    <div className="min-w-0 flex-1 space-y-4">
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
                          href={`/blog/${featuredPost.slug}`}
                          className="group/title block"
                        >
                          <h3 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover/title:text-primary md:text-2xl">
                            {featuredPost.title}
                          </h3>
                        </Link>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span>
                          {new Date(featuredPost.date).toLocaleDateString("en-US", {
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

          <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-7">
            <SectionIntro
              eyebrow="Graph view preview"
              title="Find ideas through relationships"
              description="Use the graph when you want to discover related notes instead of scrolling the archive."
            />

            <div className="mt-6 space-y-4">
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
                  className="rounded-2xl border border-border/60 bg-muted/20 p-4"
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
        <section className="space-y-6">
          <SectionIntro
            eyebrow="Recent writings"
            title="Read the newest essays, guides, and working notes"
            description="A clearer archive preview with context for what each post covers and why it matters."
          />

          {recentPosts.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-3xl border border-border/70 bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-muted/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "rounded-full border px-3 py-1 font-medium",
                        getCategoryColorClass(post.category),
                      )}
                    >
                      {post.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {post.readingTime} min read
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-foreground">
                      Read post
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card p-8 text-sm text-muted-foreground">
              No posts published yet.
            </div>
          )}
        </section>
      </SectionReveal>

      <SectionReveal delay={0.12}>
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div className="rounded-3xl border border-border/70 bg-card p-6 md:p-7">
            <SectionIntro
              eyebrow="Reading paths"
              title="Explore by topic cluster"
              description="Choose a theme and jump into a path of related posts instead of starting from page one."
            />

            <div className="mt-6 divide-y divide-border/60">
              {topicPaths.length > 0 ? (
                topicPaths.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/categories/${category.slug}`}
                    className="group block py-4 transition-colors hover:bg-muted/10"
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

          <div className="rounded-3xl border border-border/70 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_82%,transparent),color-mix(in_oklch,var(--muted)_34%,transparent))] p-6 md:p-7">
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

            <div className="mt-6 rounded-2xl border border-border/60 bg-background/80 p-4">
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

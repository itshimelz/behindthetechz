import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  SparklesIcon,
  Home01Icon,
  Book02Icon,
  ChartBubble02Icon,
  Folder01Icon,
  RssIcon,
  UserIcon,
  HelpCircleIcon,
  Notification02Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

import { HomeFeaturedPosts } from "@/components/blog/home-featured-posts";
import { HomeHeroMinimal } from "@/components/blog/home-hero-minimal";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { SectionReveal } from "@/components/shared/section-reveal";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/blog/get-all-posts";

export default async function HomePage() {
  const allPosts = await getAllPosts();

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
        {/* Left Desktop Sidebar Navigation Column (LessWrong Style) */}
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
              <span>All Posts</span>
            </Link>
            <Link
              href="/categories"
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
            >
              <HugeiconsIcon icon={Folder01Icon} className="size-4" strokeWidth={2} />
              <span>Concepts</span>
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
                  Best of behind the TechZ
                </Link>
              </li>
              <li>
                <Link
                  href="/graph"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={ChartBubble02Icon} className="size-3.5" strokeWidth={2} />
                  Sequence Highlights
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={SparklesIcon} className="size-3.5" strokeWidth={2} />
                  The Codex
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Meta Section */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Community & Meta
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/feed.xml"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={RssIcon} className="size-3.5" strokeWidth={2} />
                  Subscribe (RSS)
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-3.5" strokeWidth={2} />
                  About Author
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={Notification02Icon} className="size-3.5" strokeWidth={2} />
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={HelpCircleIcon} className="size-3.5" strokeWidth={2} />
                  FAQ & Help
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Feed Area (LessWrong Style) */}
        <main className="col-span-12 lg:col-span-9 space-y-8">
          {/* Featured Essay Banner */}
          <SectionReveal>
            <HomeHeroMinimal />
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

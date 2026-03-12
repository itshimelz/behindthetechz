import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HelpCircleIcon,
  Search01Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  LinkSquare02Icon,
  BookOpen01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

import { SectionReveal } from "@/components/shared/section-reveal";
import { SectionIntro } from "@/components/shared/section-intro";

export const metadata: Metadata = {
  title: "Help",
  description: "How to use behind the TechZ effectively.",
};

const helpItems = [
  {
    title: "Search posts",
    description:
      "Use the search bar on the blog archive to filter by title, excerpt, category, and tags.",
    icon: Search01Icon,
    href: "/blog",
    cta: "Open Blog",
  },
  {
    title: "Save favorites",
    description:
      "Click the bookmark icon on any post to save it. Favorites appear in the sidebar and the account menu.",
    icon: Bookmark02Icon,
    href: "/blog",
    cta: "Browse Posts",
  },
  {
    title: "Use graph view",
    description:
      "Open the graph map to explore relationships between posts based on wiki-style links.",
    icon: ChartBubble02Icon,
    href: "/graph",
    cta: "Open Graph View",
  },
  {
    title: "Navigate backlinks",
    description:
      "At the end of each post, check Linked from to discover related posts referencing the current topic.",
    icon: LinkSquare02Icon,
    href: "/blog",
    cta: "Read Articles",
  },
];

const readingFlow = [
  {
    title: "Start with the archive",
    description:
      "Browse the main blog page, search a topic, and narrow the list by category or tag.",
    icon: Search01Icon,
  },
  {
    title: "Open connected posts",
    description:
      "Use wiki links, related posts, and backlinks to move through connected ideas without losing context.",
    icon: LinkSquare02Icon,
  },
  {
    title: "Save what matters",
    description:
      "Bookmark posts you want to revisit later. Your saved list stays available from the sidebar.",
    icon: Bookmark02Icon,
  },
];

const faqItems = [
  {
    question: "How do I find posts on a specific topic quickly?",
    answer:
      "Use the search field on the archive page. It matches post titles, excerpts, categories, and tags, so even partial keywords usually work well.",
  },
  {
    question: "Where can I see related articles?",
    answer:
      "Open any post and scroll through the interlinks, related posts, series navigation, and backlink section near the end of the article.",
  },
  {
    question: "Are favorites tied to an account?",
    answer:
      "No. Favorites are stored in your browser, which keeps the experience fast and private but means they are device-specific.",
  },
  {
    question: "When should I use Graph View?",
    answer:
      "Use it when you want to explore the knowledge map visually, discover clusters, or jump between closely connected posts.",
  },
];

const quickTips = [
  "Use short keywords first, then refine with tags or categories.",
  "Open a post from Graph View when you want context around a topic cluster.",
  "Check the footer of a post for backlinks and adjacent reading paths.",
  "Bookmark long reads you want to continue later from the sidebar.",
];

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col gap-10 px-4 py-10 md:gap-14 md:px-8">
      <SectionReveal delay={0} className="mx-auto w-full max-w-4xl">
        <div className="space-y-5 rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.09),transparent_32%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--card)),hsl(var(--muted)/0.35))] p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} className="size-3.5" strokeWidth={2} />
            Reader guide
          </div>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={HelpCircleIcon} className="size-6" strokeWidth={2} />
            <h1 className="font-heading text-3xl font-bold tracking-tight">Help</h1>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Quick guidance for using search, favorites, graph view, and interlinked
            reading. If you are new here, start with the archive, then follow links
            between posts to explore the wider knowledge map.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="size-4" strokeWidth={2} />
              Browse archive
            </Link>
            <Link
              href="/graph"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <HugeiconsIcon
                icon={ChartBubble02Icon}
                className="size-4"
                strokeWidth={2}
              />
               Open Graph View
            </Link>
          </div>
          <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Best for
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Search-first reading and topic discovery
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Works with
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Favorites, wiki links, backlinks, and graph exploration
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/75 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Quick start
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Open the archive, search one idea, then follow connected posts
              </p>
            </div>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.04} className="mx-auto w-full max-w-4xl">
        <SectionIntro
          eyebrow="Core features"
          title="Main ways to navigate the site"
          description="These are the fastest entry points when you want to locate a topic, save something, or jump across related ideas."
        />
      </SectionReveal>

      <SectionReveal delay={0.08} className="mx-auto w-full max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          {helpItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:bg-muted/30"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
                <HugeiconsIcon icon={item.icon} strokeWidth={2} />
              </div>
              <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              <Link
                href={item.href}
                className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
              >
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </SectionReveal>

      <SectionReveal delay={0.12} className="mx-auto w-full max-w-4xl">
        <SectionIntro
          eyebrow="Reading workflow"
          title="A better way to move through connected posts"
          description="The site works best when you read in small connected loops instead of isolated single articles."
        />
      </SectionReveal>

      <SectionReveal delay={0.16} className="mx-auto w-full max-w-4xl">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <HugeiconsIcon icon={Clock01Icon} className="size-5" strokeWidth={2} />
              <h2 className="text-lg font-semibold text-foreground">
                Recommended reading flow
              </h2>
            </div>
            <div className="space-y-4">
              {readingFlow.map((step, index) => (
                <div
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-border/60 bg-muted/20 p-4"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold text-foreground">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={step.icon}
                        className="size-4 text-muted-foreground"
                        strokeWidth={2}
                      />
                      <h3 className="text-sm font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="mb-5 flex items-center gap-2">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="size-5"
                strokeWidth={2}
              />
              <h2 className="text-lg font-semibold text-foreground">Quick tips</h2>
            </div>
            <div className="space-y-3">
              {quickTips.map((tip) => (
                <div
                  key={tip}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
                >
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={2}
                  />
                  <p className="text-sm leading-6 text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.2} className="mx-auto w-full max-w-4xl">
        <SectionIntro
          eyebrow="FAQ"
          title="Common questions from first-time readers"
          description="Short answers for the most common ways people discover, save, and revisit content here."
        />
      </SectionReveal>

      <SectionReveal delay={0.24} className="mx-auto w-full max-w-4xl">
        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <HugeiconsIcon icon={HelpCircleIcon} className="size-5" strokeWidth={2} />
            <h2 className="text-lg font-semibold text-foreground">
              Frequently asked questions
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-border/60 bg-muted/20 p-4"
              >
                <h3 className="text-sm font-semibold leading-6 text-foreground">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>
    </div>
  );
}

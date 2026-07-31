import { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBubble02Icon,
  BookOpen02Icon,
  Settings02Icon,
  Link04Icon,
  Rocket01Icon,
  ArrowUpRight01Icon,
  SourceCodeIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import { SectionIntro } from "@/components/shared/section-intro";
import { BehindTheTechzLayout } from "@/components/shared/behindthetechz-layout";

export const metadata: Metadata = {
  title: "About | behind the TechZ",
  description:
    "Learn about behind the TechZ — a knowledge-driven blog built for practical engineering notes, connected topics, and distraction-free reading.",
};

const highlights = [
  {
    label: "Mission",
    value:
      "Deliver practical engineering knowledge without the noise or clickbait",
  },
  {
    label: "Content",
    value:
      "In-depth articles on software engineering, web development, and developer tooling",
  },
  {
    label: "Philosophy",
    value:
      "Learning in public — sharing experiments, notes, and lessons from real projects",
  },
];

const features = [
  {
    title: "Interactive knowledge graph",
    description:
      "Explore connections between topics visually. Every post links to related articles, forming a navigable web of knowledge.",
    icon: ChartBubble02Icon,
  },
  {
    title: "Wiki-style interlinking",
    description:
      "Posts reference each other with inline wiki links, so you can jump between connected ideas without losing context.",
    icon: Link04Icon,
  },
  {
    title: "Reading preferences",
    description:
      "Customizable reading tones, scroll memory, table-of-contents toggles, and progress tracking — built for comfort.",
    icon: Settings02Icon,
  },
  {
    title: "MDX-powered content",
    description:
      "Rich content with syntax-highlighted code blocks, LaTeX math, callouts, and interactive components — all server-rendered.",
    icon: BookOpen02Icon,
  },
];

const links = [
  {
    label: "Source Code",
    value: "View on GitHub",
    href: "https://github.com/itshimelz/behindthetechz",
    icon: SourceCodeIcon,
    hoverClass:
      "group-hover:border-zinc-500/60 group-hover:text-zinc-700 dark:group-hover:text-zinc-100",
    textHoverClass:
      "group-hover:text-zinc-700 dark:group-hover:text-zinc-100",
  },
  {
    label: "Contact",
    value: process.env.EMAIL_ADDRESS ?? "Get in touch",
    href: `mailto:${process.env.EMAIL_ADDRESS}`,
    icon: Mail01Icon,
    hoverClass:
      "group-hover:border-foreground/60 group-hover:text-foreground",
    textHoverClass: "group-hover:text-foreground",
  },
];

export default function AboutPage() {
  return (
    <BehindTheTechzLayout activePath="/about">
      <div className="space-y-12 py-4">
        {/* ── Centered Header (404 Media Style) ── */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Who We Are
          </h1>
        </section>

        {/* ── Centered Paragraph Flow ── */}
        <section className="max-w-2xl mx-auto space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
          <p>
            <strong className="text-foreground font-semibold">behind the TechZ</strong> is an independent technology publication founded by Rahat Hossain Himel exploring the ways software engineering, AI systems, and software architecture shape our digital world.
          </p>

          <p>
            We&apos;re focused on technical deep-dives, production engineering notes, system architecture patterns, and developer tooling — written with honest code, real constraints, and zero clickbait.
          </p>

          <p>
            Read more about us, our principles, and our connected topics below.
          </p>
        </section>

        {/* ── Theme Green Callout Banner (No Shadows) ── */}
        <section className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-primary/10 text-foreground border border-primary/20 p-6 sm:p-8 text-center font-medium text-sm sm:text-base leading-relaxed">
            behind the TechZ is an independent publication whose work is written, researched, and published by software engineers. Our intended audience is real developers, not AI scrapers, bots, or search algorithms.
          </div>
        </section>

        {/* ── Highlights Grid ── */}
        <section className="max-w-3xl mx-auto grid gap-6 border-t border-border/40 pt-10 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.label} className="space-y-2 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </section>

        {/* ── Key features ── */}
        <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
          <SectionIntro
            eyebrow="Features"
            title="Built for deep reading"
          />

          <section className="grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="space-y-3 rounded-xl border border-border/50 bg-card/50 p-5 transition-colors hover:bg-card/80"
              >
                <div className="flex items-center gap-2.5">
                  <HugeiconsIcon
                    icon={feature.icon}
                    className="h-5 w-5 text-primary"
                  />
                  <h3 className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </section>
        </div>

        {/* ── Links ── */}
        <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
          <SectionIntro
            eyebrow="Links"
            title="Explore and connect"
          />

          <section className="grid gap-4 sm:grid-cols-2">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/50"
                aria-label={item.label}
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`flex shrink-0 items-center justify-center text-muted-foreground transition-colors ${item.hoverClass}`}
                  >
                    <HugeiconsIcon icon={item.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors ${item.textHoverClass}`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`truncate text-sm font-medium text-foreground transition-colors ${item.textHoverClass}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform transition-colors group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                />
              </Link>
            ))}

            <Link
              href="/blog"
              className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/50"
              aria-label="Browse all posts"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:border-primary/60 group-hover:text-primary">
                  <HugeiconsIcon icon={BookOpen02Icon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-primary">
                    Archive
                  </p>
                  <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                    Browse all posts
                  </p>
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform transition-colors group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </Link>

            <Link
              href="/graph"
              className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 p-4 transition-colors hover:bg-muted/50"
              aria-label="Explore graph"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:border-foreground/60 group-hover:text-foreground">
                  <HugeiconsIcon
                    icon={ChartBubble02Icon}
                    className="h-5 w-5"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-foreground">
                    Knowledge graph
                  </p>
                  <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-foreground">
                    Explore topic connections
                  </p>
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform transition-colors group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
              />
            </Link>
          </section>
        </div>

        {/* ── Footer note ── */}
        <section className="border-t border-border/40 pt-8 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <HugeiconsIcon
              icon={Rocket01Icon}
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
            />
            <p className="text-sm leading-6 text-muted-foreground">
              <strong className="text-foreground">behind the TechZ</strong> is
              built and maintained by{" "}
              <Link
                href="https://github.com/itshimelz"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-3 transition-colors hover:text-primary/80"
              >
                Rahat Hossain Himel
              </Link>
              . The entire codebase is open source and always evolving — feedback
              and contributions are welcome.
            </p>
          </div>
        </section>
      </div>
    </BehindTheTechzLayout>
  );
}

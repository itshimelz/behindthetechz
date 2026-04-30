import { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChartBubble02Icon,
  BookOpen02Icon,
  Settings02Icon,
  Link04Icon,
  PencilEdit02Icon,
  Rocket01Icon,
  CodeIcon,
  ArrowUpRight01Icon,
  SourceCodeIcon,
  Mail01Icon,
  InformationCircleIcon,
  StructureCheckIcon,
} from "@hugeicons/core-free-icons";

import { SectionReveal } from "@/components/shared/section-reveal";
import { SectionIntro } from "@/components/shared/section-intro";

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

const principles = [
  "Depth over virality",
  "No ads, no paywalls",
  "Show real code, not toy examples",
  "Open source and transparent",
];

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "MDX",
  "Prisma",
  "PostgreSQL",
  "Supabase",
  "Shiki",
  "KaTeX",
  "Framer Motion",
  "D3.js",
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
      "group-hover:border-emerald-500/60 group-hover:text-emerald-500",
    textHoverClass: "group-hover:text-emerald-500",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-16 px-4 py-12 md:space-y-24 md:px-8">
      {/* ── Hero ── */}
      <SectionReveal>
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <HugeiconsIcon icon={InformationCircleIcon} className="h-3.5 w-3.5" />
            About the site
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Practical engineering notes without the noise
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              <strong className="text-foreground">behind the TechZ</strong> is a
              knowledge-driven blog focused on real-world software engineering.
              Every article is written to be useful — covering in-depth topics
              with honest code, connected context, and a distraction-free reading
              experience.
            </p>
          </div>

          <div className="grid gap-6 border-t border-border/40 pt-8 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label} className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-medium leading-6 text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      {/* ── What you'll find ── */}
      <div className="space-y-4 md:space-y-6">
        <SectionReveal delay={0.04}>
          <SectionIntro
            eyebrow="Overview"
            title="What you'll find here"
            description="Articles, experiments, and engineering notes from real projects — written to teach, not to trend."
          />
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={PencilEdit02Icon}
                className="h-5 w-5 text-primary"
              />
              <h3 className="text-lg font-semibold text-foreground">
                Content focus
              </h3>
            </div>
            <div className="prose prose-neutral max-w-none text-muted-foreground dark:prose-invert">
              <p>
                Posts cover a range of topics across{" "}
                <strong>web development</strong>,{" "}
                <strong>mobile engineering</strong>,{" "}
                <strong>system design</strong>, and{" "}
                <strong>developer tooling</strong>. Each article aims to go
                beyond surface-level tutorials — exploring trade-offs,
                real-world constraints, and lessons learned while building.
              </p>
              <p>
                Whether it&apos;s dissecting a framework upgrade, walking
                through a production debugging session, or documenting a
                side-project build log — the goal is always the same: share
                practical knowledge that&apos;s immediately useful.
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* ── Key features ── */}
      <div className="space-y-4 md:space-y-6">
        <SectionReveal delay={0.04}>
          <SectionIntro
            eyebrow="Features"
            title="Built for deep reading"
            description="Every feature exists to help you focus on learning, not on fighting the UI."
          />
        </SectionReveal>

        <SectionReveal delay={0.08}>
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
        </SectionReveal>
      </div>

      {/* ── Principles + Tech stack ── */}
      <div className="space-y-4 md:space-y-6">
        <SectionReveal delay={0.04}>
          <SectionIntro
            eyebrow="Under the hood"
            title="Principles and tech stack"
            description="The values that guide content decisions and the tools that power the platform."
          />
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <div className="grid gap-10 sm:grid-cols-2">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={StructureCheckIcon}
                  className="h-4 w-4 text-primary"
                />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Guiding principles
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {principles.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={CodeIcon}
                  className="h-4 w-4 text-primary"
                />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Tech stack
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-secondary/60 px-3 py-1.5 text-sm text-secondary-foreground select-none"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* ── Links ── */}
      <div className="space-y-4 md:space-y-6">
        <SectionReveal delay={0.04}>
          <SectionIntro
            eyebrow="Links"
            title="Explore and connect"
            description="Check out the source, reach out, or start reading."
          />
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <section className="grid gap-4 sm:grid-cols-2">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                className="group flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50"
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
              className="group flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50"
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
              className="group flex items-center justify-between gap-4 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50"
              aria-label="Explore graph"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex shrink-0 items-center justify-center text-muted-foreground transition-colors group-hover:border-violet-500/60 group-hover:text-violet-500">
                  <HugeiconsIcon
                    icon={ChartBubble02Icon}
                    className="h-5 w-5"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-violet-500">
                    Knowledge graph
                  </p>
                  <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-violet-500">
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
        </SectionReveal>
      </div>

      {/* ── Footer note ── */}
      <SectionReveal delay={0.12}>
        <section className="border-t border-border/40 pt-8">
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
      </SectionReveal>
    </div>
  );
}

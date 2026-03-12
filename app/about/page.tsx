import { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Linkedin02Icon,
  Mail01Icon,
  Location01Icon,
  Mortarboard01Icon,
  SparklesIcon,
  CodeIcon,
  UserStoryIcon,
  Rocket01Icon,
  ArrowUpRight01Icon,
  Facebook01Icon,
} from "@hugeicons/core-free-icons";

import { SectionReveal } from "@/components/shared/section-reveal";
import { SectionIntro } from "@/components/shared/section-intro";

export const metadata: Metadata = {
  title: "About | behind the TechZ",
  description: "About Rahat Hossain Himel, Software Developer and student.",
};

const detailItems = [
  {
    label: "Location",
    value: "Dhaka, Bangladesh",
    icon: Location01Icon,
  },
  {
    label: "Education",
    value: "Green University of Bangladesh",
    icon: Mortarboard01Icon,
  },
];

const focusAreas = [
  "Clear product thinking",
  "Maintainable code",
  "Fast, smooth interfaces",
  "Learning by building",
];

const introHighlights = [
  {
    label: "Currently building",
    value: "Mobile and web products with a practical full-stack mindset",
  },
  {
    label: "Writing about",
    value: "Engineering notes, experiments, and things I learn while shipping",
  },
  {
    label: "Interested in",
    value: "Software craftsmanship, storytelling, and thoughtful developer UX",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    value: "@itshimelz",
    href: "https://github.com/itshimelz",
    icon: GithubIcon,
    hoverClass: "group-hover:border-zinc-500/60 group-hover:text-zinc-700 dark:group-hover:text-zinc-100",
    textHoverClass:
      "group-hover:text-zinc-700 dark:group-hover:text-zinc-100",
  },
  {
    label: "LinkedIn",
    value: "/in/itshimelz",
    href: "https://linkedin.com/in/itshimelz",
    icon: Linkedin02Icon,
    hoverClass: "group-hover:border-sky-500/60 group-hover:text-sky-500",
    textHoverClass: "group-hover:text-sky-500",
  },
  {
    label: "Facebook",
    value: "/itshimelz",
    href: "https://facebook.com/itshimelz",
    icon: Facebook01Icon,
    hoverClass: "group-hover:border-blue-500/60 group-hover:text-blue-500",
    textHoverClass: "group-hover:text-blue-500",
  },
  {
    label: "Email",
    value: process.env.EMAIL_ADDRESS ?? "Email me",
    href: `mailto:${process.env.EMAIL_ADDRESS}`,
    icon: Mail01Icon,
    hoverClass: "group-hover:border-emerald-500/60 group-hover:text-emerald-500",
    textHoverClass: "group-hover:text-emerald-500",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-12 px-4 py-10 md:space-y-16 md:px-8">
      <SectionReveal>
        <section className="space-y-5 rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.09),transparent_32%),linear-gradient(135deg,hsl(var(--card)),hsl(var(--card)),hsl(var(--muted)/0.35))] p-6 md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} className="h-3.5 w-3.5" />
            About the author
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Building thoughtful software across mobile and web
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              I&apos;m Rahat Hossain Himel, a software developer and CSE student who
              enjoys turning ideas into clean, useful products while learning in
              public through writing and experiments.
            </p>
          </div>

          <div className="grid gap-3 border-t border-border/60 pt-4 sm:grid-cols-3">
            {introHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/60 bg-background/75 p-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.04}>
        <SectionIntro
          eyebrow="Profile"
          title="Background and working style"
          description="A quick look at what I build, how I learn, and the kinds of technical problems I enjoy solving."
        />
      </SectionReveal>

      <SectionReveal delay={0.08}>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <HugeiconsIcon icon={UserStoryIcon} className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-foreground">My story</h3>
            </div>
            <div className="prose prose-neutral max-w-none dark:prose-invert">
              <p>
                Hello! I&apos;m Himel. I&apos;m a passionate software developer currently
                pursuing my CSE degree. My primary focus is on mobile application
                development using <strong>Kotlin</strong> and <strong>Compose
                Multiplatform (CMP)</strong>, but I also enjoy working across the
                full stack.
              </p>
              <p>
                I love building seamless, high-performance applications and am
                always eager to learn new technologies, sharpen fundamentals, and
                solve complex problems on LeetCode.
              </p>
              <p>
                Outside of software, I enjoy storytelling, literature, anime,
                Bengali poetry, and reflective writing that sharpens how I think
                about products and people.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 md:p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Details
                  </h3>
                </div>

                <div className="grid gap-2">
                  {detailItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-3 py-3"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground">
                        <HugeiconsIcon icon={item.icon} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-foreground">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-border/60 pt-4">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon icon={Rocket01Icon} className="h-4 w-4" />
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Focus
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.12}>
        <SectionIntro
          eyebrow="Tools"
          title="Tech stack and core skills"
          description="A practical mix of languages, frameworks, and infrastructure tools I use across experiments and production-style work."
        />
      </SectionReveal>

      <SectionReveal delay={0.16}>
        <section className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <HugeiconsIcon icon={CodeIcon} className="h-5 w-5" />
            <h3 className="text-lg font-semibold text-foreground">Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Kotlin",
              "Compose Multiplatform",
              "Next.js",
              "NestJS",
              "Docker",
              "Prisma",
              "Java",
              "Python",
              "C++",
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground select-none"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </SectionReveal>

      <SectionReveal delay={0.2}>
        <SectionIntro
          eyebrow="Contact"
          title="Connect with me"
          description="Reach out for collaboration, conversation, or just to follow the work across platforms."
        />
      </SectionReveal>

      <SectionReveal delay={0.24}>
        <section className="grid gap-2 border-t border-border/60 pt-2 sm:grid-cols-2">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex items-center justify-between gap-4 rounded-xl px-1 py-3 transition-colors hover:bg-muted/30"
              aria-label={item.label}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors ${item.hoverClass}`}
                >
                  <HugeiconsIcon icon={item.icon} className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors ${item.textHoverClass}`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`truncate text-sm text-foreground transition-colors ${item.textHoverClass}`}
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
        </section>
      </SectionReveal>
    </div>
  );
}

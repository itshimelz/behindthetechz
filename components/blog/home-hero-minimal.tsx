import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ChartBubble02Icon } from "@hugeicons/core-free-icons";

export function HomeHeroMinimal() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-border/70 bg-[#FAF8F5] p-6 text-foreground dark:bg-zinc-900/60 dark:border-zinc-800">
      {/* Background watercolor artwork accent on the right */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 opacity-25 dark:opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/40 via-teal-400/20 to-transparent blur-2xl" />
      <div className="pointer-events-none absolute -right-12 -bottom-12 size-64 rounded-full bg-gradient-to-br from-amber-300/30 to-orange-400/20 blur-3xl" />

      <div className="relative z-10 space-y-4 max-w-3xl">
        {/* Subtitle / Category badge */}
        <div className="space-y-1">
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground uppercase">
            Featured Essay: AI & Software Architecture Roadmap
          </h2>
          <p className="text-xs font-serif italic text-muted-foreground/80 sm:text-sm">
            Best of behind the TechZ Selection
          </p>
        </div>

        {/* Excerpt Body */}
        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
          Modern software architectures encode implicit operational knowledge that has evolved over decades. Deep-dive into event-driven design, system boundaries, and foundational engineering principles without the noise.
        </p>

        {/* Author Line */}
        <div className="text-xs text-muted-foreground pt-1">
          <span>by </span>
          <Link href="/about" className="font-medium text-foreground hover:underline">
            Rahat Hossain Himel
          </Link>
        </div>

        {/* Discussion / Review Previews */}
        <div className="space-y-2 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-medium text-foreground shrink-0 tabular-nums">48</span>
            <span className="font-medium text-foreground/90 shrink-0">Architecture Note:</span>
            <span className="line-clamp-1 italic text-muted-foreground/90">
              &ldquo;Bi-directional graph nodes provide immediate context when exploring complex software tradeoffs.&rdquo;
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-medium text-foreground shrink-0 tabular-nums">12</span>
            <span className="font-medium text-foreground/90 shrink-0">Concept Map:</span>
            <span className="line-clamp-1 italic text-muted-foreground/90">
              &ldquo;Interlinked wiki concepts allow rapid navigation across foundational engineering topics.&rdquo;
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/blog/ai-assisted-development-roadmap-plan-to-production"
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            Read Full Essay
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" strokeWidth={2} />
          </Link>
          <Link
            href="/graph"
            className="inline-flex items-center gap-2 rounded-lg border border-border/80 bg-background/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-3.5" strokeWidth={2} />
            Explore Graph
          </Link>
        </div>
      </div>
    </section>
  );
}


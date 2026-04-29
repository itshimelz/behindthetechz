import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ChartBubble02Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";

export function HomeHeroMinimal() {
  return (
    <section className="w-full bg-card px-5 py-2 sm:px-7 md:px-8 md:py-2 dark:bg-transparent">
      <div className="max-w-3xl space-y-5">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          behind the TechZ
        </p>
        <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight text-foreground text-balance sm:text-5xl">
          Read practical engineering notes without the noise.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Start with the latest posts, then branch into connected topics when you
          want deeper context.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            render={<Link href="#recent-posts" />}
            size="lg"
            className="rounded-full"
          >
            Read latest posts
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
          <Button
            render={<Link href="/graph" />}
            size="lg"
            variant="outline"
            className="rounded-full"
          >
            Explore graph
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

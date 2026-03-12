import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  BookOpen01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/shared/section-reveal";

export default function PostNotFound() {
  return (
    <SectionReveal>
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-8 lg:py-32">
        <div className="relative flex size-24 items-center justify-center rounded-3xl border border-dashed border-border/70 bg-card/40 before:absolute before:-inset-4 before:rounded-[2rem] before:border before:border-dashed before:border-border/30">
          <HugeiconsIcon
            icon={BookOpen01Icon}
            className="size-10 text-muted-foreground"
            strokeWidth={1.5}
          />
        </div>

        <div className="space-y-4">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Blank page in the graph
          </h1>
          <p className="mx-auto max-w-lg text-base leading-7 text-muted-foreground md:text-lg">
            You stumbled upon a wiki link to a note that hasn&apos;t been
            written yet. It&apos;s a connection waiting to be made.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            render={<Link href="/blog" />}
            size="lg"
            className="rounded-full px-5"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to Archive
          </Button>
          <Button
            render={<Link href="/graph" />}
            size="lg"
            variant="outline"
            className="rounded-full px-5"
          >
            Explore Graph View
            <HugeiconsIcon icon={ChartBubble02Icon} className="size-4" />
          </Button>
        </div>
      </div>
    </SectionReveal>
  );
}

import type { Metadata } from "next";
import { CHANGELOG, dateToId } from "@/lib/changelog";
import { ChangelogEntryBlock } from "@/components/changelog/changelog-entry";
import { ChangelogNav } from "@/components/changelog/changelog-nav";
import { BehindTheTechzLayout } from "@/components/shared/behindthetechz-layout";

export const metadata: Metadata = {
  title: "What's New",
  description:
    "A running log of updates, improvements, and fixes shipped to behind the TechZ.",
};

export default function ChangelogPage() {
  const dates = CHANGELOG.map((e) => e.date);

  return (
    <BehindTheTechzLayout activePath="/changelog">
      <div className="flex w-full items-start gap-10">
        {/* Timeline */}
        <div className="min-w-0 flex-1">
          <div className="relative">
            {/* Vertical rule — visible only md+ */}
            <div
              className="absolute left-35 top-0 hidden h-full w-px bg-border/50 md:block"
              aria-hidden="true"
            />

            <div className="divide-y divide-border/40">
              {CHANGELOG.map((entry, index) => (
                <div
                  key={entry.date}
                  id={dateToId(entry.date)}
                  className="relative pt-12 first:pt-0"
                >
                  {/* Timeline dot — md+ only */}
                  <div
                    className="absolute left-33 top-[3.35rem] hidden h-2 w-2 -translate-x-1/2 rounded-full border-2 border-background bg-foreground ring-2 ring-foreground/20 md:block"
                    aria-hidden="true"
                  />
                  <ChangelogEntryBlock entry={entry} isLatest={index === 0} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky date nav — xl+ */}
        <ChangelogNav dates={dates} />
      </div>
    </BehindTheTechzLayout>
  );
}

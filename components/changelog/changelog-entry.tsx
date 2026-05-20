import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Rocket01Icon,
  BugIcon,
  PaintBrushIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { ChangelogEntry, ChangelogItemType } from "@/lib/changelog";

const SECTION_CONFIG: Record<
  ChangelogItemType,
  {
    label: string;
    icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
    badgeClass: string;
    dotClass: string;
  }
> = {
  feature: {
    label: "New",
    icon: SparklesIcon,
    badgeClass:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    dotClass: "bg-violet-500",
  },
  improvement: {
    label: "Improved",
    icon: PaintBrushIcon,
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    dotClass: "bg-sky-500",
  },
  fix: {
    label: "Fixed",
    icon: BugIcon,
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  launch: {
    label: "Launch",
    icon: Rocket01Icon,
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
};

type Props = {
  entry: ChangelogEntry;
  isLatest?: boolean;
};

export function ChangelogEntryBlock({ entry, isLatest = false }: Props) {
  return (
    <div className="group/entry relative grid gap-6 md:grid-cols-[9rem_1fr] md:gap-8">
      {/* Date column */}
      <div className="flex items-start gap-3 md:flex-col md:gap-2 md:pt-1">
        <div className="hidden md:block">
          {isLatest && (
            <span className="mb-2 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              Latest
            </span>
          )}
          <p className="text-sm font-semibold text-foreground">{entry.date}</p>
          {entry.version && (
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {entry.version}
            </p>
          )}
        </div>
        {/* Mobile date */}
        <div className="flex items-center gap-2 md:hidden">
          {isLatest && (
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
              Latest
            </span>
          )}
          <p className="text-sm font-semibold text-foreground">{entry.date}</p>
          {entry.version && (
            <p className="font-mono text-xs text-muted-foreground">
              {entry.version}
            </p>
          )}
        </div>
      </div>

      {/* Content column */}
      <div className="space-y-5 pb-10">
        {entry.sections.map((section) => {
          const config = SECTION_CONFIG[section.type];
          return (
            <div key={section.type} className="space-y-3">
              {/* Section badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                  config.badgeClass,
                )}
              >
                <HugeiconsIcon
                  icon={config.icon}
                  className="h-3.5 w-3.5"
                  strokeWidth={2}
                />
                {section.label}
              </div>

              {/* Items */}
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                        config.dotClass,
                      )}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-foreground">
                        {item.text}
                      </span>
                      {item.detail && (
                        <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

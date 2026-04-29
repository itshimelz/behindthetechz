import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BulbIcon,
  InformationCircleIcon,
  Alert01Icon,
  Alert02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgObject } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "important" | "warning" | "caution";

type MdxCalloutProps = {
  type?: string;
  title?: string;
  children?: React.ReactNode;
};

const CALLOUT_STYLES: Record<
  CalloutType,
  { icon: IconSvgObject; wrapperClasses: string; contentClasses: string }
> = {
  note: {
    icon: InformationCircleIcon,
    wrapperClasses: "border-primary/20 bg-muted/10",
    contentClasses: "text-primary",
  },
  tip: {
    icon: BulbIcon,
    wrapperClasses: "border-callout-tip/30 bg-muted/10",
    contentClasses: "text-callout-tip",
  },
  important: {
    icon: Alert02Icon,
    wrapperClasses: "border-primary/20 bg-muted/10",
    contentClasses: "text-primary",
  },
  warning: {
    icon: Alert01Icon,
    wrapperClasses: "border-destructive/30 bg-muted/10",
    contentClasses: "text-destructive",
  },
  caution: {
    icon: Shield01Icon,
    wrapperClasses: "border-destructive/30 bg-muted/10",
    contentClasses: "text-destructive",
  },
};

export function MdxCallout({ type = "note", title, children }: MdxCalloutProps) {
  const safeType = (
    Object.keys(CALLOUT_STYLES).includes(type) ? type : "note"
  ) as CalloutType;

  const style = CALLOUT_STYLES[safeType];

  return (
    <aside
      className={cn(
        "callout my-6 overflow-hidden rounded-xl border p-4 sm:p-5 relative",
        style.wrapperClasses
      )}
    >
      <div className="flex items-start gap-3 relative z-10">
        <div className={cn("mt-0.5 shrink-0", style.contentClasses)}>
          <HugeiconsIcon icon={style.icon} strokeWidth={2} className="size-5" />
        </div>
        <div
          className={cn(
            "min-w-0 flex-1 space-y-2 leading-relaxed text-sm sm:text-[15px] font-semibold *:last:mb-0! [&>p]:m-0",
            style.contentClasses
          )}
        >
          {title && title.toLowerCase() !== type.toLowerCase() && (
            <p>{title}</p>
          )}
          {children}
        </div>
      </div>
    </aside>
  );
}

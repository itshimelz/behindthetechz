"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div className="relative z-50 w-full bg-zinc-950 px-4 py-2 text-zinc-100 dark:bg-black dark:text-zinc-100 transition-all border-b border-zinc-800/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs font-mono tracking-widest uppercase">
        <div className="flex-1 text-center truncate">
          <Link
            href="/graph"
            className="inline-flex items-center gap-1.5 hover:underline underline-offset-4 decoration-zinc-400 font-semibold"
          >
            <span>LISTEN TO THE BEHIND THE TECHZ PODCAST & EXPLORE KNOWLEDGE GRAPH</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 shrink-0" strokeWidth={2} />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded p-0.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

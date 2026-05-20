"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

type BlogTagFilterChipProps = {
  tag: string;
  onClear: () => void;
};

export function BlogTagFilterChip({ tag, onClear }: BlogTagFilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 py-1 pl-3 pr-2 text-sm font-medium text-primary shadow-sm shadow-primary/5 transition-colors">
      Tag: {tag}
      <button
        onClick={onClear}
        className="rounded-full p-0.5 transition-colors hover:bg-primary/20 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label={`Clear ${tag} tag filter`}
      >
        <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

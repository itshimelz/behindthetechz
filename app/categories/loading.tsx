import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon } from "@hugeicons/core-free-icons";

export default function CategoriesLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      {/* Section Header */}
      <div className="mx-auto w-full max-w-4xl space-y-2 mb-8">
        <div className="h-9 w-48 rounded-md bg-muted animate-pulse" />
        <div className="h-5 w-64 rounded-md bg-muted animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-xl border bg-card"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                <HugeiconsIcon
                  icon={GridViewIcon}
                  className="h-5 w-5 text-muted-foreground/30 animate-pulse"
                />
              </div>
              <div className="h-6 w-24 rounded-md bg-muted animate-pulse" />
            </div>
            <div className="h-5 w-16 rounded-md bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

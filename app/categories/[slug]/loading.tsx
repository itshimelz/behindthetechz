import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      {/* Header skeleton */}
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* CategoryNav skeleton */}
      <div className="mx-auto w-full max-w-4xl flex gap-2 overflow-hidden">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      {/* Posts skeleton list */}
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-6 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-b border-border/40 pb-6 w-full"
          >
            <div className="flex items-center justify-between w-full">
              <Skeleton className="h-6 w-3/4 max-w-[400px]" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}

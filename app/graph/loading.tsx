import { Skeleton } from "@/components/ui/skeleton";

export default function GraphLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative min-h-[calc(100svh-3.5rem)] flex-1 overflow-hidden p-4 md:p-6">
        <div className="absolute top-4 left-4 w-72 space-y-3">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="absolute top-4 right-4 w-40 space-y-3">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
        </div>
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
    </div>
  );
}

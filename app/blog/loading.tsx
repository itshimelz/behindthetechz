import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-8">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}

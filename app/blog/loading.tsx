import { Skeleton } from "@/components/ui/skeleton";
import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";

export default function BlogLoading() {
  return (
    <BlogReadingSurface>
      <div className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto w-full max-w-4xl space-y-1.5">
          <Skeleton className="h-9 w-44" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="mx-auto w-full max-w-4xl space-y-8">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </BlogReadingSurface>
  );
}

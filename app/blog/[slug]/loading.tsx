import { Skeleton } from "@/components/ui/skeleton";
import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";

export default function BlogPostLoading() {
  return (
    <BlogReadingSurface>
      <article className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-4 md:px-8 md:pt-6">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-5 w-36" />
          </div>
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="h-6 w-full" />
        </div>

        <div className="mx-auto w-full max-w-3xl space-y-3">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-40 w-full" />
        </div>
      </article>
    </BlogReadingSurface>
  );
}

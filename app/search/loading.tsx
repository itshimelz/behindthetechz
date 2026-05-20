import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <BlogReadingSurface>
      <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 md:px-6 md:pt-6">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-5 h-12 w-full rounded-full" />
        <Skeleton className="mt-5 h-5 w-52" />

        <div className="mt-3 space-y-3">
          <Skeleton className="h-18 w-full rounded-xl" />
          <Skeleton className="h-18 w-full rounded-xl" />
          <Skeleton className="h-18 w-full rounded-xl" />
        </div>
      </section>
    </BlogReadingSurface>
  );
}

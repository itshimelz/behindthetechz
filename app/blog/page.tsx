import dynamic from "next/dynamic";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";

const BlogSearchWrapper = dynamic(
  () =>
    import("@/components/blog/blog-search-wrapper").then(
      (mod) => mod.BlogSearchWrapper,
    ),
  {
    loading: () => (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    ),
  },
);

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  return (
    <>
      <ScrollToTop />
      <BlogReadingSurface>
        <div className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 md:px-8 md:pt-6">
          <div className="mx-auto w-full max-w-4xl space-y-1.5">
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              All Posts
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Browse all published articles.
            </p>
          </div>

          <BlogSearchWrapper posts={posts} categories={categories} />
        </div>
      </BlogReadingSurface>
    </>
  );
}

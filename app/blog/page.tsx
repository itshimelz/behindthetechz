import dynamic from "next/dynamic";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/blog/scroll-to-top";

const BlogSearchWrapper = dynamic(
  () =>
    import("@/components/blog/blog-search-wrapper").then(
      (mod) => mod.BlogSearchWrapper,
    ),
  {
    loading: () => (
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full" />
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
      <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
        <div className="mx-auto w-full max-w-4xl space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            All Posts
          </h1>
          <p className="text-muted-foreground">
            Browse all published articles.
          </p>
        </div>

        <BlogSearchWrapper posts={posts} categories={categories} />
      </div>
    </>
  );
}

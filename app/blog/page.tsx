import dynamic from "next/dynamic";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BehindTheTechzLayout } from "@/components/shared/behindthetechz-layout";

const BlogSearchWrapper = dynamic(
  () =>
    import("@/components/blog/blog-search-wrapper").then(
      (mod) => mod.BlogSearchWrapper,
    ),
  {
    loading: () => (
      <div className="w-full space-y-4">
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
      <BehindTheTechzLayout activePath="/blog">
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Essays & Dispatches
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Search, filter, and explore all published technical notes.
            </p>
          </div>

          <BlogSearchWrapper posts={posts} categories={categories} />
        </div>
      </BehindTheTechzLayout>
    </>
  );
}

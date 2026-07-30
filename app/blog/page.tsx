import dynamic from "next/dynamic";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { BehindTheTechzLayout } from "@/components/shared/behindthetechz-layout";
import { SectionIntro } from "@/components/shared/section-intro";

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
          <SectionIntro
            eyebrow="Archive"
            title="All Essays & Dispatches"
          />

          <BlogSearchWrapper posts={posts} categories={categories} />
        </div>
      </BehindTheTechzLayout>
    </>
  );
}

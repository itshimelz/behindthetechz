import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";

import { DetailStickyHeader } from "@/components/blog/detail-sticky-header";
import { getPostsByCategory, getCategories } from "@/lib/blog/get-categories";
import { PostList } from "@/components/blog/post-list";
import Link from "next/link";

type Params = { slug: string };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(decodedSlug);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-4 md:px-8 md:pt-6">
      <DetailStickyHeader
        title={category?.name || decodedSlug}
        backHref="/categories"
        backLabel="All categories"
        jumpHref="#category-articles"
        showJump={false}
      />

      <section className="mx-auto w-full max-w-4xl space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {category?.name || decodedSlug}
          </h1>
          <Link
            href="/categories"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All categories
          </Link>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in this
          category.
        </p>
      </section>

      {/* Posts */}
      <div id="category-articles" className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon icon={Notebook01Icon} className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Articles
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <PostList
          posts={posts}
          compact
          emptyMessage="No posts in this category yet."
        />
      </div>
    </div>
  );
}

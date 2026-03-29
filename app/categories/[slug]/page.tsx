import { notFound } from "next/navigation";

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
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in this
          category.
        </p>
      </section>

      {/* Posts */}
      <div className="mx-auto w-full max-w-4xl border-t border-border/60 pt-6">
        <PostList
          posts={posts}
          compact
          emptyMessage="No posts in this category yet."
        />
      </div>
    </div>
  );
}

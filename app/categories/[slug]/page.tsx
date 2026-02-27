import { getPostsByCategory, getCategories } from "@/lib/blog/get-categories";
import { PostList } from "@/components/blog/post-list";
import { CategoryNav } from "@/components/blog/category-nav";

type Params = { slug: string };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const posts = getPostsByCategory(slug);
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {category?.name || slug}
        </h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in this
          category.
        </p>
      </div>

      {/* Category filter */}
      <div className="mx-auto w-full max-w-4xl">
        <CategoryNav categories={categories} activeSlug={slug} />
      </div>

      {/* Posts */}
      <div className="mx-auto w-full max-w-4xl">
        <PostList posts={posts} emptyMessage="No posts in this category yet." />
      </div>
    </div>
  );
}

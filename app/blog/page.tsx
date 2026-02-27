import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getCategories } from "@/lib/blog/get-categories";
import { BlogSearchWrapper } from "@/components/blog/blog-search-wrapper";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getCategories();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          All Posts
        </h1>
        <p className="text-muted-foreground">Browse all published articles.</p>
      </div>

      <BlogSearchWrapper posts={posts} categories={categories} />
    </div>
  );
}

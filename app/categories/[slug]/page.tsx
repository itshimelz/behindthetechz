import { notFound } from "next/navigation";
import { TaxonomyDetailPage } from "@/components/blog/taxonomy-detail-page";
import { getCategories, getPostsByCategory } from "@/lib/blog/get-categories";

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
  const title = category.name;
  const postCountDescription = `${posts.length} ${
    posts.length === 1 ? "post" : "posts"
  } in this category.`;

  return (
    <TaxonomyDetailPage
      title={title}
      backHref="/categories"
      backLabel="All categories"
      articleSectionId="category-articles"
      postCountDescription={postCountDescription}
      emptyMessage="No posts in this category yet."
      posts={posts}
      showJump={false}
    />
  );
}

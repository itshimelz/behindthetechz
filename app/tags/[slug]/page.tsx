import { notFound } from "next/navigation";

import { getTags, getPostsByTag } from "@/lib/blog/get-tags";
import { TaxonomyDetailPage } from "@/components/blog/taxonomy-detail-page";

type Params = { slug: string };

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === decodedSlug);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(decodedSlug);
  const postCountDescription = `${posts.length} ${
    posts.length === 1 ? "post" : "posts"
  } tagged with this topic.`;

  return (
    <TaxonomyDetailPage
      title={tag.name}
      backHref="/tags"
      backLabel="All tags"
      articleSectionId="tag-articles"
      postCountDescription={postCountDescription}
      emptyMessage="No posts with this tag yet."
      posts={posts}
      showJump={posts.length > 3}
    />
  );
}

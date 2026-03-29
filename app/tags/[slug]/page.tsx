import { notFound } from "next/navigation";

import { getTags, getPostsByTag } from "@/lib/blog/get-tags";
import { PostList } from "@/components/blog/post-list";
import Link from "next/link";

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

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-4 md:px-8 md:pt-6">
      <section className="mx-auto w-full max-w-4xl space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {tag.name}
          </h1>
          <Link
            href="/tags"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All tags
          </Link>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged with this topic.
        </p>
      </section>

      {/* Posts */}
      <div
        id="tag-articles"
        className="mx-auto w-full max-w-4xl border-t border-border/60 pt-6"
      >
        <PostList
          posts={posts}
          compact
          emptyMessage="No posts with this tag yet."
        />
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";

import { getTags, getPostsByTag } from "@/lib/blog/get-tags";
import { DetailStickyHeader } from "@/components/blog/detail-sticky-header";
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
      <DetailStickyHeader
        title={tag.name}
        backHref="/tags"
        backLabel="All tags"
        jumpHref="#tag-articles"
        showJump={posts.length > 3}
      />

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
        {posts.length > 3 ? (
          <a
            href="#tag-articles"
            className="inline-flex w-fit items-center rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted md:hidden"
          >
            Jump to articles
          </a>
        ) : null}
      </section>

      {/* Posts */}
      <div id="tag-articles" className="mx-auto w-full max-w-4xl">
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
          emptyMessage="No posts with this tag yet."
        />
      </div>
    </div>
  );
}

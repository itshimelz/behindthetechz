import { notFound } from "next/navigation";

import { getTags, getPostsByTag } from "@/lib/blog/get-tags";
import { PostList } from "@/components/blog/post-list";
import { Badge } from "@/components/ui/badge";
import { getTagColorClass, cn } from "@/lib/utils";
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
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {tag.name}
        </h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged with
          this topic.
        </p>
      </div>

      {/* Tag filter showing all tags */}
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link key={t.slug} href={`/tags/${t.slug}`}>
              <Badge
                variant={t.slug === decodedSlug ? "default" : "secondary"}
                className={cn(
                  "rounded-md px-3 py-1 text-xs font-normal transition-all border cursor-pointer",
                  t.slug === decodedSlug
                    ? "ring-2 ring-primary/30"
                    : "hover:opacity-80",
                  getTagColorClass(t.name),
                )}
              >
                {t.name}
                <span className="ml-1.5 text-[10px] opacity-70">
                  {t.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto w-full max-w-4xl">
        <PostList posts={posts} emptyMessage="No posts with this tag yet." />
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { getPostStatusWhere } from "@/lib/blog/get-all-posts";
import type { Tag } from "@/lib/blog/types";

const BLOG_REVALIDATE_SECONDS = 300;

const getTagsCached = unstable_cache(
  async (includeDrafts: boolean) => {
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: {
            posts: {
              where: {
                post: getPostStatusWhere(includeDrafts),
              },
            },
          },
        },
      },
    });

    return tags
      .map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        count: tag._count.posts,
      }))
      .filter((tag) => tag.count > 0)
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },
  ["blog-tags"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts", "blog:tags"],
  },
);

export async function getTags(): Promise<Tag[]> {
  const includeDrafts = process.env.NODE_ENV !== "production";
  return getTagsCached(includeDrafts);
}

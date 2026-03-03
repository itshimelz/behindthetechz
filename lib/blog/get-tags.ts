import { unstable_cache } from "next/cache";

import { BLOG_CACHE_TAGS } from "@/lib/blog/cache-tags";
import { getPostStatusWhere } from "@/lib/blog/get-all-posts";
import type { Tag } from "@/lib/blog/types";
import { prisma } from "@/lib/prisma";

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
    tags: [BLOG_CACHE_TAGS.posts, BLOG_CACHE_TAGS.tags],
  },
);

export async function getTags(): Promise<Tag[]> {
  const includeDrafts = process.env.NODE_ENV !== "production";
  return getTagsCached(includeDrafts);
}

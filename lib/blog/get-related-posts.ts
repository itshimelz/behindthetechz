import { unstable_cache } from "next/cache";

import { BLOG_CACHE_TAGS, BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import {
  getPostStatusWhere,
  mapDbPostToPost,
  postWithRelationsInclude,
} from "@/lib/blog/get-all-posts";
import type { Post } from "@/lib/blog/types";
import { prisma } from "@/lib/prisma";

const getRelatedPostsCached = unstable_cache(
  async (
    currentSlug: string,
    category: string,
    tags: string[],
    limit: number,
    includeDrafts: boolean,
  ) => {
    // Find posts that share tags or the same category, excluding current
    const posts = await prisma.post.findMany({
      where: {
        ...getPostStatusWhere(includeDrafts),
        slug: { not: currentSlug },
        OR: [
          {
            categories: {
              some: {
                category: {
                  name: category,
                },
              },
            },
          },
          ...(tags.length > 0
            ? [
                {
                  tags: {
                    some: {
                      tag: {
                        name: { in: tags },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: postWithRelationsInclude,
      take: limit * 2, // fetch extra to allow ranking
    });

    const mappedPosts = posts.map(mapDbPostToPost);

    // Rank by number of shared tags
    const ranked = mappedPosts
      .map((post) => {
        const sharedTags = post.tags.filter((t) => tags.includes(t)).length;
        const sameCategory = post.category === category ? 1 : 0;
        return { post, score: sharedTags + sameCategory };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ post }) => post);

    return ranked;
  },
  ["blog-related-posts"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts],
  },
);

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3,
): Promise<Post[]> {
  const includeDrafts = false;
  return getRelatedPostsCached(
    currentSlug,
    category,
    tags,
    limit,
    includeDrafts,
  );
}

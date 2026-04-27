import { unstable_cache } from "next/cache";

import { BLOG_CACHE_TAGS, BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import {
  getPostStatusWhere,
  mapDbPostToPost,
  postWithRelationsInclude,
} from "@/lib/blog/get-all-posts";
import {
  sortAndFilterTaxonomyByCount,
  taxonomyPostCountSelect,
} from "@/lib/blog/taxonomy-query";
import type { Tag } from "@/lib/blog/types";
import { prisma } from "@/lib/prisma";

const getTagsCached = unstable_cache(
  async (includeDrafts: boolean) => {
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        slug: true,
        _count: {
          select: taxonomyPostCountSelect(includeDrafts),
        },
      },
    });

    return sortAndFilterTaxonomyByCount(
      tags.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
        count: tag._count.posts,
      })),
    );
  },
  ["blog-tags"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts, BLOG_CACHE_TAGS.tags],
  },
);

const getPostsByTagCached = unstable_cache(
  async (tagSlug: string, includeDrafts: boolean) => {
    const posts = await prisma.post.findMany({
      where: {
        ...getPostStatusWhere(includeDrafts),
        tags: {
          some: {
            tag: {
              slug: tagSlug,
            },
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: postWithRelationsInclude,
    });

    return posts.map(mapDbPostToPost);
  },
  ["blog-posts-by-tag"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts, BLOG_CACHE_TAGS.tags],
  },
);

export async function getTags(): Promise<Tag[]> {
  // Intentional: include drafts in non-production so authors can preview tag pages during development.
  const includeDrafts = process.env.NODE_ENV !== "production";
  return getTagsCached(includeDrafts);
}

export async function getPostsByTag(tagSlug: string) {
  const includeDrafts = false;
  return getPostsByTagCached(tagSlug, includeDrafts);
}


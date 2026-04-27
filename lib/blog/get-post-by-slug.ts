import { unstable_cache } from "next/cache";

import { BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/lib/blog/types";
import {
  getPostStatusWhere,
  mapDbPostToPost,
  postWithRelationsInclude,
} from "@/lib/blog/get-all-posts";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const includeDrafts = false; // Always hide drafts
  return getPostBySlugCached(slug, includeDrafts);
}

export async function getAllSlugs(): Promise<string[]> {
  const includeDrafts = false; // Always hide drafts
  return getAllSlugsCached(includeDrafts);
}

const getPostBySlugCached = unstable_cache(
  async (slug: string, includeDrafts: boolean) => {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        ...getPostStatusWhere(includeDrafts),
      },
      include: postWithRelationsInclude,
    });

    if (!post) return null;
    return mapDbPostToPost(post);
  },
  ["blog-post-by-slug"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts"],
  },
);

const getAllSlugsCached = unstable_cache(
  async (includeDrafts: boolean) => {
    const posts = await prisma.post.findMany({
      where: getPostStatusWhere(includeDrafts),
      select: { slug: true },
    });

    return posts.map((post) => post.slug);
  },
  ["blog-all-slugs"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts"],
  },
);

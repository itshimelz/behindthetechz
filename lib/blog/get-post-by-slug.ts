import { unstable_cache } from "next/cache";

import { BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import { prisma } from "@/lib/prisma";
import type { Post } from "@/lib/blog/types";
import {
  getPostStatusWhere,
  mapDbPostToPost,
  postWithRelationsInclude,
} from "@/lib/blog/get-all-posts";

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const post = await prisma.post.findFirst({
      where: {
        slug,
        ...getPostStatusWhere(false),
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

export const getAllSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const posts = await prisma.post.findMany({
      where: getPostStatusWhere(false),
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

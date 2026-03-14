import { Prisma, PostStatus } from "@/lib/generated/prisma/client";
import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { Post, PostFrontmatter } from "@/lib/blog/types";
export type { Post };

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export const postWithRelationsInclude = {
  categories: {
    orderBy: { assignedAt: "asc" as const },
    include: { category: true },
  },
  tags: {
    include: { tag: true },
  },
} satisfies Prisma.PostInclude;

export type DbPostWithRelations = Prisma.PostGetPayload<{
  include: typeof postWithRelationsInclude;
}>;

export function getPostStatusWhere(
  includeDrafts: boolean,
): Prisma.PostWhereInput {
  return includeDrafts
    ? { status: { in: [PostStatus.DRAFT, PostStatus.PUBLISHED] } }
    : { status: PostStatus.PUBLISHED };
}

export function mapDbPostToPost(post: DbPostWithRelations): Post {
  const content = post.contentMdx;
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = calculateReadingTime(content);
  const primaryCategory = post.categories[0]?.category.name || "Uncategorized";

  const frontmatter: PostFrontmatter = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.createdAt).toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    coverImage: post.coverImage || undefined,
    category: primaryCategory,
    tags: post.tags.map((entry) => entry.tag.name),
    featured: post.isFeatured,
    draft: post.status !== PostStatus.PUBLISHED,
    // We type-cast here because the TS server might be lagging on the new DB columns
    viewCount: ((post as Record<string, unknown>).viewCount as number) ?? 0,
    clapCount: ((post as Record<string, unknown>).clapCount as number) ?? 0,
    seriesId:
      ((post as Record<string, unknown>).seriesId as string) || undefined,
    seriesOrder:
      ((post as Record<string, unknown>).seriesOrder as number) ?? undefined,
  };

  return {
    ...frontmatter,
    content,
    readingTime,
    wordCount,
  };
}

const BLOG_REVALIDATE_SECONDS = 300;

const getAllPostsCached = unstable_cache(
  async (includeDrafts: boolean) => {
    const posts = await prisma.post.findMany({
      where: getPostStatusWhere(includeDrafts),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: postWithRelationsInclude,
    });

    return posts.map(mapDbPostToPost);
  },
  ["blog-all-posts"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts"],
  },
);

const getRecentPostLinksCached = unstable_cache(
  async (includeDrafts: boolean, limit: number) => {
    return prisma.post.findMany({
      where: getPostStatusWhere(includeDrafts),
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        slug: true,
        title: true,
        publishedAt: true,
      },
    });
  },
  ["blog-recent-post-links"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts"],
  },
);

const getPublishedPostCountCached = unstable_cache(
  async () => {
    return prisma.post.count({
      where: { status: PostStatus.PUBLISHED },
    });
  },
  ["blog-published-post-count"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts"],
  },
);

export async function getAllPosts(): Promise<Post[]> {
  const includeDrafts = false; // Always hide drafts
  return getAllPostsCached(includeDrafts);
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured);
}

export type RecentPostLink = {
  slug: string;
  title: string;
  publishedAt: Date | null;
};

export async function getRecentPostLinks(limit = 5): Promise<RecentPostLink[]> {
  const includeDrafts = false; // Always hide drafts
  return getRecentPostLinksCached(includeDrafts, limit);
}

export async function getPublishedPostCount(): Promise<number> {
  return getPublishedPostCountCached();
}

import { unstable_cache } from "next/cache";

import { BLOG_CACHE_TAGS, BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import { getPostStatusWhere, calculateReadingTime } from "@/lib/blog/get-all-posts";
import { prisma } from "@/lib/prisma";

export type SeriesPost = {
  slug: string;
  title: string;
  seriesOrder: number | null;
  readingTime?: number;
};

export type SeriesWithPosts = {
  name: string;
  slug: string;
  description: string | null;
  posts: SeriesPost[];
};

const getSeriesForPostCached = unstable_cache(
  async (seriesId: string) => {
    const series = await prisma.series.findUnique({
      where: { id: seriesId },
      include: {
        posts: {
          where: getPostStatusWhere(false),
          orderBy: { seriesOrder: "asc" },
          select: {
            slug: true,
            title: true,
            seriesOrder: true,
            contentMdx: true,
          },
        },
      },
    });

    if (!series) return null;

    return {
      name: series.name,
      slug: series.slug,
      description: series.description,
      posts: series.posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        seriesOrder: p.seriesOrder,
        readingTime: calculateReadingTime(p.contentMdx),
      })),
    } as SeriesWithPosts;
  },
  ["blog-series-for-post"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts],
  },
);

const getAllSeriesCached = unstable_cache(
  async () => {
    const series = await prisma.series.findMany({
      select: {
        name: true,
        slug: true,
        description: true,
        _count: {
          select: { posts: true },
        },
        posts: {
          where: getPostStatusWhere(false),
          take: 1,
          orderBy: { seriesOrder: "asc" },
          select: { slug: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return series.map((s) => ({
      name: s.name,
      slug: s.slug,
      description: s.description,
      postCount: s._count.posts,
      firstPostSlug: s.posts[0]?.slug ?? null,
    }));
  },
  ["blog-all-series"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts],
  },
);

export async function getSeriesForPost(seriesId: string) {
  return getSeriesForPostCached(seriesId);
}

export async function getAllSeries() {
  return getAllSeriesCached();
}

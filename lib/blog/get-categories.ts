import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import {
  getPostStatusWhere,
  mapDbPostToPost,
  postWithRelationsInclude,
} from "@/lib/blog/get-all-posts";
import {
  sortAndFilterTaxonomyByCount,
  taxonomyPostCountSelect,
} from "@/lib/blog/taxonomy-query";
import type { Category } from "@/lib/blog/types";

const getCategoriesCached = unstable_cache(
  async (includeDrafts: boolean) => {
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        slug: true,
        iconKey: true,
        _count: {
          select: taxonomyPostCountSelect(includeDrafts),
        },
      },
    });

    return sortAndFilterTaxonomyByCount(
      categories.map((category) => ({
        name: category.name,
        slug: category.slug,
        iconKey: category.iconKey,
        count: category._count.posts,
      })),
    );
  },
  ["blog-categories"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts", "blog:categories"],
  },
);

const getPostsByCategoryCached = unstable_cache(
  async (categorySlug: string, includeDrafts: boolean) => {
    const posts = await prisma.post.findMany({
      where: {
        ...getPostStatusWhere(includeDrafts),
        categories: {
          some: {
            category: {
              slug: categorySlug,
            },
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: postWithRelationsInclude,
    });

    return posts.map(mapDbPostToPost);
  },
  ["blog-posts-by-category"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: ["blog:posts", "blog:categories"],
  },
);

export async function getCategories(): Promise<Category[]> {
  const includeDrafts = false; // Always hide drafts
  return getCategoriesCached(includeDrafts);
}

export async function getPostsByCategory(categorySlug: string) {
  const includeDrafts = false; // Always hide drafts
  return getPostsByCategoryCached(categorySlug, includeDrafts);
}

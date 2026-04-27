import { unstable_cache } from "next/cache";

import { BLOG_CACHE_TAGS, BLOG_REVALIDATE_SECONDS } from "@/lib/blog/cache-tags";
import { getAllPosts } from "@/lib/blog/get-all-posts";
import { extractWikiLinkSlugs } from "@/lib/blog/remark-wiki-link";

export type BacklinkEntry = {
  slug: string;
  title: string;
};

const getBacklinksForSlugCached = unstable_cache(
  async (targetSlug: string) => {
    const posts = await getAllPosts();
    const backlinks: BacklinkEntry[] = [];

    for (const post of posts) {
      if (post.slug === targetSlug) continue;

      const linkedSlugs = extractWikiLinkSlugs(post.content);
      if (linkedSlugs.includes(targetSlug)) {
        backlinks.push({ slug: post.slug, title: post.title });
      }
    }

    return backlinks;
  },
  ["blog-backlinks-for-slug"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts, BLOG_CACHE_TAGS.backlinks],
  },
);

const getAllBacklinksCached = unstable_cache(
  async () => {
    const posts = await getAllPosts();
    const map = new Map<string, BacklinkEntry[]>();

    for (const post of posts) {
      const linkedSlugs = extractWikiLinkSlugs(post.content);

      for (const linkedSlug of linkedSlugs) {
        if (linkedSlug === post.slug) continue;

        const existing = map.get(linkedSlug) || [];
        existing.push({ slug: post.slug, title: post.title });
        map.set(linkedSlug, existing);
      }
    }

    return map;
  },
  ["blog-all-backlinks"],
  {
    revalidate: BLOG_REVALIDATE_SECONDS,
    tags: [BLOG_CACHE_TAGS.posts, BLOG_CACHE_TAGS.backlinks],
  },
);

/**
 * Get all posts that link TO the given slug via wiki links.
 */
export async function getBacklinksForSlug(
  targetSlug: string,
): Promise<BacklinkEntry[]> {
  return getBacklinksForSlugCached(targetSlug);
}

/**
 * Build a complete backlinks map for all posts.
 * Returns Map<targetSlug, BacklinkEntry[]>
 */
export async function getAllBacklinks(): Promise<Map<string, BacklinkEntry[]>> {
  return getAllBacklinksCached();
}

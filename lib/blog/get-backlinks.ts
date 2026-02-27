import { getAllPosts } from "@/lib/blog/get-all-posts";
import { extractWikiLinkSlugs } from "@/lib/blog/remark-wiki-link";

export type BacklinkEntry = {
  slug: string;
  title: string;
};

/**
 * Get all posts that link TO the given slug via wiki links.
 */
export function getBacklinksForSlug(targetSlug: string): BacklinkEntry[] {
  const posts = getAllPosts();
  const backlinks: BacklinkEntry[] = [];

  for (const post of posts) {
    if (post.slug === targetSlug) continue;

    const linkedSlugs = extractWikiLinkSlugs(post.content);
    if (linkedSlugs.includes(targetSlug)) {
      backlinks.push({ slug: post.slug, title: post.title });
    }
  }

  return backlinks;
}

/**
 * Build a complete backlinks map for all posts.
 * Returns Map<targetSlug, BacklinkEntry[]>
 */
export function getAllBacklinks(): Map<string, BacklinkEntry[]> {
  const posts = getAllPosts();
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
}

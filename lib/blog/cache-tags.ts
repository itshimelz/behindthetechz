import { revalidateTag } from "next/cache";

export const BLOG_CACHE_TAGS = {
  posts: "blog:posts",
  categories: "blog:categories",
  tags: "blog:tags",
  backlinks: "blog:backlinks",
  graph: "blog:graph",
} as const;

export const BLOG_REVALIDATE_SECONDS = 300;

export const BLOG_DEFAULT_REVALIDATE_TAGS = [
  BLOG_CACHE_TAGS.posts,
  BLOG_CACHE_TAGS.categories,
  BLOG_CACHE_TAGS.tags,
  BLOG_CACHE_TAGS.backlinks,
  BLOG_CACHE_TAGS.graph,
] as const;

export function revalidateCacheTags(tags: readonly string[]): string[] {
  const uniqueTags = Array.from(new Set(tags.filter(Boolean)));
  for (const tag of uniqueTags) {
    revalidateTag(tag, "max");
  }
  return uniqueTags;
}

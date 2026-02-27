import { getAllPosts } from "@/lib/blog/get-all-posts";
import type { Category } from "@/lib/blog/types";

export function getCategories(): Category[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, number>();

  for (const post of posts) {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByCategory(categorySlug: string) {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase().replace(/\s+/g, "-") === categorySlug,
  );
}

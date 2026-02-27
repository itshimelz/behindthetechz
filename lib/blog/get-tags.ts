import { getAllPosts } from "@/lib/blog/get-all-posts";
import type { Tag } from "@/lib/blog/types";

export function getTags(): Tag[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { Post, PostFrontmatter } from "@/lib/blog/types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function parsePost(slug: string, fileContent: string): Post {
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;

  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = calculateReadingTime(content);

  return {
    ...frontmatter,
    slug: frontmatter.slug || slug,
    content,
    readingTime,
    wordCount,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const filePath = path.join(POSTS_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      return parsePost(slug, fileContent);
    })
    .filter((post) => {
      if (process.env.NODE_ENV === "production") {
        return !post.draft;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((post) => post.featured);
}

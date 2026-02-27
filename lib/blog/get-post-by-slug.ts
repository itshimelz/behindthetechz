import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { Post, PostFrontmatter } from "@/lib/blog/types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as PostFrontmatter;

  const wordCount = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    ...frontmatter,
    slug: frontmatter.slug || slug,
    content,
    readingTime,
    wordCount,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

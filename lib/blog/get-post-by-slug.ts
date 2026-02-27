import fs from "fs";
import path from "path";
import type { Post } from "@/lib/blog/types";
import { parsePost } from "@/lib/blog/get-all-posts";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parsePost(slug, fileContent);
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

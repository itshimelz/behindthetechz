/**
 * Human-readable title → URL slug (aligned with Obsidian-style filenames).
 * Dots become hyphens so e.g. "Mastering Next.js App Router" → "mastering-next-js-app-router".
 */
export function titleToFilename(title: string): string {
  return title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\./g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .trim();
}

/**
 * Convert an arbitrary string (category, tag, post title) into a clean, URL-safe slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/^\[\[(.*)\]\]$/, "$1")
    .replace(/^\[(.*)\]$/, "$1")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (_, slug: string, _pipe: string, label: string) => label ?? slug)
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function createHeadingId(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  const fallback = base || "section";
  const count = seen.get(fallback) ?? 0;
  seen.set(fallback, count + 1);

  return count === 0 ? fallback : `${fallback}-${count}`;
}

export function extractTocHeadings(source: string): TocHeading[] {
  const lines = source.split(/\r?\n/);
  const headings: TocHeading[] = [];
  const seenIds = new Map<string, number>();
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) {
      continue;
    }

    const match = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    if (level !== 2 && level !== 3) {
      continue;
    }

    const text = stripInlineMarkdown(match[2]);
    if (!text) {
      continue;
    }

    headings.push({
      id: createHeadingId(text, seenIds),
      text,
      level,
    });
  }

  return headings;
}

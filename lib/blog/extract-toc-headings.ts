import GithubSlugger from "github-slugger";

export type TocHeading = {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
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

export function extractTocHeadings(source: string): TocHeading[] {
  const lines = source.split(/\r?\n/);
  const headings: TocHeading[] = [];
  const slugger = new GithubSlugger();
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

    const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (!match) {
      continue;
    }

    const level = match[1].length as TocHeading["level"];

    const text = stripInlineMarkdown(match[2]);
    if (!text) {
      continue;
    }

    headings.push({
      id: slugger.slug(text),
      text,
      level,
    });
  }

  return headings;
}

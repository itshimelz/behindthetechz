import type {
  Root,
  Text,
  Link as MdastLink,
  PhrasingContent,
  Parent,
} from "mdast";
import type { Plugin } from "unified";

/**
 * Remark plugin that transforms Obsidian-style wiki links into markdown links.
 *
 * Syntax:
 *   [[slug]]         → <a href="/blog/slug" class="wiki-link">slug</a>
 *   [[slug|display]] → <a href="/blog/slug" class="wiki-link">display</a>
 */
const remarkWikiLink: Plugin<[], Root> = () => {
  return (tree) => {
    visitTextNodes(tree as Parent);
  };
};

function visitTextNodes(node: Parent) {
  if (!node.children) return;

  const newChildren: typeof node.children = [];

  for (const child of node.children) {
    if (child.type === "text") {
      const parts = parseWikiLinks((child as Text).value);
      newChildren.push(...parts);
    } else {
      if ("children" in child) {
        visitTextNodes(child as Parent);
      }
      newChildren.push(child);
    }
  }

  node.children = newChildren;
}

function parseWikiLinks(text: string): PhrasingContent[] {
  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  const parts: PhrasingContent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before the wiki link
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      } as Text);
    }

    const slug = match[1].trim();
    const displayText = match[2]?.trim() || slug;

    // Create a link node with wiki-link class
    parts.push({
      type: "link",
      url: `/blog/${slug}`,
      data: {
        hProperties: { className: "wiki-link" },
      },
      children: [{ type: "text", value: displayText } as Text],
    } as MdastLink);

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last wiki link
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      value: text.slice(lastIndex),
    } as Text);
  }

  // If no wiki links found, return the original text node
  if (parts.length === 0) {
    parts.push({ type: "text", value: text } as Text);
  }

  return parts;
}

export default remarkWikiLink;

/**
 * Extract all wiki link slugs from raw MDX content string.
 * Used by backlinks and graph data utilities.
 */
export function extractWikiLinkSlugs(content: string): string[] {
  const regex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const slugs: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    slugs.push(match[1].trim());
  }

  return [...new Set(slugs)];
}

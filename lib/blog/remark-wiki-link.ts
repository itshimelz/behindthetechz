import type {
  Root,
  Text,
  Link as MdastLink,
  PhrasingContent,
  Parent,
} from "mdast";
import type { Plugin } from "unified";

import { titleToFilename } from "@/lib/blog/title-to-filename";

const WIKI_LINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const BLOCK_ANCHOR_PREFIX = "block-";

type ParsedWikiTarget = {
  slug: string | null;
  fragment: string | null;
};

/**
 * Remark plugin that transforms Obsidian-style wiki links into markdown links.
 *
 * The link target (left of `|`, or whole `[[…]]` when no pipe) may be a human title.
 * It is normalized with {@link titleToFilename} so it matches DB slugs from your Obsidian plugin.
 *
 * Syntax:
 *   [[Title]]              → href `/blog/<slugified-title>`
 *   [[Title|display text]] → same href, display text as link label
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
  WIKI_LINK_REGEX.lastIndex = 0;
  const parts: PhrasingContent[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = WIKI_LINK_REGEX.exec(text)) !== null) {
    // Text before the wiki link
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      } as Text);
    }

    const target = match[1].trim();
    const displayText = match[2]?.trim() || target;
    const url = buildWikiHref(target);

    // Create a link node with wiki-link class
    parts.push({
      type: "link",
      url,
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

function buildWikiHref(target: string): string {
  const { slug: rawSlug, fragment } = parseWikiTarget(target);

  if (!rawSlug && !fragment) return "#";

  const fragmentPart = fragment ? `#${fragment}` : "";
  const slug = rawSlug ? titleToFilename(rawSlug) : "";
  if (!slug && !fragment) return "#";
  if (!slug) return fragmentPart || "#";

  return `/blog/${slug}${fragmentPart}`;
}

function parseWikiTarget(target: string): ParsedWikiTarget {
  const trimmed = target.trim();
  if (!trimmed) {
    return { slug: null, fragment: null };
  }

  const hashIndex = trimmed.indexOf("#");
  if (hashIndex === -1) {
    return { slug: trimmed, fragment: null };
  }

  const slugPart = trimmed.slice(0, hashIndex).trim();
  const rawFragment = trimmed.slice(hashIndex + 1).trim();

  return {
    slug: slugPart || null,
    fragment: normalizeFragment(rawFragment),
  };
}

function normalizeFragment(fragment: string): string | null {
  if (!fragment) return null;

  if (fragment.startsWith("^")) {
    return toBlockAnchorId(fragment.slice(1));
  }

  return slugifyHeadingFragment(fragment);
}

function slugifyHeadingFragment(fragment: string): string {
  return fragment
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'`]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function toBlockAnchorId(rawBlockId: string): string {
  const normalized = rawBlockId
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}_-]/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${BLOCK_ANCHOR_PREFIX}${normalized}`;
}

/**
 * Extract all wiki link slugs from raw MDX content string.
 * Used by backlinks and graph data utilities.
 */
export function extractWikiLinkSlugs(content: string): string[] {
  WIKI_LINK_REGEX.lastIndex = 0;
  const slugs: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
    const target = match[1].trim();
    const { slug: rawSlug } = parseWikiTarget(target);
    if (rawSlug) {
      const slug = titleToFilename(rawSlug);
      if (slug) slugs.push(slug);
    }
  }

  return [...new Set(slugs)];
}

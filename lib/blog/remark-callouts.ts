import type { Blockquote, Paragraph, Root, Strong, Text } from "mdast";
import type { Plugin } from "unified";

const CALLOUT_LABELS = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
} as const;

type CalloutType = keyof typeof CALLOUT_LABELS;

const CALLOUT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)$/i;

const remarkCallouts: Plugin<[], Root> = () => {
  return (tree) => {
    transformNode(tree);
  };
};

function transformNode(node: { children?: unknown[] }) {
  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    if (isBlockquote(child)) {
      transformBlockquote(child);
    }

    if (hasChildren(child)) {
      transformNode(child);
    }
  }
}

function transformBlockquote(node: Blockquote) {
  const firstParagraph = node.children[0];
  if (!isParagraph(firstParagraph)) return;

  const firstText = firstParagraph.children[0];
  if (!isText(firstText)) return;

  const markerMatch = firstText.value.match(CALLOUT_MARKER);
  if (!markerMatch) return;

  const calloutType = markerMatch[1].toLowerCase() as CalloutType;
  const customTitle = markerMatch[2]?.trim();
  const title = customTitle || CALLOUT_LABELS[calloutType];

  const markerTextLength = markerMatch[0].length;
  firstText.value = firstText.value.slice(markerTextLength).trimStart();

  if (firstParagraph.children.every(isWhitespaceText)) {
    node.children.shift();
  }

  const data = (node.data ??= {});
  data.hName = "callout";
  data.hProperties = {
    ...data.hProperties,
    type: calloutType,
    title: title,
  };
}

function createTitleParagraph(title: string): Paragraph {
  return {
    type: "paragraph",
    data: {
      hProperties: {
        className: ["callout-title"],
      },
    },
    children: [
      {
        type: "strong",
        children: [{ type: "text", value: title }],
      } satisfies Strong,
    ],
  };
}

function isBlockquote(node: unknown): node is Blockquote {
  return Boolean(node && typeof node === "object" && (node as Blockquote).type === "blockquote");
}

function isParagraph(node: unknown): node is Paragraph {
  return Boolean(node && typeof node === "object" && (node as Paragraph).type === "paragraph");
}

function isText(node: unknown): node is Text {
  return Boolean(node && typeof node === "object" && (node as Text).type === "text");
}

function hasChildren(node: unknown): node is { children: unknown[] } {
  return Boolean(node && typeof node === "object" && Array.isArray((node as { children?: unknown[] }).children));
}

function isWhitespaceText(node: unknown) {
  return isText(node) && node.value.trim() === "";
}

export default remarkCallouts;

import type { Parent, Paragraph, Root, Text } from "mdast";
import type { Plugin } from "unified";

import { toBlockAnchorId } from "@/lib/blog/remark-wiki-link";

const BLOCK_ID_MARKER_REGEX = /\s\^([^\s^]+)\s*$/;

const remarkObsidianBlockId: Plugin<[], Root> = () => {
  return (tree) => {
    visitNodes(tree as Parent);
  };
};

function visitNodes(node: Parent) {
  if (!node.children) return;

  for (const child of node.children) {
    if (child.type === "paragraph") {
      applyBlockIdFromMarker(child as Paragraph);
    }

    if ("children" in child) {
      visitNodes(child as Parent);
    }
  }
}

function applyBlockIdFromMarker(paragraph: Paragraph) {
  const lastChild = paragraph.children[paragraph.children.length - 1];
  if (!lastChild || lastChild.type !== "text") return;

  const lastTextNode = lastChild as Text;
  const markerMatch = BLOCK_ID_MARKER_REGEX.exec(lastTextNode.value);
  if (!markerMatch) return;

  const textWithoutMarker = lastTextNode.value
    .slice(0, markerMatch.index)
    .trimEnd();

  if (textWithoutMarker.length === 0) {
    paragraph.children = paragraph.children.slice(0, -1);
  } else {
    lastTextNode.value = textWithoutMarker;
  }

  const existingData = paragraph.data ?? {};
  const existingHProperties =
    (existingData.hProperties as Record<string, unknown> | undefined) ?? {};

  paragraph.data = {
    ...existingData,
    hProperties: {
      ...existingHProperties,
      id: toBlockAnchorId(markerMatch[1]),
    },
  };
}

export default remarkObsidianBlockId;

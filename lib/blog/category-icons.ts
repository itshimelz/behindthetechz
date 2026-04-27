import type { ComponentProps } from "react";
import {
  ChartBubble02Icon,
  GridViewIcon,
  Notebook01Icon,
  Bookmark02Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const CATEGORY_ICON_BY_KEY: Record<string, ComponentProps<typeof HugeiconsIcon>["icon"]> = {
  tag: Tag01Icon,
  programming: Notebook01Icon,
  development: Notebook01Icon,
  design: GridViewIcon,
  productivity: Bookmark02Icon,
  graph: ChartBubble02Icon,
};

export function getCategoryIconByKey(iconKey?: string) {
  if (!iconKey) return Tag01Icon;
  return CATEGORY_ICON_BY_KEY[iconKey] ?? Tag01Icon;
}

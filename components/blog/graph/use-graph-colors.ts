import { useMemo } from "react";

export type GraphColors = {
  background: string;
  link: string;
  linkDim: string;
  linkActive: string;
  nodeDim: string;
  nodeSelected: string;
  text: string;
  textMuted: string;
};

export function useGraphColors(isDark: boolean): GraphColors {
  return useMemo(() => {
    const fallback = {
      background: isDark ? "#12161B" : "#F5F7F8",
      link: isDark ? "rgba(148, 156, 168, 0.28)" : "rgba(124, 133, 145, 0.32)",
      linkDim: isDark
        ? "rgba(101, 111, 123, 0.14)"
        : "rgba(145, 153, 162, 0.16)",
      linkActive: isDark
        ? "rgba(196, 205, 214, 0.68)"
        : "rgba(95, 107, 123, 0.64)",
      nodeDim: isDark ? "#3f4652" : "#cfd5dc",
      nodeSelected: isDark ? "#bcc7d5" : "#56677c",
      text: isDark ? "#dbe2ea" : "#374151",
      textMuted: isDark ? "#9aa5b3" : "#6b7280",
    };

    if (typeof window === "undefined") return fallback;

    const styles = getComputedStyle(document.documentElement);
    const pick = (name: string, fallbackValue: string) => {
      const cssValue = styles.getPropertyValue(name).trim();
      return cssValue || fallbackValue;
    };

    return {
      background: pick("--graph-bg", fallback.background),
      link: pick("--graph-link", fallback.link),
      linkDim: pick("--graph-link-dim", fallback.linkDim),
      linkActive: pick("--graph-link-active", fallback.linkActive),
      nodeDim: pick("--graph-node-dim", fallback.nodeDim),
      nodeSelected: pick("--graph-node-selected", fallback.nodeSelected),
      text: pick("--graph-label", fallback.text),
      textMuted: pick("--graph-label-muted", fallback.textMuted),
    };
  }, [isDark]);
}

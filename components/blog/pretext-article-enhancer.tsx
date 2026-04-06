"use client";

import { useEffect } from "react";

type PretextModule = typeof import("@chenglou/pretext");

const DEFAULT_TARGET_SELECTOR = ".prose";
const DEFAULT_HEADING_SELECTOR = "h2, h3";
const DEFAULT_MEASURE_SELECTOR = "p, .callout";
const EXCLUDED_ANCESTOR_SELECTOR = [
  "pre",
  "code",
  "kbd",
  "samp",
  "table",
  ".katex",
  ".katex-display",
  "[data-rehype-pretty-code-fragment]",
  ".not-prose",
].join(", ");

let pretextPromise: Promise<PretextModule> | null = null;

const preparedCache = new Map<string, ReturnType<PretextModule["prepare"]>>();
const preparedWithSegmentsCache = new Map<
  string,
  ReturnType<PretextModule["prepareWithSegments"]>
>();

function loadPretext(): Promise<PretextModule> {
  if (!pretextPromise) {
    pretextPromise = import("@chenglou/pretext");
  }
  return pretextPromise;
}

function toCanvasFont(style: CSSStyleDeclaration): string {
  const fontStyle = style.fontStyle || "normal";
  const fontVariant = style.fontVariant || "normal";
  const fontWeight = style.fontWeight || "400";
  const fontSize = style.fontSize || "16px";
  const fontFamily = style.fontFamily || "sans-serif";
  return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;
}

function toLineHeight(style: CSSStyleDeclaration): number {
  const parsed = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(parsed)) {
    return parsed;
  }
  const fontSize = Number.parseFloat(style.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.4 : 22.4;
}

function isEligibleNode(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement)) {
    return false;
  }
  return !element.closest(EXCLUDED_ANCESTOR_SELECTOR);
}

function toDensityBucket(lineCount: number): "short" | "medium" | "long" {
  if (lineCount >= 8) {
    return "long";
  }
  if (lineCount >= 4) {
    return "medium";
  }
  return "short";
}

function applyHeadingBalancing(
  root: HTMLElement,
  pretext: PretextModule,
  headingSelector: string,
): void {
  const headings = root.querySelectorAll(headingSelector);
  for (const element of headings) {
    if (!isEligibleNode(element)) {
      continue;
    }

    const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (text.length < 16) {
      element.classList.remove("pretext-balance-heading");
      element.removeAttribute("data-pretext-lines");
      continue;
    }

    const style = window.getComputedStyle(element);
    const font = toCanvasFont(style);
    const lineHeight = toLineHeight(style);
    const width = element.getBoundingClientRect().width;

    if (width <= 0 || lineHeight <= 0) {
      continue;
    }

    const cacheKey = `${text}\u241f${font}`;
    const prepared =
      preparedWithSegmentsCache.get(cacheKey) ??
      pretext.prepareWithSegments(text, font);
    preparedWithSegmentsCache.set(cacheKey, prepared);

    const { lines, lineCount } = pretext.layoutWithLines(prepared, width, lineHeight);
    if (lineCount < 2 || lines.length < 2) {
      element.classList.remove("pretext-balance-heading");
      element.setAttribute("data-pretext-lines", String(lineCount));
      continue;
    }

    const widths = lines.map((line) => line.width);
    const previousMax = Math.max(...widths.slice(0, -1));
    const lastWidth = widths[widths.length - 1] ?? previousMax;
    const lastRatio = previousMax > 0 ? lastWidth / previousMax : 1;

    // Balance headings only when the last line is noticeably shorter.
    const shouldBalance = lineCount === 2 ? lastRatio < 0.72 : lastRatio < 0.58;

    element.classList.toggle("pretext-balance-heading", shouldBalance);
    element.setAttribute("data-pretext-lines", String(lineCount));
    element.style.setProperty("--pretext-measured-height", `${lineCount * lineHeight}px`);
  }
}

function applyBlockMeasurements(
  root: HTMLElement,
  pretext: PretextModule,
  measureSelector: string,
): void {
  const blocks = root.querySelectorAll(measureSelector);
  for (const element of blocks) {
    if (!isEligibleNode(element)) {
      continue;
    }

    const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (!text) {
      continue;
    }

    const style = window.getComputedStyle(element);
    const font = toCanvasFont(style);
    const lineHeight = toLineHeight(style);
    const width = element.getBoundingClientRect().width;

    if (width <= 0 || lineHeight <= 0) {
      continue;
    }

    const cacheKey = `${text}\u241f${font}`;
    const prepared =
      preparedCache.get(cacheKey) ?? pretext.prepare(text, font);
    preparedCache.set(cacheKey, prepared);

    const { lineCount, height } = pretext.layout(prepared, width, lineHeight);
    element.setAttribute("data-pretext-lines", String(lineCount));
    element.setAttribute("data-pretext-density", toDensityBucket(lineCount));
    element.style.setProperty("--pretext-measured-height", `${height}px`);
    element.style.setProperty("--pretext-line-count", String(lineCount));
  }
}

type PretextArticleEnhancerProps = {
  targetSelector?: string;
  headingSelector?: string;
  measureSelector?: string;
};

export function PretextArticleEnhancer({
  targetSelector = DEFAULT_TARGET_SELECTOR,
  headingSelector = DEFAULT_HEADING_SELECTOR,
  measureSelector = DEFAULT_MEASURE_SELECTOR,
}: PretextArticleEnhancerProps = {}) {
  useEffect(() => {
    let cancelled = false;
    let frame = 0;

    const root = document.querySelector(targetSelector);
    if (!(root instanceof HTMLElement)) {
      return;
    }

    const runEnhancement = async () => {
      try {
        const pretext = await loadPretext();
        if (cancelled || !root.isConnected) {
          return;
        }
        applyHeadingBalancing(root, pretext, headingSelector);
        applyBlockMeasurements(root, pretext, measureSelector);
      } catch {
        // Fallback to the existing rendering if the enhancer cannot run.
      }
    };

    const scheduleEnhancement = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        void runEnhancement();
      });
    };

    scheduleEnhancement();

    const resizeObserver = new ResizeObserver(() => {
      scheduleEnhancement();
    });
    resizeObserver.observe(root);

    void document.fonts?.ready.then(() => {
      if (!cancelled) {
        scheduleEnhancement();
      }
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [targetSelector, headingSelector, measureSelector]);

  return null;
}

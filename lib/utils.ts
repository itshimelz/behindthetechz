import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categoryColors = [
  "bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-100 dark:border-zinc-700/60",
];

const tagColors = [
  "bg-zinc-100 text-zinc-900 border-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-100 dark:border-zinc-700/60",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getCategoryColorClass(categoryName: string) {
  return categoryColors[hashString(categoryName) % categoryColors.length];
}

export function getTagColorClass(tagName: string) {
  return tagColors[hashString(tagName) % tagColors.length];
}



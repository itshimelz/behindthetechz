import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categoryColors = [
  "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
  "bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50",
  "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
  "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50",
  "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-800/50",
  "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/50",
  "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-200/50 dark:border-fuchsia-800/50",
];

const tagColors = [
  "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200/50 dark:border-teal-800/50",
  "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50",
  "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/50",
  "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-200/50 dark:border-lime-800/50",
  "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50",
  "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/50",
  "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200/50 dark:border-yellow-800/50",
  "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200/50 dark:border-red-800/50",
  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
  "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-800/50",
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


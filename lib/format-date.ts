const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const DATE_PRESETS = {
  compact: { month: "short", day: "numeric" } as Intl.DateTimeFormatOptions,
  standard: { month: "short", day: "numeric", year: "numeric" } as Intl.DateTimeFormatOptions,
  full: { month: "long", day: "numeric", year: "numeric" } as Intl.DateTimeFormatOptions,
} as const;

export function formatPostDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = DATE_PRESETS.full,
): string {
  return new Date(dateStr).toLocaleDateString("en-US", options);
}

export function getRelativeTimeString(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}

export function relativeDate(date: Date | string | null): string {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - parsedDate.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1d";
  if (diffDays < 7) return `${diffDays}d`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;

  return formatPostDate(parsedDate.toISOString(), DATE_PRESETS.compact);
}

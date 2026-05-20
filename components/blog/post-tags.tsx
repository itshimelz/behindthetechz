import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { formatPostDate } from "@/lib/format-date";

type Props = {
  tags: string[];
  category: string;
  date: string;
};

export function PostTags({ tags, category, date }: Props) {
  if (tags.length === 0) return null;

  const toTagSlug = (tag: string) =>
    tag.trim().toLowerCase().replace(/\s+/g, "-");

  const formattedDate = formatPostDate(date, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="mx-auto w-full max-w-3xl space-y-4">
      {/* Labeled divider */}
      <div className="flex items-center gap-3">
        <div className="flex shrink-0 items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <HugeiconsIcon
            icon={Tag01Icon}
            className="size-3.5"
            strokeWidth={2}
          />
          <span>Tags</span>
        </div>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(toTagSlug(tag))}`}>
            <Badge
              variant="outline"
              className="cursor-pointer px-3 py-1 text-xs transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
            >
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Meta line: Category · Date */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        <Link
          href={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
          className="font-medium text-foreground/80 transition-colors hover:text-foreground"
        >
          {category}
        </Link>
        <span aria-hidden="true">·</span>
        <span>{formattedDate}</span>
      </div>
    </section>
  );
}

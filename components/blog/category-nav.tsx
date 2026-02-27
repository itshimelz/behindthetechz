import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/blog/types";

type Props = {
  categories: Category[];
  activeSlug?: string;
};

export function CategoryNav({ categories, activeSlug }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
      <Link href="/blog">
        <Badge
          variant={!activeSlug ? "default" : "secondary"}
          className={`cursor-pointer transition-all hover:scale-105 ${
            !activeSlug
              ? "shadow-md hover:shadow-lg"
              : "bg-card text-muted-foreground hover:bg-muted/80 border border-border/40 hover:border-border/80"
          } rounded-full px-4 py-1.5 text-sm font-medium`}
        >
          All
        </Badge>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.slug} href={`/categories/${cat.slug}`}>
          <Badge
            variant={activeSlug === cat.slug ? "default" : "secondary"}
            className={`cursor-pointer transition-all hover:scale-105 ${
              activeSlug === cat.slug
                ? "shadow-md hover:shadow-lg"
                : "bg-card text-muted-foreground hover:bg-muted/80 border border-border/40 hover:border-border/80"
            } rounded-full px-4 py-1.5 text-sm font-medium`}
          >
            {cat.name}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                activeSlug === cat.slug
                  ? "bg-primary-foreground/20"
                  : "bg-muted group-hover:bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {cat.count}
            </span>
          </Badge>
        </Link>
      ))}
    </div>
  );
}

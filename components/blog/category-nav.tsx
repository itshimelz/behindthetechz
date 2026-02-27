import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/blog/types";

type Props = {
  categories: Category[];
  activeSlug?: string;
};

export function CategoryNav({ categories, activeSlug }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/blog">
        <Badge
          variant={!activeSlug ? "default" : "outline"}
          className="cursor-pointer transition-colors"
        >
          All
        </Badge>
      </Link>
      {categories.map((cat) => (
        <Link key={cat.slug} href={`/categories/${cat.slug}`}>
          <Badge
            variant={activeSlug === cat.slug ? "default" : "outline"}
            className="cursor-pointer transition-colors"
          >
            {cat.name}
            <span className="ml-1 opacity-60">{cat.count}</span>
          </Badge>
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type Props = {
  tags: string[];
};

export function TagPill({ tags }: Props) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link key={tag} href={`/blog?tag=${tag}`}>
          <Badge
            variant="outline"
            className="cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {tag}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

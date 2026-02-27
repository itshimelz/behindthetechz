import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";
import type { Post } from "@/lib/blog/types";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block focus:outline-none"
    >
      <div className="flex flex-col gap-2 rounded-md px-2 py-2.5 transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {/* Left side: Icon + Title */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors">
            <HugeiconsIcon
              icon={Notebook01Icon}
              className="h-4 w-4"
              strokeWidth={1.5}
            />
          </div>
          <h3 className="truncate font-medium underline-offset-4 group-hover:underline">
            {post.title}
          </h3>
        </div>

        {/* Right side: Properties (Category, Date) */}
        <div className="flex shrink-0 items-center gap-3 pl-7 sm:gap-6 sm:pl-0">
          <Badge
            variant="secondary"
            className="rounded-sm bg-muted/60 px-1.5 py-0 text-[10px] font-normal uppercase tracking-wider text-muted-foreground"
          >
            {post.category}
          </Badge>
          <span className="text-muted-foreground min-w-[100px] text-right text-sm">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}

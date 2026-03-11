import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { Post } from "@/lib/blog/types";
import { getCategoryColorClass, cn } from "@/lib/utils";

type Props = {
  posts: Post[];
};

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-3xl mt-8">
      <h2 className="text-xl font-semibold tracking-tight mb-4 text-foreground">
        Related Posts
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-sm"
          >
            <div className="relative aspect-2/1 w-full overflow-hidden border-b border-border/50 bg-muted/20">
              <Image
                src={post.coverImage || "/images/placeholder.png"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            
            <div className="flex flex-1 flex-col p-4">
              <Badge
                variant="secondary"
                className={cn(
                  "mb-3 w-fit text-[10px] border",
                  getCategoryColorClass(post.category),
                )}
              >
                {post.category}
              </Badge>
              <h3 className="mb-2 text-sm font-medium line-clamp-2 transition-colors group-hover:text-primary text-foreground">
                {post.title}
              </h3>
              <div className="mt-auto flex items-center justify-between pt-2">
                <span className="text-xs italic text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

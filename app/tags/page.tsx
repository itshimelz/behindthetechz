import { getTags } from "@/lib/blog/get-tags";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { getTagColorClass, cn } from "@/lib/utils";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      {/* Section Header */}
      <div className="mx-auto w-full max-w-4xl space-y-2 mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          All Tags
        </h1>
        <p className="text-muted-foreground">
          Browse all tags across the blog. Click a tag to see related posts.
        </p>
      </div>

      {tags.length === 0 ? (
        <div className="col-span-full py-12 text-center">
          <HugeiconsIcon
            icon={Tag01Icon}
            className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50"
          />
          <h3 className="mb-2 font-heading text-xl font-medium">
            No tags found
          </h3>
          <p className="text-muted-foreground">
            Tags will appear here once you publish some posts.
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge
                variant="secondary"
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-normal hover:opacity-80 transition-all border cursor-pointer",
                  getTagColorClass(tag.name),
                )}
              >
                <HugeiconsIcon
                  icon={Tag01Icon}
                  className="size-3.5 mr-1.5"
                  strokeWidth={2}
                />
                {tag.name}
                <span className="ml-2 text-xs opacity-70 bg-background/50 px-1.5 py-0.5 rounded-sm">
                  {tag.count}
                </span>
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

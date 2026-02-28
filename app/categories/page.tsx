import { getCategories } from "@/lib/blog/get-categories";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon } from "@hugeicons/core-free-icons";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      {/* Section Header matching the "All Posts" design */}
      <div className="mx-auto w-full max-w-4xl space-y-2 mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          All Categories
        </h1>
        <p className="text-muted-foreground">
          Browse topics covered in this blog.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="col-span-full py-12 text-center">
          <HugeiconsIcon
            icon={GridViewIcon}
            className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50"
          />
          <h3 className="mb-2 font-heading text-xl font-medium">
            No categories found
          </h3>
          <p className="text-muted-foreground">
            Categories will appear here once you publish some posts.
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors">
                  <HugeiconsIcon
                    icon={GridViewIcon}
                    className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </div>
                <h3 className="text-lg font-medium group-hover:text-primary transition-colors text-foreground">
                  {category.name}
                </h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground bg-muted hover:bg-muted/80 px-2 py-1 rounded-md shrink-0 transition-colors">
                {category.count} posts
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

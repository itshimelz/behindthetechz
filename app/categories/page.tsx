import { getCategories } from "@/lib/blog/get-categories";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon } from "@hugeicons/core-free-icons";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pb-10 pt-4 md:px-8 md:pt-6">
      <section className="mx-auto w-full max-w-4xl space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          All Categories
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Pick a category to open related posts.
        </p>
      </section>

      {categories.length === 0 ? (
        <section className="mx-auto w-full max-w-4xl py-10 text-center">
          <HugeiconsIcon
            icon={GridViewIcon}
            className="mx-auto mb-3 size-10 text-muted-foreground/50"
          />
          <h3 className="mb-1 font-heading text-lg font-medium">
            No categories found
          </h3>
          <p className="text-sm text-muted-foreground">
            Categories will appear here once you publish some posts.
          </p>
        </section>
      ) : (
        <section className="mx-auto w-full max-w-4xl">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-border hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={GridViewIcon}
                  className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"
                  strokeWidth={2}
                />
                <span>{category.name}</span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { getCategories } from "@/lib/blog/get-categories";
import { HugeiconsIcon } from "@hugeicons/react";
import { GridViewIcon } from "@hugeicons/core-free-icons";
import { TaxonomyIndexPage } from "@/components/blog/taxonomy-index-page";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <TaxonomyIndexPage
      eyebrow="CATEGORIES"
      title="All Categories"
      emptyTitle="No Categories Found"
      emptyDescription="Categories will appear here once you publish some posts."
      items={categories}
      hrefBase="/categories"
      renderIcon={(className) => (
        <HugeiconsIcon icon={GridViewIcon} className={className} strokeWidth={2} />
      )}
    />
  );
}

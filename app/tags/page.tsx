import { getTags } from "@/lib/blog/get-tags";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";
import { TaxonomyIndexPage } from "@/components/blog/taxonomy-index-page";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <TaxonomyIndexPage
      title="All Tags"
      subtitle="Pick a tag to open related posts."
      emptyTitle="No tags found"
      emptyDescription="Tags will appear here once you publish some posts."
      items={tags}
      hrefBase="/tags"
      renderIcon={(className) => (
        <HugeiconsIcon icon={Tag01Icon} className={className} strokeWidth={2} />
      )}
    />
  );
}

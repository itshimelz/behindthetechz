import { getPostStatusWhere } from "@/lib/blog/get-all-posts";

type TaxonomyWithCount = {
  name: string;
  slug: string;
  count: number;
};

export function taxonomyPostCountSelect(
  includeDrafts: boolean,
) {
  return {
    posts: {
      where: {
        post: getPostStatusWhere(includeDrafts),
      },
    },
  };
}

export function sortAndFilterTaxonomyByCount<T extends TaxonomyWithCount>(
  items: T[],
): T[] {
  return items
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

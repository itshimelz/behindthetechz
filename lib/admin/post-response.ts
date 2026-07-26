export interface FormattedPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isFeatured: boolean;
  coverImage: string | null;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  categories: string[];
  tags: string[];
  series?: string | null;
  seriesOrder?: number | null;
  revisionId: string;
}

type PostLike = Record<string, unknown>;

export function formatFullPost(post: PostLike): FormattedPost {
  const categories = Array.isArray(post.categories)
    ? post.categories
        .map((pc: unknown) => {
          if (typeof pc === "string") return pc;
          if (typeof pc === "object" && pc !== null) {
            const item = pc as Record<string, unknown>;
            const cat = item.category as Record<string, unknown> | undefined;
            return (cat?.slug as string) ?? (cat?.name as string) ?? (item.slug as string) ?? "";
          }
          return "";
        })
        .filter(Boolean)
    : [];

  const tags = Array.isArray(post.tags)
    ? post.tags
        .map((pt: unknown) => {
          if (typeof pt === "string") return pt;
          if (typeof pt === "object" && pt !== null) {
            const item = pt as Record<string, unknown>;
            const tag = item.tag as Record<string, unknown> | undefined;
            return (tag?.slug as string) ?? (tag?.name as string) ?? (item.slug as string) ?? "";
          }
          return "";
        })
        .filter(Boolean)
    : [];

  const updatedAtStr = post.updatedAt
    ? new Date(post.updatedAt as string | number | Date).toISOString()
    : new Date().toISOString();
  const createdAtStr = post.createdAt
    ? new Date(post.createdAt as string | number | Date).toISOString()
    : new Date().toISOString();

  return {
    id: (post.id as string) ?? "",
    slug: (post.slug as string) ?? "",
    title: (post.title as string) ?? "",
    excerpt: (post.excerpt as string) ?? "",
    contentMdx: (post.contentMdx as string) ?? "",
    status: (post.status as "DRAFT" | "PUBLISHED" | "ARCHIVED") ?? "DRAFT",
    isFeatured: Boolean(post.isFeatured),
    coverImage: (post.coverImage as string) ?? null,
    publishedAt: post.publishedAt
      ? new Date(post.publishedAt as string | number | Date).toISOString()
      : null,
    updatedAt: updatedAtStr,
    createdAt: createdAtStr,
    categories,
    tags,
    series: (post.series as string) ?? null,
    seriesOrder: (post.seriesOrder as number) ?? null,
    revisionId: updatedAtStr,
  };
}

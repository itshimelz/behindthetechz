export type PostFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  coverImage?: string;
  category: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  viewCount: number;
  clapCount: number;
  seriesId?: string;
  seriesOrder?: number;
};

export type Post = PostFrontmatter & {
  content: string;
  readingTime: number;
  wordCount: number;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  iconKey?: string;
};

export type Tag = {
  name: string;
  slug: string;
  count: number;
};

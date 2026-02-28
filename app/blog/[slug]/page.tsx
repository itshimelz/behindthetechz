import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getPostBySlug, getAllSlugs } from "@/lib/blog/get-post-by-slug";
import { getBacklinksForSlug } from "@/lib/blog/get-backlinks";
import remarkWikiLink from "@/lib/blog/remark-wiki-link";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import { PostMeta } from "@/components/blog/post-meta";
import { TagPill } from "@/components/blog/tag-pill";
import { CodeBlock } from "@/components/blog/code-block";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { BacklinksSection } from "@/components/blog/backlinks-section";

type Params = { slug: string };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://behindthetechz.com";

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on behind the TechZ.`,
    keywords: [post.category, ...post.tags],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on behind the TechZ.`,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: ["Rahat Hossain Himel"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on behind the TechZ.`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  const backlinks = getBacklinksForSlug(decodedSlug);

  return (
    <>
      <ReadingProgress />
      <article className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
        <div className="mx-auto w-full max-w-3xl space-y-4">
          <PostMeta post={post} />
          <TagPill tags={post.tags} />
        </div>

        {/* MDX content */}
        <div className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-3xl">
          <MDXRemote
            source={post.content}
            components={{
              pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
                <CodeBlock {...props} />
              ),
            }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkWikiLink, remarkMath],
                rehypePlugins: [
                  rehypeKatex,
                  [rehypePrettyCode, { theme: "github-light" }],
                ],
              },
            }}
          />
        </div>

        {/* Backlinks */}
        <BacklinksSection backlinks={backlinks} />
      </article>
    </>
  );
}

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
import { InlineCode } from "@/components/blog/inline-code";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { BacklinksSection } from "@/components/blog/backlinks-section";
import { ScrollToTop } from "@/components/blog/scroll-to-top";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://behindthetechz.live";

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
  const post = await getPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  const backlinks = await getBacklinksForSlug(decodedSlug);

  return (
    <>
      <ReadingProgress />
      <ScrollToTop />
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
              code: (props: React.HTMLAttributes<HTMLElement>) => (
                <InlineCode {...props} />
              ),
            }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkWikiLink, remarkMath],
                rehypePlugins: [
                  rehypeKatex,
                  [
                    rehypePrettyCode,
                    {
                      theme: {
                        light: "github-light",
                        dark: "github-dark",
                      },
                    },
                  ],
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

import type { Metadata } from "next";
import { NaturalImage } from "@/components/blog/natural-image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { BlogPostBreadcrumbTitle } from "@/components/blog/blog-post-breadcrumb-title";
import { BacklinksSection } from "@/components/blog/backlinks-section";
import { HeadingCopyLinkEnhancer } from "@/components/blog/heading-copy-link-enhancer";
import { NewsletterCTA } from "@/components/blog/newsletter-cta";
import { PretextArticleEnhancer } from "@/components/blog/pretext-article-enhancer";
import { PostScrollMemory } from "@/components/blog/post-scroll-memory";
import { PostFooter } from "@/components/blog/post-footer";
import { PostMeta } from "@/components/blog/post-meta";
import { PostTags } from "@/components/blog/post-tags";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { RelatedPosts } from "@/components/blog/related-posts";
import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { SeriesNav } from "@/components/blog/series-nav";
import { SiteBreadcrumb } from "@/components/site-breadcrumb";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TagPill } from "@/components/blog/tag-pill";
import { getBacklinksForSlug } from "@/lib/blog/get-backlinks";
import { extractTocHeadings } from "@/lib/blog/extract-toc-headings";
import { getPostBySlug, getAllSlugs } from "@/lib/blog/get-post-by-slug";
import { getAllPosts, type Post } from "@/lib/blog/get-all-posts";
import { getPostMdxConfig } from "@/lib/blog/mdx-config";
import { postPath } from "@/lib/blog/post-path";
import { getRelatedPosts } from "@/lib/blog/get-related-posts";
import { getSeriesForPost } from "@/lib/blog/get-series";
import { SITE_URL } from "@/lib/site";

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

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on behind the TechZ.`,
    keywords: [post.category, ...post.tags],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on behind the TechZ.`,
      url: `${SITE_URL}${postPath(post.slug)}`,
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
  const relatedPosts = await getRelatedPosts(
    decodedSlug,
    post.category,
    post.tags,
  );
  const seriesData = post.seriesId
    ? await getSeriesForPost(post.seriesId)
    : null;
  const tocHeadings = extractTocHeadings(post.content);

  const allPosts = await getAllPosts();
  const validSlugs = allPosts.map((p) => p.slug);
  const postMetadata = allPosts.reduce(
    (acc, p) => {
      acc[p.slug] = {
        title: p.title,
        excerpt: p.excerpt,
        date: p.date,
        readingTime: p.readingTime,
      };
      return acc;
    },
    {} as Record<string, Partial<Post>>,
  );
  const mdxConfig = getPostMdxConfig({ validSlugs, postMetadata });

  return (
    <>
      <BlogPostBreadcrumbTitle title={post.title} />
      <ReadingProgress />
      <ScrollToTop />
      <PostScrollMemory slug={decodedSlug} />
      <HeadingCopyLinkEnhancer />
      <PretextArticleEnhancer />
      <BlogReadingSurface>
        {/* Container for Article & Sticky Sidebar */}
        <div className="mx-auto flex w-full max-w-360 items-start justify-center gap-8 px-4 pb-10 pt-4 md:px-8 md:pt-6">
          <article className="flex w-full max-w-3xl min-w-0 flex-1 flex-col gap-6">
            <div className="mx-auto w-full max-w-3xl space-y-4">
              <SiteBreadcrumb />
              <PostMeta post={post} />
              <TagPill tags={post.tags} />
            </div>

            {/* Cover image */}
            {post.coverImage && (
              <div className="mx-auto w-full max-w-3xl">
                <NaturalImage
                  src={post.coverImage}
                  alt={post.title}
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            {/* Series Navigation */}
            {seriesData && (
              <SeriesNav series={seriesData} currentSlug={decodedSlug} />
            )}

            {/* Table of Contents - Mobile/Tablet inline only */}
            <div className="xl:hidden">
              <TableOfContents headings={tocHeadings} />
            </div>
            {/* MDX content */}
            <div className="prose prose-neutral dark:prose-invert mx-auto w-full max-w-3xl">
              <MDXRemote
                source={post.content}
                components={mdxConfig.components}
                options={mdxConfig.options}
              />
            </div>

            {/* Backlinks */}
            <BacklinksSection backlinks={backlinks} />

            {/* Engagement bar: claps, views, share, bookmark, copy link */}
            <PostFooter
              slug={post.slug}
              title={post.title}
              initialClapCount={post.clapCount}
              initialViewCount={post.viewCount}
            />

            {/* Tags + meta */}
            <PostTags
              tags={post.tags}
              category={post.category}
              date={post.date}
            />

            {/* Newsletter subscribe CTA */}
            <NewsletterCTA category={post.category} />

            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} />
          </article>

          {/* Desktop Sticky Table of Contents */}
          <div className="contents">
            <TableOfContents headings={tocHeadings} isDesktop />
          </div>
        </div>
      </BlogReadingSurface>
    </>
  );
}

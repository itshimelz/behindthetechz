import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { BlogPostBreadcrumbTitle } from "@/components/blog/blog-post-breadcrumb-title";
import { BacklinksSection } from "@/components/blog/backlinks-section";
import { CodeBlock } from "@/components/blog/code-block";
import { HeadingCopyLinkEnhancer } from "@/components/blog/heading-copy-link-enhancer";
import { InlineCode } from "@/components/blog/inline-code";
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
import { TableOfContents } from "@/components/blog/table-of-contents";
import { TagPill } from "@/components/blog/tag-pill";
import { WikiLink } from "@/components/blog/wiki-link";
import { getBacklinksForSlug } from "@/lib/blog/get-backlinks";
import { extractTocHeadings } from "@/lib/blog/extract-toc-headings";
import { getPostBySlug, getAllSlugs } from "@/lib/blog/get-post-by-slug";
import { getAllPosts, type Post } from "@/lib/blog/get-all-posts";
import { getRelatedPosts } from "@/lib/blog/get-related-posts";
import { getSeriesForPost } from "@/lib/blog/get-series";
import remarkObsidianBlockId from "@/lib/blog/remark-obsidian-block-id";
import remarkCallouts from "@/lib/blog/remark-callouts";
import remarkWikiLink from "@/lib/blog/remark-wiki-link";

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
              <PostMeta post={post} />
              <TagPill tags={post.tags} />
            </div>

            {/* Cover image */}
            {post.coverImage && (
              <div className="mx-auto w-full max-w-3xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
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
                components={{
                  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
                    <CodeBlock {...props} />
                  ),
                  code: (props: React.HTMLAttributes<HTMLElement>) => (
                    <InlineCode {...props} />
                  ),
                  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
                    const hrefValue = href ?? "";
                    const className =
                      typeof props.className === "string" ? props.className : "";
                    const isWikiLink = className.split(/\s+/).includes("wiki-link");
                    const isInternalBlogLink = hrefValue.startsWith("/blog/");
                    const isHashLink = hrefValue.startsWith("#");
                    const isInternalLink = isInternalBlogLink || isHashLink || hrefValue.startsWith("/");

                    if ((isWikiLink || isInternalBlogLink) && href) {
                      return (
                        <WikiLink
                          href={href}
                          validSlugs={validSlugs}
                          postMetadata={postMetadata}
                          {...props}
                        >
                          {children}
                        </WikiLink>
                      );
                    }

                    if (isInternalLink) {
                      return (
                        <a
                          href={href}
                          title={props.title ?? href}
                          className="font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
                          {...props}
                        >
                          {children}
                        </a>
                      );
                    }

                    const hoverTitle = props.title ?? href;
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={hoverTitle}
                        className="font-medium text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
                    <span className="my-8 block overflow-hidden rounded-xl border bg-muted/20">
                      <img
                        alt={props.alt || "Post image"}
                        loading="lazy"
                        className="w-full object-cover transition-colors"
                        {...props}
                      />
                      {props.alt && (
                        <span className="block border-t bg-muted/40 px-4 py-2.5 text-center text-sm text-muted-foreground">
                          {props.alt}
                        </span>
                      )}
                    </span>
                  ),
                  iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
                    <span className="my-8 block overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
                      <span className="relative block aspect-video w-full">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          loading={props.loading ?? "lazy"}
                          allowFullScreen={props.allowFullScreen ?? true}
                          {...props}
                        />
                      </span>
                    </span>
                  ),
                  video: (props: React.VideoHTMLAttributes<HTMLVideoElement>) => (
                    <span className="my-8 block overflow-hidden rounded-xl border bg-muted/20 shadow-sm">
                      <video
                        className="w-full rounded-xl"
                        controls={props.controls ?? true}
                        playsInline={props.playsInline ?? true}
                        preload={props.preload ?? "metadata"}
                        {...props}
                      />
                    </span>
                  ),
                }}
                options={{
                  mdxOptions: {
                    remarkPlugins: [
                      remarkObsidianBlockId,
                      remarkWikiLink,
                      remarkCallouts,
                      remarkGfm,
                      remarkMath,
                    ],
                    rehypePlugins: [
                      rehypeKatex,
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "append",
                          properties: {
                            className: ["heading-anchor"],
                            "aria-label": "Copy section link",
                            "data-heading-anchor": "true",
                            title: "Copy link to this section",
                          },
                          content: [
                            {
                              type: "element",
                              tagName: "svg",
                              properties: {
                                "aria-hidden": "true",
                                xmlns: "http://www.w3.org/2000/svg",
                                width: "16",
                                height: "16",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                              },
                              children: [
                                {
                                  type: "element",
                                  tagName: "path",
                                  properties: {
                                    d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                                  },
                                  children: [],
                                },
                                {
                                  type: "element",
                                  tagName: "path",
                                  properties: {
                                    d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                                  },
                                  children: [],
                                },
                              ],
                            },
                          ],
                        },
                      ],
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

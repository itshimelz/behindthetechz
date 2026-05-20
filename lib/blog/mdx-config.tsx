import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/blog/code-block";
import { MdxImage } from "@/components/blog/mdx-image";
import { InlineCode } from "@/components/blog/inline-code";
import { MdxCallout } from "@/components/blog/mdx-callout";
import { WikiLink } from "@/components/blog/wiki-link";
import type { Post } from "@/lib/blog/get-all-posts";
import remarkObsidianBlockId from "@/lib/blog/remark-obsidian-block-id";
import remarkCallouts from "@/lib/blog/remark-callouts";
import remarkWikiLink from "@/lib/blog/remark-wiki-link";
import { Tweet } from "react-tweet";

type MdxConfigParams = {
  validSlugs: string[];
  postMetadata: Record<string, Partial<Post>>;
};

export function getPostMdxConfig({ validSlugs, postMetadata }: MdxConfigParams) {
  type MdxOptions = NonNullable<MDXRemoteProps["options"]>;

  const options = {
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
        ] as const,
        [
          rehypePrettyCode,
          {
            theme: {
              light: "github-light",
              dark: "github-dark",
            },
          },
        ] as const,
      ],
    },
  } satisfies MdxOptions;

  return {
    components: {
      callout: (props: React.HTMLAttributes<HTMLDivElement> & { type?: string; title?: string }) => (
        <MdxCallout {...props} />
      ),
      pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
        <CodeBlock {...props} />
      ),
      code: (props: React.HTMLAttributes<HTMLElement>) => (
        <InlineCode {...props} />
      ),
      a: ({
        href,
        children,
        ...props
      }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
        const hrefValue = href ?? "";
        const className =
          typeof props.className === "string" ? props.className : "";
        const isWikiLink = className.split(/\s+/).includes("wiki-link");
        const isInternalBlogLink = hrefValue.startsWith("/blog/");
        const isHashLink = hrefValue.startsWith("#");
        const isInternalLink =
          isInternalBlogLink || isHashLink || hrefValue.startsWith("/");

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
        <MdxImage {...props} />
      ),
      Tweet: (props: React.ComponentProps<typeof Tweet>) => (
        <div className="flex justify-center my-8 not-prose">
          <Tweet {...props} />
        </div>
      ),
      iframe: (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => {
        const src = props.src || "";
        const isVideoEmbed =
          src.includes("youtube.com") ||
          src.includes("youtu.be") ||
          src.includes("vimeo.com");

        if (isVideoEmbed) {
          return (
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
          );
        }

        return (
          <span className="my-8 flex justify-center w-full overflow-hidden rounded-xl bg-muted/5 shadow-sm">
            <iframe
              className="max-w-full"
              loading={props.loading ?? "lazy"}
              allowFullScreen={props.allowFullScreen ?? true}
              {...props}
            />
          </span>
        );
      },
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
    },
    options,
  };
}

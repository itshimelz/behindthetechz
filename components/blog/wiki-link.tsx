import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { cn } from "@/lib/utils";
import type { Post } from "@/lib/blog/get-all-posts";

type WikiLinkProps = React.ComponentPropsWithoutRef<typeof Link> & {
  children?: React.ReactNode;
  validSlugs: string[];
  postMetadata?: Record<string, Partial<Post>>;
};

export function WikiLink({
  href,
  children,
  className,
  validSlugs,
  postMetadata,
  ...props
}: WikiLinkProps) {
  const hrefValue = href.toString();
  const slug = extractSlugFromHref(hrefValue);

  const isMissing = !!slug && !validSlugs.includes(slug);
  const metadata = slug ? postMetadata?.[slug] : undefined;

  const linkContent = (
    <Link
      href={href}
      data-missing={isMissing ? "true" : undefined}
      aria-label={
        isMissing
          ? `${typeof children === "string" ? children : slug} (missing post)`
          : undefined
      }
      title={isMissing ? `Missing post: ${slug}` : undefined}
      className={cn(
        "wiki-link group relative inline-flex items-center gap-1 font-medium no-underline transition-colors hover:no-underline",
        isMissing
          ? "text-muted-foreground hover:text-foreground"
          : "text-foreground hover:text-(--wiki-link-hover)",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );

  if (isMissing || !metadata) {
    return linkContent;
  }

  return (
    <HoverCard>
      <HoverCardTrigger render={linkContent} delay={350} closeDelay={150} />
      <HoverCardContent
        side="top"
        align="center"
        sideOffset={8}
        className={cn(
          "w-72 rounded-xl border bg-popover p-0 text-popover-foreground shadow-sm shadow-black/5 outline-none",
          "duration-200 ease-out",
        )}
      >
        <div className="flex flex-col gap-2.5 p-4">
          <h4 className="font-semibold leading-tight tracking-tight text-foreground">
            {metadata.title}
          </h4>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {metadata.excerpt}
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Calendar01Icon} className="size-3" />
            <span>
              {metadata.date &&
                new Date(metadata.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
            {metadata.readingTime && (
              <>
                <span className="opacity-50">•</span>
                <span>{metadata.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function extractSlugFromHref(href: string): string {
  if (!href || href.startsWith("#")) return "";

  const [pathname] = href.split("#");
  if (!pathname.startsWith("/blog/")) return "";

  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[segments.length - 1] || "";

  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

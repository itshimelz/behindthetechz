"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useOptionalBlogBreadcrumbTitle } from "@/components/blog/blog-breadcrumb-title-context";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ROUTE_LABELS: Record<string, string> = {
  blog: "Blog",
  about: "About",
  graph: "Graph View",
  categories: "Categories",
  tags: "Tags",
};

function segmentLabel(
  segment: string,
  segments: string[],
  index: number,
  postTitle: string | null,
): string {
  const fromRoute = ROUTE_LABELS[segment];
  if (fromRoute) return fromRoute;

  const isBlogPostLeaf =
    segments[0] === "blog" &&
    segments.length === 2 &&
    index === 1;

  if (isBlogPostLeaf && postTitle) return postTitle;

  return decodeURIComponent(segment).replace(/-/g, " ");
}

export function SiteBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { postTitle } = useOptionalBlogBreadcrumbTitle() ?? { postTitle: null };

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" title="Home" />}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;
          const label = segmentLabel(segment, segments, index, postTitle);

          return (
            <span key={href} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="line-clamp-1 max-w-50" title={label}>
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href} title={label} />}>
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

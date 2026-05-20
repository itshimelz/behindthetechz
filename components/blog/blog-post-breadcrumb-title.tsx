"use client";

import { useEffect } from "react";

import { useBlogBreadcrumbTitle } from "@/components/blog/blog-breadcrumb-title-context";

/** Registers the post title for `SiteBreadcrumb` on `/blog/[slug]`; clears on unmount. */
export function BlogPostBreadcrumbTitle({ title }: { title: string }) {
  const { setPostTitle } = useBlogBreadcrumbTitle();

  useEffect(() => {
    setPostTitle(title);
    return () => setPostTitle(null);
  }, [title, setPostTitle]);

  return null;
}

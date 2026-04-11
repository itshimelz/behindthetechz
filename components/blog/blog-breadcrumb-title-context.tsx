"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BlogBreadcrumbTitleContextValue = {
  /** Shown as the last breadcrumb segment on `/blog/[slug]` instead of the slug. */
  postTitle: string | null;
  setPostTitle: (title: string | null) => void;
};

const BlogBreadcrumbTitleContext =
  createContext<BlogBreadcrumbTitleContextValue | null>(null);

export function BlogBreadcrumbTitleProvider({ children }: { children: ReactNode }) {
  const [postTitle, setPostTitle] = useState<string | null>(null);

  const value = useMemo(
    () => ({ postTitle, setPostTitle }),
    [postTitle],
  );

  return (
    <BlogBreadcrumbTitleContext.Provider value={value}>
      {children}
    </BlogBreadcrumbTitleContext.Provider>
  );
}

export function useBlogBreadcrumbTitle(): BlogBreadcrumbTitleContextValue {
  const ctx = useContext(BlogBreadcrumbTitleContext);
  if (!ctx) {
    throw new Error(
      "useBlogBreadcrumbTitle must be used within BlogBreadcrumbTitleProvider",
    );
  }
  return ctx;
}

export function useOptionalBlogBreadcrumbTitle(): BlogBreadcrumbTitleContextValue | null {
  return useContext(BlogBreadcrumbTitleContext);
}

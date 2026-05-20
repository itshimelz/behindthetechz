"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Search01Icon } from "@hugeicons/core-free-icons";

import { Input } from "@/components/ui/input";
import { postPath } from "@/lib/blog/post-path";
import type { Post } from "@/lib/blog/types";

type Props = {
  posts: Post[];
};

function getRelevanceScore(post: Post, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = post.title.toLowerCase();
  const excerpt = post.excerpt.toLowerCase();
  const category = post.category.toLowerCase();
  const tags = post.tags.map((tag) => tag.toLowerCase());
  const words = q.split(/\s+/).filter(Boolean);

  let score = 0;

  if (title === q) score += 120;
  if (title.startsWith(q)) score += 70;
  if (title.includes(q)) score += 45;
  if (category === q) score += 30;
  if (category.includes(q)) score += 18;
  if (tags.some((tag) => tag === q)) score += 34;
  if (tags.some((tag) => tag.includes(q))) score += 20;
  if (excerpt.includes(q)) score += 12;

  for (const word of words) {
    if (title.includes(word)) score += 9;
    if (tags.some((tag) => tag.includes(word))) score += 5;
  }

  return score;
}

function formatSearchDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

export function SearchPageClient({ posts }: Props) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);

  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setSearchQuery(initialQuery);
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextQuery = debouncedQuery.trim();
    const params = new URLSearchParams(window.location.search);
    const currentQuery = params.get("q") ?? "";

    if (nextQuery === currentQuery) return;

    if (nextQuery) {
      params.set("q", nextQuery);
    } else {
      params.delete("q");
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `/search?${queryString}` : "/search";
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [debouncedQuery]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return [...posts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }

    return posts
      .map((post) => ({ post, score: getRelevanceScore(post, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          new Date(b.post.date).getTime() - new Date(a.post.date).getTime(),
      )
      .map((entry) => entry.post);
  }, [posts, normalizedQuery]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-10 pt-4 md:px-6 md:pt-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground">
        Search
      </h1>

      <div className="relative mt-5 w-full">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </span>
        <Input
          type="search"
          placeholder="Search articles"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-12 rounded-full border-border/70 bg-background pl-11 pr-12 text-base [appearance:textfield] [&::-ms-clear]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
          aria-label="Search articles"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 right-3 my-auto inline-flex size-7 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 outline-none"
            aria-label="Clear search query"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Articles
        </span>
        <span className="h-px flex-1 bg-border/80" aria-hidden="true" />
        <span className="text-base font-medium text-foreground">
          {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
        </span>
      </div>

      {normalizedQuery ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {`for '${searchQuery.trim()}'`}
        </p>
      ) : null}

      {filteredPosts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-5">
          <p className="text-sm font-medium text-foreground">No results found.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a broader keyword, title phrase, category, or tag.
          </p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border/70">
          {filteredPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={postPath(post.slug)}
                className="block rounded-xl px-1 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-1 text-base font-medium text-foreground md:text-lg">
                      {post.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">
                      {post.excerpt}
                    </p>
                  </div>
                  <time
                    dateTime={post.date}
                    className="mt-1 shrink-0 text-xs text-muted-foreground md:text-sm"
                  >
                    {formatSearchDate(post.date)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

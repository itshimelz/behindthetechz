import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";

import type { Post } from "@/lib/blog/types";
import { DetailStickyHeader } from "@/components/blog/detail-sticky-header";
import { PostList } from "@/components/blog/post-list";

type TaxonomyDetailPageProps = {
  title: string;
  backHref: string;
  backLabel: string;
  articleSectionId: string;
  postCountDescription: string;
  emptyMessage: string;
  posts: Post[];
  showJump: boolean;
};

export function TaxonomyDetailPage({
  title,
  backHref,
  backLabel,
  articleSectionId,
  postCountDescription,
  emptyMessage,
  posts,
  showJump,
}: TaxonomyDetailPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-4 md:px-8 md:pt-6">
      <DetailStickyHeader
        title={title}
        backHref={backHref}
        backLabel={backLabel}
        jumpHref={`#${articleSectionId}`}
        showJump={showJump}
      />

      <section className="mx-auto w-full max-w-4xl space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <Link
            href={backHref}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {backLabel}
          </Link>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          {postCountDescription}
        </p>
        {showJump ? (
          <a
            href={`#${articleSectionId}`}
            className="inline-flex w-fit items-center rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted md:hidden"
          >
            Jump to articles
          </a>
        ) : null}
      </section>

      <div id={articleSectionId} className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon
              icon={Notebook01Icon}
              className="size-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />
            Articles
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </div>
        <PostList posts={posts} compact emptyMessage={emptyMessage} />
      </div>
    </div>
  );
}

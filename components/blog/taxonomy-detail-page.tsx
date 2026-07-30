import { HugeiconsIcon } from "@hugeicons/react";
import { Notebook01Icon } from "@hugeicons/core-free-icons";

import type { Post } from "@/lib/blog/types";
import { DetailStickyHeader } from "@/components/blog/detail-sticky-header";
import { PostList } from "@/components/blog/post-list";
import { SectionIntro } from "@/components/shared/section-intro";

type TaxonomyDetailPageProps = {
  eyebrow?: string;
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
  eyebrow,
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

      <section className="mx-auto w-full max-w-6xl space-y-2">
        <SectionIntro eyebrow={eyebrow} title={title} />
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

      <div id={articleSectionId} className="mx-auto w-full max-w-6xl">
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
        <PostList posts={posts} viewMode="grid" emptyMessage={emptyMessage} />
      </div>
    </div>
  );
}

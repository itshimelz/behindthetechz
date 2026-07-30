import type { ReactNode } from "react";
import Link from "next/link";
import { BehindTheTechzLayout } from "@/components/shared/behindthetechz-layout";
import { SectionIntro } from "@/components/shared/section-intro";

type TaxonomyItem = {
  name: string;
  slug: string;
  count: number;
};

type TaxonomyIndexPageProps = {
  eyebrow?: string;
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  items: TaxonomyItem[];
  hrefBase: string;
  renderIcon: (className: string) => ReactNode;
};

export function TaxonomyIndexPage({
  eyebrow,
  title,
  emptyTitle,
  emptyDescription,
  items,
  hrefBase,
  renderIcon,
}: TaxonomyIndexPageProps) {
  return (
    <BehindTheTechzLayout activePath={hrefBase}>
      <div className="space-y-6">
        <SectionIntro eyebrow={eyebrow} title={title} />

        {items.length === 0 ? (
          <section className="py-10 text-center">
            {renderIcon("mx-auto mb-3 size-10 text-muted-foreground/50")}
            <h3 className="mb-1 font-heading text-lg font-medium">{emptyTitle}</h3>
            <p className="text-sm text-muted-foreground">{emptyDescription}</p>
          </section>
        ) : (
          <section>
            <div className="flex flex-wrap gap-2.5">
              {items.map((item) => (
                <Link
                  key={item.slug}
                  href={`${hrefBase}/${item.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3.5 py-1.5 text-sm text-foreground transition-all hover:border-foreground/30 hover:bg-muted"
                >
                  {renderIcon(
                    "size-3.5 text-muted-foreground transition-colors group-hover:text-foreground",
                  )}
                  <span className="font-medium">{item.name}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-medium">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </BehindTheTechzLayout>
  );
}

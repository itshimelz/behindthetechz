import type { ReactNode } from "react";
import Link from "next/link";
import { LessWrongLayout } from "@/components/shared/lesswrong-layout";

type TaxonomyItem = {
  name: string;
  slug: string;
  count: number;
};

type TaxonomyIndexPageProps = {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  items: TaxonomyItem[];
  hrefBase: string;
  renderIcon: (className: string) => ReactNode;
};

export function TaxonomyIndexPage({
  title,
  subtitle,
  emptyTitle,
  emptyDescription,
  items,
  hrefBase,
  renderIcon,
}: TaxonomyIndexPageProps) {
  return (
    <LessWrongLayout activePath={hrefBase}>
      <div className="space-y-6">
        <section className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        </section>

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
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-mono">
                    {item.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </LessWrongLayout>
  );
}

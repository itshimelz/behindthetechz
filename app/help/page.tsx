import type { Metadata } from "next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  HelpCircleIcon,
  Search01Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Help",
  description: "How to use behind the TechZ effectively.",
};

const helpItems = [
  {
    title: "Search posts",
    description:
      "Use the search bar on the blog archive to filter by title, excerpt, category, and tags.",
    icon: Search01Icon,
    href: "/blog",
    cta: "Open Blog",
  },
  {
    title: "Save favorites",
    description:
      "Click the bookmark icon on any post to save it. Favorites appear in the sidebar and the account menu.",
    icon: Bookmark02Icon,
    href: "/blog",
    cta: "Browse Posts",
  },
  {
    title: "Use graph view",
    description:
      "Open the graph map to explore relationships between posts based on wiki-style links.",
    icon: ChartBubble02Icon,
    href: "/graph",
    cta: "Open Graph",
  },
  {
    title: "Navigate backlinks",
    description:
      "At the end of each post, check Linked from to discover related posts referencing the current topic.",
    icon: LinkSquare02Icon,
    href: "/blog",
    cta: "Read Articles",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={HelpCircleIcon} className="size-6" strokeWidth={2} />
          <h1 className="font-heading text-3xl font-bold tracking-tight">Help</h1>
        </div>
        <p className="text-muted-foreground">
          Quick guidance for using search, favorites, graph view, and interlinked
          reading.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2">
        {helpItems.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-card p-5 transition-colors hover:bg-muted/30"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-muted-foreground">
              <HugeiconsIcon icon={item.icon} strokeWidth={2} />
            </div>
            <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            <Link
              href={item.href}
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {item.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

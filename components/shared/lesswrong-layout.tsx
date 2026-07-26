import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Book02Icon,
  Folder01Icon,
  RssIcon,
  UserIcon,
  HelpCircleIcon,
  Notification02Icon,
  Bookmark02Icon,
  ChartBubble02Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";

type Props = {
  children: React.ReactNode;
  activePath?: string;
};

export function LessWrongLayout({ children, activePath }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Desktop Sidebar Column (LessWrong Style) */}
        <aside className="hidden lg:col-span-3 lg:block sticky top-20 h-fit space-y-6 text-sm text-muted-foreground pr-2 border-r border-border/40">
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activePath === "/"
                  ? "bg-muted/80 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <HugeiconsIcon icon={Home01Icon} className="size-4 text-foreground" strokeWidth={2} />
              <span>Home</span>
            </Link>
            <Link
              href="/blog"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activePath === "/blog"
                  ? "bg-muted/80 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <HugeiconsIcon icon={Book02Icon} className="size-4 text-foreground" strokeWidth={2} />
              <span>All Posts</span>
            </Link>
            <Link
              href="/categories"
              className={`flex items-center gap-2.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                activePath === "/categories"
                  ? "bg-muted/80 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <HugeiconsIcon icon={Folder01Icon} className="size-4 text-foreground" strokeWidth={2} />
              <span>Concepts</span>
            </Link>
          </div>

          {/* Library Section */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Library
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-3.5" strokeWidth={2} />
                  Best of behind the TechZ
                </Link>
              </li>
              <li>
                <Link
                  href="/graph"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={ChartBubble02Icon} className="size-3.5" strokeWidth={2} />
                  Sequence Highlights
                </Link>
              </li>
              <li>
                <Link
                  href="/tags"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={SparklesIcon} className="size-3.5" strokeWidth={2} />
                  The Codex
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Meta Section */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Community & Meta
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                <Link
                  href="/feed.xml"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={RssIcon} className="size-3.5" strokeWidth={2} />
                  Subscribe (RSS)
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-3.5" strokeWidth={2} />
                  About Author
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={Notification02Icon} className="size-3.5" strokeWidth={2} />
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors hover:text-foreground hover:bg-muted/40"
                >
                  <HugeiconsIcon icon={HelpCircleIcon} className="size-3.5" strokeWidth={2} />
                  FAQ & Help
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="col-span-12 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}

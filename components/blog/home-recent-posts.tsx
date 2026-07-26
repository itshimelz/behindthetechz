"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { PostList } from "@/components/blog/post-list";
import type { Post } from "@/lib/blog/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type HomeRecentPostsProps = {
  posts: Post[];
};

export function HomeRecentPosts({ posts }: HomeRecentPostsProps) {
  const [activeTab, setActiveTab] = useState<"recent" | "enriched" | "recommended">("enriched");
  const [showSettings, setShowSettings] = useState(false);
  const [minReadingTime, setMinReadingTime] = useState<number>(0);

  // Compute filtered and sorted posts dynamically for each tab
  const displayedPosts = useMemo(() => {
    let filtered = [...posts];

    if (minReadingTime > 0) {
      filtered = filtered.filter((p) => p.readingTime >= minReadingTime);
    }

    if (activeTab === "recent") {
      // Sort strictly chronologically (newest first)
      return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    if (activeTab === "enriched") {
      // Sort by engagement score (views + claps + featured weight)
      return filtered.sort((a, b) => {
        const scoreA = (a.viewCount || 0) + (a.clapCount || 0) * 5 + (a.featured ? 500 : 0);
        const scoreB = (b.viewCount || 0) + (b.clapCount || 0) * 5 + (b.featured ? 500 : 0);
        return scoreB - scoreA;
      });
    }

    if (activeTab === "recommended") {
      // Prioritize featured essays and long-form high-signal posts
      const featured = filtered.filter((p) => p.featured);
      const nonFeatured = filtered.filter((p) => !p.featured).sort((a, b) => b.readingTime - a.readingTime);
      return [...featured, ...nonFeatured];
    }

    return filtered;
  }, [posts, activeTab, minReadingTime]);

  return (
    <section id="recent-posts" className="w-full space-y-4">
      {/* LessWrong Feed Control Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 p-1 border border-border/50 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`rounded-lg px-3 py-1 font-medium transition-all ${
              activeTab === "recent"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("enriched")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all ${
              activeTab === "enriched"
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Enriched
            <HugeiconsIcon icon={SparklesIcon} className="size-3" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("recommended")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-all ${
              activeTab === "recommended"
                ? "bg-background text-foreground shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recommended
            <HugeiconsIcon icon={SparklesIcon} className="size-3" strokeWidth={2} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowSettings(true)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          title="Feed Preferences"
        >
          <HugeiconsIcon icon={Settings02Icon} className="size-4" strokeWidth={2} />
        </button>
      </div>

      {/* Feed Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={Settings02Icon} className="size-4" strokeWidth={2} />
              Feed Customization
            </DialogTitle>
            <DialogDescription>
              Adjust how articles are ranked and filtered in your personal feed stream.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Default Sort Stream
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("recent")}
                  className={`rounded-lg border p-2 text-xs font-medium transition-all ${
                    activeTab === "recent"
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recent
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("enriched")}
                  className={`rounded-lg border p-2 text-xs font-medium transition-all ${
                    activeTab === "enriched"
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Enriched
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("recommended")}
                  className={`rounded-lg border p-2 text-xs font-medium transition-all ${
                    activeTab === "recommended"
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Recommended
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Minimum Reading Length
              </label>
              <div className="flex items-center gap-2">
                {[0, 3, 5, 8].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMinReadingTime(mins)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      minReadingTime === mins
                        ? "border-foreground bg-foreground text-background"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mins === 0 ? "All Lengths" : `${mins}+ mins`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Posts Stream */}
      {displayedPosts.length > 0 ? (
        <PostList posts={displayedPosts} compact />
      ) : (
        <p className="text-sm text-muted-foreground py-4">No matching posts found for this filter.</p>
      )}
    </section>
  );
}

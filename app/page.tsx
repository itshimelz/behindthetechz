import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { PostList } from "@/components/blog/post-list";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 5);
  const featuredPosts = allPosts.filter((_, i) => i < 2);

  return (
    <div className="flex flex-1 flex-col gap-12 px-4 py-8 md:px-8 lg:py-16">
      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-xl md:h-48 md:w-48">
          <Image
            src="/logo.png"
            alt="behind the TechZ Logo"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            behind the TechZ
          </h1>
          <p className="text-muted-foreground max-w-[600px] text-lg leading-relaxed sm:text-xl">
            A personal blog about technology, programming, and everyday
            thoughts. Dev guides, tutorials, and stories — mostly in Bangla.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
            <Link href="/blog">
              <Button size="lg" className="rounded-full shadow-md">
                Read All Posts
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="ml-2 h-4 w-4"
                />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="rounded-full">
                About Me
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="mx-auto w-full max-w-4xl space-y-6">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Featured Posts
            </h2>
          </div>
          <PostList posts={featuredPosts} />
        </section>
      )}

      {/* Latest Posts */}
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Latest Posts
          </h2>
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        <PostList posts={latestPosts} />
      </section>
    </div>
  );
}

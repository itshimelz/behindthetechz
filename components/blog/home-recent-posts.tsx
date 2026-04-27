import { PostList } from "@/components/blog/post-list";
import { SectionIntro } from "@/components/shared/section-intro";
import type { Post } from "@/lib/blog/types";

type HomeRecentPostsProps = {
  posts: Post[];
};

export function HomeRecentPosts({ posts }: HomeRecentPostsProps) {
  return (
    <section
      id="recent-posts"
      className="w-full bg-card px-5 py-6 sm:px-7 md:px-8 md:py-7 dark:bg-transparent"
    >
      <div className="space-y-5 md:space-y-6">
        <SectionIntro
          eyebrow="Recent posts"
          title="Start with what is new"
          description="Fresh writing first, clear and easy to scan."
        />
        {posts.length > 0 ? (
          <PostList posts={posts} compact />
        ) : (
          <p className="text-sm text-muted-foreground">No posts published yet.</p>
        )}
      </div>
    </section>
  );
}

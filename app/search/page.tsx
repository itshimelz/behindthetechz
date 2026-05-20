import { SearchPageClient } from "@/components/blog/search-page-client";
import { BlogReadingSurface } from "@/components/blog/blog-reading-surface";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { getAllPosts } from "@/lib/blog/get-all-posts";

export default async function SearchPage() {
  const posts = await getAllPosts();

  return (
    <>
      <ScrollToTop />
      <BlogReadingSurface>
        <SearchPageClient posts={posts} />
      </BlogReadingSurface>
    </>
  );
}

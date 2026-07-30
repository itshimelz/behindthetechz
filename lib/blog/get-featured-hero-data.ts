import { getAllPosts } from "@/lib/blog/get-all-posts";
import { getGraphData } from "@/lib/blog/get-graph-data";
import { AUTHOR_CONFIG } from "@/lib/site";

export type FeaturedHeroInsight = {
  label: string;
  text: string;
};

export type FeaturedHeroItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number;
  wordCount: number;
  author: string;
  authorAvatar?: string;
  coverImage?: string;
  insights: FeaturedHeroInsight[];
};

function extractQuoteFromContent(content: string, fallbackExcerpt: string): string {
  // Try to find a blockquote (> ...) in MDX content
  const blockquoteMatch = content.match(/^>\s*(.+)$/m);
  if (blockquoteMatch && blockquoteMatch[1]) {
    const cleanQuote = blockquoteMatch[1].replace(/[*_~`]/g, "").trim();
    if (cleanQuote.length > 10 && cleanQuote.length < 140) {
      return cleanQuote;
    }
  }

  // Try to find first h2 heading
  const h2Match = content.match(/^##\s+(.+)$/m);
  if (h2Match && h2Match[1]) {
    const cleanH2 = h2Match[1].replace(/[*_~`]/g, "").trim();
    if (cleanH2.length > 10 && cleanH2.length < 120) {
      return cleanH2;
    }
  }

  // Fallback to excerpt first sentence
  const firstSentence = fallbackExcerpt.split(/(?<=[.!?])\s+/)[0];
  return firstSentence || fallbackExcerpt;
}

export async function getFeaturedHeroItems(): Promise<FeaturedHeroItem[]> {
  const [allPosts, graphData] = await Promise.all([
    getAllPosts(),
    getGraphData(),
  ]);

  const nodeMap = new Map(graphData.nodes.map((n) => [n.id, n]));

  // Pick featured posts, or fallback to latest published posts if none marked featured
  let featuredPosts = allPosts.filter((p) => p.featured && !p.draft);
  if (featuredPosts.length === 0) {
    featuredPosts = allPosts.filter((p) => !p.draft).slice(0, 3);
  } else if (featuredPosts.length > 3) {
    featuredPosts = featuredPosts.slice(0, 3);
  }

  return featuredPosts.map((post) => {
    const node = nodeMap.get(post.slug);
    const outgoing = node?.outgoingCount ?? 0;
    const incoming = node?.incomingCount ?? 0;
    const totalConnections = outgoing + incoming;

    const mainInsightText = extractQuoteFromContent(post.content, post.excerpt);

    const insights: FeaturedHeroInsight[] = [
      {
        label: "Architecture Note",
        text: mainInsightText,
      },
      {
        label: "Concept Map",
        text: totalConnections > 0
          ? `${totalConnections} interlinked wiki concepts allow rapid navigation.`
          : `Foundational topic in ${post.category} engineering.`,
      },
    ];

    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      date: post.date,
      readingTime: post.readingTime,
      wordCount: post.wordCount,
      author: AUTHOR_CONFIG.name,
      authorAvatar: AUTHOR_CONFIG.avatar,
      coverImage: post.coverImage,
      insights,
    };
  });
}

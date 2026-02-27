import { getAllPosts } from "@/lib/blog/get-all-posts";
import { extractWikiLinkSlugs } from "@/lib/blog/remark-wiki-link";

export type GraphNode = {
  id: string;
  name: string;
  category: string;
  excerpt: string;
  val: number; // node size weight
};

export type GraphLink = {
  source: string;
  target: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: GraphLink[];
};

/**
 * Generate graph data for the 3D force-directed visualization.
 * Nodes = posts, Links = wiki link connections between posts.
 */
export function getGraphData(): GraphData {
  const posts = getAllPosts();
  const slugSet = new Set(posts.map((p) => p.slug));

  const nodes: GraphNode[] = posts.map((post) => ({
    id: post.slug,
    name: post.title,
    category: post.category,
    excerpt: post.excerpt,
    val: 1,
  }));

  const links: GraphLink[] = [];
  const linkSet = new Set<string>();

  for (const post of posts) {
    const linkedSlugs = extractWikiLinkSlugs(post.content);

    for (const targetSlug of linkedSlugs) {
      // Only create links to posts that actually exist
      if (!slugSet.has(targetSlug)) continue;
      if (targetSlug === post.slug) continue;

      const linkKey = `${post.slug}->${targetSlug}`;
      if (linkSet.has(linkKey)) continue;

      linkSet.add(linkKey);
      links.push({ source: post.slug, target: targetSlug });
    }
  }

  // Increase node size based on number of connections
  const connectionCount = new Map<string, number>();
  for (const link of links) {
    connectionCount.set(
      link.source,
      (connectionCount.get(link.source) || 0) + 1,
    );
    connectionCount.set(
      link.target,
      (connectionCount.get(link.target) || 0) + 1,
    );
  }
  for (const node of nodes) {
    node.val = 3 + (connectionCount.get(node.id) || 0) * 1.5;
  }

  return { nodes, links };
}

import { getAllPosts } from "@/lib/blog/get-all-posts";
import { extractWikiLinkSlugs } from "@/lib/blog/remark-wiki-link";

export type GraphNode = {
  id: string;
  name: string;
  category: string;
  excerpt: string;
  val: number; // node size weight
  outgoingCount: number;
  incomingCount: number;
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
    outgoingCount: 0,
    incomingCount: 0,
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

  // Calculate connections
  const outgoingCount = new Map<string, number>();
  const incomingCount = new Map<string, number>();
  const totalCount = new Map<string, number>();

  for (const link of links) {
    outgoingCount.set(link.source, (outgoingCount.get(link.source) || 0) + 1);
    incomingCount.set(link.target, (incomingCount.get(link.target) || 0) + 1);
    totalCount.set(link.source, (totalCount.get(link.source) || 0) + 1);
    totalCount.set(link.target, (totalCount.get(link.target) || 0) + 1);
  }

  for (const node of nodes) {
    const outgoing = outgoingCount.get(node.id) || 0;
    const incoming = incomingCount.get(node.id) || 0;
    const total = totalCount.get(node.id) || 0;
    node.outgoingCount = outgoing;
    node.incomingCount = incoming;
    // Sizing: prioritize outgoing links but consider total connectivity
    node.val = 3 + total * 1.5 + outgoing * 2;
  }

  return { nodes, links };
}

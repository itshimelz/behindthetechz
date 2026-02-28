"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { forceCollide } from "d3-force-3d";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChartBubble02Icon,
  Search01Icon,
  ArrowUpRight01Icon,
  ArrowDownLeft01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";

import type { GraphData, GraphNode } from "@/lib/blog/get-graph-data";
import type { ForceGraphMethods } from "react-force-graph-2d";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground animate-pulse text-sm">
        Loading graph...
      </p>
    </div>
  ),
});

type ForceGraphNode = GraphNode & { x?: number; y?: number };
type GraphLinkRef = {
  source: string | { id?: string };
  target: string | { id?: string };
};

type Props = {
  data: GraphData;
};

export function GraphView({ data }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | null>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [linkDistance, setLinkDistance] = useState(120);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [showArrows, setShowArrows] = useState(false);

  const activeNodeId = hoveredNodeId ?? selectedNodeId;

  const graphColors = useMemo(() => {
    const fallback = {
      background: isDark ? "#12161B" : "#F5F7F8",
      link: isDark ? "rgba(148, 156, 168, 0.28)" : "rgba(124, 133, 145, 0.32)",
      linkDim: isDark
        ? "rgba(101, 111, 123, 0.14)"
        : "rgba(145, 153, 162, 0.16)",
      linkActive: isDark
        ? "rgba(196, 205, 214, 0.68)"
        : "rgba(95, 107, 123, 0.64)",
      nodeDim: isDark ? "#3f4652" : "#cfd5dc",
      nodeSelected: isDark ? "#bcc7d5" : "#56677c",
      text: isDark ? "#dbe2ea" : "#374151",
      textMuted: isDark ? "#9aa5b3" : "#6b7280",
    };

    if (typeof window === "undefined") return fallback;

    const styles = getComputedStyle(document.documentElement);
    const pick = (name: string, fallbackValue: string) => {
      const cssValue = styles.getPropertyValue(name).trim();
      return cssValue || fallbackValue;
    };

    return {
      background: pick("--graph-bg", fallback.background),
      link: pick("--graph-link", fallback.link),
      linkDim: pick("--graph-link-dim", fallback.linkDim),
      linkActive: pick("--graph-link-active", fallback.linkActive),
      nodeDim: pick("--graph-node-dim", fallback.nodeDim),
      nodeSelected: pick("--graph-node-selected", fallback.nodeSelected),
      text: pick("--graph-label", fallback.text),
      textMuted: pick("--graph-label-muted", fallback.textMuted),
    };
  }, [isDark]);

  const categoryColorMap = useMemo(() => {
    const palette = [
      "#6F8196",
      "#7C7F93",
      "#8A7E96",
      "#7B8F7A",
      "#8F8572",
      "#6F8D8C",
      "#7C8591",
    ];

    const categories = Array.from(
      new Set(data.nodes.map((node) => node.category)),
    );
    categories.sort((a, b) => a.localeCompare(b));

    return new Map(
      categories.map((category, index) => [
        category,
        palette[index % palette.length],
      ]),
    );
  }, [data.nodes]);

  const adjacencyMap = useMemo(() => {
    const map = new Map<string, Set<string>>();

    for (const node of data.nodes) {
      map.set(node.id, new Set());
    }

    for (const link of data.links) {
      map.get(link.source)?.add(link.target);
      map.get(link.target)?.add(link.source);
    }

    return map;
  }, [data.links, data.nodes]);

  const selectedNode = useMemo(
    () => data.nodes.find((node) => node.id === selectedNodeId) || null,
    [data.nodes, selectedNodeId],
  );

  const selectedNeighbors = useMemo(() => {
    if (!selectedNodeId) return [];

    const neighbors = adjacencyMap.get(selectedNodeId);
    if (!neighbors) return [];

    return Array.from(neighbors)
      .map((id) => data.nodes.find((node) => node.id === id))
      .filter((node): node is GraphNode => Boolean(node))
      .slice(0, 8);
  }, [adjacencyMap, data.nodes, selectedNodeId]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return data.nodes
      .filter((node) => {
        return (
          node.name.toLowerCase().includes(query) ||
          node.id.toLowerCase().includes(query) ||
          node.category.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [data.nodes, searchQuery]);

  const getNodeId = useCallback((ref: string | { id?: string }) => {
    if (typeof ref === "string") return ref;
    return ref.id || "";
  }, []);

  const isNeighbor = useCallback(
    (nodeId: string, targetId: string) => {
      return adjacencyMap.get(nodeId)?.has(targetId) || false;
    },
    [adjacencyMap],
  );

  const isNodeEmphasized = useCallback(
    (nodeId: string) => {
      if (!activeNodeId) return true;
      if (nodeId === activeNodeId) return true;
      return isNeighbor(activeNodeId, nodeId);
    },
    [activeNodeId, isNeighbor],
  );

  const isLinkEmphasized = useCallback(
    (link: GraphLinkRef) => {
      if (!activeNodeId) return true;

      const sourceId = getNodeId(link.source);
      const targetId = getNodeId(link.target);
      return sourceId === activeNodeId || targetId === activeNodeId;
    },
    [activeNodeId, getNodeId],
  );

  const getCategoryColor = useCallback(
    (category: string) => categoryColorMap.get(category) || "#7C8591",
    [categoryColorMap],
  );

  const getNodeBaseColor = useCallback(
    (node: GraphNode) => getCategoryColor(node.category),
    [getCategoryColor],
  );

  const focusNode = useCallback(
    (nodeId: string) => {
      const graphApi = fgRef.current;
      if (!graphApi) return;

      const node = data.nodes.find((item) => item.id === nodeId) as
        | ForceGraphNode
        | undefined;

      if (!node) return;

      if (typeof node.x === "number" && typeof node.y === "number") {
        graphApi.centerAt(node.x, node.y, 500);
        graphApi.zoom(2, 500);
        return;
      }

      graphApi.zoomToFit(500, 80);
    },
    [data.nodes],
  );

  useEffect(() => {
    const graphApi = fgRef.current;
    if (!graphApi) return;

    const linkForce = graphApi.d3Force("link");
    if (linkForce) {
      linkForce.distance(linkDistance);
    }

    const chargeForce = graphApi.d3Force("charge");
    if (chargeForce) {
      chargeForce.strength(-300);
    }

    graphApi.d3Force("collide", forceCollide(24) as never);
    graphApi.d3ReheatSimulation();
  }, [linkDistance]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;

      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleNodeClick = useCallback(
    (node: object) => {
      const graphNode = node as GraphNode;
      if (!graphNode.id) return;

      setSelectedNodeId(graphNode.id);
      setSearchQuery(graphNode.name);
      focusNode(graphNode.id);
    },
    [focusNode],
  );

  const handleSearchPick = useCallback(
    (node: GraphNode) => {
      setSelectedNodeId(node.id);
      setSearchQuery(node.name);
      focusNode(node.id);
    },
    [focusNode],
  );

  const nodeCanvasObject = useCallback(
    (node: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const graphNode = node as ForceGraphNode;
      const isSelected = graphNode.id === selectedNodeId;
      const isHovered = graphNode.id === hoveredNodeId;
      const emphasized = isNodeEmphasized(graphNode.id);
      const radius = 3 + Math.cbrt(graphNode.val) * 1.4;

      const fillColor =
        isSelected || isHovered
          ? graphColors.nodeSelected
          : emphasized
            ? getNodeBaseColor(graphNode)
            : graphColors.nodeDim;

      ctx.save();
      ctx.globalAlpha = emphasized ? 1 : 0.45;
      ctx.beginPath();
      ctx.arc(
        graphNode.x || 0,
        graphNode.y || 0,
        radius,
        0,
        2 * Math.PI,
        false,
      );
      ctx.fillStyle = fillColor;
      ctx.fill();

      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(
          graphNode.x || 0,
          graphNode.y || 0,
          radius + 2,
          0,
          2 * Math.PI,
          false,
        );
        ctx.strokeStyle = isDark
          ? "rgba(240,245,250,0.7)"
          : "rgba(46,60,78,0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      const shouldShowLabel =
        showLabels &&
        (graphNode.id === activeNodeId ||
          globalScale > 1.35 ||
          (globalScale > 0.95 && graphNode.val >= 10));

      if (shouldShowLabel) {
        const fontSize = Math.min(10, Math.max(8, 5 + graphNode.val / 5));
        ctx.font = `500 ${fontSize}px Inter, Tiro Bangla, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = emphasized ? graphColors.text : graphColors.textMuted;
        ctx.fillText(
          graphNode.name,
          graphNode.x || 0,
          (graphNode.y || 0) + radius + fontSize / 1.5 + 2,
        );
      }

      ctx.restore();
    },
    [
      activeNodeId,
      getNodeBaseColor,
      graphColors.nodeDim,
      graphColors.nodeSelected,
      graphColors.text,
      graphColors.textMuted,
      hoveredNodeId,
      isDark,
      isNodeEmphasized,
      selectedNodeId,
      showLabels,
    ],
  );

  const handleZoomIn = useCallback(() => {
    if (!fgRef.current) return;
    fgRef.current.zoom(fgRef.current.zoom() * 1.35, 350);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!fgRef.current) return;
    fgRef.current.zoom(fgRef.current.zoom() * 0.74, 350);
  }, []);

  const handleFit = useCallback(() => {
    if (!fgRef.current) return;
    fgRef.current.zoomToFit(500, 80);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    setSearchQuery("");
  }, []);

  const handleZoom = useCallback((transform: { k: number }) => {
    if (!zoomTimeoutRef.current) {
      zoomTimeoutRef.current = setTimeout(() => {
        setZoomLevel(transform.k);
        zoomTimeoutRef.current = null;
      }, 100);
    }
  }, []);

  // Compute a scale factor that prevents lines/arrows from getting extremely huge when zooming in,
  // and completely disappearing when zooming out.
  const visualScale = Math.max(0.3, Math.pow(zoomLevel, 0.6));

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {data.nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center px-4">
          <Empty className="max-w-md py-12">
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon icon={ChartBubble02Icon} strokeWidth={1.8} />
              </EmptyMedia>
              <EmptyTitle>No graph connections yet</EmptyTitle>
              <EmptyDescription>
                Add wiki-style links like [[another-post-slug]] inside your
                posts to build your knowledge graph.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <>
          <ForceGraph2D
            ref={fgRef as unknown as React.MutableRefObject<ForceGraphMethods>}
            graphData={data}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor={graphColors.background}
            nodeCanvasObject={nodeCanvasObject}
            linkColor={(link) => {
              const ref = link as GraphLinkRef;
              if (!activeNodeId) return graphColors.link;
              return isLinkEmphasized(ref)
                ? graphColors.linkActive
                : graphColors.linkDim;
            }}
            linkWidth={(link) => {
              const ref = link as GraphLinkRef;
              const base = !activeNodeId ? 2 : isLinkEmphasized(ref) ? 3 : 0.8;
              return base / visualScale;
            }}
            linkDirectionalArrowLength={(link) => {
              if (!showArrows) return 0;
              const ref = link as GraphLinkRef;
              const base = !activeNodeId ? 5 : isLinkEmphasized(ref) ? 7 : 0;
              return base / visualScale;
            }}
            linkDirectionalArrowRelPos={1}
            warmupTicks={80} // Pre-calculate physics so nodes start spread out
            cooldownTicks={200}
            onZoom={handleZoom}
            onNodeClick={handleNodeClick}
            onNodeHover={(node) => {
              const graphNode = node as GraphNode | null;
              setHoveredNodeId(graphNode?.id || null);
            }}
            onBackgroundClick={() => setSelectedNodeId(null)}
            enableNodeDrag
            d3AlphaDecay={0.045}
            d3VelocityDecay={0.35}
          />

          <div className="absolute top-4 left-4 w-[min(24rem,calc(100%-2rem))] space-y-3">
            <div className="rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-sm">
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search node by title, slug, or category"
                  className="h-9 pl-9"
                />
              </div>

              {searchQuery.trim() ? (
                <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border bg-card">
                  {searchResults.length > 0 ? (
                    <ul className="divide-y divide-border">
                      {searchResults.map((node) => (
                        <li key={node.id}>
                          <button
                            type="button"
                            onClick={() => handleSearchPick(node)}
                            className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-muted/60"
                          >
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium">
                                {node.name}
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {node.category}
                              </span>
                            </span>
                            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              {node.outgoingCount + node.incomingCount}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-4 text-xs text-muted-foreground">
                      No matching nodes found.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="absolute top-4 right-4 flex w-40 flex-col gap-3">
            <div className="rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-sm">
              <label
                htmlFor="link-distance"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Path Length
              </label>
              <input
                id="link-distance"
                type="range"
                min="30"
                max="250"
                value={linkDistance}
                onChange={(event) =>
                  setLinkDistance(Number(event.target.value))
                }
                className="w-full accent-primary"
                title="Adjust spacing between graph nodes"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {linkDistance}px
              </p>
            </div>

            <div className="rounded-xl border bg-background/90 p-2 shadow-sm backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-1">
                <Button size="xs" variant="outline" onClick={handleZoomIn}>
                  +
                </Button>
                <Button size="xs" variant="outline" onClick={handleZoomOut}>
                  -
                </Button>
                <Button size="xs" variant="outline" onClick={handleFit}>
                  Fit
                </Button>
              </div>
              <div className="mt-2 flex flex-col gap-1">
                <Button
                  size="xs"
                  variant={showLabels ? "default" : "outline"}
                  onClick={() => setShowLabels((prev) => !prev)}
                >
                  Labels
                </Button>
                <Button
                  size="xs"
                  variant={showArrows ? "default" : "outline"}
                  onClick={() => setShowArrows((prev) => !prev)}
                >
                  Arrows
                </Button>
              </div>
            </div>
          </div>

          {selectedNode ? (
            <div className="absolute bottom-4 right-4 w-[min(24rem,calc(100%-2rem))] rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Selected Node
                  </p>
                  <h3 className="truncate text-base font-semibold text-foreground">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedNode.category}
                  </p>
                </div>
                <Button size="xs" variant="ghost" onClick={clearSelection}>
                  Clear
                </Button>
              </div>

              <div className="mb-3 grid grid-cols-3 gap-2">
                <div className="rounded-md border bg-muted/40 px-2 py-1.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Incoming</p>
                  <p className="text-sm font-semibold">
                    {selectedNode.incomingCount}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/40 px-2 py-1.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Outgoing</p>
                  <p className="text-sm font-semibold">
                    {selectedNode.outgoingCount}
                  </p>
                </div>
                <div className="rounded-md border bg-muted/40 px-2 py-1.5 text-center">
                  <p className="text-[10px] text-muted-foreground">Total</p>
                  <p className="text-sm font-semibold">
                    {selectedNode.incomingCount + selectedNode.outgoingCount}
                  </p>
                </div>
              </div>

              {selectedNeighbors.length > 0 ? (
                <div className="mb-3">
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Nearby nodes
                  </p>
                  <ul className="divide-y divide-border/50 max-h-40 overflow-y-auto">
                    {selectedNeighbors.map((node, index) => {
                      // Determine direction relative to selectedNode
                      // An outgoing link means selectedNode -> node
                      // An incoming link means node -> selectedNode
                      const isOutgoing = data.links.some(
                        (l) =>
                          getNodeId(l.source) === selectedNode.id &&
                          getNodeId(l.target) === node.id,
                      );
                      const isIncoming = data.links.some(
                        (l) =>
                          getNodeId(l.source) === node.id &&
                          getNodeId(l.target) === selectedNode.id,
                      );

                      return (
                        <li key={node.id} className="py-1.5">
                          <button
                            type="button"
                            onClick={() => handleSearchPick(node)}
                            className="flex items-center gap-2 min-w-0 w-full text-left group"
                          >
                            <span className="text-xs font-semibold tabular-nums text-muted-foreground group-hover:text-primary transition-colors min-w-4 text-right">
                              {index + 1}.
                            </span>
                            <span className="truncate flex-1 text-xs font-medium group-hover:text-primary transition-colors">
                              {node.name}
                            </span>
                            <div className="flex shrink-0 gap-0.5 text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-primary transition-opacity">
                              {isOutgoing && (
                                <HugeiconsIcon
                                  icon={ArrowUpRight01Icon}
                                  className="size-3.5"
                                  strokeWidth={2}
                                />
                              )}
                              {isIncoming && (
                                <HugeiconsIcon
                                  icon={ArrowDownLeft01Icon}
                                  className="size-3.5"
                                  strokeWidth={2}
                                />
                              )}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <Button
                  render={<Link href={`/blog/${selectedNode.id}`} />}
                  size="sm"
                  className="gap-1"
                >
                  Open post
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/blog/${selectedNode.id}`)}
                >
                  Go now
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

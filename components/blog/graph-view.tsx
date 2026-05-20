"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useReducedMotion } from "framer-motion";
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
import { GraphToolbar } from "@/components/blog/graph/graph-toolbar";
import {
  drawGraphLinkArrow,
  drawGraphNode,
} from "@/components/blog/graph/graph-canvas";
import { useGraphColors } from "@/components/blog/graph/use-graph-colors";
import { useTheme } from "@/hooks/use-theme";

import type { GraphData, GraphNode } from "@/lib/blog/get-graph-data";
import { postPath } from "@/lib/blog/post-path";
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
type ForceGraphLink = {
  source: string | ForceGraphNode;
  target: string | ForceGraphNode;
};

type Props = {
  data: GraphData;
};

export function GraphView({ data }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | null>(null);

  // Callback ref: fires the instant ForceGraph2D mounts and provides its API.
  // This is the ONLY reliable way to register forces before the simulation
  // computes its first tick (useEffect and onEngineStop both fire too late).
  const setFgRef = useCallback((instance: ForceGraphMethods | null) => {
    fgRef.current = instance;
    if (!instance) return;

    // Strengthen charge repulsion
    const chargeForce = instance.d3Force("charge");
    if (chargeForce) {
      chargeForce.strength(-420);
    }
  }, []);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [linkDistance, setLinkDistance] = useState(120);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLabels, setShowLabels] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const hoverTransitionRef = useRef(0);
  const hoverAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  const activeNodeId = hoveredNodeId ?? selectedNodeId;

  useEffect(() => {
    const target = activeNodeId ? 1 : 0;

    hoverAnimationRef.current?.stop();
    hoverAnimationRef.current = animate(hoverTransitionRef.current, target, {
      duration: prefersReducedMotion ? 0 : 0.22,
      ease: "easeOut",
      onUpdate: (latest) => {
        hoverTransitionRef.current = latest;
        const graphApi = fgRef.current as ForceGraphMethods & {
          refresh?: () => void;
        };
        graphApi.refresh?.();
      },
    });

    return () => {
      hoverAnimationRef.current?.stop();
    };
  }, [activeNodeId, prefersReducedMotion]);

  const graphColors = useGraphColors(isDark);

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

    const getId = (ref: string | { id?: string } | unknown) => {
      if (!ref) return "";
      if (typeof ref === "string") return ref;
      if (typeof ref === "object" && "id" in ref) {
        return String((ref as { id?: string }).id || "");
      }
      return "";
    };

    for (const link of data.links) {
      const sourceId = getId(link.source);
      const targetId = getId(link.target);
      if (sourceId && targetId) {
        map.get(sourceId)?.add(targetId);
        map.get(targetId)?.add(sourceId);
      }
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

  // Update link distance whenever the slider changes.
  useEffect(() => {
    const graphApi = fgRef.current;
    if (!graphApi) return;

    const linkForce = graphApi.d3Force("link");
    if (linkForce) {
      linkForce.distance(linkDistance);
    }

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
      drawGraphNode({
        node: node as ForceGraphNode,
        ctx,
        globalScale,
        activeNodeId,
        selectedNodeId,
        hoveredNodeId,
        showLabels,
        isDark,
        hoverMix: hoverTransitionRef.current,
        colors: graphColors,
        isNodeEmphasized,
        getNodeBaseColor,
      });
    },
    [
      activeNodeId,
      getNodeBaseColor,
      graphColors,
      hoveredNodeId,
      isDark,
      isNodeEmphasized,
      selectedNodeId,
      showLabels,
    ],
  );

  const linkCanvasObject = useCallback(
    (link: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      drawGraphLinkArrow({
        link: link as ForceGraphLink,
        ctx,
        globalScale,
        showArrows,
        activeNodeId,
        hoverMix: hoverTransitionRef.current,
        colors: graphColors,
      });
    },
    [activeNodeId, graphColors, showArrows],
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

  const panelMotion = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.98 },
      };

  const listVariants = prefersReducedMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: 0.02,
          },
        },
      };

  const itemVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0, y: 6 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.18 },
        },
      };

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
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.985 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full w-full"
          >
            <ForceGraph2D
              ref={
                setFgRef as unknown as React.MutableRefObject<ForceGraphMethods>
              }
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
                const hoverMix = hoverTransitionRef.current;
                const emphasized = isLinkEmphasized(ref);
                const baseWhenIdle = 2.1;
                const baseWhenEmphasized = 2.9;
                const baseWhenDimmed = 1;
                const base = !activeNodeId
                  ? baseWhenIdle
                  : emphasized
                    ? baseWhenIdle + (baseWhenEmphasized - baseWhenIdle) * hoverMix
                    : baseWhenIdle + (baseWhenDimmed - baseWhenIdle) * hoverMix;
                return base / visualScale;
              }}
              linkDirectionalArrowLength={0}
              linkCanvasObjectMode={() => "after"}
              linkCanvasObject={linkCanvasObject}
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
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: "easeOut", delay: 0.08 }}
            className="absolute top-4 left-4 w-[min(24rem,calc(100%-2rem))] space-y-3"
          >
            <motion.div
              layout
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-sm"
            >
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

              <AnimatePresence initial={false} mode="wait">
                {searchQuery.trim() ? (
                  <motion.div
                    key="search-results"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="mt-2 max-h-52 overflow-y-auto scrollbar-minimal rounded-lg border bg-card"
                  >
                    {searchResults.length > 0 ? (
                      <motion.ul
                        variants={listVariants}
                        initial="hidden"
                        animate="show"
                        className="divide-y divide-border"
                      >
                        {searchResults.map((node) => (
                          <motion.li key={node.id} variants={itemVariants}>
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
                          </motion.li>
                        ))}
                      </motion.ul>
                    ) : (
                      <motion.div
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
                        className="px-3 py-4 text-xs text-muted-foreground"
                      >
                        No matching nodes found.
                      </motion.div>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <GraphToolbar
            prefersReducedMotion={prefersReducedMotion}
            linkDistance={linkDistance}
            setLinkDistance={setLinkDistance}
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleFit={handleFit}
            showLabels={showLabels}
            setShowLabels={setShowLabels}
            showArrows={showArrows}
            setShowArrows={setShowArrows}
          />

          <AnimatePresence initial={false} mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                layout
                initial={panelMotion.initial}
                animate={panelMotion.animate}
                exit={panelMotion.exit}
                transition={{ duration: 0.22, ease: "easeOut", delay: 0.08 }}
                className="absolute bottom-4 right-4 w-[min(24rem,calc(100%-2rem))] rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur-sm"
              >
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
                  <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="divide-y divide-border/50 max-h-40 overflow-y-auto scrollbar-minimal pr-1"
                  >
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
                        <motion.li
                          key={node.id}
                          variants={itemVariants}
                          className="py-1.5"
                        >
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
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              ) : null}

              <div className="flex items-center gap-2">
                <Button
                  render={<Link href={postPath(selectedNode.id)} />}
                  size="sm"
                  className="gap-1"
                >
                  Open post
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(postPath(selectedNode.id))}
                >
                  Go now
                </Button>
              </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

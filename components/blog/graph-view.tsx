"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useRef, useCallback, useEffect, useState } from "react";
import { ZoomIn, ZoomOut, Maximize } from "lucide-react";

import type { GraphData, GraphNode } from "@/lib/blog/get-graph-data";
import type { ForceGraphMethods } from "react-force-graph-2d";

// Dynamic import to avoid SSR issues with Canvas Graph
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

type ForceGraphNode = GraphNode & { x: number; y: number };

type Props = {
  data: GraphData;
};

export function GraphView({ data }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [fgRef, setFgRef] = useState<ForceGraphMethods | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [linkDistance, setLinkDistance] = useState(120);

  useEffect(() => {
    if (fgRef) {
      const linkForce = fgRef.d3Force("link");
      if (linkForce) {
        linkForce.distance(linkDistance);
        fgRef.d3ReheatSimulation();
      }
    }
  }, [linkDistance, fgRef]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNodeClick = useCallback(
    (node: object) => {
      const graphNode = node as GraphNode;
      if (graphNode.id) {
        router.push(`/blog/${graphNode.id}`);
      }
    },
    [router],
  );

  // Custom canvas rendering for nodes: 2D circle with text below it
  const nodeCanvasObject = useCallback(
    (node: object, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const graphNode = node as ForceGraphNode;
      const radius = 2 + Math.cbrt(graphNode.val) * 1.5;

      // Draw Circle
      ctx.beginPath();
      ctx.arc(graphNode.x, graphNode.y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = "#9ca3af";
      ctx.fill();

      // Draw Text
      // Using a graph-space constant size so it perfectly scales with zoom
      const fontSize = Math.min(6, 3 + graphNode.val / 3);
      // When zoomed way out, hide text to avoid clutter
      if (globalScale > 0.8) {
        ctx.font = `500 ${fontSize}px Inter, Tiro Bangla, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#374151";
        ctx.fillText(
          graphNode.name,
          graphNode.x,
          graphNode.y + radius + fontSize / 1.5 + 1,
        );
      }
    },
    [],
  );

  const handleZoomIn = useCallback(() => {
    if (!fgRef) return;
    fgRef.zoom(fgRef.zoom() * 1.5, 500);
  }, [fgRef]);

  const handleZoomOut = useCallback(() => {
    if (!fgRef) return;
    fgRef.zoom(fgRef.zoom() * 0.66, 500);
  }, [fgRef]);

  const handleFit = useCallback(() => {
    if (!fgRef) return;
    fgRef.zoomToFit(500, 50);
  }, [fgRef]);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {data.nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Add [[wiki links]] to your posts to see the graph.
          </p>
        </div>
      ) : (
        <>
          <ForceGraph2D
            ref={
              setFgRef as unknown as React.MutableRefObject<ForceGraphMethods>
            }
            graphData={data}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#f8f9fa"
            // Nodes: use custom canvas
            nodeCanvasObject={nodeCanvasObject}
            // Links: thin subtle gray lines
            linkColor={() => "rgba(156, 163, 175, 1)"}
            linkWidth={2}
            // Interaction
            onNodeClick={handleNodeClick}
            enableNodeDrag={true}
            d3AlphaDecay={0.04}
            d3VelocityDecay={0.3}
          />
          <div className="absolute top-4 right-4 flex flex-col items-end gap-3">
            {/* Link Distance Controller */}
            <div className="flex w-36 flex-col gap-2 rounded-md border bg-background/80 p-3 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background">
              <label
                htmlFor="link-distance"
                className="text-xs font-semibold text-foreground tracking-tight"
              >
                Path Length
              </label>
              <input
                id="link-distance"
                type="range"
                min="30"
                max="250"
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
                className="w-full accent-primary"
                title="Adjust spacing between graph nodes"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleZoomIn}
                className="bg-background/80 text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border shadow-sm backdrop-blur-sm transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-background/80 text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border shadow-sm backdrop-blur-sm transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={handleFit}
                className="bg-background/80 text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border shadow-sm backdrop-blur-sm transition-colors"
                title="Fit to Screen"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

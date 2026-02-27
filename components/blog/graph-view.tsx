"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useRef, useCallback, useEffect, useState } from "react";
import SpriteText from "three-spritetext";

import type { GraphData, GraphNode } from "@/lib/blog/get-graph-data";

// Dynamic import to avoid SSR issues with WebGL
const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground animate-pulse text-sm">
        Loading graph...
      </p>
    </div>
  ),
});

type Props = {
  data: GraphData;
};

export function GraphView({ data }: Props) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

  // Custom node: small circle + text label ABOVE the node
  const nodeThreeObject = useCallback((node: object) => {
    const graphNode = node as GraphNode;
    const sprite = new SpriteText(graphNode.name);
    sprite.color = "#374151";
    sprite.textHeight = 3;
    sprite.fontFace = "Inter, Tiro Bangla, sans-serif";
    sprite.fontWeight = "500";
    sprite.backgroundColor = "transparent";
    sprite.padding = 1;
    // Position label above the node
    // @ts-expect-error - SpriteText extends THREE.Object3D but types are missing it
    sprite.position.y = 8;
    return sprite;
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {data.nodes.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Add [[wiki links]] to your posts to see the graph.
          </p>
        </div>
      ) : (
        <ForceGraph3D
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="#f8f9fa"
          // Nodes: small muted spheres
          nodeColor={() => "#9ca3af"}
          nodeRelSize={4}
          nodeOpacity={0.85}
          nodeResolution={16}
          nodeThreeObject={nodeThreeObject}
          nodeThreeObjectExtend={true}
          // Links: thin subtle gray lines
          linkColor={() => "rgba(156, 163, 175, 0.4)"}
          linkWidth={0.8}
          linkOpacity={0.4}
          // Interaction
          onNodeClick={handleNodeClick}
          enableNodeDrag={true}
          enableNavigationControls={true}
          showNavInfo={false}
          d3AlphaDecay={0.04}
          d3VelocityDecay={0.3}
        />
      )}
    </div>
  );
}

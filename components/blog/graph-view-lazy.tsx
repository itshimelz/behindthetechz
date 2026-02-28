"use client";

import dynamic from "next/dynamic";

import type { GraphData } from "@/lib/blog/get-graph-data";

const GraphView = dynamic(
  () => import("@/components/blog/graph-view").then((mod) => mod.GraphView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm">
          Loading graph experience...
        </p>
      </div>
    ),
  },
);

type Props = {
  data: GraphData;
};

export function GraphViewLazy({ data }: Props) {
  return <GraphView data={data} />;
}

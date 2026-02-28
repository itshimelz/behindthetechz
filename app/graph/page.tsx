import { getGraphData } from "@/lib/blog/get-graph-data";
import { GraphView } from "@/components/blog/graph-view";

export default function GraphPage() {
  const data = getGraphData();

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative min-h-[calc(100svh-3.5rem)] flex-1 overflow-hidden">
        <GraphView data={data} />
      </div>
    </div>
  );
}

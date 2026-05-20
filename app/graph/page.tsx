import { getGraphData } from "@/lib/blog/get-graph-data";
import { GraphViewLazy } from "@/components/blog/graph-view-lazy";

export default async function GraphPage() {
  const data = await getGraphData();

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative h-[calc(100svh-3.5rem)] overflow-hidden">
        <GraphViewLazy data={data} />
      </div>
    </div>
  );
}

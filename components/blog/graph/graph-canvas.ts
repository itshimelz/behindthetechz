import type { GraphNode } from "@/lib/blog/get-graph-data";
import type { GraphColors } from "@/components/blog/graph/use-graph-colors";

type ForceGraphNode = GraphNode & { x?: number; y?: number };
type ForceGraphLink = {
  source: string | ForceGraphNode;
  target: string | ForceGraphNode;
};

type DrawNodeParams = {
  node: ForceGraphNode;
  ctx: CanvasRenderingContext2D;
  globalScale: number;
  activeNodeId: string | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  showLabels: boolean;
  isDark: boolean;
  hoverMix: number;
  colors: GraphColors;
  isNodeEmphasized: (nodeId: string) => boolean;
  getNodeBaseColor: (node: GraphNode) => string;
};

type DrawLinkArrowParams = {
  link: ForceGraphLink;
  ctx: CanvasRenderingContext2D;
  globalScale: number;
  showArrows: boolean;
  activeNodeId: string | null;
  hoverMix: number;
  colors: GraphColors;
};

export function drawGraphNode({
  node,
  ctx,
  globalScale,
  activeNodeId,
  selectedNodeId,
  hoveredNodeId,
  showLabels,
  isDark,
  hoverMix,
  colors,
  isNodeEmphasized,
  getNodeBaseColor,
}: DrawNodeParams) {
  const isSelected = node.id === selectedNodeId;
  const isHovered = node.id === hoveredNodeId;
  const emphasized = isNodeEmphasized(node.id);
  const radius = 3 + Math.cbrt(node.val) * 1.4;

  const fillColor =
    isSelected || isHovered
      ? colors.nodeSelected
      : emphasized
        ? getNodeBaseColor(node)
        : colors.nodeDim;

  ctx.save();
  ctx.globalAlpha = emphasized ? 1 : 1 - 0.55 * hoverMix;
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = fillColor;
  ctx.fill();

  if (isSelected || isHovered) {
    ctx.beginPath();
    ctx.arc(node.x || 0, node.y || 0, radius + 2, 0, 2 * Math.PI, false);
    ctx.strokeStyle = isDark
      ? "rgba(240,245,250,0.7)"
      : "rgba(46,60,78,0.55)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  const shouldShowLabel =
    showLabels &&
    (node.id === activeNodeId ||
      globalScale > 1.35 ||
      (globalScale > 0.95 && node.val >= 10));

  if (shouldShowLabel) {
    const fontSize = Math.min(10, Math.max(8, 5 + node.val / 5));
    ctx.font = `500 ${fontSize}px "Google Sans", "Tiro Bangla", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = emphasized ? colors.text : colors.textMuted;
    ctx.fillText(node.name, node.x || 0, (node.y || 0) + radius + fontSize / 1.5 + 2);
  }

  ctx.restore();
}

export function drawGraphLinkArrow({
  link,
  ctx,
  globalScale,
  showArrows,
  activeNodeId,
  hoverMix,
  colors,
}: DrawLinkArrowParams) {
  if (!showArrows) return;

  const source = typeof link.source === "object" ? link.source : null;
  const target = typeof link.target === "object" ? link.target : null;

  if (
    !source ||
    !target ||
    typeof source.x !== "number" ||
    typeof source.y !== "number" ||
    typeof target.x !== "number" ||
    typeof target.y !== "number"
  ) {
    return;
  }

  const sourceId = source.id;
  const targetId = target.id;
  const emphasized =
    !activeNodeId || sourceId === activeNodeId || targetId === activeNodeId;

  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy);
  if (!distance) return;

  const ux = dx / distance;
  const uy = dy / distance;

  const targetRadius = 3 + Math.cbrt(target.val) * 1.4;
  const tipX = target.x - ux * (targetRadius + 0.35);
  const tipY = target.y - uy * (targetRadius + 0.35);

  const arrowScale = (emphasized ? 0.98 : 0.86) / Math.max(1, globalScale);
  const arrowAngle = Math.atan2(dy, dx);
  const arrowSvgPath = new Path2D("M0 0 L-6.8 3.4 L-4.8 0 L-6.8 -3.4 Z");
  const color = emphasized ? colors.linkActive : colors.linkDim;

  ctx.save();
  ctx.globalAlpha = emphasized ? 0.95 : 0.85 - 0.3 * hoverMix;
  ctx.fillStyle = color;
  ctx.translate(tipX, tipY);
  ctx.rotate(arrowAngle);
  ctx.scale(arrowScale, arrowScale);
  ctx.fill(arrowSvgPath);
  ctx.restore();
}

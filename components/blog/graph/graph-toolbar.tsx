import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

type GraphToolbarProps = {
  prefersReducedMotion: boolean | null;
  linkDistance: number;
  setLinkDistance: (value: number) => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleFit: () => void;
  showLabels: boolean;
  setShowLabels: (value: boolean) => void;
  showArrows: boolean;
  setShowArrows: (value: boolean) => void;
};

export function GraphToolbar({
  prefersReducedMotion,
  linkDistance,
  setLinkDistance,
  handleZoomIn,
  handleZoomOut,
  handleFit,
  showLabels,
  setShowLabels,
  showArrows,
  setShowArrows,
}: GraphToolbarProps) {
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: 0.14 }}
      className="absolute top-4 right-4 flex w-40 flex-col gap-3"
    >
      <motion.div
        layout
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur-sm"
      >
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
          onChange={(event) => setLinkDistance(Number(event.target.value))}
          className="w-full accent-primary"
          title="Adjust spacing between graph nodes"
        />
        <p className="mt-1 text-[10px] text-muted-foreground">{linkDistance}px</p>
      </motion.div>

      <motion.div
        layout
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="rounded-xl border bg-background/90 p-2 shadow-sm backdrop-blur-sm"
      >
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
            onClick={() => setShowLabels(!showLabels)}
          >
            Labels
          </Button>
          <Button
            size="xs"
            variant={showArrows ? "default" : "outline"}
            onClick={() => setShowArrows(!showArrows)}
          >
            Arrows
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

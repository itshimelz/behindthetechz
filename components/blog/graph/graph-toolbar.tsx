import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Settings01Icon,
  Add01Icon,
  Remove01Icon,
  CenterFocusIcon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

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
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 12 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: 0.14 }}
      className="absolute top-4 right-4 flex flex-col gap-2"
    >
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="size-10 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
            />
          }
        >
          <HugeiconsIcon icon={Settings01Icon} className="size-5 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent align="end" side="left" sideOffset={12} className="w-64 p-0 overflow-hidden bg-background/95 backdrop-blur-md">
          <div className="flex items-center justify-between border-b p-3">
            <h4 className="text-sm font-semibold">Graph settings</h4>
          </div>
          <Accordion defaultValue={["display", "forces"]}>
            <AccordionItem value="display" className="border-b px-3">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                Display
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Labels</span>
                  <Switch
                    checked={showLabels}
                    onCheckedChange={setShowLabels}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Arrows</span>
                  <Switch
                    checked={showArrows}
                    onCheckedChange={setShowArrows}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="forces" className="border-b-0 px-3">
              <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
                Forces
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1">
                <div className="space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Link distance</span>
                      <span className="text-xs text-muted-foreground">{linkDistance}</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="250"
                      value={linkDistance}
                      onChange={(event) => setLinkDistance(Number(event.target.value))}
                      className="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none outline-hidden"
                      title="Adjust spacing between graph nodes"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PopoverContent>
      </Popover>

      {/* Floating Action Buttons for Zoom / Fit */}
      <div className="mt-2 flex flex-col gap-2 rounded-full border bg-background/80 p-1 shadow-sm backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <HugeiconsIcon icon={Add01Icon} className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          onClick={handleFit}
          title="Fit to screen"
        >
          <HugeiconsIcon icon={CenterFocusIcon} className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <HugeiconsIcon icon={Remove01Icon} className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}

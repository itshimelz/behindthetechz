import { cn } from "@/lib/utils";

type LoadingPillProps = {
  label?: string;
  className?: string;
};

export function LoadingPill({ label = "Loading", className }: LoadingPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className,
      )}
    >
      <span
        className="size-2.5 rounded-full border border-current border-r-transparent animate-spin"
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

"use client";

import { toast } from "sonner";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

export function InlineCode({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // Prevent interactive copying if it's already inside a full code block (handled by code-block.tsx)
  const isBlockCode =
    "data-language" in props ||
    "data-theme" in props ||
    "data-line-numbers" in props ||
    className?.includes("shiki");

  if (isBlockCode) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text =
      typeof children === "string"
        ? children
        : e.currentTarget.textContent || "";
    const didCopy = await copyToClipboard(text);
    if (didCopy) {
      toast.success("Code copied to clipboard");
    }
  };

  return (
    <code
      className={cn(
        "font-mono cursor-copy transition-colors hover:opacity-80 active:opacity-60",
        className,
      )}
      onClick={handleCopy}
      {...props}
    >
      {children}
    </code>
  );
}

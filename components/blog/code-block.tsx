"use client";

import { useState, useRef, ReactNode } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick01Icon,
  Copy01Icon,
  Cancel01Icon,
  Maximize01Icon,
} from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { copyToClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  "data-language"?: string;
  raw?: string;
}

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const preRef = useRef<HTMLPreElement>(null);

  const language = props["data-language"] || "Text";

  const handleCopy = async () => {
    if (preRef.current) {
      // The text inside pre might have span tags from syntax highlighting.
      // textContent will extract just the raw text.
      const text = preRef.current.textContent || "";
      const didCopy = await copyToClipboard(text);
      if (didCopy) {
        toast.success("Code copied to clipboard");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-zinc-200 bg-white font-sans dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-11 items-center justify-between border-b border-zinc-100 bg-white px-4 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/50">
        <div className="flex items-center gap-2">
          {/* Minimalist language badge similar to the screenshot */}
          <span className="font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400 tracking-wide">
            {language === "Text"
              ? "Code"
              : language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  aria-label="Toggle Code Expansion"
                />
              }
            >
              {isExpanded ? (
                <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
              ) : (
                <HugeiconsIcon icon={Maximize01Icon} className="h-4 w-4" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{isExpanded ? "Collapse code" : "Expand code"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                  aria-label="Copy to Clipboard"
                />
              }
            >
              {isCopied ? (
                <>
                  <HugeiconsIcon
                    icon={Tick01Icon}
                    className="h-4 w-4 text-green-500"
                  />
                  <span className="text-green-500">Copied</span>
                </>
              ) : (
                <>
                  <HugeiconsIcon icon={Copy01Icon} className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy code</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div
        className={cn(
          "transition-[max-height,opacity] duration-300 ease-in-out bg-[#f8f9fa] dark:bg-transparent",
          isExpanded
            ? "max-h-[1000px] opacity-100 overflow-auto"
            : "max-h-0 opacity-0 overflow-hidden",
        )}
      >
        <pre
          ref={preRef}
          className={cn(
            "p-4 text-[15px] font-mono overflow-x-auto m-0 bg-transparent!",
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

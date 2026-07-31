"use client";

import { useState, useCallback } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export function MdxFootnoteLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const [content, setContent] = useState<string | null>(null);

  const fetchFootnoteContent = useCallback(() => {
    if (!href || typeof window === "undefined") return;
    const targetId = href.startsWith("#") ? href.slice(1) : href;
    const targetEl = document.getElementById(targetId) || document.querySelector(href);
    if (targetEl) {
      // Clone element to safely strip the back-reference arrow link
      const clone = targetEl.cloneNode(true) as HTMLElement;
      const backrefs = clone.querySelectorAll("[data-footnote-backref]");
      backrefs.forEach((el) => el.remove());
      const text = clone.textContent?.trim() ?? "";
      if (text) {
        setContent(text);
      }
    }
  }, [href]);

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <a
            href={href}
            onMouseEnter={fetchFootnoteContent}
            onFocus={fetchFootnoteContent}
            className="inline-flex items-center justify-center font-bold text-xs text-primary no-underline hover:underline px-0.5"
            {...props}
          >
            {children}
          </a>
        }
      />
      <HoverCardContent
        side="top"
        align="center"
        className="w-72 max-w-sm rounded-xl border border-border/80 bg-popover/95 p-3.5 backdrop-blur-md shadow-xl text-xs leading-relaxed text-popover-foreground z-50"
      >
        {content ? (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Footnote {children}
            </span>
            <p className="text-foreground/90 font-normal leading-relaxed">{content}</p>
          </div>
        ) : (
          <span className="text-muted-foreground italic">Footnote reference {children}</span>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

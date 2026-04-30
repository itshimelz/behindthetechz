"use client";

import { useState, useCallback } from "react";

import { cn } from "@/lib/utils";

/**
 * MDX-rendered image that preserves its natural aspect ratio using the
 * AspectRatio component.  Replaces the previous plain `<img>` override in the
 * MDX component map.
 *
 * Because MDX feeds us raw `<img>` props we keep things simple and use a native
 * `<img>` tag rather than `next/image`.
 */
export function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [ratio, setRatio] = useState<number | null>(null);

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    },
    [],
  );

  return (
    <span className="my-4 block overflow-hidden rounded-xl border bg-muted/20">
      {ratio ? (
        <span
          className="relative block w-full aspect-(--ratio)"
          style={{ "--ratio": ratio } as React.CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={props.alt || "Post image"}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-contain transition-colors",
            )}
            {...props}
          />
        </span>
      ) : (
        /* Initial render — image loads, fires onLoad to compute ratio */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt={props.alt || "Post image"}
          loading="lazy"
          className="w-full transition-colors"
          {...props}
          onLoad={handleLoad}
        />
      )}

      {props.alt && (
        <span className="block border-t bg-muted/40 px-4 py-2.5 text-center text-sm text-muted-foreground">
          {props.alt}
        </span>
      )}
    </span>
  );
}

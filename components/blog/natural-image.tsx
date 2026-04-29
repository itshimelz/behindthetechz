"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

type NaturalImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  containerClassName?: string;
  /** If true, show alt text as a caption below the image. */
  showCaption?: boolean;
};

/**
 * Displays a `next/image` inside an `AspectRatio` container whose ratio is
 * derived from the image's intrinsic (natural) dimensions.  Until the
 * dimensions are known the container is hidden so there is no layout‑shift
 * flash.
 */
export function NaturalImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 768px",
  className,
  containerClassName,
  showCaption = false,
}: NaturalImageProps) {
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
    <span
      className={cn(
        "block overflow-hidden rounded-xl border bg-muted/20",
        containerClassName,
      )}
    >
      {ratio ? (
        <AspectRatio ratio={ratio} className="w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn("object-contain", className)}
            onLoad={handleLoad}
          />
        </AspectRatio>
      ) : (
        /* Hidden image used only to detect natural dimensions */
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          priority={priority}
          sizes={sizes}
          className={cn("w-full", className)}
          onLoad={handleLoad}
        />
      )}

      {showCaption && alt && (
        <span className="block border-t bg-muted/40 px-4 py-2.5 text-center text-sm text-muted-foreground">
          {alt}
        </span>
      )}
    </span>
  );
}

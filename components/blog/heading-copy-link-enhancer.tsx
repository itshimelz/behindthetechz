"use client";

import { useEffect } from "react";

export function HeadingCopyLinkEnhancer() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest(
        'a[data-heading-anchor="true"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      if (!navigator.clipboard?.writeText) return;

      event.preventDefault();
      const hash = anchor.getAttribute("href") ?? "";
      const url = `${window.location.origin}${window.location.pathname}${hash}`;

      void navigator.clipboard.writeText(url);
      anchor.classList.add("is-copied");
      window.setTimeout(() => {
        anchor.classList.remove("is-copied");
      }, 1200);
    };

    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

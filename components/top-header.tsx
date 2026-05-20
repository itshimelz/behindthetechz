"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { SiteBreadcrumb } from "@/components/site-breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";

function isBlogPostPath(pathname: string) {
  return /^\/blog\/[^/]+\/?$/.test(pathname);
}

export function TopHeader() {
  const pathname = usePathname();

  if (isBlogPostPath(pathname)) {
    return null;
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="md:hidden" />
        <SiteBreadcrumb />
        <Link
          href="/search"
          aria-label="Open search"
          className="focus-visible:border-ring focus-visible:ring-ring/50 ml-auto inline-flex size-8 items-center justify-center rounded-lg border border-transparent transition-colors hover:bg-muted focus-visible:ring-3 outline-none md:hidden"
        >
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="text-muted-foreground"
            aria-hidden="true"
          />
        </Link>
      </div>
    </header>
  );
}

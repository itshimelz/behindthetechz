"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home02Icon,
  Search01Icon,
  Notebook01Icon,
  GridViewIcon,
  Tag01Icon,
  ChartBubble02Icon,
  UserIcon,
  MessageQuestionIcon,
  Moon02Icon,
  Sun03Icon,
  Bookmark02Icon,
  EyeIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { SubscribeDialog } from "@/components/blog/subscribe-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/use-theme";
import { useFavorites } from "@/hooks/use-favorites";
import {
  useReadingProgressPreference,
  usePostScrollMemoryPreference,
  useTocPreference,
} from "@/hooks/use-local-storage-pref";
import { useBlogReadingPreferences } from "@/hooks/use-blog-reading-preferences";
import { AuthorDialog } from "@/components/user/author-dialog";
import { FavoritesDialog } from "@/components/user/favorites-dialog";
import { PreferencesDialog } from "@/components/user/preferences-dialog";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

const navMain = [
  { title: "Home", url: "/", icon: Home02Icon, color: "text-foreground" },
  { title: "All Posts", url: "/blog", icon: Notebook01Icon, color: "text-foreground" },
  { title: "Categories", url: "/categories", icon: GridViewIcon, color: "text-foreground" },
  { title: "Tags", url: "/tags", icon: Tag01Icon, color: "text-foreground" },
  { title: "Graph View", url: "/graph", icon: ChartBubble02Icon, color: "text-foreground" },
  { title: "About", url: "/about", icon: UserIcon, color: "text-foreground" },
];

const navStripLinks = [
  { title: "ALL POSTS", href: "/blog", matchPrefix: "/blog" },
  { title: "CATEGORIES", href: "/categories", matchPrefix: "/categories" },
  { title: "TAGS", href: "/tags", matchPrefix: "/tags" },
  { title: "GRAPH VIEW", href: "/graph", matchPrefix: "/graph" },
  { title: "ABOUT", href: "/about", matchPrefix: "/about" },
];

const navSecondary = [
  { title: "About", url: "/about", icon: UserIcon, color: "text-foreground" },
  { title: "Help", url: "/help", icon: MessageQuestionIcon, color: "text-foreground" },
];

// ---------------------------------------------------------------------------
// Mobile nav sheet content
// ---------------------------------------------------------------------------

function MobileNavContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 py-2">
      <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Navigation
      </p>
      {navMain.map((item) => {
        const isActive =
          item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
        return (
          <Link
            key={item.title}
            href={item.url}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={item.icon} className={cn("size-4", item.color)} strokeWidth={2} />
            {item.title}
          </Link>
        );
      })}
      <Separator className="my-2" />
      <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        More
      </p>
      {navSecondary.map((item) => {
        const isActive =
          pathname === item.url || pathname.startsWith(item.url + "/");
        return (
          <Link
            key={item.title}
            href={item.url}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <HugeiconsIcon icon={item.icon} className={cn("size-4", item.color)} strokeWidth={2} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------

export function SiteNavbar({
  publishedPostsCount = 0,
}: {
  publishedPostsCount?: number;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { enabled: readingProgressEnabled, setEnabled: setReadingProgress } =
    useReadingProgressPreference();
  const { enabled: postScrollMemoryEnabled, setEnabled: setPostScrollMemory } =
    usePostScrollMemoryPreference();
  const { enabled: tocEnabled, setEnabled: setTocEnabled } = useTocPreference();
  const { tone: blogBgTone, setTone: setBlogBgTone } =
    useBlogReadingPreferences();
  const { favorites, toggleFavorite, isMounted, importFavorites } = useFavorites();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setDesktopMenuOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setDesktopMenuOpen(false);
    }, 150);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isBlogPostRoute = /^\/blog\/[^/]+\/?$/.test(pathname);

  // Hide the navbar on individual blog post pages (they have their own header)
  if (isBlogPostRoute) {
    return null;
  }

  const themeLabel = theme === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <>
      {/* Sticky Top Header Section (Stays pinned at top on scroll) */}
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/90 dark:bg-background/85 transition-all duration-300 border-b border-border"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          {/* Left Side: Search + Theme Toggle */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 hover:text-foreground"
              aria-label="Search articles"
            >
              <HugeiconsIcon icon={Search01Icon} className="size-3.5" strokeWidth={2} />
              <span className="hidden sm:inline uppercase text-[11px] font-medium tracking-wider">Search</span>
            </Link>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              className="rounded-full transition-all duration-300 hover:bg-muted/60 hover:rotate-12"
              aria-label={themeLabel}
            >
              <HugeiconsIcon
                icon={theme === "dark" ? Sun03Icon : Moon02Icon}
                className="size-4 text-foreground"
                strokeWidth={2}
              />
            </Button>
          </div>

          {/* Center Logo */}
          <div className="flex justify-center flex-1">
            <Link
              href="/"
              className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              aria-label="behind the TechZ home"
            >
              <Image
                src="/logo_h.png"
                alt="behind the TechZ"
                width={220}
                height={70}
                priority
                className="h-auto w-[140px] sm:w-[170px]"
              />
            </Link>
          </div>

          {/* Right Side: About Link + Subscribe Button + Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SubscribeDialog />

            {/* Desktop Preferences dropdown */}
            <div
              className="hidden md:flex"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenu open={desktopMenuOpen} onOpenChange={setDesktopMenuOpen}>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="rounded-full transition-all hover:bg-muted/60"
                      aria-label="Menu"
                    />
                  }
                >
                  <HugeiconsIcon icon={Menu01Icon} className="size-4 text-foreground" strokeWidth={2} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-52 rounded-xl border border-border/80 bg-popover/95 p-1.5 backdrop-blur-md shadow-lg"
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setPreferencesOpen(true)}>
                      <HugeiconsIcon icon={EyeIcon} strokeWidth={2} aria-hidden="true" className="text-foreground" />
                      Reading Preferences
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFavoritesOpen(true)}>
                      <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} aria-hidden="true" className="text-foreground" />
                      All Favorites
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setAuthorOpen(true)}>
                      <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" className="text-foreground" />
                      About Author
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {navSecondary.map((item) => (
                      <DropdownMenuItem key={item.title} render={<Link href={item.url} />}>
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} aria-hidden="true" className={item.color} />
                        {item.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden rounded-full transition-all hover:bg-muted/60"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HugeiconsIcon icon={Menu01Icon} className="size-4 text-foreground" strokeWidth={2} />
            </Button>
          </div>
        </div>
      </header>

      {/* Non-sticky Navigation Link Strip — hidden on mobile; hamburger menu serves navigation there */}
      <nav className="hidden md:block w-full border-b border-border/40 bg-muted/20 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 lg:gap-7 text-[11px] uppercase tracking-widest overflow-x-auto px-4">
          {navStripLinks.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.matchPrefix + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-foreground font-bold border-b-2 border-primary pb-0.5"
                    : "text-muted-foreground hover:text-foreground font-semibold",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile side-sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-72 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Mobile navigation menu</SheetDescription>
          </SheetHeader>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <Link href="/" onClick={closeMobile}>
                <Image
                  src="/logo_h.png"
                  alt="behind the TechZ"
                  width={220}
                  height={70}
                  className="h-auto w-[130px]"
                />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2">
              <MobileNavContent pathname={pathname} onClose={closeMobile} />
              <Separator className="my-2" />
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    closeMobile();
                    setPreferencesOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={EyeIcon} className="size-4 text-foreground" strokeWidth={2} />
                  Reading Preferences
                </button>
                <button
                  onClick={() => {
                    closeMobile();
                    setFavoritesOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={Bookmark02Icon} className="size-4 text-foreground" strokeWidth={2} />
                  All Favorites
                </button>
                <button
                  onClick={() => {
                    closeMobile();
                    setAuthorOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={UserIcon} className="size-4 text-foreground" strokeWidth={2} />
                  About Author
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialogs */}
      <AuthorDialog
        open={authorOpen}
        onOpenChange={setAuthorOpen}
        publishedPostsCount={publishedPostsCount}
      />
      <PreferencesDialog
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        theme={theme}
        toggleTheme={toggleTheme}
        readingProgressEnabled={readingProgressEnabled}
        setReadingProgress={setReadingProgress}
        tocEnabled={tocEnabled}
        setTocEnabled={setTocEnabled}
        postScrollMemoryEnabled={postScrollMemoryEnabled}
        setPostScrollMemory={setPostScrollMemory}
        blogBgTone={blogBgTone}
        setBlogBgTone={setBlogBgTone}
      />
      <FavoritesDialog
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
        favorites={favorites}
        isMounted={isMounted}
        toggleFavorite={toggleFavorite}
        importFavorites={importFavorites}
      />
    </>
  );
}

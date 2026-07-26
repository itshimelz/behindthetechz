"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  Notification03Icon,
  Moon02Icon,
  Sun03Icon,
  Bookmark02Icon,
  EyeIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
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
];

const navSecondary = [
  { title: "What's New", url: "/changelog", icon: Notification03Icon, color: "text-foreground" },
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
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 2);
    handleScroll(); // sync on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      <header
        className={cn(
          "sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 dark:bg-background/75 transition-all duration-300",
          scrolled
            ? "border-b border-border/70 shadow-xs shadow-black/5 dark:shadow-black/20"
            : "border-b border-border/30",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
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
              className="h-auto w-[135px] sm:w-[155px]"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navMain.map((item) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-tight transition-all duration-200",
                    isActive
                      ? "bg-foreground/10 text-foreground font-semibold dark:bg-zinc-800/90 dark:text-zinc-100"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Pill (desktop) */}
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 hover:text-foreground shadow-2xs"
            >
              <HugeiconsIcon icon={Search01Icon} className="size-3.5" strokeWidth={2} />
              <span className="hidden md:inline font-medium">Search notes...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground/80 shadow-2xs">
                ⌘K
              </kbd>
            </Link>

            {/* Mobile Search Icon Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="sm:hidden rounded-full transition-all hover:bg-muted/60"
              render={<Link href="/search" />}
              aria-label="Search"
            >
              <HugeiconsIcon icon={Search01Icon} className="size-4" strokeWidth={2} />
            </Button>

            {/* Theme toggle */}
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

            {/* Preferences dropdown (desktop) */}
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

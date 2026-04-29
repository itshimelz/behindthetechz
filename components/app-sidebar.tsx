"use client";

import { useCallback, useMemo, useState, type ComponentProps } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { getCategoryIconByKey } from "@/lib/blog/category-icons";
import { postPath } from "@/lib/blog/post-path";
import { relativeDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home02Icon,
  Search01Icon,
  Notebook01Icon,
  GridViewIcon,
  UserIcon,
  MessageQuestionIcon,
  Tag01Icon,
  ChartBubble02Icon,
  Bookmark02Icon,
  ArrowRight01Icon,
  Notification03Icon,
} from "@hugeicons/core-free-icons";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useFavorites } from "@/hooks/use-favorites";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const navMain = [
  {
    title: "Home",
    url: "/",
    icon: Home02Icon,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search01Icon,
  },
  {
    title: "All Posts",
    url: "/blog",
    icon: Notebook01Icon,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: GridViewIcon,
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Tag01Icon,
  },
  {
    title: "Graph View",
    url: "/graph",
    icon: ChartBubble02Icon,
  },
];

const navSecondary = [
  {
    title: "What's New",
    url: "/changelog",
    icon: <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} aria-hidden="true" />,
  },
  {
    title: "About",
    url: "/about",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />,
  },
  {
    title: "Help",
    url: "/help",
    icon: <HugeiconsIcon icon={MessageQuestionIcon} strokeWidth={2} aria-hidden="true" />,
  },
];

/** Max favorites shown inline before overflow triggers a "View all" link. */
const SIDEBAR_FAVORITES_LIMIT = 5;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const sidebarListVariants = {
  open: {
    transition: { staggerChildren: 0.035, delayChildren: 0.02 },
  },
  closed: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const sidebarItemVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: "easeOut" as const },
  },
  closed: {
    opacity: 0,
    x: -6,
    transition: { duration: 0.12, ease: "easeInOut" as const },
  },
};

// ---------------------------------------------------------------------------
// Reusable sub-components (reduce repetition)
// ---------------------------------------------------------------------------

/** Wraps a sidebar item in a motion.div with the standard stagger animation. */
function AnimatedItem({
  animate,
  children,
}: {
  animate: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={sidebarItemVariants}
      initial={false}
      animate={animate}
    >
      {children}
    </motion.div>
  );
}

/** Reusable collapsible sidebar section with label, chevron, and stagger animation. */
function CollapsibleSection({
  label,
  badge,
  defaultOpen,
  onOpenChange,
  animationState,
  children,
}: {
  label: string;
  badge?: React.ReactNode;
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animationState: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="group/collapsible"
      onOpenChange={onOpenChange}
    >
      <SidebarGroup>
        <SidebarGroupLabel render={<CollapsibleTrigger />}>
          {label}
          {badge}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
            aria-hidden="true"
          />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <motion.div
              variants={sidebarListVariants}
              initial={false}
              animate={animationState}
            >
              <SidebarMenu>{children}</SidebarMenu>
            </motion.div>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

// ---------------------------------------------------------------------------
// Main sidebar
// ---------------------------------------------------------------------------

export function AppSidebar({
  categories = [],
  recentPosts = [],
  publishedPostsCount = 0,
  ...props
}: ComponentProps<typeof Sidebar> & {
  categories?: {
    name: string;
    slug: string;
    count: number;
    iconKey?: string;
  }[];
  recentPosts?: { slug: string; title: string; publishedAt: Date | null }[];
  publishedPostsCount?: number;
}) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { favorites, isMounted } = useFavorites();
  const prefersReducedMotion = useReducedMotion();
  const topCategories = useMemo(() => categories.slice(0, 5), [categories]);
  const isBlogPostRoute = /^\/blog\/[^/]+\/?$/.test(pathname);
  const [categoriesOpen, setCategoriesOpen] = useState(!isMobile);
  const [favoritesOpen, setFavoritesOpen] = useState(!isMobile);
  const [recentOpen, setRecentOpen] = useState(!isMobile);
  const showDetailSections = state === "expanded" || isMobile;

  const shouldAnimate = !prefersReducedMotion && state === "expanded";
  const getAnimState = (isOpen: boolean) =>
    shouldAnimate ? (isOpen ? "open" : "closed") : undefined;

  // Extract the current blog post slug for active-state matching
  const activeBlogSlug = useMemo(() => {
    const match = pathname.match(/^\/blog\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const closeMobileDrawer = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile, setOpenMobile]);

  // Precompute visible favorites
  const visibleFavorites = useMemo(
    () => favorites.slice(0, SIDEBAR_FAVORITES_LIMIT),
    [favorites],
  );
  const overflowCount = favorites.length - SIDEBAR_FAVORITES_LIMIT;

  if (isBlogPostRoute) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center justify-between px-2 py-2",
            isMobile && "px-1.5 py-1",
          )}
        >
          <Link
            href="/"
            className="group-data-[collapsible=icon]:hidden"
            onClick={closeMobileDrawer}
            aria-label="behind the TechZ home"
          >
            <Image
              src="/logo_h.png"
              alt="behind the TechZ"
              width={220}
              height={70}
              priority
              className={cn("h-auto w-[170px]", isMobile && "w-[150px]")}
            />
          </Link>
          {!isMobile && (
            <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto" />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* 1. Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => {
                const isActive =
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={<Link href={item.url} title={item.title} />}
                      isActive={isActive}
                      onClick={closeMobileDrawer}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showDetailSections && (
          <>
            {/* 2. Favorites */}
            <CollapsibleSection
              label="Favorites"
              defaultOpen={!isMobile}
              onOpenChange={setFavoritesOpen}
              animationState={getAnimState(favoritesOpen)}
            >
              {!isMounted ? (
                <SidebarMenuItem>
                  <AnimatedItem animate={getAnimState(favoritesOpen)}>
                    <SidebarMenuButton disabled>
                      <span className="text-muted-foreground text-xs">
                        Loading\u2026
                      </span>
                    </SidebarMenuButton>
                  </AnimatedItem>
                </SidebarMenuItem>
              ) : favorites.length === 0 ? (
                <SidebarMenuItem>
                  <AnimatedItem animate={getAnimState(favoritesOpen)}>
                    <SidebarMenuButton disabled>
                      <span className="text-muted-foreground text-xs">
                        No favorites yet
                      </span>
                    </SidebarMenuButton>
                  </AnimatedItem>
                </SidebarMenuItem>
              ) : (
                <>
                  {visibleFavorites.map((fav) => (
                    <SidebarMenuItem key={fav.slug}>
                      <AnimatedItem animate={getAnimState(favoritesOpen)}>
                        <SidebarMenuButton
                          tooltip={fav.title}
                          render={<Link href={postPath(fav.slug)} title={fav.title} />}
                          onClick={closeMobileDrawer}
                          isActive={activeBlogSlug === fav.slug}
                        >
                          <HugeiconsIcon
                            icon={Bookmark02Icon}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span className="truncate">{fav.title}</span>
                        </SidebarMenuButton>
                      </AnimatedItem>
                    </SidebarMenuItem>
                  ))}
                  {overflowCount > 0 && (
                    <SidebarMenuItem>
                      <AnimatedItem animate={getAnimState(favoritesOpen)}>
                        <SidebarMenuButton
                          className="text-muted-foreground text-xs"
                          tooltip="View all favorites"
                          render={<Link href="#" title="View all favorites" />}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            closeMobileDrawer();
                          }}
                        >
                          <span>+{overflowCount} more</span>
                        </SidebarMenuButton>
                      </AnimatedItem>
                    </SidebarMenuItem>
                  )}
                </>
              )}
            </CollapsibleSection>

            {/* 3. Recent Posts */}
            <CollapsibleSection
              label="Recent Posts"
              defaultOpen={!isMobile}
              onOpenChange={setRecentOpen}
              animationState={getAnimState(recentOpen)}
            >
              {recentPosts.length === 0 ? (
                <SidebarMenuItem>
                  <Empty className="mx-1 py-6 px-3">
                    <EmptyHeader className="gap-1.5">
                      <EmptyMedia className="size-8">
                        <HugeiconsIcon
                          icon={Notebook01Icon}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </EmptyMedia>
                      <EmptyTitle className="text-sm">No recent posts</EmptyTitle>
                      <EmptyDescription className="text-xs">
                        Publish your first post to populate this section.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </SidebarMenuItem>
              ) : (
                <>
                  {recentPosts.map((post) => (
                    <SidebarMenuItem key={post.slug}>
                      <AnimatedItem animate={getAnimState(recentOpen)}>
                        <SidebarMenuButton
                          tooltip={post.title}
                          render={<Link href={postPath(post.slug)} title={post.title} />}
                          onClick={closeMobileDrawer}
                          isActive={activeBlogSlug === post.slug}
                        >
                          <HugeiconsIcon
                            icon={Notebook01Icon}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span className="truncate">{post.title}</span>
                          {post.publishedAt && (
                            <span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
                              {relativeDate(post.publishedAt)}
                            </span>
                          )}
                        </SidebarMenuButton>
                      </AnimatedItem>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <AnimatedItem animate={getAnimState(recentOpen)}>
                      <SidebarMenuButton
                        tooltip="View all posts"
                        render={<Link href="/blog" title="View all posts" />}
                        onClick={closeMobileDrawer}
                        className="text-muted-foreground"
                      >
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span>View all posts</span>
                      </SidebarMenuButton>
                    </AnimatedItem>
                  </SidebarMenuItem>
                </>
              )}
            </CollapsibleSection>

            {/* 4. Top Categories */}
            {categories.length > 0 && (
              <CollapsibleSection
                label="Top Categories"
                badge={
                  <span className="bg-muted text-muted-foreground ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-medium leading-none">
                    {categories.length}
                  </span>
                }
                defaultOpen={!isMobile}
                onOpenChange={setCategoriesOpen}
                animationState={getAnimState(categoriesOpen)}
              >
                {topCategories.map((cat) => {
                  const isActive =
                    pathname === `/categories/${cat.slug}` ||
                    pathname.startsWith(`/categories/${cat.slug}/`);
                  return (
                    <SidebarMenuItem key={cat.slug}>
                      <AnimatedItem animate={getAnimState(categoriesOpen)}>
                        <SidebarMenuButton
                          tooltip={cat.name}
                          render={<Link href={`/categories/${cat.slug}`} title={cat.name} />}
                          onClick={closeMobileDrawer}
                          isActive={isActive}
                        >
                          <HugeiconsIcon
                            icon={getCategoryIconByKey(cat.iconKey)}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>{cat.name}</span>
                          <span className="text-muted-foreground ml-auto text-xs">
                            {cat.count}
                          </span>
                        </SidebarMenuButton>
                      </AnimatedItem>
                    </SidebarMenuItem>
                  );
                })}
                <SidebarMenuItem>
                  <AnimatedItem animate={getAnimState(categoriesOpen)}>
                    <SidebarMenuButton
                      tooltip="View all categories"
                      render={<Link href="/categories" title="View all categories" />}
                      onClick={closeMobileDrawer}
                      className="text-muted-foreground"
                    >
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>View all categories</span>
                    </SidebarMenuButton>
                  </AnimatedItem>
                </SidebarMenuItem>
              </CollapsibleSection>
            )}
          </>
        )}

        {/* 5. Utility links */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser publishedPostsCount={publishedPostsCount} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

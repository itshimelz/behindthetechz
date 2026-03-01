"use client";

import { useMemo, type ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";

import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Home02Icon,
  Notebook01Icon,
  GridViewIcon,
  UserIcon,
  MessageQuestionIcon,
  Tag01Icon,
  ChartBubble02Icon,
  Bookmark02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useFavorites } from "@/hooks/use-favorites";

const navMain = [
  {
    title: "Home",
    url: "/",
    icon: <HugeiconsIcon icon={Home02Icon} strokeWidth={2} />,
  },
  {
    title: "All Posts",
    url: "/blog",
    icon: <HugeiconsIcon icon={Notebook01Icon} strokeWidth={2} />,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    title: "Graph View",
    url: "/graph",
    icon: <HugeiconsIcon icon={ChartBubble02Icon} strokeWidth={2} />,
  },
];

const navSecondary = [
  {
    title: "About",
    url: "/about",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} />,
  },
  {
    title: "Help",
    url: "/help",
    icon: <HugeiconsIcon icon={MessageQuestionIcon} strokeWidth={2} />,
  },
];

const CATEGORY_ICON_BY_KEY: Record<
  string,
  React.ComponentProps<typeof HugeiconsIcon>["icon"]
> = {
  tag: Tag01Icon,
  programming: Notebook01Icon,
  development: Notebook01Icon,
  design: GridViewIcon,
  productivity: Bookmark02Icon,
  graph: ChartBubble02Icon,
};

function getCategoryIconByKey(iconKey?: string) {
  if (!iconKey) return Tag01Icon;
  return CATEGORY_ICON_BY_KEY[iconKey] ?? Tag01Icon;
}

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
  recentPosts?: { slug: string; title: string }[];
  publishedPostsCount?: number;
}) {
  const pathname = usePathname();
  const { favorites, isMounted } = useFavorites();
  const topCategories = useMemo(() => categories.slice(0, 5), [categories]);

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="font-heading text-lg font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden">
            behind the TechZ
          </span>
          <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
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
                      render={<Link href={item.url} />}
                      isActive={isActive}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        {categories.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel render={<CollapsibleTrigger />}>
                Categories
                <span className="bg-muted text-muted-foreground ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-medium leading-none">
                  {categories.length}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {topCategories.map((cat) => (
                      <SidebarMenuItem key={cat.slug}>
                        <SidebarMenuButton
                          tooltip={cat.name}
                          render={<Link href={`/categories/${cat.slug}`} />}
                        >
                          <HugeiconsIcon
                            icon={getCategoryIconByKey(cat.iconKey)}
                            strokeWidth={2}
                          />
                          <span>{cat.name}</span>
                          <span className="text-muted-foreground ml-auto text-xs">
                            {cat.count}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Saved / Favorites */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Favorites
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {!isMounted ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton disabled>
                        <span className="text-muted-foreground text-xs">
                          Loading...
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : favorites.length === 0 ? (
                    <SidebarMenuItem>
                      <SidebarMenuButton disabled>
                        <span className="text-muted-foreground text-xs">
                          No favorites yet
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ) : (
                    favorites.map((fav) => (
                      <SidebarMenuItem key={fav.slug}>
                        <SidebarMenuButton
                          tooltip={fav.title}
                          render={<Link href={`/blog/${fav.slug}`} />}
                        >
                          <HugeiconsIcon
                            icon={Bookmark02Icon}
                            strokeWidth={2}
                          />
                          <span className="truncate">{fav.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Recent Posts */}
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Recent Posts
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"
              />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                {recentPosts.length === 0 ? (
                  <Empty className="mx-1 py-6 px-3">
                    <EmptyHeader className="gap-1.5">
                      <EmptyMedia className="size-8">
                        <HugeiconsIcon
                          icon={Notebook01Icon}
                          strokeWidth={1.8}
                        />
                      </EmptyMedia>
                      <EmptyTitle className="text-sm">
                        No recent posts
                      </EmptyTitle>
                      <EmptyDescription className="text-xs">
                        Publish your first post to populate this section.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <SidebarMenu>
                    {recentPosts.map((post) => (
                      <SidebarMenuItem key={post.slug}>
                        <SidebarMenuButton
                          tooltip={post.title}
                          render={<Link href={`/blog/${post.slug}`} />}
                        >
                          <HugeiconsIcon
                            icon={Notebook01Icon}
                            strokeWidth={2}
                          />
                          <span className="truncate">{post.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser publishedPostsCount={publishedPostsCount} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

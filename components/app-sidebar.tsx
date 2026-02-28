"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/hooks/use-favorites";

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
import { ChevronRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home02Icon,
  Notebook01Icon,
  GridViewIcon,
  UserIcon,
  MessageQuestionIcon,
  Tag01Icon,
  ChartBubble02Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

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
    url: "#",
    icon: <HugeiconsIcon icon={MessageQuestionIcon} strokeWidth={2} />,
  },
];

export function AppSidebar({
  categories = [],
  ...props
}: ComponentProps<typeof Sidebar> & {
  categories?: { name: string; slug: string; count: number }[];
}) {
  const pathname = usePathname();
  const { favorites, isMounted } = useFavorites();

  return (
    <Sidebar collapsible="icon" className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <span className="font-heading text-lg font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden">
            behind the TechZ
          </span>
          <SidebarTrigger className="group-data-[collapsible=icon]:mx-auto" />
        </div>
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
      </SidebarHeader>
      <SidebarContent>
        {/* Categories */}
        {categories.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel render={<CollapsibleTrigger />}>
                Categories
                <span className="bg-muted text-muted-foreground ml-2 rounded-sm px-1.5 py-0.5 text-[10px] font-medium leading-none">
                  {categories.length}
                </span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {[...categories]
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5)
                      .map((cat) => (
                        <SidebarMenuItem key={cat.slug}>
                          <SidebarMenuButton
                            render={<Link href={`/categories/${cat.slug}`} />}
                          >
                            <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} />
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
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
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
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton disabled>
                      <span className="text-muted-foreground text-xs">
                        No posts yet
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

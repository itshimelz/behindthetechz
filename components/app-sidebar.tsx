"use client";

import type { ComponentProps } from "react";
import Link from "next/link";

import { NavSecondary } from "@/components/nav-secondary";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home02Icon,
  Notebook01Icon,
  GridViewIcon,
  UserIcon,
  Settings05Icon,
  MessageQuestionIcon,
  Tag01Icon,
  ChartBubble02Icon,
} from "@hugeicons/core-free-icons";

const navMain = [
  {
    title: "Home",
    url: "/",
    icon: <HugeiconsIcon icon={Home02Icon} strokeWidth={2} />,
    isActive: true,
  },
  {
    title: "All Posts",
    url: "/blog",
    icon: <HugeiconsIcon icon={Notebook01Icon} strokeWidth={2} />,
  },
  {
    title: "Categories",
    url: "/blog",
    icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
  },
  {
    title: "About",
    url: "/about",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} />,
  },
  {
    title: "Graph View",
    url: "/graph",
    icon: <HugeiconsIcon icon={ChartBubble02Icon} strokeWidth={2} />,
  },
];

const categories = [
  { name: "Technology", slug: "technology", count: 0 },
  { name: "Programming", slug: "programming", count: 0 },
  { name: "Life", slug: "life", count: 0 },
];

const navSecondary = [
  {
    title: "Settings",
    url: "#",
    icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
  },
  {
    title: "Help",
    url: "#",
    icon: <HugeiconsIcon icon={MessageQuestionIcon} strokeWidth={2} />,
  },
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <span className="font-heading text-lg font-bold tracking-tight">
            behind the TechZ
          </span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={item.isActive}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => (
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
        </SidebarGroup>

        {/* Recent Posts */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Posts</SidebarGroupLabel>
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
        </SidebarGroup>

        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

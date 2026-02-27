"use client";

import React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            if (item.title === "Settings") {
              return (
                <SidebarMenuItem key={item.title}>
                  <Popover>
                    <PopoverTrigger render={<SidebarMenuButton />}>
                      {item.icon}
                      <span>{item.title}</span>
                    </PopoverTrigger>
                    <PopoverContent
                      side="right"
                      align="end"
                      sideOffset={16}
                      className="w-64 p-4 rounded-xl shadow-lg border-border/40 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/75"
                    >
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm text-foreground">
                            Settings
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Manage your app preferences and settings.
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                T
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Theme</span>
                              <span className="text-xs text-muted-foreground">
                                Change appearance
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-primary">
                                A
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                Account
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Manage profile
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<a href={item.url} />}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

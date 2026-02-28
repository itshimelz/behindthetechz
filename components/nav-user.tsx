"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Moon02Icon,
  Sun03Icon,
  Logout03Icon,
  ArrowUpDownIcon,
  Bookmark02Icon,
  Delete02Icon,
  Mail01Icon,
  Calendar03Icon,
  GlobalIcon,
  Notification03Icon,
  AnalyticsUpIcon,
  EyeIcon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { useFavorites } from "@/hooks/use-favorites";
import { useReadingProgressPreference } from "@/hooks/use-reading-progress";

const user = {
  name: "Rahat Hossain",
  email: "himel@techzblog.com",
  avatar: "/avatar.png",
  role: "Author & Developer",
  joinedDate: "February 2026",
  website: "behindthetechz.com",
  postsCount: 11,
  favoritesCount: 0,
};

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 text-muted-foreground shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium leading-none">{label}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { enabled: readingProgressEnabled, setEnabled: setReadingProgress } =
    useReadingProgressPreference();
  const { favorites, toggleFavorite, isMounted } = useFavorites();
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                />
              }
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">RH</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <HugeiconsIcon
                icon={ArrowUpDownIcon}
                className="ml-auto size-4"
                strokeWidth={2}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--anchor-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg">RH</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={toggleTheme}>
                  <HugeiconsIcon
                    icon={theme === "dark" ? Sun03Icon : Moon02Icon}
                    strokeWidth={2}
                  />
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAccountOpen(true)}>
                  <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFavoritesOpen(true)}>
                  <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />
                  Favorites
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Account Dialog */}
      <Dialog open={accountOpen} onOpenChange={setAccountOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
            <DialogDescription>
              Your profile information and preferences.
            </DialogDescription>
          </DialogHeader>

          {/* Profile Card */}
          <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
            <Avatar className="h-14 w-14 rounded-xl" size="lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-xl text-lg">RH</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-base truncate">{user.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {user.role}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="size-4 text-muted-foreground shrink-0"
                strokeWidth={2}
              />
              <span className="text-xs text-foreground truncate">
                {user.email}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5">
              <HugeiconsIcon
                icon={Calendar03Icon}
                className="size-4 text-muted-foreground shrink-0"
                strokeWidth={2}
              />
              <span className="text-xs text-foreground">
                Joined {user.joinedDate}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5">
              <HugeiconsIcon
                icon={GlobalIcon}
                className="size-4 text-muted-foreground shrink-0"
                strokeWidth={2}
              />
              <span className="text-xs text-foreground truncate">
                {user.website}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5">
              <HugeiconsIcon
                icon={AnalyticsUpIcon}
                className="size-4 text-muted-foreground shrink-0"
                strokeWidth={2}
              />
              <span className="text-xs text-foreground">
                {user.postsCount} posts published
              </span>
            </div>
          </div>

          <Separator />

          {/* Preferences */}
          <div className="space-y-0">
            <p className="text-sm font-medium mb-1">Preferences</p>
            <SettingRow
              icon={
                <HugeiconsIcon
                  icon={theme === "dark" ? Moon02Icon : Sun03Icon}
                  className="size-4"
                  strokeWidth={2}
                />
              }
              label="Dark Mode"
              description="Toggle between light and dark theme"
            >
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </SettingRow>
            <SettingRow
              icon={
                <HugeiconsIcon
                  icon={Notification03Icon}
                  className="size-4"
                  strokeWidth={2}
                />
              }
              label="Notifications"
              description="Receive updates on new posts"
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              icon={
                <HugeiconsIcon
                  icon={EyeIcon}
                  className="size-4"
                  strokeWidth={2}
                />
              }
              label="Reading Progress"
              description="Show reading progress bar on posts"
            >
              <Switch
                checked={readingProgressEnabled}
                onCheckedChange={setReadingProgress}
              />
            </SettingRow>
          </div>
        </DialogContent>
      </Dialog>

      {/* Favorites Dialog */}
      <Dialog open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Favorites</DialogTitle>
            <DialogDescription>
              Posts you&apos;ve saved for quick access.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto">
            {!isMounted ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Loading...
              </p>
            ) : favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  className="size-8 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <p className="text-muted-foreground text-sm">
                  No favorites yet. Click the bookmark icon on any post to save
                  it here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {favorites.map((fav) => (
                  <li
                    key={fav.slug}
                    className="flex items-center justify-between gap-2 py-2.5"
                  >
                    <Link
                      href={`/blog/${fav.slug}`}
                      onClick={() => setFavoritesOpen(false)}
                      className="flex items-center gap-2 min-w-0 flex-1 group"
                    >
                      <HugeiconsIcon
                        icon={Bookmark02Icon}
                        className="size-4 shrink-0 text-primary"
                        strokeWidth={2}
                      />
                      <span className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                        {fav.title}
                      </span>
                    </Link>
                    <button
                      onClick={() =>
                        toggleFavorite({ slug: fav.slug, title: fav.title })
                      }
                      className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-muted shrink-0"
                      aria-label={`Remove ${fav.title} from favorites`}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        className="size-4"
                        strokeWidth={2}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Moon02Icon,
  Sun03Icon,
  Bookmark02Icon,
  Delete02Icon,
  Mail01Icon,
  Calendar03Icon,
  GlobalIcon,
  AnalyticsUpIcon,
  EyeIcon,
  Menu01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { useTocPreference } from "@/hooks/use-toc";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const user = {
  name: "Rahat H. Himel",
  email: "himelhasan1215@gmail.com",
  avatar: "himel-avatar.jpg",
  role: "Author & Developer",
  joinedDate: "February 2026",
  website: "behindthetechz.me",
} as const;

// ---------------------------------------------------------------------------
// Reusable sub-components
// ---------------------------------------------------------------------------

/** A single row in the Reading Preferences dialog with icon, label, description, and a control. */
function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 text-muted-foreground shrink-0">
          <HugeiconsIcon icon={icon} className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
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

/** A compact info card used in the About Author dialog grid. */
function InfoCard({
  icon,
  children,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5">
      <HugeiconsIcon
        icon={icon}
        className="size-4 text-muted-foreground shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="text-xs text-foreground truncate">{children}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NavUser component
// ---------------------------------------------------------------------------

export function NavUser({
  publishedPostsCount = 0,
}: {
  publishedPostsCount?: number;
}) {
  const { isMobile } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { enabled: readingProgressEnabled, setEnabled: setReadingProgress } =
    useReadingProgressPreference();
  const { enabled: tocEnabled, setEnabled: setTocEnabled } = useTocPreference();
  const { favorites, toggleFavorite, isMounted } = useFavorites();
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const themeLabel = theme === "dark" ? "Light Mode" : "Dark Mode";

  return (
    <>
      <SidebarMenu>
        {/* Direct theme toggle button */}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={themeLabel} onClick={toggleTheme}>
            <HugeiconsIcon
              icon={theme === "dark" ? Sun03Icon : Moon02Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>{themeLabel}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Preferences dropdown */}
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  tooltip="Preferences"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                />
              }
            >
              <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} aria-hidden="true" />
              <span>Preferences</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-48 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setPreferencesOpen(true)}>
                  <HugeiconsIcon icon={EyeIcon} strokeWidth={2} aria-hidden="true" />
                  Reading Preferences
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFavoritesOpen(true)}>
                  <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} aria-hidden="true" />
                  All Favorites
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setAuthorOpen(true)}>
                  <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />
                  About Author
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* About Author Dialog */}
      <Dialog open={authorOpen} onOpenChange={setAuthorOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>About the Author</DialogTitle>
            <DialogDescription>The person behind this site.</DialogDescription>
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
            <InfoCard icon={Mail01Icon}>{user.email}</InfoCard>
            <InfoCard icon={Calendar03Icon}>Joined {user.joinedDate}</InfoCard>
            <InfoCard icon={GlobalIcon}>{user.website}</InfoCard>
            <InfoCard icon={AnalyticsUpIcon}>
              {publishedPostsCount} posts published
            </InfoCard>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reading Preferences Dialog */}
      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reading Preferences</DialogTitle>
            <DialogDescription>
              Customize your reading experience. These settings are stored in
              your browser only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-0">
            <SettingRow
              icon={theme === "dark" ? Moon02Icon : Sun03Icon}
              label="Dark Mode"
              description="Toggle between light and dark theme"
            >
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </SettingRow>
            <SettingRow
              icon={EyeIcon}
              label="Reading Progress"
              description="Show reading progress bar on posts"
            >
              <Switch
                checked={readingProgressEnabled}
                onCheckedChange={setReadingProgress}
              />
            </SettingRow>
            <SettingRow
              icon={Menu01Icon}
              label="Table of Contents"
              description="Show in-page table of contents"
            >
              <Switch checked={tocEnabled} onCheckedChange={setTocEnabled} />
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
              Posts you&apos;ve saved for quick access. This list is stored only
              in your browser (local storage) and is not saved in the database.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto">
            {!isMounted ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Loading&hellip;
              </p>
            ) : favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <HugeiconsIcon
                  icon={Bookmark02Icon}
                  className="size-8 text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-muted-foreground text-sm">
                  No favorites yet. Click the bookmark icon on any post to save
                  it here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border" role="list">
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
                        aria-hidden="true"
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
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Favorites are private to this device/browser.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

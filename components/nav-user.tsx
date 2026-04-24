"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/use-theme";
import { useFavorites } from "@/hooks/use-favorites";
import { useReadingProgressPreference } from "@/hooks/use-reading-progress";
import { usePostScrollMemoryPreference } from "@/hooks/use-post-scroll-memory";
import { useTocPreference } from "@/hooks/use-toc";
import {
  BLOG_BG_TONE_OPTIONS,
  useBlogReadingPreferences,
} from "@/hooks/use-blog-reading-preferences";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const user = {
  name: "Rahat H. Himel",
  email: "himelhasan1215@gmail.com",
  avatar: "himel-avatar.jpg",
  role: "Author & Developer",
  joinedDate: "February 2026",
  website: "behindthetechz.live",
  bio: "Building practical guides on AI-assisted development, engineering workflows, and modern web systems.",
} as const;

const BLOG_BG_TONE_LABELS = {
  default: "Default",
  paper: "Paper",
  mist: "Mist",
  sepia: "Sepia",
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

function SocialOption({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <motion.div
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        className="flex items-center gap-2 rounded-md border border-border bg-muted/20 px-3 py-2.5 transition-colors group-hover:bg-muted/35"
      >
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="truncate text-xs text-foreground">{label}</span>
      </motion.div>
    </Link>
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
  const { enabled: postScrollMemoryEnabled, setEnabled: setPostScrollMemory } =
    usePostScrollMemoryPreference();
  const { enabled: tocEnabled, setEnabled: setTocEnabled } = useTocPreference();
  const {
    tone: blogBgTone,
    setTone: setBlogBgTone,
  } = useBlogReadingPreferences();
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>About the Author</DialogTitle>
            <DialogDescription>
              The person behind this site and its engineering notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 rounded-2xl" size="lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-2xl text-lg">
                    RH
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="truncate text-lg font-semibold tracking-tight">
                    {user.name}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.role}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                      {user.website}
                    </span>
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground">
                      Joined {user.joinedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
              {user.bio}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <SocialOption
                label="github.com/itshimelz"
                href="https://github.com/itshimelz"
                icon={
                  <svg
                    className="size-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.25 9.28 7.76 10.78.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.16.69-3.82-1.52-3.82-1.52-.52-1.31-1.26-1.67-1.26-1.67-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.29.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.61 0-1.24.44-2.25 1.16-3.05-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.11 1.16a10.9 10.9 0 0 1 5.66 0c2.16-1.46 3.11-1.16 3.11-1.16.61 1.55.23 2.7.11 2.98.72.8 1.16 1.81 1.16 3.05 0 4.36-2.66 5.31-5.19 5.59.41.35.77 1.05.77 2.12 0 1.53-.02 2.76-.02 3.13 0 .3.2.66.79.55A11.27 11.27 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z" />
                  </svg>
                }
              />
              <SocialOption
                label="x.com/itshimelz"
                href="https://x.com/itshimelz"
                icon={
                  <svg
                    className="size-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
              />
              <SocialOption
                label="linkedin.com/in/itshimelz"
                href="https://www.linkedin.com/in/itshimelz/"
                icon={
                  <svg
                    className="size-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.2 0 22.23 0z" />
                  </svg>
                }
              />
              <SocialOption
                label="facebook.com/itshimelz"
                href="https://www.facebook.com/itshimelz"
                icon={
                  <svg
                    className="size-4 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.88v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                  </svg>
                }
              />
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Snapshot
              </p>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard icon={Mail01Icon}>{user.email}</InfoCard>
                <InfoCard icon={Calendar03Icon}>Joined {user.joinedDate}</InfoCard>
                <InfoCard icon={GlobalIcon}>{user.website}</InfoCard>
                <InfoCard icon={AnalyticsUpIcon}>
                  {publishedPostsCount} posts published
                </InfoCard>
              </div>
            </div>
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
            <SettingRow
              icon={Bookmark02Icon}
              label="Resume Post Position"
              description="Remember where you left off in each post"
            >
              <Switch
                checked={postScrollMemoryEnabled}
                onCheckedChange={setPostScrollMemory}
              />
            </SettingRow>
            <SettingRow
              icon={Settings01Icon}
              label="Blog Background"
              description="Choose a softer page surface for long reads"
            >
              <Select
                value={blogBgTone}
                onValueChange={(value) => {
                  if (BLOG_BG_TONE_OPTIONS.includes(value as (typeof BLOG_BG_TONE_OPTIONS)[number])) {
                    setBlogBgTone(value as (typeof BLOG_BG_TONE_OPTIONS)[number]);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_BG_TONE_OPTIONS.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {BLOG_BG_TONE_LABELS[tone]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

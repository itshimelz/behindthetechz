"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Moon02Icon,
  Sun03Icon,
  Bookmark02Icon,
  EyeIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { AuthorDialog } from "@/components/user/author-dialog";
import { FavoritesDialog } from "@/components/user/favorites-dialog";
import { PreferencesDialog } from "@/components/user/preferences-dialog";
import {
  useBlogReadingPreferences,
} from "@/hooks/use-blog-reading-preferences";

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
  const { favorites, toggleFavorite, importFavorites, isMounted } = useFavorites();
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

"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark02Icon,
  EyeIcon,
  Menu01Icon,
  Moon02Icon,
  Settings01Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BLOG_BG_TONE_OPTIONS } from "@/hooks/use-blog-reading-preferences";
import { cn } from "@/lib/utils";

const BLOG_BG_TONE_LABELS = {
  default: "Default",
  paper: "Paper",
  mist: "Mist",
  sepia: "Sepia",
} as const;

function SettingRow({
  icon,
  label,
  description,
  children,
  iconColor,
}: {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  label: string;
  description?: string;
  children: React.ReactNode;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3 min-w-0">
        <span className={cn("mt-0.5 shrink-0", iconColor || "text-muted-foreground")}>
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

type PreferencesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: string;
  toggleTheme: () => void;
  readingProgressEnabled: boolean;
  setReadingProgress: (enabled: boolean) => void;
  tocEnabled: boolean;
  setTocEnabled: (enabled: boolean) => void;
  postScrollMemoryEnabled: boolean;
  setPostScrollMemory: (enabled: boolean) => void;
  blogBgTone: (typeof BLOG_BG_TONE_OPTIONS)[number];
  setBlogBgTone: (tone: (typeof BLOG_BG_TONE_OPTIONS)[number]) => void;
};

export function PreferencesDialog({
  open,
  onOpenChange,
  theme,
  toggleTheme,
  readingProgressEnabled,
  setReadingProgress,
  tocEnabled,
  setTocEnabled,
  postScrollMemoryEnabled,
  setPostScrollMemory,
  blogBgTone,
  setBlogBgTone,
}: PreferencesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reading Preferences</DialogTitle>
          <DialogDescription>
            Customize your reading experience. These settings are stored in your
            browser only.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0">
          <SettingRow
            icon={theme === "dark" ? Moon02Icon : Sun03Icon}
            label="Dark Mode"
            description="Toggle between light and dark theme"
            iconColor="text-foreground"
          >
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </SettingRow>
          <SettingRow
            icon={EyeIcon}
            label="Reading Progress"
            description="Show reading progress bar on posts"
            iconColor="text-foreground"
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
            iconColor="text-foreground"
          >
            <Switch checked={tocEnabled} onCheckedChange={setTocEnabled} />
          </SettingRow>
          <SettingRow
            icon={Bookmark02Icon}
            label="Resume Post Position"
            description="Remember where you left off in each post"
            iconColor="text-foreground"
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
            iconColor="text-foreground"
          >
            <Select
              value={blogBgTone}
              onValueChange={(value) => {
                if (
                  BLOG_BG_TONE_OPTIONS.includes(
                    value as (typeof BLOG_BG_TONE_OPTIONS)[number],
                  )
                ) {
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
  );
}

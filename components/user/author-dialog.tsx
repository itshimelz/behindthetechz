"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalyticsUpIcon,
  Calendar03Icon,
  GlobalIcon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const user = {
  name: "Rahat H. Himel",
  email: "himelhasan1215@gmail.com",
  avatar: "himel-avatar.jpg",
  role: "Author & Developer",
  joinedDate: "February 2026",
  website: "behindthetechz.live",
  bio: "Building practical guides on AI-assisted development, engineering workflows, and modern web systems.",
} as const;

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

type AuthorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publishedPostsCount: number;
};

export function AuthorDialog({
  open,
  onOpenChange,
  publishedPostsCount,
}: AuthorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <AvatarFallback className="rounded-2xl text-lg">RH</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="truncate text-lg font-semibold tracking-tight">
                  {user.name}
                </h3>
                <p className="truncate text-sm text-muted-foreground">{user.role}</p>
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
  );
}

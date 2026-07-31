"use client";

import { useState, useRef, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Tick02Icon,
  Alert02Icon,
  RssIcon,
  BookOpen02Icon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  trigger?: React.ReactElement;
};

function getSubSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return (
    localStorage.getItem("btz_newsletter_sub") === "1" ||
    document.cookie.includes("btz_newsletter_sub=1")
  );
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribeToSub(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function SubscribeDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [overrideForm, setOverrideForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const isSubscribedFromStore = useSyncExternalStore(
    subscribeToSub,
    getSubSnapshot,
    getServerSnapshot,
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          website: honeypotRef.current?.value ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("btz_newsletter_sub", "1");
        window.dispatchEvent(new Event("storage"));
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setOverrideForm(false);
        setError(null);
        setEmail("");
      }, 200);
    }
  };

  const isSubscribedState =
    (isSubscribedFromStore || submitted) && !overrideForm;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 h-8 shadow-xs border-none cursor-pointer">
              Subscribe
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md p-6 gap-5 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden">
        <DialogHeader className="gap-2 text-left">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <HugeiconsIcon
              icon={isSubscribedState ? Tick02Icon : Mail01Icon}
              className="size-6 text-primary"
              strokeWidth={2}
            />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {isSubscribedState ? "You're Already Subscribed!" : "Subscribe to behind the TechZ"}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {isSubscribedState
              ? "Your email is registered for behind the TechZ updates. You'll receive email dispatches as soon as new articles are published."
              : "Get early access to deep technical insights, engineering guides, and software updates delivered straight to your inbox."}
          </DialogDescription>
        </DialogHeader>

        {isSubscribedState ? (
          <div className="flex flex-col gap-4 pt-1 animate-in fade-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                What you can do now
              </p>
              <div className="grid gap-2">
                <Link
                  href="/blog"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={BookOpen02Icon} className="size-4 text-primary shrink-0" strokeWidth={2} />
                    <span>Browse All Essays & Dispatches</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground">→</span>
                </Link>

                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={RssIcon} className="size-4 text-orange-500 shrink-0" strokeWidth={2} />
                    <span>Subscribe via RSS Reader</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground">→</span>
                </a>

                <Link
                  href="/unsubscribe"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs font-medium text-foreground transition-all hover:bg-muted hover:border-border"
                >
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon icon={UserRemove01Icon} className="size-4 text-muted-foreground shrink-0" strokeWidth={2} />
                    <span>Unsubscribe or Change Email</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground">→</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <button
                type="button"
                onClick={() => setOverrideForm(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-3 transition-colors cursor-pointer"
              >
                Subscribe another email
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-xs rounded-lg px-4"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={2}
                />
                <Input
                  type="email"
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-10 pl-10 text-sm rounded-xl border-border/80 focus-visible:ring-primary"
                />
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] size-0 overflow-hidden opacity-0"
                />
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <HugeiconsIcon icon={Alert02Icon} className="size-3.5 shrink-0" strokeWidth={2} />
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              {loading ? "Subscribing..." : "Join Newsletter"}
            </Button>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
              <span>Prefer RSS feed?</span>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
              >
                <HugeiconsIcon icon={RssIcon} className="size-3.5 text-orange-500" strokeWidth={2} />
                <span>RSS Feed XML</span>
              </a>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

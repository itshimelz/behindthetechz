"use client";

import { useState, useRef, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Tick02Icon,
  Alert02Icon,
  RssIcon,
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
  trigger?: React.ReactNode;
};

export function SubscribeDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

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
      // Reset state on close after animation completes
      setTimeout(() => {
        setSubmitted(false);
        setError(null);
        setEmail("");
      }, 200);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-wider px-3.5 py-1.5 h-8 shadow-xs border-none cursor-pointer">
              Subscribe
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md p-6 gap-5 rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden">
        <DialogHeader className="gap-2 text-left">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
            <HugeiconsIcon icon={Mail01Icon} className="size-6" strokeWidth={2} />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Subscribe to behind the TechZ
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Get early access to deep technical insights, engineering guides, and software updates delivered straight to your inbox.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={Tick02Icon} className="size-6" strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                You&apos;re subscribed!
              </p>
              <p className="text-xs text-muted-foreground">
                Thank you for joining. We&apos;ll notify you whenever new content is published.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="mt-2 text-xs rounded-lg"
            >
              Done
            </Button>
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
                  className="h-10 pl-10 text-sm rounded-xl border-border/80 focus-visible:ring-emerald-500"
                />
                {/* Honeypot field for bot protection */}
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
              className="h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm transition-all active:scale-[0.98]"
            >
              {loading ? "Subscribing..." : "Join Newsletter"}
            </Button>

            <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
              <span>Prefer RSS feed?</span>
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-medium text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
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

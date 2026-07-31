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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  category: string;
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

export function NewsletterCTA({ category }: Props) {
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

  const isSubscribedState =
    (isSubscribedFromStore || submitted) && !overrideForm;

  return (
    <section className="mx-auto w-full max-w-3xl">
      {isSubscribedState ? (
        <div className="rounded-2xl border border-primary/20 bg-card p-6 sm:p-7 dark:bg-zinc-900/30 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  className="size-5 text-primary"
                  strokeWidth={2}
                />
              </div>
              <div className="space-y-2 min-w-0">
                <div>
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    You&apos;re Subscribed to behind the TechZ
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    You&apos;re already set to receive new dispatches for <span className="font-semibold text-foreground">{category}</span> and software engineering articles.
                  </p>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline underline-offset-4"
                  >
                    <HugeiconsIcon icon={BookOpen02Icon} className="size-3.5" strokeWidth={2} />
                    Browse Archive
                  </Link>
                  <span className="text-muted-foreground/40">·</span>
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-orange-500 hover:underline underline-offset-4"
                  >
                    <HugeiconsIcon icon={RssIcon} className="size-3.5" strokeWidth={2} />
                    RSS Feed
                  </a>
                  <span className="text-muted-foreground/40">·</span>
                  <Link
                    href="/unsubscribe"
                    className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                  >
                    <HugeiconsIcon icon={UserRemove01Icon} className="size-3.5" strokeWidth={2} />
                    Unsubscribe
                  </Link>
                  <span className="text-muted-foreground/40">·</span>
                  <button
                    type="button"
                    onClick={() => setOverrideForm(true)}
                    className="font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 cursor-pointer"
                  >
                    Use another email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-7 dark:bg-zinc-900/30 shadow-xs">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Content */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-5"
                  strokeWidth={2}
                />
              </div>
              <div className="space-y-1 min-w-0">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  Enjoyed this article?
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Get notified when new posts about{" "}
                  <span className="font-semibold text-foreground">
                    {category}
                  </span>{" "}
                  are published.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <form
              onSubmit={handleSubmit}
              className="flex w-full shrink-0 flex-col gap-2 sm:w-auto"
            >
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-9 min-w-0 sm:w-52 bg-background border-border/80 text-sm"
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-9 shrink-0 px-4 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase font-bold tracking-wider shadow-xs border-none cursor-pointer transition-colors"
                >
                  {loading ? "..." : "Subscribe"}
                </Button>
              </div>
              {error && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                  />
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

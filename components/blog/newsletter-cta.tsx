"use client";

import { useState, useRef, type FormEvent } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Tick02Icon, Alert02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  category: string;
};

export function NewsletterCTA({ category }: Props) {
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
          // Honeypot field — bots will fill this, humans won't see it
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

  return (
    <section className="mx-auto w-full max-w-3xl">
      <style>{`
        @keyframes ctaScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ctaCheckScaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes ctaFadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-cta-scale-in {
          animation: ctaScaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-cta-check {
          animation: ctaCheckScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .animate-cta-fade-up-1 {
          animation: ctaFadeInUp 0.25s ease-out 0.15s both;
        }
        .animate-cta-fade-up-2 {
          animation: ctaFadeInUp 0.25s ease-out 0.25s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-cta-scale-in, .animate-cta-check, .animate-cta-fade-up-1, .animate-cta-fade-up-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      {submitted ? (
        <div className="animate-cta-scale-in flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/20 px-6 py-8 text-center dark:bg-muted/10">
          <div className="animate-cta-check flex size-10 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon
              icon={Tick02Icon}
              className="size-5 text-primary"
              strokeWidth={2}
            />
          </div>
          <p className="animate-cta-fade-up-1 text-sm font-medium text-foreground">
            You&apos;re on the list!
          </p>
          <p className="animate-cta-fade-up-2 text-xs text-muted-foreground">
            We&apos;ll notify you when new posts are published.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-muted/20 px-6 py-6 dark:bg-muted/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              {/* Text content */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Mail01Icon}
                    className="size-4 text-primary"
                    strokeWidth={2}
                  />
                  <h3 className="text-base font-semibold text-foreground">
                    Enjoyed this article?
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Get notified when new posts about{" "}
                  <span className="font-medium text-foreground/80">
                    {category}
                  </span>{" "}
                  are published. No spam, unsubscribe anytime.
                </p>
              </div>

              {/* Form */}
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
                    className="h-9 min-w-0 sm:w-52"
                  />
                  {/* Honeypot — invisible to humans, bots fill it */}
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
                      size="default"
                      disabled={loading}
                      className="h-9 shrink-0 px-4 active:scale-95 transition-transform duration-100"
                    >
                      {loading ? "..." : "Subscribe"}
                    </Button>
                </div>
                {error && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive animate-cta-fade-up-1">
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

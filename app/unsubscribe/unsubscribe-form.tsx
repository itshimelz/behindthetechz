"use client";

import { useState, type FormEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Tick02Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function UnsubscribeForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok && data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes unsubScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes unsubCheckScaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes unsubFadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-unsub-scale-in {
          animation: unsubScaleIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-unsub-check {
          animation: unsubCheckScaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }
        .animate-unsub-fade-up-1 {
          animation: unsubFadeInUp 0.25s ease-out 0.15s both;
        }
        .animate-unsub-fade-up-2 {
          animation: unsubFadeInUp 0.25s ease-out 0.25s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-unsub-scale-in, .animate-unsub-check, .animate-unsub-fade-up-1, .animate-unsub-fade-up-2 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      {done ? (
        <div className="animate-unsub-scale-in flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-6 py-8 dark:bg-muted/10">
          <div className="animate-unsub-check flex size-10 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon
              icon={Tick02Icon}
              className="size-5 text-primary"
              strokeWidth={2}
            />
          </div>
          <p className="animate-unsub-fade-up-1 text-sm font-medium text-foreground">
            You&apos;ve been unsubscribed
          </p>
          <p className="animate-unsub-fade-up-2 text-xs text-muted-foreground text-center">
            If this email was subscribed, it has been removed. You won&apos;t
            receive any more emails from us.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <HugeiconsIcon
                icon={Mail01Icon}
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-10 pl-9"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={loading}
              className="h-10 px-5 active:scale-95 transition-transform duration-100"
            >
              {loading ? "..." : "Unsubscribe"}
            </Button>
          </div>
          {error && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-destructive animate-unsub-fade-up-1">
              <HugeiconsIcon
                icon={Alert02Icon}
                className="size-3.5 shrink-0"
                strokeWidth={2}
              />
              {error}
            </p>
          )}
        </form>
      )}
    </>
  );
}

"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-muted/20 px-6 py-8 text-center dark:bg-muted/10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 12,
                delay: 0.1,
              }}
              className="flex size-10 items-center justify-center rounded-full bg-primary/10"
            >
              <HugeiconsIcon
                icon={Tick02Icon}
                className="size-5 text-primary"
                strokeWidth={2}
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="text-sm font-medium text-foreground"
            >
              You&apos;re on the list!
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.25 }}
              className="text-xs text-muted-foreground"
            >
              We&apos;ll notify you when new posts are published.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="rounded-xl border border-border/50 bg-muted/20 px-6 py-6 dark:bg-muted/10"
          >
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
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Button
                      type="submit"
                      size="default"
                      disabled={loading}
                      className="h-9 shrink-0 px-4"
                    >
                      {loading ? "..." : "Subscribe"}
                    </Button>
                  </motion.div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-destructive"
                  >
                    <HugeiconsIcon
                      icon={Alert02Icon}
                      className="size-3.5 shrink-0"
                      strokeWidth={2}
                    />
                    {error}
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

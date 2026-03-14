"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-6 py-8 dark:bg-muted/10"
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
            You&apos;ve been unsubscribed
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.25 }}
            className="text-xs text-muted-foreground"
          >
            If this email was subscribed, it has been removed. You won&apos;t
            receive any more emails from us.
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
        >
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
            <motion.div
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                type="submit"
                variant="outline"
                disabled={loading}
                className="h-10 px-5"
              >
                {loading ? "..." : "Unsubscribe"}
              </Button>
            </motion.div>
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-1.5 text-xs text-destructive"
            >
              <HugeiconsIcon
                icon={Alert02Icon}
                className="size-3.5 shrink-0"
                strokeWidth={2}
              />
              {error}
            </motion.p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thank you for subscribing to behind the TechZ!");
    setEmail("");
  };

  return (
    <footer className="mt-auto w-full overflow-hidden">
      {/* Dark Main Footer Block (Full Bleed Parallel Diagonal Tilted Top & Bottom Edges) */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-zinc-950 text-zinc-100 dark:bg-black pt-16 sm:pt-24 md:pt-28 pb-16 sm:pb-24 md:pb-28 px-4 sm:px-6 md:px-8 [clip-path:polygon(0_3vw,100%_0,100%_calc(100%-3vw),0_100%)]">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Top Right Tagline Banner */}
          <div className="flex justify-start sm:justify-end pt-2 pb-6 border-b border-zinc-800/60">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-left sm:text-right leading-snug tracking-tight max-w-xl text-zinc-100 font-bold">
              Unparalleled access to hidden engineering concepts both online and IRL.
            </h2>
          </div>

          {/* 4-Column Footer Grid */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 text-xs text-zinc-300">
            {/* Col 1: Bio */}
            <div className="lg:col-span-4 space-y-3 pr-2">
              <p className="leading-relaxed text-zinc-400 text-xs sm:text-sm max-w-sm">
                behind the TechZ is an independent technology blog founded by Rahat Hossain Himel covering AI engineering, system boundaries, and software architecture.
              </p>
            </div>

            {/* Col 2: Navigation Links (Underlined list) */}
            <div className="lg:col-span-3 space-y-2.5">
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/about" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    All Posts
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/tags" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Tags
                  </Link>
                </li>
                <li>
                  <Link href="/graph" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Graph View
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/feed.xml" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    RSS
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Topics / Links (Underlined list) */}
            <div className="lg:col-span-2 space-y-2.5">
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/categories/software-architecture" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/categories/ai-engineering" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    AI Systems
                  </Link>
                </li>
                <li>
                  <Link href="/categories/bangla-tech" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Bangla Tech
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Help & FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="underline underline-offset-4 decoration-zinc-500 hover:text-white transition-colors">
                    Search Notes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Newsletter Subscription Input Box */}
            <div className="lg:col-span-3 space-y-3">
              <p className="text-xs text-zinc-300">
                Join the newsletter to get the latest updates.
              </p>
              <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/90 px-3 py-2 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:border-zinc-400 transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1.5 p-1 text-zinc-400 hover:text-white transition-colors"
                  title="Subscribe"
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" strokeWidth={2} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Light Bar with Centered Logo & Copyright */}
      <div className="w-full bg-background text-foreground py-8 px-4 text-center border-t border-border/40 space-y-3">
        <div className="flex justify-center">
          <Link href="/" className="inline-block transition-transform hover:scale-[1.02]">
            <Image
              src="/logo_h.png"
              alt="behind the TechZ"
              width={160}
              height={50}
              className="h-auto w-[110px]"
            />
          </Link>
        </div>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          &copy; {new Date().getFullYear()} BEHIND THE TECHZ. PUBLISHED WITH NEXT.JS.
        </p>
      </div>
    </footer>
  );
}

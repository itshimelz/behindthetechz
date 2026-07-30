"use client";

import Link from "next/link";

export function HomeTiltedBanner() {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-10 sm:my-14 py-20 sm:py-28 md:py-32 bg-zinc-950 dark:bg-black text-zinc-100 overflow-hidden shadow-2xl [clip-path:polygon(0_3vw,100%_0,100%_calc(100%-3vw),0_100%)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-5 sm:space-y-6">
        {/* Bio Paragraph Text */}
        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300 max-w-2xl mx-auto font-normal">
          behind the TechZ is an independent technology blog founded by Rahat Hossain Himel covering AI engineering, system boundaries, and software architecture. Read more about us{" "}
          <Link
            href="/about"
            className="underline underline-offset-4 decoration-zinc-500 hover:text-white font-medium transition-colors"
          >
            here
          </Link>.
        </p>
      </div>
    </section>
  );
}

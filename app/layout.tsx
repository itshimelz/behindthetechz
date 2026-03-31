import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteBreadcrumb } from "@/components/site-breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCategories } from "@/lib/blog/get-categories";
import {
  getPublishedPostCount,
  getRecentPostLinks,
} from "@/lib/blog/get-all-posts";

import "katex/dist/katex.min.css";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://behindthetechz.live";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "behind the TechZ — Tech & Programming Blog",
    template: "%s | behind the TechZ",
  },
  description:
    "A personal blog by Rahat Hossain Himel covering technology, programming, and everyday thoughts.",
  keywords: [
    "tech blog",
    "programming",
    "Bangla",
    "web development",
    "Kotlin",
    "Next.js",
  ],
  authors: [{ name: "Rahat Hossain Himel" }],
  creator: "Rahat Hossain Himel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "behind the TechZ",
    title: "behind the TechZ — Tech & Programming Blog",
    description:
      "A personal blog by Rahat Hossain Himel covering technology, programming, and everyday thoughts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "behind the TechZ",
    description: "Tech, programming, and everyday stories — mostly in Bangla.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, recentPosts, publishedPostsCount] = await Promise.all([
    getCategories(),
    getRecentPostLinks(5),
    getPublishedPostCount(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        {/* Google Fonts — loaded via <link> because @import url() in CSS is stripped by Tailwind v4 PostCSS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=Tiro+Bangla:ital@0;1&display=swap"
        />
        {/*
          "Blog Title" composite font — Bengali glyphs from Tiro Bangla,
          everything else falls through to Google Sans in the font stack.
          Placed in <head> because Tailwind v4 PostCSS strips @font-face from CSS.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
@font-face {
  font-family: "Blog Title";
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/tirobangla/v6/IFSgHe1Tm95E3O8b5i2V8PGo80Luuw.woff2") format("woff2");
  unicode-range: U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1;
}
@font-face {
  font-family: "Blog Title";
  font-style: italic;
  font-weight: 400 700;
  font-display: swap;
  src: url("https://fonts.gstatic.com/s/tirobangla/v6/IFSiHe1Tm95E3O8b5i2V8PG_w1L2vx4i.woff2") format("woff2");
  unicode-range: U+0951-0952, U+0964-0965, U+0980-09FE, U+1CD0, U+1CD2, U+1CD5-1CD6, U+1CD8, U+1CE1, U+1CEA, U+1CED, U+1CF2, U+1CF5-1CF7, U+200C-200D, U+20B9, U+25CC, U+A8F1;
}`,
          }}
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="behind the TechZ RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar
              categories={categories}
              recentPosts={recentPosts}
              publishedPostsCount={publishedPostsCount}
            />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <SidebarTrigger className="md:hidden" />
                  <SiteBreadcrumb />
                  <Link
                    href="/search"
                    aria-label="Open search"
                    className="focus-visible:border-ring focus-visible:ring-ring/50 ml-auto inline-flex size-8 items-center justify-center rounded-lg border border-transparent transition-colors hover:bg-muted focus-visible:ring-3 outline-none md:hidden"
                  >
                    <HugeiconsIcon
                      icon={Search01Icon}
                      strokeWidth={2}
                      className="text-muted-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </header>
              <main id="main-content" className="flex flex-1 flex-col">
                {children}
              </main>
              <SiteFooter />
            </SidebarInset>
            <Toaster position="top-center" />
          </SidebarProvider>
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

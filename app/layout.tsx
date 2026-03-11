import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <link
          rel="alternate"
          type="application/rss+xml"
          title="behind the TechZ RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="antialiased">
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
                </div>
              </header>
              {children}
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

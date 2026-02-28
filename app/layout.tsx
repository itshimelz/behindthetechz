import type { Metadata } from "next";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteBreadcrumb } from "@/components/site-breadcrumb";
import { SiteFooter } from "@/components/site-footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getCategories } from "@/lib/blog/get-categories";
import { getAllPosts } from "@/lib/blog/get-all-posts";

import "katex/dist/katex.min.css";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://behindthetechz.com";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getCategories();
  const recentPosts = getAllPosts().slice(0, 5).map((post) => ({
    slug: post.slug,
    title: post.title,
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <TooltipProvider>
          <SidebarProvider>
            <AppSidebar categories={categories} recentPosts={recentPosts} />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2">
                <div className="flex flex-1 items-center gap-2 px-3">
                  <SiteBreadcrumb />
                </div>
              </header>
              {children}
              <SiteFooter />
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
